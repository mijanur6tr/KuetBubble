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

import { 
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form"
import { useParams } from "next/navigation"

const specialChar = "||"
const initialMessageString =
  "If KUET had a Hogwarts house system, which hall would be Gryffindor? 😂||একজন crush এর কারণে library regular হওয়া কি সত্যি myth নাকি fact? 👀||  What's the most creative way you've ever avoided a KUET assignment deadline?  🤫 "
const parseStringMessages = (messageString: string): string[] =>
  messageString.split(specialChar)

export default function SendMessage() {
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(parseStringMessages(initialMessageString))
  const [isSuggestLoad, setIsSuggestLoad] = useState(false)
  const [suggestError, setSuggestError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const params = useParams<{username:string}>()
  const username = params.username

  const form = useForm<z.infer<typeof messageSchema>>({ resolver: zodResolver(messageSchema) })
  const messageContent = form.watch("content")

  const handleClick = (message: string) => form.setValue("content", message)

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    try {
      const result = await axios.post<ApiResponse>("/api/send-messages", {
        content: data.content,
        username: window.location.pathname.split("/")[2]
      })
      if (result.data.success) {
        toast.success("Message sent")
        form.reset({ ...form.getValues(), content: '' })
      } else {
        toast.error(result.data.message)
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
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
    <div className="w-full min-h-screen  max-w-4xl mx-auto lg:my-2  py-4 sm:p-6 px-4 md:px-10  bg-gradient-to-br from-orange-50 via-green-50 to-orange-50 rounded-2xl shadow-lg">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-12 lg:mt-2 mb-6 sm:mb-8 text-center text-orange-700">Send a Message</h1>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mx-2">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-orange-800  font-semibold">Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none border-green-300 focus:ring-2 focus:ring-green-400 w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || !messageContent}
                className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium"
              >
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* Suggested Messages Section */}
<div className="mt-4 sm:mt-6">
  <Card className="bg-white rounded-lg shadow-md mt-4 sm:mt-6">
    <CardHeader>
      <CardTitle className="text-lg sm:text-xl font-semibold text-green-700">Suggested Messages</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-2 sm:gap-3">
      {suggestedMessages.map((msg, i) => (
        <Button
  key={i}
  variant="outline"
  className="w-full text-left whitespace-normal break-words py-10 lg:py-7 px-3 sm:px-4 
             rounded-md border-green-300 hover:bg-green-50 text-gray-800 
             text-sm sm:text-base leading-snug"
  onClick={() => handleClick(msg)}
>
  {msg}
</Button>

      ))}
    </CardContent>
  </Card>

  <div className="w-full flex justify-center mx-auto mt-4 sm:mt-5">
    <Button
      onClick={fetchMessages}
      disabled={isSuggestLoad}
      className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md w-full sm:w-auto text-base sm:text-lg font-bold flex items-center justify-center gap-2"
    >
      {isSuggestLoad && <Loader2 className="h-5 w-5 animate-spin" />}
      💡 Get Suggestion from AI
    </Button>
  </div>
  {suggestError && <p className="text-red-500 mt-2 text-center">{suggestError}</p>}
</div>


      <Separator className="my-6 sm:my-8" />
      <div className="text-center text-gray-700 font-medium text-sm sm:text-base">
        <span>
          <Link href="/sign-up" className="text-orange-500 font-bold hover:underline">
            Create Your Account
          </Link>{" "}
          to get your own message board
        </span>
      </div>
          <div className='flex justify-center items-center '>
        <Link 
    href="https://kuet-note.vercel.app/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-[#499514] font-bold pt-3 hover:underline"
  >
    Try out kuetNote
  </Link>
      </div>
    </div>
  )
}
