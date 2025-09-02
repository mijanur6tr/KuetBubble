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
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-800 text-gray-100 min-h-screen">
        
        {/* Hook Section */}
        <section className="text-center mb-10 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Ask. Share. Stay Anonymous.
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            A safe space for KUETians to drop questions, thoughts, and confessions 💬  
            No names. No pressure. Just vibes.
          </p>
        </section>

        {/* Carousel */}
        <Carousel
          plugins={[Autoplay({ delay: 2500 })]}
          className="w-full min-h-[60vh] max-w-lg md:max-w-2xl"
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
                  <CardContent className="flex flex-col md:flex-row items-start space-y-3 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0 text-indigo-300" />
                    <div>
                      <p className="text-gray-100">{message.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gradient-to-r from-indigo-950 to-purple-900 text-gray-300 text-sm md:text-base">
        © 2025 KuetBuble. Built with ❤️ for KUETians.
      </footer>
    </>
  )
}
