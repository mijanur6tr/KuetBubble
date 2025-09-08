"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { verifyCodeSchema } from "@/schemas/verifyCodeSchema"
import { useParams, useRouter } from "next/navigation"
import { toast } from "react-toastify"

import {
    Form,
    FormItem,
    FormLabel,
    FormMessage,
    FormField,
} from "@/components/ui/form"


export default function VerifyPage(){

    const router = useRouter()
    const param = useParams<{ username: string }>()
    const form = useForm<z.infer<typeof verifyCodeSchema>>({
        resolver: zodResolver(verifyCodeSchema),
        defaultValues:{
            code:""
        }
    })

    const submit = async (data: z.infer<typeof verifyCodeSchema>) => {
        try {
            const response = await axios.post("/api/verify-code",
                {
                    username: param.username,
                    code: data.code
                }
            )
            if (response.data.success) {
                toast.success("Email verified successfully!")
            }
            router.replace(`/sign-in`)

        } catch (error) {
             console.log("error in code verify",error)
            toast.error("Failed to verify")
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)}>
                        <FormField
                            name="code"
                            control={form.control}
                            render={
                                ({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <Input {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )
                            }
                        />
                        <Button
                            type="submit"
                            className="w-full text-center mx-auto py-3 mt-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-400 transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                            Verify Account
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
