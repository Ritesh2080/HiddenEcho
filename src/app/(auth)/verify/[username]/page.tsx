"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import SpotlightCard from "@/components/SpotlightCard";
import Squares from "@/components/SquaresBg";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
     defaultValues: {
      code:""
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username: params.username,
        code: data.code,
      });
      toast.success(response.data.message);
      router.replace("/sign-in")
    } catch (error) {
 console.error("Error during verification", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Verification failed");
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
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Verify Your Account</h1>
                <p className="mb-8">Enter the verification code sent to your email</p>
            </div>
             <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
              <FormDescription className="sr-only">
                Enter the verification code sent to your email
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="text-white border-1 hover:bg-white/20" variant="ghost">Submit</Button>
      </form>
    </Form>
        </SpotlightCard>
        </div>
    </div>
  );
};

export default VerifyAccount;
