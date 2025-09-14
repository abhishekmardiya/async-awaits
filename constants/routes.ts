export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  SIGN_IN_WITH_OAUTH: "/auth/signin-with-oauth",
  PROFILE: (id: string) => `/profile/${id}`,

  QUESTION: (id: string) => `/questions/${id}`,
  ASK_QUESTION: "/ask-question",
  COLLECTION: "/collection",
  TAGS: "/tags",
  TAG: (id: string) => `/tags/${id}`,

  COMMUNITY: "/community",
  JOBS: "/jobs",
};
