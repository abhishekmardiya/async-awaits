"use server";

import mongoose from "mongoose";

import { action } from "../handlers/action";
import handleError from "../handlers/error";
import { AskQuestionSchema } from "../validations";

import Question from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tag from "@/database/tag.model";

export const createQuestion = async (
  params: CreateQuestionParams
): Promise<ActionResponse> => {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true, // so that only authenticated users can create questions
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags } = validationResult?.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [question] = await Question.create(
      [{ title, content, author: userId }],
      {
        session,
      }
    );

    if (!question) {
      throw new Error("Failed to create question");
    }

    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocument = [];

    /**
     * For each tag in the provided tags array:
     * - Attempts to find a tag in the database with a case-insensitive match.
     * - If the tag does not exist, inserts a new tag with the given name.
     * - Increments the 'questions' count for the tag (whether found or newly inserted).
     */
    for (const tag of tags ?? []) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: {
            $regex: new RegExp(`^${tag}$`, "i"),
          },
        },
        {
          $setOnInsert: { name: tag },
          $inc: { questions: 1 },
        },
        {
          upsert: true,
          new: true,
          session,
        }
      );

      tagIds.push(existingTag?._id);
      tagQuestionDocument.push({
        tag: existingTag?._id,
        question: question._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocument, { session });

    await Question.findByIdAndUpdate(
      question._id,
      {
        $push: { tags: { $each: tagIds } },
      },
      { session }
    );

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
};
