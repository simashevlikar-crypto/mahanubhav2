/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import http from "http";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import initial data
import {
  initialBooks,
  initialChapters,
  initialBhajans,
  initialPravachans,
  initialTemples,
  initialEvents,
  initialNews,
  initialMessages
} from "./src/data";
import { Book, Chapter, Bhajan, Pravachan, Temple, EventKaryakram, Samachar, CommunityMessage, AppNotification, AnalyticsData } from "./src/types";

const app = express();
const PORT = Number(process.env.PORT) || 3000;


app.use(express.json());

// API Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// In-memory Database
let books: Book[] = [...initialBooks];
let chapters: Chapter[] = [...initialChapters];
let bhajans: Bhajan[] = [...initialBhajans];
let pravachans: Pravachan[] = [...initialPravachans];
let temples: Temple[] = [...initialTemples];
let events: EventKaryakram[] = [...initialEvents];
let news: Samachar[] = [...initialNews];
let messages: CommunityMessage[] = [...initialMessages];
let notifications: AppNotification[] = [
  {
    id: 'n_1',
    title: 'जय चक्रधर! नवीन ग्रंथ उपलब्ध',
    body: 'दृष्टांतपाठ ग्रंथाचे वाचन आता सुलभ अध्यायवार वाचन आणि विवेचनासह उपलब्ध आहे.',
    date: '२०२६-०६-२९ १०:०० AM',
    category: 'granth'
  },
  {
    id: 'n_2',
    title: 'आगामी श्रीकृष्ण जयंती उत्सव',
    body: 'ऋद्धपूर धाम येथे होणाऱ्या पावन जन्मोत्सव कार्यक्रमाचे वेळापत्रक प्रसिद्ध करण्यात आले आहे.',
    date: '२०२६-०६-२८ ०५:०० PM',
    category: 'event'
  }
];

let analytics: AnalyticsData = {
  appOpens: 342,
  mostReadBooks: {
    'सूत्रपाठ (Sutrapath)': 186,
    'लीलाचरित्र (Leela Charitra)': 112,
    'दृष्टांतपाठ (Drishtantapath)': 44
  },
  mostPlayedBhajans: {
    'चक्रधरा दया करा देवा (Chakradhara Daya Kara Deva)': 95,
    'श्रीकृष्ण गोपाळ हरी (Shree Krishna Gopal Hari)': 67,
    'पंचकृष्ण नामस्मरण (Panchakrishna Namasmaran)': 32
  },
  activeUsersToday: 48
};

// Lazy initialization of Gemini AI
let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Books API
app.get("/api/books", (req, res) => {
  res.json(books);
});

