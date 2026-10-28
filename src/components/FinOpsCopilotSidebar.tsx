import React, { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw, ArrowUpRight, Terminal } from 'lucide-react';
import {
  ChatMessage,
  SUGGESTED_COPILOT_PROMPTS,
  INITIAL_CHAT_HISTORY,
  generateCopilotResponse,
} from '../data/mockFinOpsData';

interface FinOpsCopilotSidebarProps {
  totalSpend: number;
  remainingSavings: number;
  remediatedSavings: number;
  openRecsCount: number;
  activeAnomaliesCount: number;
  tagCompliance: number;
  onHighlightResource?: (resourceId: string) => void;
}

export const FinOpsCopilotSidebar: React.FC<FinOpsCopilotSidebarProps> = ({
  totalSpend,
  remainingSavings,
  remediatedSavings,
  openRecsCount,
  activeAnomaliesCount,
  tagCompliance,
  onHighlightResource,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_HISTORY);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (promptText?: string) => {
    const queryText = (promptText ?? input).trim();
    if (!queryText || isTyping) return;

    const now = new Date();
    const timestamp = `${String(now.getUTCHours()).padStart(2, '0')}:${String(
      now.getUTCMinutes()
    ).padStart(2, '0')} UTC`;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!promptText) setInput('');
    setIsTyping(true);

    window.setTimeout(() => {
      const response = generateCopilotResponse(queryText, {
        totalSpend,
        remainingSavings,
        remediatedSavings,
        openRecsCount,
        activeAnomaliesCount,
        tagCompliance,
      });

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        timestamp,
        metricsReferenced: response.metricsReferenced,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 320);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_CHAT_HISTORY);
    setInput('');
  };

  return (
    <aside
      aria-label="AI FinOps Copilot Sidebar"
      className="w-full xl:w-[380px] shrink-0 bg-[#141417] border border-[#262522] rounded-xl flex flex-col h-[680px] xl:h-[calc(100vh-7.5rem)] xl:sticky xl:top-20"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#262522] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#E5B869] shrink-0" />
            <h2 className="text-sm font-semibold text-[#F5F3EF] tracking-tight truncate">
              AI FinOps Copilot
            </h2>
          </div>
          <p className="text-xs text-[#9E9A90] mt-0.5 truncate">
            Billing telemetry · AWS · GCP · Azure
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetChat}
          title="Reset conversation"
          className="px-2.5 py-1.5 text-xs font-medium text-[#9E9A90] hover:text-[#F5F3EF] hover:bg-[#1C1C20] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Live Context Summary Bar (unboxed clean metadata with separators) */}
      <div className="px-5 py-2.5 bg-[#0C0C0E]/80 border-b border-[#262522] text-xs text-[#9E9A90] font-mono tabular-nums flex items-center justify-between">
        <span>Open Savings: ${remainingSavings.toLocaleString()}/mo</span>
        <span aria-hidden="true">·</span>
        <span>{openRecsCount} Idle Resources</span>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5 text-[11px] text-[#78746B] font-mono tabular-nums">
              <span>{msg.role === 'user' ? 'FinOps Lead' : 'Strata Copilot'}</span>
              <span aria-hidden="true">·</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[94%] rounded-lg px-4 py-3 text-xs leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-[#E5B869]/15 text-[#F5F3EF] border border-[#E5B869]/35'
                  : 'bg-[#0C0C0E] text-[#E8E4DC] border border-[#262522]'
              }`}
            >
              {msg.content}

              {msg.metricsReferenced && msg.metricsReferenced.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#22211E] flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono tabular-nums text-[#9E9A90]">
                  {msg.metricsReferenced.map((metric, idx) => {
                    const isResourceId =
                      metric.startsWith('i-') ||
                      metric.startsWith('vol-') ||
                      metric.startsWith('gke-') ||
                      metric.startsWith('nat-');
                    return (
                      <React.Fragment key={metric}>
                        {idx > 0 && <span aria-hidden="true">·</span>}
                        {isResourceId && onHighlightResource ? (
                          <button
                            type="button"
                            onClick={() => onHighlightResource(metric.split(' ')[0])}
                            className="text-[#E5B869] hover:text-[#F0CA86] underline underline-offset-2 cursor-pointer"
                          >
                            {metric}
                          </button>
                        ) : (
                          <span>{metric}</span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col items-start">
            <div className="text-[11px] text-[#78746B] font-mono mb-1">
              Strata Copilot · Analyzing CUR & BigQuery billing logs...
            </div>
            <div className="bg-[#0C0C0E] border border-[#262522] rounded-lg px-4 py-3 text-xs text-[#9E9A90] font-mono">
              Querying cost allocation & resource utilization...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Starters */}
      <div className="px-5 py-3 border-t border-[#262522] bg-[#0C0C0E]/50">
        <div className="text-[11px] font-medium text-[#9E9A90] mb-2">
          Suggested FinOps Queries
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {SUGGESTED_COPILOT_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="text-left px-3 py-1.5 rounded-md bg-[#18181C] hover:bg-[#22211E] border border-[#262522] text-xs text-[#D6D2C8] hover:text-[#F5F3EF] transition-colors flex items-center justify-between gap-2 group cursor-pointer"
            >
              <span className="truncate">{prompt}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#78746B] group-hover:text-[#E5B869] shrink-0 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-4 border-t border-[#262522] bg-[#101013] rounded-b-xl"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about bill spikes, S3, or idle EC2..."
            aria-label="Ask AI FinOps Copilot"
            className="flex-1 min-w-0 bg-[#0C0C0E] border border-[#262522] focus:border-[#E5B869] rounded-lg px-3.5 py-2 text-xs text-[#F5F3EF] placeholder:text-[#78746B] focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-3.5 py-2 bg-[#E5B869] hover:bg-[#F0CA86] disabled:bg-[#1C1C20] disabled:text-[#6E6A61] text-[#0C0C0E] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </aside>
  );
};
