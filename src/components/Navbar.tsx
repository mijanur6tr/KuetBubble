"use client"

import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

export default function Navbar() {
    const { data: session } = useSession()
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' }) // redirect to home page after logout
    }

    return (
        <nav className="p-4 md:px-16 py-2 shadow-md bg-gray-700 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="#" className="text-xl font-bold mb-4 md:mb-0">
                    KuetBuble
                </a>
                {session ? (
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                        <span className="mr-4">
                            Welcome, {session.user.username || session.user.email}
                        </span>
                        <Button
                            className="w-full md:w-auto bg-slate-100 text-black"
                            variant="outline"
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </Button>
                    </div>
                ) : (
                    <Link href="/sign-in">
                        <Button
                            className="w-full md:w-auto bg-slate-100 text-black"
                            variant="outline"
                        >
                            Login
                        </Button>
                    </Link>
                )}
            </div>
        </nav>
    )
}