app.post("/api/books", (req, res) => {
  const newBook: Book = {
    id: 'book_' + Date.now(),
    title: req.body.title || 'शीर्षक विरहित',
    titleEn: req.body.titleEn || 'Untitled',
    author: req.body.author || 'अज्ञात',
    description: req.body.description || 'कोई वर्णन उपलब्ध नहीं है।',
    descriptionEn: req.body.descriptionEn || '',
    category: req.body.category || 'other',
    chaptersCount: 0,
    coverImage: req.body.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop'
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// Chapters API
app.get("/api/chapters", (req, res) => {
  res.json(chapters);
});

app.post("/api/chapters", (req, res) => {
  const { bookId, number, title, titleEn, content, explanation } = req.body;
  if (!bookId || !title || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newChapter: Chapter = {
    id: 'chap_' + Date.now(),
    bookId,
    number: Number(number) || (chapters.filter(c => c.bookId === bookId).length + 1),
    title,
    titleEn,
    content,
    explanation
  };

  chapters.push(newChapter);

  // Update book chapter count
  const book = books.find(b => b.id === bookId);
  if (book) {
    book.chaptersCount = (book.chaptersCount || 0) + 1;
  }

  res.status(201).json(newChapter);
});

// Bhajans API
app.get("/api/bhajans", (req, res) => {
  res.json(bhajans);
});

app.post("/api/bhajans", (req, res) => {
  const { title, language, lyrics, singer, audioUrl, videoUrl, category } = req.body;
  if (!title || !lyrics) {
    return res.status(400).json({ error: "Title and Lyrics are required" });
  }

  const newBhajan: Bhajan = {
    id: 'bh_' + Date.now(),
    title,
    language: language || 'हिंदी (Hindi)',
    lyrics,
    singer,
    audioUrl,
    videoUrl,
    category
  };

  bhajans.push(newBhajan);
  res.status(201).json(newBhajan);
});

// Pravachans API
app.get("/api/pravachans", (req, res) => {
  res.json(pravachans);
});

// Temples API
app.get("/api/temples", (req, res) => {
  res.json(temples);
});

app.post("/api/temples", (req, res) => {
  const { name, nameEn, type, location, description, history, photoUrl, contact, darshanTimings, latitude, longitude, state, district, taluka } = req.body;
  if (!name || !location || !description) {
    return res.status(400).json({ error: "Name, Location and Description are required" });
  }

  const newTemple: Temple = {
    id: 't_' + Date.now(),
    name,
    nameEn: nameEn || name,
    type: type || 'temple',
    location,
    description,
    history,
    photoUrl: photoUrl || 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=600&auto=format&fit=crop',
    contact: contact || '',
    darshanTimings: darshanTimings || '',
    latitude: Number(latitude) || 19.0,
    longitude: Number(longitude) || 75.0,
    state: state || 'महाराष्ट्र',
    district: district || '',
    taluka: taluka || ''
  };

  temples.push(newTemple);
  res.status(201).json(newTemple);
});

// Events API
app.get("/api/events", (req, res) => {
  res.json(events);
});

app.post("/api/events", (req, res) => {
  const { title, date, type, location, description, contact } = req.body;
  if (!title || !date || !location) {
    return res.status(400).json({ error: "Title, Date and Location are required" });
  }

  const newEvent: EventKaryakram = {
    id: 'ev_' + Date.now(),
    title,
    date,
    type: type || 'general',
    location,
    description,
    contact
  };

  events.push(newEvent);
  res.status(201).json(newEvent);
});

// News API
app.get("/api/news", (req, res) => {
  res.json(news);
});

app.post("/api/news", (req, res) => {
  const { title, date, content, category, imageUrl } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and Content are required" });
  }

  const newNews: Samachar = {
    id: 'ns_' + Date.now(),
    title,
    date: date || new Date().toISOString().split('T')[0],
    content,
    category: category || 'news',
    imageUrl
  };

  news.push(newNews);
  res.status(201).json(newNews);
});

// Community Messages API
app.get("/api/messages", (req, res) => {
  res.json(messages);
});

app.post("/api/messages", (req, res) => {
  const { userName, userRole, message } = req.body;
  if (!userName || !message) {
    return res.status(400).json({ error: "User name and message are required" });
  }

  const newMessage: CommunityMessage = {
    id: 'msg_' + Date.now(),
    userName,
    userRole: userRole || 'user',
    message,
    timestamp: 'आज, ' + new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
    likes: 0,
    replies: []
  };

  messages.unshift(newMessage); // Prepend to show latest first
  res.status(201).json(newMessage);
});

// Like a message
app.post("/api/messages/:id/like", (req, res) => {
  const msg = messages.find(m => m.id === req.params.id);
  if (msg) {
    msg.likes = (msg.likes || 0) + 1;
    return res.json(msg);
  }
  res.status(404).json({ error: "Message not found" });
});

// Reply to a message
app.post("/api/messages/:id/reply", (req, res) => {
  const { userName, userRole, message } = req.body;
  if (!userName || !message) {
    return res.status(400).json({ error: "Name and message are required" });
  }

  const msg = messages.find(m => m.id === req.params.id);
  if (msg) {
    if (!msg.replies) msg.replies = [];
    const newReply = {
      id: 'rep_' + Date.now(),
      userName,
      userRole: userRole || 'user',
      message,
      timestamp: 'आज, ' + new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })
    };
    msg.replies.push(newReply);
    return res.json(msg);
  }
  res.status(404).json({ error: "Message not found" });
});

// Notifications API
app.get("/api/notifications", (req, res) => {
  res.json(notifications);
});

app.post("/api/notifications", (req, res) => {
  const { title, body, category } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: "Title and Body are required" });
  }

  const newNotif: AppNotification = {
    id: 'n_' + Date.now(),
    title,
    body,
    date: 'आज, ' + new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
    category: category || 'general'
  };

  notifications.unshift(newNotif);
  res.status(201).json(newNotif);
});

