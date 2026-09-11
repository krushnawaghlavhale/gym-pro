import React, { useState, useRef, useEffect } from "react";
import { UserProfile, ChatMessage } from "../types";
import { IMAGES } from "../data/mockData";
import { Send, Bot, Sparkles, User, RefreshCcw, Dumbbell, Utensils, HelpCircle } from "lucide-react";

interface AssistantScreenProps {
  userProfile: UserProfile;
}

export const AssistantScreen: React.FC<AssistantScreenProps> = ({ userProfile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      role: "assistant",
      content: `Hello ${userProfile.name}! 👋 I am your dedicated FitAI Coach. I've designed your program around ${userProfile.goal} with a ${userProfile.diet} diet and ${userProfile.scheduleDays} days/week training schedule. How can I assist you with today's routine?`,
      timestamp: "Just now",
    },
    {
      id: "msg-2",
      role: "user",
      content: "Why did you recommend this workout?",
      timestamp: "Just now",
    },
    {
      id: "msg-3",
      role: "assistant",
      content:
        "This plan was selected based on your stated goal of building lean muscle, your intermediate experience level, and the availability of a full commercial gym. We prioritized compound movements (like squats and pushups) to maximize neuromuscular activation and metabolic efficiency within your 45-minute sessions.",
      timestamp: "Just now",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          userProfile,
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content:
          data.reply ||
          "Keep up the great consistency! Consistency and progressive overload are the master keys to lasting physique results.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const botMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content:
          "This plan was selected based on your stated goal of building lean muscle, your intermediate experience level, and the availability of a full commercial gym. We prioritized compound movements to maximize efficiency.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrompts = [
    "Why did you recommend this workout?",
    "Alternative exercise for squats",
    "Another vegetarian meal",
    "How to optimize recovery on rest days",
    "Should I do cardio before or after weights?",
  ];

  return (
    <div className="pt-20 pb-28 md:pb-12 px-4 md:px-10 max-w-4xl mx-auto min-h-screen text-[#131b2e] flex flex-col animate-fadeIn">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-[#003ec7] text-white flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-headline font-extrabold text-2xl text-[#131b2e] flex items-center gap-2">
              FitAI Smart Coach
              <span className="bg-[#c1f100] text-[#546b00] text-[10px] font-bold px-2 py-0.5 rounded-full">
                AI Powered
              </span>
            </h1>
            <p className="text-xs text-[#434656]">
              Real-time exercise science, nutrition advice, and customized modifications.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#c3c5d9] hover:border-[#003ec7] text-[#434656] hover:text-[#003ec7] whitespace-nowrap transition-all shadow-2xs hover:bg-[#eaedff]/40 cursor-pointer flex-shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Container */}
      <div className="flex-grow bg-white rounded-3xl p-5 md:p-6 border border-[#c3c5d9]/60 shadow-sm overflow-y-auto mb-4 space-y-4 max-h-[60vh] min-h-[400px]">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-[#003ec7] text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-[#003ec7] text-white rounded-tr-sm shadow-md font-medium"
                    : "bg-[#f2f3ff] text-[#131b2e] rounded-tl-sm border border-[#c3c5d9]/40 font-normal"
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>
                <span
                  className={`text-[10px] block mt-1 text-right ${
                    isUser ? "text-white/70" : "text-[#737688]"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-[#c3c5d9] mt-1">
                  <img
                    src={IMAGES.avatar}
                    alt={userProfile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-full bg-[#003ec7] text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-[#f2f3ff] rounded-2xl px-4 py-3 border border-[#c3c5d9]/40 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#003ec7] animate-bounce" />
              <div
                className="w-2 h-2 rounded-full bg-[#003ec7] animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-[#003ec7] animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="bg-white rounded-2xl p-2 border border-[#c3c5d9] shadow-md flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything about your fitness or nutrition..."
          className="flex-grow px-4 py-2.5 text-xs sm:text-sm text-[#131b2e] focus:outline-none placeholder-[#737688] font-medium"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="bg-[#003ec7] text-white hover:bg-[#0052ff] disabled:opacity-40 p-3 rounded-xl transition-all cursor-pointer flex-shrink-0 active:scale-95 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
