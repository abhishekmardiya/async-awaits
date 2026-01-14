// !DO NOT IMPORT EXTERNAL TYPES INTO THIS FILE OR EXPORT ANY TYPE OR INTERFACE FROM THIS FILE

/** biome-ignore-all lint/correctness/noUnusedVariables: This file is used to define global types and interfaces for the application */

interface SignInWithOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    email: string;
    name: string;
    image: string;
    username: string;
  };
}

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}

interface GetQuestionParams {
  questionId: string;
}

// Omit is used to omit the filter property from the PaginatedSearchParams type
interface GetTagQuestionsParams extends Omit<PaginatedSearchParams, "filter"> {
  tagId: string;
}

interface IncrementViewsParams {
  questionId: string;
}

interface CreateAnswerParams {
  questionId: string;
  content: string;
}

interface GetAnswersParams extends PaginatedSearchParams {
  questionId: string;
}

type VoteType = "upvote" | "downvote";

interface CreateVoteParams {
  targetId: string;
  targetType: "question" | "answer";
  voteType: VoteType;
}

interface UpdateVoteCountParams extends CreateVoteParams {
  change: 1 | -1;
}

type HasVotedParams = Pick<CreateVoteParams, "targetId" | "targetType">;

interface HasVotedResponse {
  hasUpVoted: boolean;
  hasDownVoted: boolean;
}

type TargetType = "question" | "answer";

interface CollectionBaseParams {
  questionId: string;
}

interface GetUserParams {
  userId: string;
}

interface GetUserQuestionsParams
  extends Omit<PaginatedSearchParams, "query" | "filter" | "sort"> {
  userId: string;
}

interface GetUserAnswersParams extends PaginatedSearchParams {
  userId: string;
}

interface GetUserTagsParams {
  userId: string;
}

interface DeleteQuestionParams {
  questionId: string;
}

interface DeleteAnswerParams {
  answerId: string;
}

interface CreateInteractionParams {
  action:
    | "view"
    | "upvote"
    | "downvote"
    | "bookmark"
    | "post"
    | "edit"
    | "delete"
    | "search";
  actionId: string;
  authorId: string;
  actionTarget: "question" | "answer";
}

interface UpdateReputationParams {
  interaction: IInteractionDoc;
  session: mongoose.ClientSession;
  performerId: string;
  authorId: string;
}

interface RecommendationParams {
  userId: string;
  query?: string;
  skip: number;
  limit: number;
}

interface JobFilterParams {
  query: string;
  page: string;
}

interface GlobalSearchParams {
  query: string;
  type: string | null;
}