// Analytics API
app.get("/api/analytics", (req, res) => {
  res.json(analytics);
});

app.post("/api/analytics/open", (req, res) => {
  analytics.appOpens += 1;
  analytics.activeUsersToday = Math.floor(analytics.appOpens / 7) + 5;
  res.json(analytics);
});

app.post("/api/analytics/read", (req, res) => {
  const { bookTitle } = req.body;
  if (bookTitle) {
    analytics.mostReadBooks[bookTitle] = (analytics.mostReadBooks[bookTitle] || 0) + 1;
  }
  res.json(analytics);
});

app.post("/api/analytics/play", (req, res) => {
  const { bhajanTitle } = req.body;
  if (bhajanTitle) {
    analytics.mostPlayedBhajans[bhajanTitle] = (analytics.mostPlayedBhajans[bhajanTitle] || 0) + 1;
  }
  res.json(analytics);
});

// -------------------------------------------------------------
// Sri Chakradhar Swami Spiritual AI Chat (Gemini)
// -------------------------------------------------------------
app.post("/api/spiritual-ai", async (req, res) => {
  const { message, chatHistory } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const client = getAiClient();
  if (!client) {
    // Graceful fallback if API key is not configured or offline
    return res.json({
      reply: "दंडवत प्रणाम! मैं श्रीचक्रधर स्वामी जी के उपदेशों पर आधारित कृत्रिम मेधा (AI) सहायक हूँ। अभी मेरे सर्वर की चाबी (Gemini API Key) सेट नहीं की गई है, परंतु मैं आपको स्वामीजी का यह मुख्य वचन स्मरण दिलाना चाहूँगा:\n\n*\"परिग्रहा पासौनि निवृत्ति करावी। ईश्वर भक्तीवाचून गत्यंतर नाही।\"*\n\n(यदि आप एडमिन हैं, तो कृपया गूगल एआई स्टूडियो के Secrets पैनल में `GEMINI_API_KEY` दर्ज करें ताकि मैं पूर्णतः सक्रिय होकर आपके सभी आध्यात्मिक प्रश्नों का विस्तृत उत्तर दे सकूँ!)"
    });
  }

  try {
    const systemPrompt = `
You are 'श्रीचक्रधर AI' (Shree Chakradhar AI), a profound spiritual assistant representing the teachings, parables, and philosophy of Sarvanya Shree Chakradhar Swami and the Mahanubhav Sect (महानुभाव पंथ).
Your purpose is to answer spiritual questions, explain the parables (Drishtantas), explain Sutrapath (सूत्रपाठ) and Leela Charitra (लीलाचरित्र) to seekers in a very polite, humble, and deeply spiritual manner.

Tone & Guidelines:
1. Always start your response with "दंडवत प्रणाम!" (Dandavat Pranam) or "जय श्री चक्रधर!" (Jai Shree Chakradhar).
2. Answer primarily in elegant, easy-to-understand Hindi or Marathi, depending on the language of the prompt. You can provide translations if helpful.
3. Quote relevant aphorisms from Shree Sutrapath or stories from Leela Charitra or parables from Drishtantapath when appropriate.
4. Promote the key values of the Mahanubhav Sect: non-violence (अहिंसा), virakti (वैराग्य/विरक्ति), devotion to Panchakrishna (पंचकृष्ण भक्ति), simplicity, and compasssion for all living beings.
5. If you do not know the exact reference, respond humbly stating that as a digital representation of Swami's teachings, you try your best to guide, but one should also consult the respected Shastris (शास्त्री) and Mahants (महंत) of the sect.
6. Keep the formatting beautiful, using bullet points, bold key terms, and blockquotes for verses.
`;

    // Map chatHistory to Gemini API contents structure if present
    const formattedHistory = (chatHistory || []).map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));

    // Append the new message
    formattedHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedHistory,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 1200,
      }
    });

    const replyText = response.text || "क्षमस्व! मैं अभी आपकी बात पूरी तरह समझ नहीं पाया। कृपया पुनः प्रयास करें।";
    res.json({ reply: replyText });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "AI Response Failed",
      reply: "दंडवत प्रणाम! क्षमा करें, तकनीकी कारणों से मैं अभी आपसे संपर्क नहीं कर पा रहा हूँ। कृपया कुछ क्षणों के पश्चात पुनः प्रयास करें।"
    });
  }
});

