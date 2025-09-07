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

const specialChar = "||"
const initialMessageString = "What's your favourite place at KUET?||Do you have any pets?||What's your dream job?"
const parseStringMessages = (messageString: string): string[] => messageString.split(specialChar)

export default function SendMessage() {
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(parseStringMessages(initialMessageString))
  const [isSuggestLoad, setIsSuggestLoad] = useState(false)
  const [suggestError, setSuggestError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
      }
    } catch (error) {
      console.error(error)
      toast.error("Error sending message")
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

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Textarea
          {...form.register("content")}
          placeholder="Write your message here..."
          className="w-full min-h-[80px] p-4 border-2 border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-300 rounded-lg resize-none text-gray-700 placeholder:text-gray-400"
        />
        <div className="flex justify-center">
          <Button type="submit" disabled={isLoading || !messageContent} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </form>

      <div className="mt-10 space-y-6">
        <Button onClick={fetchMessages} disabled={isSuggestLoad} className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-lg w-full md:w-auto">
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
              <Button key={i} variant="outline" className="w-full text-left break-words py-3 px-4 rounded-lg border-purple-300 hover:bg-purple-100 text-gray-800" onClick={() => handleClick(msg)}>
                {msg}
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
