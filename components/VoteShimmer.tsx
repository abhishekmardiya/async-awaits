export const VoteShimmer = () => {
  return (
    <div className="flex-center gap-2.5">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="background-light700_dark400 size-5 animate-pulse rounded"
        />
      ))}
    </div>
  );
};
