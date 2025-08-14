import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
  await dbconnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message:
              "Email is already taken, please use a different email or sign in if you already have an account",
          },
          { status: 400 }
        );
      } else {
        const isCodeExpired =
          new Date(existingUserByEmail.verifyCodeExpiry) < new Date();
        if (isCodeExpired) {
          const verifyCode = Math.floor(
            100000 + Math.random() * 900000
          ).toString();
          const hashedPassword = await bcrypt.hash(password, 10);
          existingUserByEmail.username = username;
          existingUserByEmail.email = email;
          existingUserByEmail.password = hashedPassword;
          existingUserByEmail.verifyCode = verifyCode;
          existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

          const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
          );
          if (!emailResponse.success) {
            return Response.json(
              {
                success: false,
                message: emailResponse.message,
              },
              { status: 500 }
            );
          }
          await existingUserByEmail.save();
          return Response.json(
            {
              success: true,
              message: "user registered successfully please verify your email",
            },
            { status: 201 }
          );
        } else {
          return Response.json(
            {
              success: false,
              message:
                "Email is already taken, please use a different email or sign in if you already have an account",
            },
            { status: 400 }
          );
        }
      }
    } else {
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      );
      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          { status: 500 }
        );
      }
      await newUser.save();
      return Response.json(
        {
          success: true,
          message: "user registered successfully please verify your email",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error during sign up:", error);
  }
}
