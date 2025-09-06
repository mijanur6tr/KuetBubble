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
import { Loader2 } from 'lucide-react'
import { RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { User } from 'next-auth'



export default function Dashboard(){

  const [messages,setMessages] = useState<Message[]>([])
  const [isLoading,setIsLoading] = useState(false)
  const [swithLoading,setSwitchLoading]  = useState(false)

  const {data:session} = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessage:true
    }
  })

  const {register, setValue, watch} = form

  const acceptMessages = watch("acceptMessage")

  const fetchAcceptMessages = useCallback( async ()=>{
    setSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages")
      setValue("acceptMessage",response.data.isAcceptingMessage)
    } catch (error) {
      console.log(error)
      toast.error("something went wrong updating isAcceptingMessage field")
    }finally{
      setSwitchLoading(false)
    }
  },[setValue])



  const fetchMessages = useCallback(async (refresh:boolean=false)=>{
    setIsLoading(true)
    setSwitchLoading(true)
    try {
      const response =await axios.get<ApiResponse>("/api/get-messages")
      setMessages(response.data.messages || [])
      if(refresh){
        toast("Refreshed messages")
      }
    } catch (error) {
      console.log(error)
      toast.error("something went wrong when refreshing messages")
    }finally{
      setIsLoading(false)
      setSwitchLoading(false)
    }
  },[setIsLoading,setMessages])



 //fetching the initial state from the server

  useEffect(()=>{
    if(!session || !session.user) return;

    fetchAcceptMessages()
    fetchMessages()
  },[setValue,acceptMessages,fetchMessages,fetchAcceptMessages])


  if(!session || !session.user){
    return <></>
  }

  const {username} = session?.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`


  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast("Coppied")
  }


  const handleSwitch = async ()=>{
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages",{acceptMessage:!acceptMessages})
      setValue("acceptMessage",!acceptMessages)
      toast(response.data.message)
    } catch (error) {
      console.log(error)
      toast.error("something went wront changing the message accepting state")
    }
  }


  const handleDeleteMessage = (messageId:string)=> {
    setMessages(messages.filter((message)=>message._id != messageId))
  }
 
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">


      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

        <div className='mb-4'>
          <Switch
          {...register("acceptMessage")}
          checked={acceptMessages ?? false}
          onCheckedChange={handleSwitch}

          />
          <span>
            Accept Messages : {acceptMessages?"on":"off"}
          </span>
        </div>

        <Separator/>

       <Button 
       variant={'outline'}
       onClick={(e)=>{
        e.preventDefault()
        fetchMessages(true)
       }}
       > {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
        </Button>

        <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
         {messages.length>0 ? (
          messages.map((message,index)=>(
            
            <MessageCard
            key={index}
            message={message}
            onMessageDelete={handleDeleteMessage}
            />
            
          ))
         ) : (<p>No message to display</p>) }
        </div>

    
      </div>
   )
 }
