"use client";

import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import messages from "../../message.json";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-orange-50 px-4 md:px-12 py-12 flex flex-col items-center text-gray-800">

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 md:mb-20 max-w-4xl"
      >
        <h1 className="text-4xl md:text-6xl py-2 font-extrabold tracking-tight 
          bg-gradient-to-r from-orange-600 via-green-600 to-teal-600 
          bg-clip-text text-transparent">
          Ask. Share. Stay Anonymous.
        </h1>

        <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-700">
          A safe space for KUETians to drop questions, thoughts, and confessions.
          No names. No pressure. Just pure honesty.
        </p>
      </motion.section>


      {/* Highlight Mini Cards (Soft, Friendly — Miro Inspired) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10 max-w-5xl w-full">
        {["Anonymous", "Secure", "Fast", "Zero Judgment"].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.15 }}
            className="bg-white shadow-md border border-orange-200/50 rounded-xl 
              p-4 text-center hover:shadow-lg hover:scale-[1.03] transition-all cursor-default"
          >
            <p className="font-semibold text-orange-700">{item}</p>
          </motion.div>
        ))}
      </div>


      {/* Carousel */}
      <Carousel
        plugins={[Autoplay({ delay: 2500 })]}
        className="w-full max-w-4xl"
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index} className="p-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-white border border-orange-200 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-orange-600">
                      {message.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col md:flex-row items-start gap-4">
                    <Mail className="flex-shrink-0 text-green-600" />
                    <div>
                      <p className="text-gray-700 whitespace-pre-line break-words">
                        {message.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">{message.received}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>


      {/* CTA Footer */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="mb-3 font-medium text-gray-700">Get your own message board!</p>

        <Link href={'/sign-up'}>
          <button className="bg-gradient-to-r from-orange-500 to-green-500 hover:opacity-90 
            text-white font-bold px-6 py-2 rounded-lg shadow-md transition-all">
            Get Started
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
