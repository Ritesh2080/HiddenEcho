import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
  await dbconnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    const userMessage = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!userMessage || userMessage.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No messages found for the user",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        messages: userMessage[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error getting the messages", error);
    return Response.json(
      {
        success: false,
        message: "error getting the messages",
      },
      { status: 500 }
    );
  }
}
