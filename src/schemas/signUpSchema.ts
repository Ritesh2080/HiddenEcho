import {z} from "zod"

export const usernameValidation = z
  .string()
  .min(2,"Username must be at least 2 characters")
  .max(20,"Username must be no more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special characters");


export const signUpSchema =  z.object({
    username: usernameValidation,
    // Corrected line: message passed directly as a string
    email: z.email("Invalid email"), 
    // Corrected line: message passed as the second argument
    password: z.string().min(6, "password must be at least 6 characters") 
});