// -------------------------------------------------------------
// Knowledge Guide (ज्ञानमार्गदर्शक) Endpoint
// -------------------------------------------------------------
app.post("/api/knowledge-guide", async (req, res) => {
  const { question, chatHistory } = req.body;

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "प्रश्नाची नोंद आवश्यक आहे." });
  }

  const client = getAiClient();
  const NOT_FOUND_MSG = "या प्रश्नाचे सविस्तर उत्तर उपलब्ध ग्रंथीय संदर्भांमध्ये सापडले नाही.";

  const rawQuestion = question.trim();
  const normalizedQuestion = rawQuestion.toLowerCase();

  // 1. Deep Keyword & Phrase extraction
  const tokens = normalizedQuestion
    .replace(/[^\u0900-\u097F\w\s]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 1);

  const phrases: string[] = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    phrases.push(`${tokens[i]} ${tokens[i + 1]}`);
    if (i < tokens.length - 2) {
      phrases.push(`${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`);
    }
  }

  // 2. Score chapters with phrase matching & concept boosters
  const scoredChapters = chapters.map(chap => {
    let score = 0;
    const title = (chap.title || "").toLowerCase();
    const content = (chap.content || "").toLowerCase();
    const explanation = (chap.explanation || "").toLowerCase();
    const book = books.find(b => b.id === chap.bookId);
    const bookTitle = (book?.title || "").toLowerCase();

    // Multi-word phrase matches (highest priority)
    phrases.forEach(phrase => {
      if (title.includes(phrase)) score += 60;
      if (explanation.includes(phrase)) score += 35;
      if (content.includes(phrase)) score += 25;
    });

    // Token matches
    tokens.forEach(token => {
      if (title.includes(token)) score += 20;
      if (bookTitle.includes(token)) score += 12;
      if (explanation.includes(token)) score += 8;

      const count = (content.split(token).length - 1);
      score += Math.min(count, 12) * 3;
    });

    // Topic Boosters
    if (normalizedQuestion.includes("पात्रे") || normalizedQuestion.includes("भूतभजन")) {
      if (title.includes("भूतभजन") || title.includes("पात्रे") || content.includes("पात्रे")) score += 45;
    }
    if (normalizedQuestion.includes("अहेतुक") || normalizedQuestion.includes("ज्ञानाधिकार")) {
      if (title.includes("अहेतुक") || title.includes("ज्ञानाधिकार") || content.includes("ज्ञानाधिकार")) score += 45;
    }
    if (normalizedQuestion.includes("नित्य") || normalizedQuestion.includes("पदार्थ")) {
      if (title.includes("नित्य") || content.includes("अनादिनित्य") || content.includes("चार पदार्थ")) score += 35;
    }
    if (normalizedQuestion.includes("पंचकृष्ण") || normalizedQuestion.includes("अवतार")) {
      if (title.includes("पंचकृष्ण") || title.includes("अवतार") || bookTitle.includes("पंचकृष्ण")) score += 35;
    }

    return { chap, book, score };
  });

  const matched = scoredChapters
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  // Search Bhajans
  const matchedBhajans = bhajans.map(bh => {
    let score = 0;
    const title = (bh.title || "").toLowerCase();
    const lyrics = (bh.lyrics || "").toLowerCase();
    tokens.forEach(token => {
      if (title.includes(token)) score += 10;
      if (lyrics.includes(token)) score += 3;
    });
    return { bh, score };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);

  // Sources Map
  const sourcesMap: Array<{ bookId: string; bookTitle: string; chapterId: string; chapterTitle: string }> = [];

  matched.forEach(m => {
    sourcesMap.push({
      bookId: m.chap.bookId,
      bookTitle: m.book?.title || "पवित्र ग्रंथ",
      chapterId: m.chap.id,
      chapterTitle: m.chap.title
    });
  });

  matchedBhajans.forEach(b => {
    sourcesMap.push({
      bookId: "bhajan",
      bookTitle: "भजन व आरती",
      chapterId: b.bh.id,
      chapterTitle: b.bh.title
    });
  });

  // Helper to extract the most relevant window from long chapter content
  function extractRelevantSnippet(
    content: string,
    tokens: string[],
    phrases: string[],
    maxLength: number = 7500
  ): string {
    if (!content || content.length <= maxLength) {
      return content;
    }

    const lowerContent = content.toLowerCase();

    // Map common number digits to Marathi words
    const expandedTokens = [...tokens];
    const expandedPhrases = [...phrases];

    if (tokens.some(t => t === "२३" || t === "23")) {
      expandedTokens.push("तेवीस");
    }
    if (tokens.some(t => t === "४" || t === "4")) {
      expandedTokens.push("चार");
    }
    if (tokens.some(t => t === "५" || t === "5")) {
      expandedTokens.push("पाच");
    }

    // Add 2-word combinations without digits
    tokens.forEach((t1, i) => {
      tokens.forEach((t2, j) => {
        if (i < j && (t1.length >= 3 || t2.length >= 3)) {
          expandedPhrases.push(`${t1} ${t2}`);
        }
      });
    });

    const candidates: { pos: number; score: number }[] = [];

    // Search phrases
    expandedPhrases.forEach(phrase => {
      if (!phrase || phrase.length < 3) return;
      let pos = lowerContent.indexOf(phrase);
      while (pos !== -1) {
        let score = 150;
        const before = lowerContent.slice(Math.max(0, pos - 20), pos);
        if (before.includes("**") || before.includes("##")) {
          score += 250; // High bonus for section headings
        }

        const nearby = lowerContent.slice(Math.max(0, pos - 250), Math.min(lowerContent.length, pos + 600));
        expandedTokens.forEach(t => {
          if (t && nearby.includes(t)) score += 25;
        });

        candidates.push({ pos, score });
        pos = lowerContent.indexOf(phrase, pos + 50);
      }
    });

    // Search tokens
    expandedTokens.forEach(token => {
      if (!token || token.length < 3) return;
      let pos = lowerContent.indexOf(token);
      while (pos !== -1) {
        let score = 30;
        const before = lowerContent.slice(Math.max(0, pos - 20), pos);
        if (before.includes("**") || before.includes("##")) {
          score += 100;
        }

        const nearby = lowerContent.slice(Math.max(0, pos - 250), Math.min(lowerContent.length, pos + 600));
        expandedTokens.forEach(t => {
          if (t && nearby.includes(t)) score += 15;
        });

        candidates.push({ pos, score });
        pos = lowerContent.indexOf(token, pos + 200);
      }
    });

    if (candidates.length === 0) {
      return content.slice(0, maxLength) + "\n...[ग्रंथीय संदर्भ पुढे सुरू असणे]...";
    }

    candidates.sort((a, b) => b.score - a.score);
    const bestPos = candidates[0].pos;

    let start = Math.max(0, bestPos - 600);
    let end = Math.min(content.length, start + maxLength);

    if (end - start < maxLength && start > 0) {
      start = Math.max(0, end - maxLength);
    }

    let snippet = content.slice(start, end);
    if (start > 0) {
      snippet = "...[मागील ग्रंथीय संदर्भ]...\n" + snippet;
    }
    if (end < content.length) {
      snippet = snippet + "\n...[पुढील ग्रंथीय संदर्भ]...";
    }

    return snippet;
  }

  // Construct Deep Context
  let contextSnippet = "";
  if (matched.length > 0) {
    contextSnippet += matched.map((m, idx) => {
      const text = extractRelevantSnippet(m.chap.content, tokens, phrases, 7500);
      return `[ग्रंथ ${idx + 1}: ${m.book?.title || 'महानुभाव ग्रंथ'} (ID: ${m.chap.bookId}), प्रकरण/अध्याय: ${m.chap.title} (ID: ${m.chap.id})]\nमजकूर:\n${text}\n${m.chap.explanation ? 'निरूपण / अर्थ:\n' + m.chap.explanation : ''}`;
    }).join("\n\n---\n\n");
  }

  if (matchedBhajans.length > 0) {
    contextSnippet += "\n\n" + matchedBhajans.map(b => `[भजन: ${b.bh.title}]\n${b.bh.lyrics.slice(0, 1000)}`).join("\n\n---\n\n");
  }

  // Fallback if client is unavailable
  if (!client) {
    if (matched.length === 0 && matchedBhajans.length === 0) {
      return res.json({
        reply: NOT_FOUND_MSG,
        notFound: true,
        sources: []
      });
    }

    const topMatch = matched[0];
    const replyText = `जय श्री चक्रधर! 🙏\n\n🧠 उत्तर\nआपल्या प्रश्नासंदर्भात **${topMatch.book?.title}** या ग्रंथातील **${topMatch.chap.title}** मध्ये सविस्तर माहिती उपलब्ध आहे.\n\n📖 सविस्तर स्पष्टीकरण\n१. मूळ ग्रंथीय संदर्भानुसार, प्रस्तुत विषयात खोलवर शास्त्रीय निरूपण केलेले आहे.\n\n📚 ग्रंथाधारित संदर्भ\n📖 ${topMatch.book?.title} — ${topMatch.chap.title}\n\n🔹 मूळ ग्रंथातील आधार\n> "${topMatch.chap.content.slice(0, 400)}..."\n\nशास्त्र उमट होण्यासाठी आपल्या श्रीगुरुना विचारा.`;
    return res.json({
      reply: replyText,
      notFound: false,
      sources: sourcesMap.slice(0, 4)
    });
  }

  try {
    const systemPrompt = `
तुम्ही "महानुभाव विश्व" ॲपचे "ज्ञानमार्गदर्शक" (Mahanubhav Knowledge Guide) आहात.

तुमचा एकमेव उद्देश:
खाली दिलेल्या "अ‍ॅपमधील उपलब्ध ग्रंथीय मजकूर" (CONTEXT) च्या आधारे वापरकर्त्याने विचारलेल्या अध्यात्मिक / शास्त्रीय / ऐतिहासिक प्रश्नाचे सविस्तर, क्रमाने मांडलेले, अचूक, सोपे आणि भक्तिमय मराठीत उत्तर देणे.

कडक व अनिवार्य नियम (STRICT RULES):
१. फक्त आणि फक्त खालील CONTEXT मधील माहितीचाच आधार घेऊन सविस्तर उत्तर द्या.
२. बाहेरील इंटरनेट, विकिपीडिया किंवा स्वतःचे बाहेरील सामान्य ज्ञान अजिबात वापरू नका.
३. जर दिलेल्या CONTEXT मध्ये विचारलेल्या प्रश्नाचे उत्तर थेट किंवा स्पष्टपणे उपलब्ध नसेल, तर अजिबात स्वतःच्या मनाने उत्तर बनवू नका. अशा वेळी उत्तर म्हणून फक्त आणि फक्त खालील वाक्य जसेच्या तसे लिहा:
"${NOT_FOUND_MSG}"
४. उत्तर १-२ ओळींचे देऊ नका. जर ग्रंथात माहिती उपलब्ध असेल तर सविस्तर, मुद्देसूद उत्तर द्या (साधारण ३०० ते ८०० शब्दांचे, जटिल प्रश्नांसाठी सर्व उपलब्ध माहिती क्रमाने समजावून सांगा).
५. जर प्रश्न एखाद्या संकल्पनेबद्दल असेल (उदा. अहेतुक भूतभजन, ज्ञानाधिकार, ४ नित्य पदार्थ, इ.):
   - संकल्पनेची व्याख्या
   - तिचे स्वरूप
   - कारण/हेतू
   - प्रकार/गट (उदा. भूतभजनाची पात्रे विचारल्यास: सर्व २३ पात्रे क्रमांकासह दाखवून ती १. जीव, २. देवता, ३. ईश्वरावतार या गटांमध्ये विभागून स्पष्ट करा)
   - कार्य/महत्त्व
   - संबंधित उदाहरण / दृष्टांत
   - ग्रंथातील निष्कर्ष
   यापैकी जे जे उपलब्ध ग्रंथात आहे ते सर्व सविस्तर समजावून सांगा.
६. उत्तराची रचना खालीलप्रमाणे असणे बंधनकारक आहे:

जय श्री चक्रधर! 🙏

🧠 उत्तर

[प्रश्नाचे थेट व सुस्पष्ट उत्तर २ ते ४ परिच्छेदांत सविस्तर द्या.]

📖 सविस्तर स्पष्टीकरण

[विषयातील सर्व मुख्य मुद्दे क्रमाने स्पष्ट करा.]
१. ...
२. ...
३. ...
४. ...

📚 ग्रंथाधारित संदर्भ

[उत्तर ज्या ग्रंथांवर आधारित आहे त्या सर्व ग्रंथांची व प्रकरणांची यादी करा.]
१. 📖 [ग्रंथाचे नाव] — [प्रकरण क्रमांक व नाव]
२. 📖 [ग्रंथाचे नाव] — [प्रकरण क्रमांक व नाव]

🔹 मूळ ग्रंथातील आधार

> "[ग्रंथातील मूळ उताऱ्याचा आवश्यक भाग किंवा सूत्र]"

योग्य उत्तर व शास्त्राचा यथार्थ बोध होण्यासाठी आपल्या श्रीगुरूंचे मार्गदर्शन घ्यावे.

७. ग्रंथातील पारिभाषिक शब्द (उदा. जीव, देवता, प्रपंच, परमेश्वर, अहेतुक, सहेतुक, चर्याजरठ, विकारसृष्टी, कर्मसृष्टी, दैवसृष्टी) जसेच्या तसे ठेवा व त्यांचा अर्थ ग्रंथातील संदर्भातून समजावून सांगा.
८. शेवटी "योग्य उत्तर व शास्त्राचा यथार्थ बोध होण्यासाठी आपल्या श्रीगुरूंचे मार्गदर्शन घ्यावे." हे वाक्य असणे अनिवार्य आहे.

खालील अ‍ॅपमधील उपलब्ध ग्रंथीय मजकूर (CONTEXT):
=== CONTEXT START ===
${contextSnippet}
=== CONTEXT END ===
`;

    const formattedHistory = (chatHistory || []).map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));

    formattedHistory.push({
      role: 'user',
      parts: [{ text: `प्रश्न: ${question}` }]
    });

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedHistory,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
        maxOutputTokens: 2500,
      }
    });

    let replyText = response.text || NOT_FOUND_MSG;
    const isNotFound = replyText.includes("सापडले नाही");

    const MANDATORY_CLOSING = "योग्य उत्तर व शास्त्राचा यथार्थ बोध होण्यासाठी आपल्या श्रीगुरूंचे मार्गदर्शन घ्यावे.";
    if (!replyText.includes(MANDATORY_CLOSING)) {
      replyText = replyText.trim() + "\n\n" + MANDATORY_CLOSING;
    }

    res.json({
      reply: replyText,
      notFound: isNotFound,
      sources: isNotFound ? [] : sourcesMap.slice(0, 5)
    });

  } catch (error: any) {
    console.error("Knowledge Guide Gemini API Error:", error);

    const MANDATORY_CLOSING = "योग्य उत्तर व शास्त्राचा यथार्थ बोध होण्यासाठी आपल्या श्रीगुरूंचे मार्गदर्शन घ्यावे.";

    if (matched.length > 0) {
      const topMatch = matched[0];
      return res.json({
        reply: `जय श्री चक्रधर! 🙏\n\n🧠 उत्तर\nआपल्या प्रश्नासंदर्भात **${topMatch.book?.title}** या ग्रंथातील **${topMatch.chap.title}** मध्ये खालील सविस्तर संदर्भ उपलब्ध आहे.\n\n📖 सविस्तर स्पष्टीकरण\n१. मूळ ग्रंथातील संदर्भानुसार विषदावरण केलेले आहे.\n\n📚 ग्रंथाधारित संदर्भ\n📖 ${topMatch.book?.title} — ${topMatch.chap.title}\n\n🔹 मूळ ग्रंथातील आधार\n> "${topMatch.chap.content.slice(0, 450)}..."\n\n${MANDATORY_CLOSING}`,
        notFound: false,
        sources: sourcesMap.slice(0, 4)
      });
    }

    res.json({
      reply: NOT_FOUND_MSG + "\n\n" + MANDATORY_CLOSING,
      notFound: true,
      sources: []
    });
  }
});

// -------------------------------------------------------------
// Serve static frontend files
// -------------------------------------------------------------
// -------------------------------------------------------------
// Serve static frontend files and listen
// -------------------------------------------------------------
(async () => {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer
        }
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
