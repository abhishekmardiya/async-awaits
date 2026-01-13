import { type Document, model, models, Schema, type Types } from "mongoose";
import { InteractionActionEnums } from "@/constants";

export interface IInteraction {
  user: Types.ObjectId;
  action: string;
  actionId: Types.ObjectId;
  actionType: string;
}

export interface IInteractionDoc extends IInteraction, Document {}

const InteractionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // action: 'upvote', 'downvote', 'view', 'ask_question',
    action: {
      type: String,
      enum: InteractionActionEnums,
      required: true,
    },
    // actionId:questionId or answerId

    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: { type: String, enum: ["question", "answer"], required: true },
  },
  { timestamps: true }
);

export const Interaction =
  models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);
