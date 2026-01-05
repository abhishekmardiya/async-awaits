# Multiple Ways to Handle Reputation

## 1. Sequential Database Calls

The most straightforward approach is to perform your DB operations one after another, like so:

```tsx
async function updateReputationSequential(params: UpdateReputationParams) {
  if (performerId === authorId) {
    await User.findByIdAndUpdate(
      performerId,
      { $inc: { reputation: authorPoints } },
      { session }
    );
    return;
  }

  await User.findByIdAndUpdate(
    performerId,
    { $inc: { reputation: performerPoints } },
    { session }
  );
  await User.findByIdAndUpdate(
    authorId,
    { $inc: { reputation: authorPoints } },
    { session }
  );
}
```

Sure, you can wrap it in a transaction with a session to keep it atomic, but it’s still sequential.

That means MongoDB processes one request at a time, which increases latency and could create performance bottlenecks under high load.

## 2. Parallel Database Calls

A slightly better approach is to fire both DB operations in parallel:

```tsx
async function updateReputationParallel(params: UpdateReputationParams) {
  if (performerId === authorId) {
    await User.findByIdAndUpdate(
      performerId,
      { $inc: { reputation: authorPoints } },
      { session }
    );
    return;
  }

  await Promise.all([
    User.findByIdAndUpdate(
      performerId,
      { $inc: { reputation: performerPoints } },
      { session }
    ),
    User.findByIdAndUpdate(
      authorId,
      { $inc: { reputation: authorPoints } },
      { session }
    ),
  ]);
}
```

This speeds things up, but if you’re not using transactions, there’s still a risk: one update might succeed, and the other might fail—leading to inconsistent data. And you’re still making multiple requests to the database.

## 3. Bulk Write Operations (Recommended)

we can handle multiple DB operations in one go—rather than firing off separate requests. It’s faster, cleaner, safer, and scales much better.

The most efficient (and my preferred) method is using a bulk write

```tsx
await User.bulkWrite([
  {
    updateOne: {
      filter: { _id: performerId },
      update: { $inc: { reputation: performerPoints } },
      ...(session && { session }),
    },
  },
  {
    updateOne: {
      filter: { _id: authorId },
      update: { $inc: { reputation: authorPoints } },
      ...(session && { session }),
    },
  },
]);
```

This might not be as clean to look at, but under the hood, it’s a single round-trip to the database. It plays very well with transactions and is more scalable when things get busy.

There are even more advanced approaches, like using $cond in aggregation pipelines, but that can get quite complex. If you’re curious, check out MongoDB's [$cond operator](https://www.mongodb.com/docs/manual/reference/operator/aggregation/cond/).

TL;DR
There is no single “correct” approach. Each approach has pros and cons, so choose the one that best suits your performance and consistency needs.
