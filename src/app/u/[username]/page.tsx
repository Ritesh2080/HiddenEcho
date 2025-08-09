"use client";
import { Button } from "@/components/ui/button";
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
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useCompletion } from "@ai-sdk/react";

const Page = () => {
  const params = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const { completion, complete, isLoading } = useCompletion({
    api: "/api/suggest-messages",
  });
  const submitMessage = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username: params.username,
        content: data.content,
      });
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error during sending", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Sending message failed"
      );
    }
  };
  return (
    <div className="flex justify-center min-h-screen bg-white">
        <div className="w-full lg:w-[80%] mt-5">
          <div className="w-[100%] m-auto">
          <h1 className="text-center text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Public Profile Link
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitMessage)}
              className="w-full mt-6 space-y-6 flex flex-col items-center lg:flex-none"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 text-lg font-semibold">
                      Send Anonymous message to @{params.username}
                    </FormLabel>
                    <FormControl>
                      <Input className="h-15"
                        placeholder="Write your anonymous message here"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="sr-only">
                      Enter your message content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Send it</Button>
            </form>
          </Form>
          </div>
          <div className="mt-8 mx-5">
            <Button
              type="button"
              onClick={() => complete("")}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Suggestions"}
            </Button>
                        <h2 className="text-lg font-semibold mb-3 mt-4">Click to use the suggestions</h2>

                <div className=" p-5 border rounded-lg">
                  <h2 className="text-lg font-bold">Messages</h2>
            {completion && (
              <div className="mt-4">
                {completion.split("||").map((q, i) => (
                  <p
                    key={i}
                    className="border m-2 rounded-lg p-2 text-center cursor-pointer hover:bg-gray-100"
                    onClick={() => form.setValue("content", q.trim())}
                  >
                    {q.trim()}
                  </p>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Page;
