import { auth } from "@/auth";
import { QuestionCard } from "@/components/cards/QuestionCard";
import { DataRenderer } from "@/components/DataRendered";
import HomeFilter from "@/components/filters/HomeFilter";
import { NextLink } from "@/components/NextLink";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getQuestions } from "@/lib/actions/question.action";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
  const {
    page = 1,
    pageSize = 10,
    query = "",
    filter = "",
    sort = "",
  } = await searchParams;

  const { success, data, error } = await getQuestions({
    page: Number(page),
    pageSize: Number(pageSize),
    query,
    filter,
    sort,
  });

  const { questions } = data! || {};

  const session = await auth();
  console.log("session:", session);

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <NextLink href={ROUTES?.ASK_QUESTION}>Ask a Question</NextLink>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          imgSrc="/icons/search.svg"
          placeholder="Search.questions.."
          route="/"
          otherClasses="flex-1"
        />
      </section>
      <HomeFilter />
      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions?.map((question) => (
              <QuestionCard key={question?._id} question={question} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Home;
