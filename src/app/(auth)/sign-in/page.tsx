"use client"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"


import { 
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"



export default function Signin() {
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })

  const submit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      })

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          toast.error("Sign in failed")
        } else {
          toast.error("Something went wrong")
        }
      }

      if (result?.url) {
        router.replace("/dashboard")
      }

    } catch (error) {
      console.log("error in sign in", error)
      toast.error("Failed to sign in")
    }
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      <div className="relative w-full mx-2 max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">

       

        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back
          </h1>
          <p className="mb-4 text-gray-600">Sign in to continue your secret conversations</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
