"use client"
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { Message } from '@/models/User.models'
import { useForm } from 'react-hook-form'

import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { User } from 'next-auth'
import Link from 'next/link'

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [switchLoading, setSwitchLoading] = useState(false)

  const { data: session, status } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {}
  })

  const { register, setValue, watch } = form
  const acceptMessages = watch("acceptMessage")

  const fetchAcceptMessages = useCallback(async () => {
    setSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages")
      setValue("acceptMessage", response.data.isAcceptingMessage ?? false)
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong updating the accept messages setting")
    } finally {
      setSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages")
      setMessages(response.data.messages || [])
      if (refresh) toast.success("Messages refreshed")
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch messages")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!session?.user) return
    fetchAcceptMessages()
    fetchMessages()
  }, [session, fetchAcceptMessages, fetchMessages])

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading user data...</p>
      </div>
    )
  }

  const username = (session.user as User).username || ""
  const profileUrl = `${window.location.protocol}//${window.location.host}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Link copied!")
  }

  const handleSwitch = async () => {
    setSwitchLoading(true)
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", { acceptMessage: !acceptMessages })
      setValue("acceptMessage", !acceptMessages)
      toast.success(response.data.message)
    } catch (error) {
      console.log(error)
      toast.error("Failed to update message acceptance")
    } finally {
      setSwitchLoading(false)
    }
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(message => message._id !== messageId))
  }

 return (
  <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 
                  bg-gradient-to-br from-orange-50 via-green-50 to-orange-50 
                  min-h-screen rounded-2xl">

    <h1 className="text-4xl font-extrabold mb-8 text-center 
                   bg-gradient-to-r from-orange-600 to-green-600
                   bg-clip-text text-transparent">
      Dashboard
    </h1>

    {/* Profile Link */}
    <div className="bg-white rounded-xl p-5 mb-6 shadow-md border border-orange-200">
      <p className="text-lg font-semibold mb-2 text-orange-700">Your Public Link</p>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          value={profileUrl}
          disabled
          className="flex-1 p-3 border border-green-300 rounded-md bg-orange-50/40
                     focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <Button
          onClick={copyToClipboard}
          className="bg-gradient-to-r from-orange-500 to-green-500 text-white font-bold px-5 py-2 rounded-lg shadow-md hover:opacity-90 transition-all w-full md:w-auto"
        >
          Copy Link
        </Button>
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

    {/* Accept Messages Switch */}
    <div className="bg-white rounded-xl p-5 mb-6 shadow-md border border-green-200 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Switch
          {...register("acceptMessage")}
          checked={!!acceptMessages}
          onCheckedChange={handleSwitch}
          disabled={switchLoading}
        />
        <span className="text-orange-700 font-semibold text-lg">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      {switchLoading && <Loader2 className="animate-spin h-5 w-5 text-green-600" />}
    </div>

    <Separator className="my-6 bg-green-300" />

    {/* Refresh Button */}
    <div className="flex justify-end mb-4">
      <Button
        variant="outline"
        onClick={(e) => {
          e.preventDefault()
          fetchMessages(true)
        }}
        className="border-green-500 text-green-600 hover:bg-green-100"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <RefreshCcw className="h-5 w-5" />
        )}
      </Button>
    </div>

    {/* Messages Grid */}
    <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6">
      {messages.length > 0 ? (
        messages.map((message) => (
          <MessageCard
            key={message._id}
            message={message}
            onMessageDelete={handleDeleteMessage}
          />
        ))
      ) : (
        <p className="text-gray-600 col-span-full text-center py-6 border rounded-xl bg-white shadow-sm border-green-200">
          No messages to display
        </p>
      )}
    </div>
  </div>
)

}
