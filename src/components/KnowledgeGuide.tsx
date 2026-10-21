/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, BookOpen, Mic, MicOff, RefreshCw, AlertCircle,
  HelpCircle, MessageSquare, ChevronRight, CheckCircle2, Bookmark, Share2
} from 'lucide-react';

interface KnowledgeGuideProps {
  lang?: 'hi' | 'mr' | 'en';
  onOpenSource?: (bookId: string, chapterId?: string) => void;
  onNavigateToGranthalaya?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  notFound?: boolean;
  sources?: Array<{
    bookId: string;
    bookTitle: string;
    chapterId: string;
    chapterTitle: string;
  }>;
}

// Helper to parse inline bold text (**bold**)
function renderInlineBold(str: string) {
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-extrabold text-amber-950">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// FormattedAnswer component to render structured responses nicely
function FormattedAnswer({ text }: { text: string }) {
  const lines = text.split('\n');

  return (
    <div className="space-y-2.5 font-devanagari leading-relaxed text-gray-800 text-xs sm:text-sm">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        // Salutation
        if (trimmed.includes("जय श्री चक्रधर")) {
          return (
            <div key={idx} className="font-black text-amber-900 text-sm sm:text-base flex items-center gap-1.5 pb-1 border-b border-amber-200">
              <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>{trimmed}</span>
            </div>
          );
        }

        // Mandatory closing banner
        if (
          trimmed.includes("मार्गदर्शन घ्यावे") ||
          trimmed.includes("शास्त्र उमट होण्यासाठी") ||
          trimmed.includes("श्रीगुरूंचे मार्गदर्शन")
        ) {
          return (
            <div key={idx} className="mt-4 bg-amber-50 border-2 border-dashed border-amber-400/80 text-amber-950 rounded-xl p-3 font-bold text-xs sm:text-sm text-center shadow-2xs flex items-center justify-center gap-2">
              <span className="text-amber-600 text-base">🙏</span>
              <span>{trimmed}</span>
            </div>
          );
        }

        // Section Headers
        if (trimmed.startsWith("🧠 उत्तर")) {
          return (
            <div key={idx} className="mt-3 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-xl px-3.5 py-2 font-black text-xs sm:text-sm shadow-xs flex items-center gap-2">
              <span className="text-base">🧠</span>
              <span>उत्तर</span>
            </div>
          );
        }

        if (trimmed.startsWith("📖 सविस्तर स्पष्टीकरण")) {
          return (
            <div key={idx} className="mt-4 bg-amber-100/90 text-amber-950 border border-amber-300 rounded-xl px-3.5 py-2 font-black text-xs sm:text-sm shadow-2xs flex items-center gap-2">
              <span className="text-base">📖</span>
              <span>सविस्तर स्पष्टीकरण</span>
            </div>
          );
        }

        if (trimmed.startsWith("📚 ग्रंथाधारित संदर्भ") || trimmed.startsWith("📚 संबंधित ग्रंथ")) {
          return (
            <div key={idx} className="mt-4 bg-purple-100/90 text-purple-950 border border-purple-300 rounded-xl px-3.5 py-2 font-black text-xs sm:text-sm shadow-2xs flex items-center gap-2">
              <span className="text-base">📚</span>
              <span>{trimmed.replace(/^[📚\s]+/, '')}</span>
            </div>
          );
        }

        if (trimmed.startsWith("🔹 मूळ ग्रंथातील आधार")) {
          return (
            <div key={idx} className="mt-4 bg-orange-100/90 text-amber-950 border border-orange-300 rounded-xl px-3.5 py-2 font-black text-xs sm:text-sm shadow-2xs flex items-center gap-2">
              <span className="text-base">🔹</span>
              <span>मूळ ग्रंथातील आधार</span>
            </div>
          );
        }

        // Blockquotes
        if (trimmed.startsWith(">")) {
          const quoteText = trimmed.replace(/^>\s*/, '');
          return (
            <blockquote key={idx} className="my-2 bg-amber-50/90 border-l-4 border-amber-600 p-3 rounded-r-xl text-amber-950 font-semibold italic shadow-2xs">
              <div className="flex items-start gap-2">
                <Bookmark className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{renderInlineBold(quoteText)}</span>
              </div>
            </blockquote>
          );
        }

        // Numbered list items (१., २., ३., 1., 2., 3., etc.)
        const isNumbered = /^[०-९1-90-9]+[\.\)]\s*/.test(trimmed);
        if (isNumbered) {
          const numberMatch = trimmed.match(/^([०-९1-90-9]+[\.\)])\s*(.*)/);
          if (numberMatch) {
            const num = numberMatch[1];
            const content = numberMatch[2];
            return (
              <div key={idx} className="ml-1 sm:ml-2 pl-3 border-l-2 border-amber-300 my-1.5 space-y-0.5">
                <div className="flex items-start gap-2">
                  <span className="font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md text-xs shrink-0">{num}</span>
                  <div className="flex-1 leading-relaxed text-gray-900 font-medium">{renderInlineBold(content)}</div>
                </div>
              </div>
            );
          }
        }

        // Bullet points
        if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
          const content = trimmed.replace(/^[•\-\*]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 ml-2 my-1">
              <span className="text-amber-600 font-black text-base leading-none">•</span>
              <div className="flex-1 text-gray-800 font-medium">{renderInlineBold(content)}</div>
            </div>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="text-gray-800 leading-relaxed font-medium">
            {renderInlineBold(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default function KnowledgeGuide({
  lang = 'mr',
  onOpenSource,
  onNavigateToGranthalaya
}: KnowledgeGuideProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'ai',
      text: `जय श्री चक्रधर! 🙏\n\nमी **महानुभाव विश्व ज्ञानमार्गदर्शक** आहे. मी फक्त या अ‍ॅपमधील उपलब्ध महानुभाव पंथीय ग्रंथ, लीळाचरित्र, सूत्रपाठ, दृष्टांतपाठ, स्तोत्रे आणि आरत्यांच्या आधारे तुमच्या प्रश्नांची उत्तरे देतो.\n\nतुम्ही खालील उदाहरणांपैकी प्रश्न निवडू शकता किंवा आपला स्वतःचा प्रश्न विचारू शकता:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: []
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested example questions in Marathi
  const suggestedQuestions = [
    "अहेतुक भूतभजनाने ज्ञानाधिकार कसा प्राप्त होतो?",
    "भूतभजनाची पात्रे किती?",
    "चार अनादिनित्य पदार्थ कोणते आहेत?",
    "भटोबास कोणत्या गावचे होते?",
    "श्री चक्रधर स्वामींचे अवतार कार्य आणि मुख्य संदेश काय आहे?",
    "सूत्रपाठात ईश्वर स्वरूपाविषयी आणि भक्तीविषयी काय सांगितले आहे?",
    "महानुभाव पंथातील पंचकृष्ण अवतार कोणते आहेत?"
  ];

  // Auto scroll chat to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle Speech Recognition for voice typing
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('तुमच्या ब्राऊझरमध्ये व्हॉईस इनपुट उपलब्ध नाही. कृपया टाइप करा.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'mr-IN'; // Marathi speech input
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  // Submit Question
  const handleSendQuestion = async (queryText?: string) => {
    const query = (queryText || inputQuery).trim();
    if (!query || loading) return;

    const userMsgId = 'usr_' + Date.now();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: timeStr
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      // Build history for API request
      const chatHistory = messages
        .filter(m => m.id !== 'welcome_1')
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text
        }));

      const res = await fetch('/api/knowledge-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          chatHistory
        })
      });

      if (!res.ok) {
        throw new Error('API server error');
      }

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: data.reply || "या प्रश्नाचे स्पष्ट उत्तर सध्या महानुभाव विश्वमधील उपलब्ध ग्रंथसंग्रहात सापडले नाही.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notFound: data.notFound || false,
        sources: data.sources || []
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (err) {
      console.error("Knowledge Guide fetch error:", err);
      const fallbackMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: "या प्रश्नाचे स्पष्ट उत्तर सध्या महानुभाव विश्वमधील उपलब्ध ग्रंथसंग्रहात सापडले नाही.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notFound: true,
        sources: []
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto font-devanagari animate-fade-in">

      {/* 1. HERO TITLE HEADER */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-purple-900 rounded-3xl p-5 text-white shadow-xl border-2 border-[#FFD54F]/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-[#FFD54F]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[#FFD54F] font-black text-xs border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD54F] animate-spin" />
              ग्रंथाधारित AI मार्गदर्शक
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-display flex items-center gap-2">
              <span>🧠 ज्ञानमार्गदर्शक</span>
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/90 max-w-2xl leading-relaxed">
              महानुभाव विश्व अ‍ॅपमधील उपलब्ध ग्रंथ, सूत्रे, लीळा व स्तोत्रांच्या आधारे आपल्या अध्यात्मिक प्रश्नांची उत्तरे मिळवा.
            </p>
          </div>

          {onNavigateToGranthalaya && (
            <button
              onClick={onNavigateToGranthalaya}
              className="self-start md:self-center px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-2 border border-white/40 shadow-md backdrop-blur-md transition-all cursor-pointer shrink-0"
            >
              <BookOpen className="w-4 h-4 text-[#FFD54F]" />
              <span>संपूर्ण ग्रंथालय पहा</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. STRICT RULE NOTICE BANNER */}
      <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-950 shadow-sm">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed font-medium">
          <strong className="font-bold text-amber-900">कडक नियम व वैशिष्ठ्य:</strong> ज्ञानमार्गदर्शक हे फक्त या अ‍ॅपमध्ये उपलब्ध असणाऱ्या ग्रंथसंग्रहातील माहितीचा आधार घेते. ग्रंथांमध्ये उत्तर नसेल तर ते स्पष्टपणे नमूद केले जाते.
        </div>
      </div>

      {/* 3. SUGGESTED QUESTIONS CHIPS */}
      <div className="bg-white/90 border border-amber-200/80 rounded-2xl p-3.5 shadow-md">
        <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>सुचवलेले प्रश्न (उदाहरणे):</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuestion(q)}
              disabled={loading}
              className="text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl px-3 py-2 text-left transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <ChevronRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. CHAT MESSAGES DISPLAY WORKSPACE */}
      <div className="bg-white/95 border-2 border-amber-200 rounded-3xl p-3 sm:p-5 shadow-xl min-h-[380px] max-h-[550px] flex flex-col justify-between overflow-hidden">

        {/* Scrollable Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-3.5 sm:p-4 shadow-sm text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-tr-none font-medium'
                    : 'bg-amber-50/80 border border-amber-200 text-gray-800 rounded-tl-none font-sans'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-amber-200/80 text-amber-900 font-extrabold text-xs">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>ज्ञानमार्गदर्शक उत्तर:</span>
                  </div>
                )}

                {/* Formatted Text Content */}
                {msg.sender === 'ai' ? (
                  <FormattedAnswer text={msg.text} />
                ) : (
                  <div className="whitespace-pre-wrap font-devanagari">
                    {msg.text}
                  </div>
                )}

                {/* Not Found Warning Badge */}
                {msg.notFound && (
                  <div className="mt-3 bg-rose-50 border border-rose-300 text-rose-900 rounded-xl p-2.5 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>हा प्रश्न सध्या उपलब्ध ग्रंथसंग्रहात थेट नमूद नाही.</span>
                  </div>
                )}

                {/* Source References & Read Original Button */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3.5 border-t-2 border-amber-200/90 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-amber-600" />
                        ग्रंथ व प्रकरण संदर्भ (Source References):
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                        {msg.sources.length} संदर्भ
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {msg.sources.map((src, sIdx) => (
                        <div
                          key={sIdx}
                          className="bg-white border-2 border-amber-200/90 hover:border-amber-500 rounded-2xl p-3 flex items-center justify-between gap-2.5 shadow-2xs hover:shadow-sm transition-all group"
                        >
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-black text-amber-950 font-devanagari truncate">
                              📖 {src.bookTitle}
                            </h5>
                            <p className="text-[11px] font-bold text-gray-700 font-devanagari truncate mt-0.5">
                              📑 {src.chapterTitle}
                            </p>
                          </div>

                          {onOpenSource && (
                            <button
                              onClick={() => onOpenSource(src.bookId, src.chapterId)}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs hover:scale-105"
                              title="अ‍ॅपमधील मूळ ग्रंथ/प्रकरण उघडा"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>मूळ ग्रंथ वाचा</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <div className={`text-[9px] mt-2 text-right ${msg.sender === 'user' ? 'text-amber-100' : 'text-gray-400'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2 text-xs font-bold">
                <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />
                <span>ग्रंथसंग्रहातून उत्तर शोधले जात आहे... कृपया वाट पहा.</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 5. INPUT & ACTIONS BAR */}
        <div className="pt-3 border-t border-amber-200 mt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuestion();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Mic Button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={loading}
              className={`p-3 rounded-2xl border font-bold transition-all shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse border-rose-700'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
              }`}
              title={isListening ? "ऐकत आहे..." : "बोलून प्रश्न विचारा"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Question Input Textarea/Input */}
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="ग्रंथाधारित प्रश्न इथे टाइप करा..."
              disabled={loading}
              className="flex-1 bg-amber-50/50 border-2 border-amber-200 focus:border-amber-500 focus:bg-white rounded-2xl px-4 py-3 text-xs sm:text-sm font-devanagari text-gray-900 placeholder:text-gray-400 outline-none transition-all shadow-inner"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="px-4 sm:px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>विचारारा</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
