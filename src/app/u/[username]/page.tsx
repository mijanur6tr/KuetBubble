"use client"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@radix-ui/react-separator"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import * as z from "zod"
import { messageSchema } from "@/schemas/messageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "react-toastify"
import { metadata } from "@/app/layout"
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
 import { useParams } from "next/navigation"


const specialChar = "||"
const initialMessageString = "If KUET had a Hogwarts house system, which hall would be Gryffindor? 😂||একজন crush এর কারণে library regular হওয়া কি সত্যি myth নাকি fact? 👀||  What's the most creative way you've ever avoided a KUET assignment deadline?  🤫 "
const parseStringMessages = (messageString: string): string[] => messageString.split(specialChar)

export default function SendMessage() {
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(parseStringMessages(initialMessageString))
  const [isSuggestLoad, setIsSuggestLoad] = useState(false)
  const [suggestError, setSuggestError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const params= useParams<{username:string}>()
  const username = params.username

  const form = useForm<z.infer<typeof messageSchema>>({ resolver: zodResolver(messageSchema) })
  const messageContent = form.watch("content")

  const handleClick = (message: string) => form.setValue("content", message)

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    try {
      const result = await axios.post<ApiResponse>("/api/send-messages", { content: data.content, username: window.location.pathname.split("/")[2] })
      if (result.data.success) {
        toast.success("Message sent")
        form.reset({ ...form.getValues(), content: '' })
      }else{
        console.log(result.data.message)
        toast.error(result.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response.data.message)
    } finally { setIsLoading(false) }
  }

  const fetchMessages = async () => {
    setIsSuggestLoad(true)
    setSuggestError(null)
    try {
      const res = await axios.post("/api/suggest-messages")
      setSuggestedMessages(res.data.message.split("||"))
    } catch (err: any) {
      setSuggestError("Failed to fetch messages")
      toast.error("Failed to fetch messages")
    } finally { setIsSuggestLoad(false) }
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-5 p-6 md:p-10 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 rounded-2xl shadow-lg">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-purple-700">Send a Message</h1>

     <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className=" mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="bg-purple-500 hover:bg-purple-600"  type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="mt-10 space-y-6">
        <Button onClick={fetchMessages} disabled={isSuggestLoad} className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-lg w-full sm:w-auto">
          {isSuggestLoad && <Loader2 className="h-5 w-5 animate-spin" />}
          {isSuggestLoad ? "Loading..." : "Suggest Messages"}
        </Button>
        {suggestError && <p className="text-red-500">{suggestError}</p>}

        <Card className="bg-white rounded-xl shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-purple-700">Suggested Messages</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {suggestedMessages.map((msg, i) => (
              <Button key={i} variant="outline" className="w-full text-left break-words py-8 md:py-5 px-4 rounded-lg border-purple-300 hover:bg-purple-100 text-gray-800" onClick={() => handleClick(msg)}>
                <p className="rounded-lg border-purple-300 hover:bg-purple-100 text-gray-800  text-wrap">{msg}</p>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />
      <div className="text-center">
        <p className="mb-3 font-medium text-gray-700">Get your own message board!</p>
        <Link href="/sign-up">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold">Create Your Account</Button>
        </Link>
      </div>
    </div>
  )
}
