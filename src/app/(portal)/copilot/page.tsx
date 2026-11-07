"use client";

import * as React from "react";
import {
  Bot,
  Sparkles,
  Send,
  ShieldCheck,
  FileText,
  User,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

interface Message {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  citation?: {
    policyTitle: string;
    section: string;
    effectiveDate: string;
  };
}

export default function CopilotPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "msg-1",
      sender: "copilot",
      text: "Hello Alex! I am your PeopleOS AI Assistant. I have read-only access to authorized organizational records, leave balances, attendance logs, and approved HR policies. How can I assist you today?",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const msgCountRef = React.useRef(2);

  const samplePrompts = [
    "How many annual leave days do I have left?",
    "Who is absent today in my team?",
    "Explain UAE legal entity vs India work location calendar rule",
    "Show employees completing probation this month",
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) {
      toast.warning("Empty Query", "Please ask a question or select a suggestion.");
      return;
    }

    const userMsgId = `usr-${msgCountRef.current++}`;
    const userMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "";
      let citation = undefined;

      if (query.toLowerCase().includes("leave")) {
        replyText =
          "According to your tenant profile (Acme Global), you currently have **18.5 days of Annual Leave** remaining for the 2026 cycle. You also have 1 unlocked Air Ticket Entitlement credited on your 1-year anniversary.";
        citation = {
          policyTitle: "Global Leave & Service Entitlement Policy",
          section: "Sec 4.2 - Annual Accrual & Air Allowance",
          effectiveDate: "2026-01-01",
        };
      } else if (query.toLowerCase().includes("absent") || query.toLowerCase().includes("team")) {
        replyText =
          "In your department today (Engineering), 1 team member is on approved sick leave (**Marcus Vance**), and 2 team members are working remotely (**Elena Rostova**, **David Kim**). Team attendance rate is 92%.";
      } else if (query.toLowerCase().includes("uae") || query.toLowerCase().includes("india") || query.toLowerCase().includes("calendar")) {
        replyText =
          "In PeopleOS, **Legal Entity** (e.g. Acme UAE Ltd) and **Work Location** (e.g. Bangalore Tech Park) are decoupled. Employees employed under a UAE contract but working physically in India receive the **India Holiday Calendar** by default under an effective-dated assignment, ensuring local statutory observance.";
        citation = {
          policyTitle: "Cross-Border Assignment & Holiday Protocol",
          section: "Sec 2.1 - Decoupled Location & Entity Assignments",
          effectiveDate: "2026-01-01",
        };
      } else if (query.toLowerCase().includes("probation")) {
        replyText =
          "There are 2 employees in your organization completing their probation period this month: **Daniel Lee** (confirmed Nov 18) and **Aisha Al-Mansoor** (confirmed Nov 24). HR review forms have been drafted.";
      } else {
        replyText = `I analyzed your request: "${query}". All records in your tenant boundary are current. Let me know if you would like me to generate an approval workflow draft or pull an export.`;
      }

      const botMsgId = `bot-${msgCountRef.current++}`;
      const botMsg: Message = {
        id: botMsgId,
        sender: "copilot",
        text: replyText,
        timestamp: "Just now",
        citation,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EEEEEE] dark:border-[#163854]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#167D8D] text-white shadow-md shadow-[#167D8D]/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#071B2B] dark:text-[#f0f7f9] flex items-center gap-2">
                PeopleOS AI Copilot
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#B9E4E8] text-[#071B2B]">
                  Read-Only Sandbox
                </span>
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Permission-aware assistant with strict tenant isolation and policy citations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Tenant Scoped • Audit Logged</span>
          </div>
        </div>

        {/* Security Warning Notice */}
        <div className="p-3.5 rounded-xl border border-[#B9E4E8] dark:border-[#163854] bg-[#eaf7f9] dark:bg-[#0a2134] text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[#167D8D] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-[#071B2B] dark:text-[#B9E4E8]">
              Zero-Hallucination Policy Citation
            </span>
            <p className="text-zinc-600 dark:text-zinc-400">
              All answers provided by Copilot cite approved HR policy versions and effective dates. Sensitive mutations require explicit human administrator confirmation.
            </p>
          </div>
        </div>

        {/* Chat Stream Window */}
        <div className="rounded-2xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs flex flex-col h-[520px]">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "copilot" && (
                  <div className="w-8 h-8 rounded-full bg-[#167D8D] text-white flex items-center justify-center shrink-0 text-xs font-semibold shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm space-y-2 ${
                    m.sender === "user"
                      ? "bg-[#167D8D] text-white rounded-br-none"
                      : "bg-zinc-100 dark:bg-zinc-900 text-[#071B2B] dark:text-[#f0f7f9] rounded-bl-none border border-[#EEEEEE] dark:border-[#163854]"
                  }`}
                >
                  <div className="leading-relaxed whitespace-pre-wrap">{m.text}</div>

                  {m.citation && (
                    <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800 flex items-start gap-2 text-[11px] text-[#071B2B] dark:text-[#B9E4E8] font-medium">
                      <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <div>
                        <span>{m.citation.policyTitle} ({m.citation.section})</span>
                        <span className="text-zinc-400 block text-[10px]">
                          Effective Date: {m.citation.effectiveDate}
                        </span>
                      </div>
                    </div>
                  )}

                  <div
                    className={`text-[10px] ${
                      m.sender === "user"
                        ? "text-[#B9E4E8]"
                        : "text-zinc-400 dark:text-zinc-500"
                    } text-right`}
                  >
                    {m.timestamp}
                  </div>
                </div>

                {m.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center shrink-0 text-xs font-semibold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start items-center text-xs text-zinc-400 italic">
                <div className="w-8 h-8 rounded-full bg-[#167D8D] text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-[#EEEEEE] dark:border-[#163854] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#167D8D] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#167D8D] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#167D8D] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Quick prompt pills */}
          <div className="px-4 py-2 border-t border-[#EEEEEE] dark:border-[#163854] flex gap-2 overflow-x-auto text-[11px]">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-3 py-1 rounded-full border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] hover:bg-[#eaf7f9] dark:hover:bg-[#0a2134] text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[#EEEEEE] dark:border-[#163854] flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot about leave balances, policies, or team attendance..."
              className="flex-1 bg-[#fafafa] dark:bg-[#0a2134] border border-[#EEEEEE] dark:border-[#163854] rounded-xl px-4 py-2.5 text-xs text-[#071B2B] dark:text-[#f0f7f9] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#167D8D]/20 focus:border-[#167D8D]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-4 py-2.5 rounded-xl bg-[#167D8D] hover:bg-[#126876] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
