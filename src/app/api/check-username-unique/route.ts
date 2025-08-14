import dbconnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbconnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }
    const { username } = result.data;
    const existedVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existedVerifiedUser) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }
    const existedNonVerifiedUser = await UserModel.findOne({
      username,
      isVerified: false,
    });

    if (existedNonVerifiedUser) {
      const isCodeExpired =
        new Date(existedNonVerifiedUser.verifyCodeExpiry) < new Date();
      if (isCodeExpired) {
        await UserModel.deleteOne({ username:existedNonVerifiedUser.username });
        return Response.json(
          { success: true, message: "username is unique" },
          { status: 200 }
        );
      }else{
        return Response.json(
          {
            success: false,
            message: "Username is already taken",
          },
          { status: 400 }
        );  
      }
    }
    return Response.json(
      { success: true, message: "username is unique" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      { success: false, message: "Error checking the username" },
      { status: 500 }
    );
  }
}
