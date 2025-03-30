// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/DB/db";
import User from "@/lib/DB/DBModels/User";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, firstName, lastName, username } = body;

  if (!email || !password || !firstName || !lastName || !username) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  await dbConnect();

  const userExists = await User.findOne({ email });
  if (userExists) {
    return NextResponse.json({ message: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    username,
    wishlist: [],
  });

  return NextResponse.json({ user }, { status: 201 });
}
