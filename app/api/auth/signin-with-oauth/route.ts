import mongoose from "mongoose";
import { type NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

import { Account, User } from "@/database";
import { handleError } from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { dbConnect } from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const { provider, providerAccountId, user } = await req.json();

  await dbConnect();

  /* 
  Mongoose sessions are used to create a context for multiple operations. When we start a new session, all operations that we perform on the session will be part of the same context. This means that if any of the operations fail, the entire session will be rolled back and none of the operations will be committed to the database, ensuring database consistency.
 */

  // If any of the operations (creating an account or a user) fail, then all of them will be rolled back and none of them will be committed to the database, ensuring database consistency.
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validatedData = SignInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { name, username, email, image } = user;

    const slugifyUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    let existingUser = await User.findOne({ email }).session(session);

    if (!existingUser) {
      [existingUser] = await User.create(
        [
          {
            name,
            username: slugifyUsername,
            email,
            image,
          },
        ],
        { session }
      );
    }
    // Update existing user log in with different provider
    else {
      const updatedData: { name?: string; image?: string } = {};

      if (existingUser?.name !== name) {
        updatedData.name = name;
      }

      if (existingUser?.image !== image) {
        updatedData.image = image;
      }

      if (Object.keys(updatedData)?.length) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updatedData }
        ).session(session);
      }
    }

    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser?._id,
            name,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session }
      );
    }

    // commit the transaction atomically
    await session.commitTransaction();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    // rollback the transaction
    await session.abortTransaction();
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    await session.endSession();
  }
}
