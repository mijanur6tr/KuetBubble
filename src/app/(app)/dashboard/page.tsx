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
      setValue("acceptMessage", response.data.isAcceptingMessage)
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
    <div className="w-full max-w-7xl  mx-auto px-6 md:px-12 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Profile Link */}
      <div className="bg-gray-50 rounded-xl p-5 mb-6 shadow-md flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          value={profileUrl}
          disabled
          className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
        />
        <Button onClick={copyToClipboard} className="w-full md:w-auto">
          Copy Link
        </Button>
      </div>

      {/* Accept Messages Switch */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-5 mb-6 shadow-md">
        <div className="flex items-center gap-3">
          <Switch
            {...register("acceptMessage")}
            checked={!!acceptMessages}
            onCheckedChange={handleSwitch}
            disabled={switchLoading}
          />
          <span className="text-gray-700 font-medium text-lg">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
        </div>
        {switchLoading && <Loader2 className="animate-spin h-5 w-5 text-gray-500" />}
      </div>

      <Separator className="my-6" />

      {/* Refresh Messages */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault()
            fetchMessages(true)
          }}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCcw className="h-5 w-5" />}
        </Button>
      </div>

      {/* Messages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard key={message._id} message={message} onMessageDelete={handleDeleteMessage} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center py-6 border rounded-xl bg-gray-50">
            No messages to display
          </p>
        )}
      </div>
    </div>
  )
}
