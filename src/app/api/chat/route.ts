import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message, groupId, userId } = await req.json();

  // Call Gemini API
  const response = await fetch("https://api.gemini.com/v1/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gemini-2.5-flash", // use the appropriate model
      messages: [
        {
          role: "system",
          content: "You are a helpful expense assistant for a group app."
        },
        {
          role: "user",
          content: message
        }
      ]
    })
  });

  const data = await response.json();

  return NextResponse.json(data);
}
