import { model, models, Schema, Types } from "mongoose";

export interface IAccount {
  // from Types directly and not from Schema.Types
  userId: Types.ObjectId;
  name: string;
  image?: string;
  password?: string;
  provider: string;
  providerAccountId: string;
}

const AccountSchema = new Schema<IAccount>(
  {
    // monogo id:Schema.Types.ObjectId
    // ref: "User" --> refers to the User model
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    image: { type: String },
    // image & password is optional for OAuth
    password: { type: String },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
  },
  // Create createdAt and updatedAt fields in the collection automatically
  { timestamps: true }
);

// models gives all the models in the database
// If the model is already registered, use that, otherwise create a new model
const Account = models?.Account || model<IAccount>("Account", AccountSchema);

export default Account;
