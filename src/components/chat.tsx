
"use client"
import { useState } from "react";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

export default function ChatBot({ groupId, userId }: { groupId: string; userId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]); // ✅ Type defined
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    // Add user message
    setMessages(prev => [...prev, { sender: "user", text: input }]);

    // Send to chat API
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, groupId, userId })
    });

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content || "I didn't understand";

    setMessages(prev => [...prev, { sender: "bot", text: reply }]);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-white shadow-lg rounded-lg p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto mb-2 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === "user" ? "text-right" : "text-left"}>
            <span className="px-2 py-1 rounded bg-gray-200">{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Type message..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-3 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
