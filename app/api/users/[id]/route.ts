import { NextRequest, NextResponse } from "next/server";

import { User } from "@/database";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";

// Get user by id
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    throw new NotFoundError("User");
  }

  try {
    await dbConnect();

    const user = await User.findById(id);

    if (!user) {
      throw new NotFoundError("User");
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// Update user by id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    throw new NotFoundError("User");
  }

  try {
    await dbConnect();
    const body = await req?.json();

    const validatedData = UserSchema.safeParse(body);

    if (!validatedData?.success) {
      throw new ValidationError(validatedData?.error.flatten().fieldErrors);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      validatedData?.data,
      // By default, findOneAndUpdate() returns the document as it was before update was applied. If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.
      {
        new: true,
      }
    );

    if (!updatedUser) {
      throw new NotFoundError("User");
    }

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// Delete user by id
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    throw new NotFoundError("User");
  }

  try {
    await dbConnect();

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new NotFoundError("User");
    }

    return NextResponse.json(
      { success: true, data: deletedUser },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
