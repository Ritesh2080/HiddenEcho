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
import Squares from "@/components/SquaresBg";
import SpotlightCard from "@/components/SpotlightCard";

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
  const handleGetSuggestions = async () => {
    try {
      await complete("");
    } catch (err) {
      console.error("Gemini suggestion error:", err);
      toast.error("Failed to fetch suggestions");
    }
  };

  return (
    <div className="flex justify-center w-full relative items-center min-h-screen bg-[rgb(10,10,10)]">
      <Squares
        speed={0.2}
        squareSize={50}
        direction="diagonal" // up, down, left, right, diagonal
        borderColor="#fafafa33"
        hoverFillColor="#fff"
        IsDashBoard={true}
      />
      <div className="w-[85%] lg:w-[80%] mt-20 mb-20">
        <SpotlightCard
          className="custom-spotlight-card w-full"
          spotlightColor="rgba(0, 229, 255, 0.2)"
        >
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
                    <FormItem className="w-full flex flex-col items-start justify-start pl-5">
                      <FormLabel className="mb-2 text-lg font-semibold">
                        Send Anonymous message to @{params.username}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-15 w-full"
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
                <Button
                  type="submit"
                  variant="ghost"
                  className="text-white w-auto ml-5 self-baseline md:w-auto border-1 hover:bg-white/20 p-5"
                >
                  Send it
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-8 mx-5">
            <Button
              type="button"
              variant="ghost"
              className="text-white w-full md:w-auto  border-1 hover:bg-white/20 p-5"
              onClick={handleGetSuggestions}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Suggestions"}
            </Button>
            <h2 className="text-lg font-semibold mb-3 mt-4">
              Click to use the suggestions
            </h2>

            <div className=" p-5 border rounded-lg">
              <h2 className="text-lg font-bold">Messages</h2>
              {completion && (
                <div className="mt-4">
                  {completion.split("||").map((q, i) => (
                    <p
                      key={i}
                      className="border m-2 rounded-lg p-2 text-center cursor-pointer hover:bg-white/20"
                      onClick={() => form.setValue("content", q.trim())}
                    >
                      {q.trim()}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default Page;
