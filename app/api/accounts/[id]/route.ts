import { NextResponse } from "next/server";

import { Account } from "@/database";
import { handleError } from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import { dbConnect } from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";

// Get account by id
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    throw new NotFoundError("Account");
  }

  try {
    await dbConnect();

    const account = await Account.findById(id);

    if (!account) {
      throw new NotFoundError("Account");
    }

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// Delete account by id
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    throw new NotFoundError("Account");
  }

  try {
    await dbConnect();

    const account = await Account.findByIdAndDelete(id);

    if (!account) {
      throw new NotFoundError("Account");
    }

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// Update account by id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    throw new NotFoundError("Account");
  }

  try {
    await dbConnect();

    const body = await request.json();
    // No safe parsing is performed here as the request body might contain data that shouldn't be exposed.
    const validatedData = AccountSchema.partial().safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const updatedAccount = await Account.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!updatedAccount) {
      throw new NotFoundError("Account");
    }

    return NextResponse.json(
      { success: true, data: updatedAccount },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
