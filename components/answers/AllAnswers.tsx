import { DataRenderer } from "../DataRendered";
import AnswerCard from "./AnswerCard";

import { EMPTY_ANSWERS } from "@/constants/states";

interface Props extends ActionResponse<Answer[]> {
  totalAnswers: number;
}

export const AllAnswers = ({ data, success, error, totalAnswers }: Props) => {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
        {/* TODO: Filters */}
        <p>Filters</p>
      </div>

      <DataRenderer
        data={data}
        error={error}
        success={success}
        empty={EMPTY_ANSWERS}
        render={(answers) =>
          answers?.map((answer) => <AnswerCard key={answer?._id} {...answer} />)
        }
      />
    </div>
  );
};
