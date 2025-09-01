"use client"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { signInSchema } from "@/schemas/signInSchema"
import {signIn} from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import {toast} from "react-toastify"
import { useRouter } from "next/navigation";



import { 
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"



export default function Signin () {

  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      "identifier":"",
      "password":""
    }
  })

  const submit = async (data:z.infer<typeof signInSchema>)=>{
    try {
          const result = await signIn("credentials",{
            redirect:false,
            identifier:data.identifier,
            password:data.password
          })

          if(result?.error){
            if(result.error==="CredentialsSignin"){
              toast.error("Sign in failed")
            }else{
              toast.error("Something went wrong")
            }
          }

          if(result?.url){
            router.replace("/dashboard")
          }
            
        } catch (error) {
            console.log("error in sign up",error)
            toast.error("Failed to register")
           
        }
  }

  return (
       <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)}>
              <FormField
               name="identifier"
               control={form.control}
               render={
                ({field})=>(
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <Input type="text" {...field}/>
                    <FormMessage/>
                  </FormItem>
                )
               }
              />
              
              <FormField
               name="password"
               control={form.control}
               render={
                ({field})=>(
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" {...field}/>
                    <FormMessage/>
                  </FormItem>
                )
               }
              />
              <Button type="submit" className="w-full">Sign In</Button>
            </form>

            <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>

          </Form>

      </div>
      </div>
   )
 }
