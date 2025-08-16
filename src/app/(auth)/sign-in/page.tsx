"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn, useSession } from "next-auth/react";
import Squares from "@/components/SquaresBg";
import SpotlightCard from "@/components/SpotlightCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { verifyUsernameSchema } from "@/schemas/signUpSchema";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const formForVerify = useForm<z.infer<typeof verifyUsernameSchema>>({
    resolver: zodResolver(verifyUsernameSchema),
    defaultValues: {
      username: "",
    },
  });
  const { update } = useSession();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });

    if (!result?.error) {
      setIsSubmitting(false);
      toast.success("Signed in successfully. Redirecting...");

      await update();

      router.replace("/dashboard");
    } else {
      setIsSubmitting(false);
      toast.error(result.error);
    }
  };
  const handleVerifyClick = async (
    data: z.infer<typeof verifyUsernameSchema>
  ) => {
    try {
      setIsSubmitting(true);
      const response = await axios.get(
        `/api/get-user?username=${data.username}`
      );
      if (response.data.success) {
        setIsSubmitting(false);
        toast.success("redirecting to verification page");
        router.replace(`/verify/${data.username}`);
      } else {
        setIsSubmitting(false);
        toast.error(response.data.message || "Error getting the username");
      }
    } catch (error) {
      setIsSubmitting(false);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "error getting the username"
      );
    }
  };

  return (
    <div className="flex justify-center relative items-center min-h-screen bg-[rgb(10,10,10)]">
      <Squares
        speed={0.2}
        squareSize={40}
        direction="diagonal" // up, down, left, right, diagonal
        borderColor="#fafafa33"
        hoverFillColor="#fff"
      />
      <div className="w-full max-w-lg text-white p-8 space-y-8 relative z-10 rounded-lg shadow-md">
        <SpotlightCard
          className="custom-spotlight-card"
          spotlightColor="rgba(0, 229, 255, 0.2)"
        >
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
              Join HiddenEcho
            </h1>
            <p className="mb-8">Sign in to start your anonymous adventure</p>
          </div>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username/Email</FormLabel>
                      <FormControl>
                        <Input placeholder="username/email" {...field} />
                      </FormControl>
                      <FormDescription className="sr-only">
                        Enter your username or email to sign in
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="sr-only">
                        Enter your password to sign in
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="ghost"
                  className="text-white border-1 hover:bg-white/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
            <div className="text-center mt-4">
              <div className="flex justify-start flex-col md:flex-row items-start md:items-center gap-2 md:gap-12 text-start mb-4">
                <p>New User? Head to sign-up page</p>
                <Link
                  href="/sign-up"
                  className="text-blue-600 md:ml-4 text-lg hover:underline hover:text-blue-800"
                >
                  Sign Up
                </Link>
              </div>
              <div className="flex justify-center flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 text-start">
                <p>Already Registered? Verify your account </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="text-blue-600 text-lg hover:underline hover:text-blue-800 pl-0">
                      Verify
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md p-0 m-0 border-none">
                    <DialogHeader>
                      <DialogTitle className="sr-only absolute top-0">
                        Enter Username to verify
                      </DialogTitle>
                    </DialogHeader>
                    <SpotlightCard
                      className="custom-spotlight-card"
                      spotlightColor="rgba(0, 229, 255, 0.2)"
                    >
                      <div className="text-center">
                        <p className="mb-4">Enter your username to verify </p>
                      </div>
                      <div>
                        <Form {...formForVerify}>
                          <form
                            onSubmit={formForVerify.handleSubmit(
                              handleVerifyClick
                            )}
                            className="space-y-6"
                          >
                            <FormField
                              control={formForVerify.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="mb-1">
                                    Username
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="username" {...field} />
                                  </FormControl>
                                  <FormDescription className="sr-only">
                                    Enter your username to verify
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="submit"
                              variant="ghost"
                              disabled={isSubmitting}
                              className="text-white border-1 hover:bg-white/20"
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                </>
                              ) : (
                                "Verify"
                              )}
                            </Button>
                          </form>
                        </Form>
                      </div>
                    </SpotlightCard>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};
export default Page;
