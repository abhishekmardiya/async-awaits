import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { Suspense } from "react";

import { AllAnswers } from "@/components/answers/AllAnswers";
import TagCard from "@/components/cards/TagCard";
import { Preview } from "@/components/editor/Preview";
import { AnswerForm } from "@/components/forms/AnswerForm";
import { Metric } from "@/components/Metric";
import { UserAvatar } from "@/components/UserAvatar";
import { Votes } from "@/components/votes/Votes";
import { ROUTES } from "@/constants/routes";
import { getAnswers } from "@/lib/actions/answer.action";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { hasVoted } from "@/lib/actions/vote.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";

// getQuestion API Call --> page is rendered --> incrementViews API Call
const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const { success, data: question } = await getQuestion({ questionId: id });

  if (!success || !question) {
    redirect(ROUTES?.NOT_FOUND);
  }

  const {
    success: areAnswersLoaded,
    data: answersResult,
    error: answersError,
    // TODO:get this params from searchParams
  } = await getAnswers({
    questionId: id,
    page: 1,
    pageSize: 10,
    filter: "latest",
  });

  // we use "use" hook to pass this api as a promise
  const hasVotedPromise = hasVoted({
    targetId: question._id,
    targetType: "question",
  });

  const { author, createdAt, answers, views, tags, content, title } = question;

  // increment views after the page is rendered
  after(async () => {
    await incrementViews({ questionId: id });
  });

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author?._id}
              name={author?.name}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author?._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>

          <div className="flex justify-end">
            <Suspense fallback={<div>Loading...</div>}>
              <Votes
                targetType="question"
                targetId={question?._id}
                upVotes={question?.upVotes}
                downVotes={question?.downVotes}
                hasVotedPromise={hasVotedPromise}
              />
            </Suspense>
          </div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={answers}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>

      <Preview content={content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {tags?.map((tag) => (
          <TagCard
            key={tag?._id}
            _id={tag?._id as string}
            name={tag.name}
            compact
          />
        ))}
      </div>

      <div className="my-5">
        <AllAnswers
          data={answersResult?.answers}
          success={areAnswersLoaded}
          error={answersError}
          totalAnswers={answersResult?.totalAnswers || 0}
        />
      </div>

      <div className="my-5">
        <AnswerForm
          questionId={question?._id}
          questionTitle={question?.title}
          questionContent={question?.content}
        />
      </div>
    </>
  );
};

export default QuestionDetails;
