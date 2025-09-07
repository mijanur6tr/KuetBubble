"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { X } from 'lucide-react'
import axios from 'axios'
import dayjs from "dayjs";
import { toast } from 'react-toastify'
import { ApiResponse } from '@/types/ApiResponse'


import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Message } from '@/models/User.models'



interface messageCardProps{
    message:Message;
    onMessageDelete:(messageId:string)=>void;
}



export default function MessageCard({message,onMessageDelete}:messageCardProps) {

    const handleDeleteConfirm = async () =>{
        try {
            const response = await axios.delete<ApiResponse>(`/api/message-delete/${message._id}`)
            toast(response.data.message)
            onMessageDelete(message._id)
        } catch (error) {
            console.log(error)
            toast.error("something went wrong")
        }
    }

    return (
        <Card className='card-bordered'>
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <CardTitle>{message.content}</CardTitle>
                    <AlertDialog>

                        <AlertDialogTrigger>
                          
                            <X className="w-5 h-5" />
                        
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div>
                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                </div>
            </CardHeader>
            <CardContent>
            </CardContent>
        </Card>
    )
}
