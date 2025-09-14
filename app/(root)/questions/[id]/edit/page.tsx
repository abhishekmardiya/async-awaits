import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import { ROUTES } from "@/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";

const EditAQuestion = async ({ params }: RouteParams) => {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const session = await auth();

  if (!session) {
    redirect(ROUTES.SIGN_IN);
  }

  const { data: question, success } = await getQuestion({
    questionId: id,
  });

  if (!success) {
    notFound();
  }

  // redirect to the question page if the user is not the author
  if (question?.author.toString() !== session?.user?.id) {
    redirect(ROUTES?.QUESTION(id));
  }

  return <QuestionForm question={question} isEdit />;
};

export default EditAQuestion;
