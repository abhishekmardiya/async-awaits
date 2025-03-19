import { NextRequest, NextResponse } from "next/server";

import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";

// Get all users
export async function GET() {
  try {
    await dbConnect();

    const users = await User.find();
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// Create new user
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req?.json();

    const validatedData = UserSchema.safeParse(body);

    if (!validatedData?.success) {
      throw new ValidationError(validatedData?.error.flatten().fieldErrors);
    }

    // Check if email or username already exists
    const { email, username } = validatedData?.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new Error("Username already exists");
    }

    // Create new user
    const newUser = await User.create(validatedData?.data);

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
