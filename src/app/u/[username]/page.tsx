"use client"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { X } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { useParams } from "next/navigation"
import Link from "next/link"
import { Message } from "@/models/User.models"
import { messageSchema } from "@/schemas/messageSchema"
import  * as z from "zod"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "react-toastify"
import { useState } from "react"

import { useCompletion } from '@ai-sdk/react'


const specialChar = "||";

const parseStringMessages = (messageString:string):string[] => {
    return messageString.split(specialChar)
}

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {

    const [isLoading,setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver:zodResolver(messageSchema)
    })

    const params = useParams<{username:string}>();
    const username = params.username

    const {
        complete,
        completion,
        error,
        isLoading:isSuggestLoading
    } = useCompletion({
        api:"/api/suggest-messages",
        initialCompletion:initialMessageString
    });


    const messageContent = form.watch("content")

    const handleClick = (message:string) => {
        form.setValue("content",message)
    }

    const onSubmit = ()=>{
        
    }

    const fetchMessages = () => {
        
    }


  return (
    <div>

    </div>
   )
 }
