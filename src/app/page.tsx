"use client"

import Link from "next/link"
import Autoplay from "embla-carousel-autoplay"
import messages from "../../message.json"
import { Mail } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-800 text-gray-100 px-4 md:px-12 py-12 flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="text-center mb-12 md:mb-20 max-w-4xl">
        <h1 className="text-4xl md:text-6xl py-2 font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Ask. Share. Stay Anonymous.
        </h1>
        <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-200">
          A safe space for KUETians to drop questions, thoughts, and confessions. 
          No names. No pressure. Just vibes.
        </p>
      </section>

      {/* Carousel */}
      <Carousel
        plugins={[Autoplay({ delay: 2500 })]}
        className="w-full  max-w-4xl"
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index} className="p-4">
              <Card className="bg-white/10 border border-white/20 shadow-xl rounded-2xl backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-fuchsia-200">
                    {message.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-start gap-4">
                  <Mail className="flex-shrink-0 text-indigo-300" />
                  <div>
                    <p className="text-gray-100">{message.content}</p>
                    <p className="text-xs text-gray-400 mt-2">{message.received}</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Footer CTA */}
      <div className="mt-12 text-center">
        <p className="mb-3 font-medium text-gray-200">Get your own message board!</p>
        <Link href={'/sign-up'}>
          <button className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-6 py-2 rounded-lg shadow-md">
            Get Messages
          </button>
        </Link>
      </div>
    </div>
  )
}
