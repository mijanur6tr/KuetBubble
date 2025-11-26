"use client"

import { X } from 'lucide-react'
import axios from 'axios'
import dayjs from "dayjs";
import { toast } from 'react-toastify'
import { ApiResponse } from '@/types/ApiResponse'
import { Message } from '@/models/User.models'

import {
    Card,
    CardContent,
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

interface MessageCardProps {
    message: Message
    onMessageDelete: (messageId: string) => void
}

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/message-delete/${message._id}`)
            toast.success(response.data.message)
            onMessageDelete(message._id)
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }

    return (
        <Card className="bg-white/80 border border-green-200 backdrop-blur-md rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all flex flex-col justify-between">
            
            {/* Header: timestamp & delete */}
            <div className="flex justify-between items-start mb-3">
                <span className="text-gray-500 text-xs md:text-sm">
                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                </span>
                
                <AlertDialog>
                    <AlertDialogTrigger>
                        <X className="w-5 h-5 text-red-500 hover:text-red-600 cursor-pointer" />
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

            {/* Message Content */}
            <CardContent className="px-0 py-0">
                <p className="text-gray-800 text-sm md:text-base whitespace-pre-line break-words">
                    {message.content}
                </p>
            </CardContent>
        </Card>
    )
}
