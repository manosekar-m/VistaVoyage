/**
 * AI Travel Assistant Controller
 * Uses Google Gemini with package data as context
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Package = require('../models/Package');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// POST /api/ai/chat
exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message required' });

    // Try multiple model names for better compatibility
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    // Fetch active packages from DB for context
    const packages = await Package.find({ status: 'Active' })
      .select('title location price duration description highlights')
      .lean();

    // Format package data for context
    const packageContext = packages.map(p =>
      `• ${p.title} | Location: ${p.location} | Price: ₹${p.price} | Duration: ${p.duration} days | Highlights: ${(p.highlights||[]).join(', ')}`
    ).join('\n');

    const systemPrompt = `You are VistaVoyage, a friendly and knowledgeable travel assistant for VistaVoyage Travel Agency.
You ONLY suggest and discuss packages available in our catalog below. Do not mention or recommend external services.
Be enthusiastic, helpful, and concise. Use rupee symbol ₹ for prices. Keep responses under 150 words.

Available Packages:
${packageContext}

If the user asks about something not in our packages, politely say we don't have that currently and suggest the closest match.`;

    // Check if Gemini key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.log('⚠️ Gemini API key not configured, using fallback.');
      return res.json({ success: true, reply: generateFallbackReply(message, packages) });
    }

    // Prepare and clean history for Gemini (must start with 'user' and alternate)
    // We skip the initial assistant intro if present to maintain the pattern
    const cleanHistory = history.filter((msg, idx) => {
      if (idx === 0 && msg.role !== 'user') return false;
      return true;
    });

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt + "\n\nUnderstood. Please greet the user." }] },
        { role: 'model', parts: [{ text: "Hello! I am your VistaVoyage travel assistant. How can I help you plan your next journey today?" }] },
        ...cleanHistory.slice(-6).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))
      ]
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    res.json({ success: true, reply });
  } catch (err) {
    console.error('❌ Gemini Error:', err);
    // Graceful fallback on API error
    const packages = await Package.find({ status: 'Active' }).lean();
    res.json({ success: true, reply: generateFallbackReply(req.body.message, packages || []) });
  }
};

// Simple fallback when API key not configured or error occurs
function generateFallbackReply(message, packages) {
  const msg = message.toLowerCase();

  if (msg.includes('budget') || msg.includes('cheap') || msg.includes('under')) {
    const match = msg.match(/\d+/);
    const budget = match ? Number(match[0]) : 5000;
    const affordable = packages.filter(p => p.price <= budget);
    if (affordable.length) {
      return `Here are packages under ₹${budget}: ${affordable.map(p => `${p.title} (₹${p.price})`).join(', ')}. Which one interests you?`;
    }
    return `Our packages start from ₹${Math.min(...packages.map(p => p.price))}. Would you like to explore those?`;
  }

  if (msg.includes('day') || msg.includes('duration')) {
    const match = msg.match(/\d+/);
    const days = match ? Number(match[0]) : 3;
    const filtered = packages.filter(p => p.duration === days);
    if (filtered.length) return `For ${days}-day trips: ${filtered.map(p => `${p.title} in ${p.location}`).join(', ')}!`;
  }

  // Location-based search
  for (const pkg of packages) {
    if (pkg.location && msg.includes(pkg.location.toLowerCase().split(',')[0].toLowerCase())) {
      return `We have ${pkg.title} in ${pkg.location} for ₹${pkg.price} (${pkg.duration} days). ${pkg.description ? pkg.description.substring(0, 80) : ''}...`;
    }
  }

  return `Welcome to VistaVoyage! 🌍 We have ${packages.length} amazing packages across India. You can ask me about packages by location (like "Goa", "Kerala"), price (like "under ₹5000"), or duration (like "3 day trips"). What are you interested in?`;
}
