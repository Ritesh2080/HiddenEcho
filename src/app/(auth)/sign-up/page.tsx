"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";
import Squares from "@/components/SquaresBg";
const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUniqueness = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          //   let message = response.data.message;
          //   setUsernameMessage(message);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message || "error checking the username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUniqueness();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (usernameMessage !== "username is unique") {
      toast.error("Please choose a unique username before signing up");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      if (response.data.success) {
        toast.success("Sign up successful");
        router.replace(`/verify/${data.username}`);
        setIsSubmitting(false);
      } else {
        toast.error(response.data.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Sign up failed");
      setIsSubmitting(false);
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
      <div className="w-full max-w-lg p-8 space-y-8 relative z-10 text-white rounded-lg shadow-md">
        <SpotlightCard
          className="custom-spotlight-card"
          spotlightColor="rgba(0, 229, 255, 0.2)"
        >
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
              Join HiddenEcho
            </h1>
            <p className="mb-8">Sign up to start your anonymous adventure</p>
          </div>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                        />
                      </FormControl>
                      {isCheckingUsername && (
                        <Loader2 className="animate-spin" />
                      )}
                      <p
                        className={`text-sm ${usernameMessage === "username is unique" ? "text-green-500" : "text-red-500"}`}
                      >
                        {usernameMessage}
                      </p>
                      <FormDescription className="sr-only">
                        Choose a unique username for your account
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormDescription className="sr-only">
                        Enter a valid email address for account verification
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
                        Give a strong password to protect your account
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="text-white border-1 hover:bg-white/20"
                  variant="ghost"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "SignUp"
                  )}
                </Button>
              </form>
            </Form>
            <div className="text-center mt-4">
              <p>
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-blue-600 hover:underline hover:text-blue-800"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default Page;
