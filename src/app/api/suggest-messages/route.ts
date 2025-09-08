// app/api/gemini/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me. Avoid personal or sensitive topics, encourage friendly interaction.Make the questions intersting and short.Include fun that the university genZ students doing engineering can relate.Make the questions specific for KUET means Khulna University of Engineering and Technology students so that they can relate to the question and get hooked.The university name {KUET}.Make the questions easy to understand but tricky as well and gets of fun. For example: 'If KUET had a Hogwarts house system, which hall would be Gryffindor? 😂||একজন crush এর কারণে library regular হওয়া কি সত্যি myth নাকি fact? 👀||Which is harder: KUET exams or waking up for 8 AM class? 😴' Make the generated messages bit different from the past one and bring creativity";

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
