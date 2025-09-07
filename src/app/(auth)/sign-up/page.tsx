"use client"

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useDebounceValue } from 'usehooks-ts';
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormField,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUpSchema } from '@/schemas/signUpSchema';
import { useRouter } from 'next/navigation';



export default function SignUp() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmiting, setIsSubmiting] = useState(false);
    const [debouncedUsername] = useDebounceValue(username, 300);

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    });

    useEffect(() => {
        const checkUsername = async () => {
            if (!debouncedUsername) return;
            setIsCheckingUsername(true);
            setUsernameMessage('');
            try {
                const response = await axios.get<ApiResponse>(`/api/username-unique?username=${debouncedUsername}`);
                setUsernameMessage(response.data.message);
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username');
            } finally {
                setIsCheckingUsername(false);
            }
        };
        checkUsername();
    }, [debouncedUsername]);

    const Submit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmiting(true);
        try {
            const response = await axios.post<ApiResponse>("/api/sign-up", data);
            if (response.data.success) {
                toast.success("Registered Successfully! Verification code sent to your email");
                router.replace(`/verify/${data.username}`);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? "Failed to register");
        } finally {
            setIsSubmiting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
            <div className="relative w-full max-w-md mx-2 p-8 space-y-8 bg-white rounded-lg shadow-md">

               

                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join KUET Bubble
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(Submit)} className='space-y-6'>
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <Input
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setUsername(e.target.value);
                                        }}
                                    />
                                    <div className="flex items-center gap-2 mt-1">
                                        {fieldState.error ? (
                                            <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                                        ) : isCheckingUsername ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            usernameMessage && (
                                                <p className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}>
                                                    {usernameMessage}
                                                </p>
                                            )
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='email'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" />
                                    </FormControl>
                                    <p className='text-gray-400 mb-2 text-sm'>We will send you a verification code</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='password'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type='password' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit' className='w-full mt-2' disabled={isSubmiting} >
                            {isSubmiting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
