## Why We Use Tags for Recommendations

Tags are a simple and effective way to understand a user's interests on our platform. Since tags represent the core topics of each question, analyzing which tags a user interacts with most—such as “Next.js” or “React”—helps us tailor recommendations to their preferences.

To enhance relevance:

- We collect all tags the user has interacted with and filter out duplicates.
- Next, we use these unique tags to find other questions related to those same topics.
- **Importantly, we exclude any questions that the user has already seen, interacted with, or authored themselves**.

This approach ensures that recommendations remain both fresh and closely aligned with the user's demonstrated interests

## How We Implement Tags in Recommendations

- Gather all the user's interactions with questions—including posts, upvotes, bookmarks, and views.
- Extract the IDs of the questions involved in these interactions.
- Fetch the tags associated with these questions.
- Merge and deduplicate these tags to form the user's unique set of interests.
- Search the database for other questions that:
  - Have at least one of these tags,
  - Have not been interacted with by the user,
  - Were not authored by the user.
- Present these matching questions as recommendations.
