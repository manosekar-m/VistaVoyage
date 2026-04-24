/**
 * AI Travel Assistant Controller
 * Uses Google Gemini with package data as context
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Package = require('../models/Package');
const AIPlan = require('../models/AIPlan');
const User = require('../models/User');
const { sendAIPlanEmail: sendEmailService } = require('../services/emailService');

// POST /api/ai/chat
exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message required' });

    // Fetch active packages from DB
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

    if (!process.env.GEMINI_API_KEY) {
      // Fallback: simple rule-based responses
      return res.json({ success: true, reply: generateFallbackReply(message, packages) });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash", 
      systemInstruction: systemPrompt 
    });

    const chat = model.startChat({
      history: history.slice(-6).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      }
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();
    res.json({ success: true, reply });
  } catch (err) {
    console.error('AI Chat Error:', err);
    // Graceful fallback on API error
    const packages = await Package.find({ status: 'Active' }).lean();
    res.json({ success: true, reply: generateFallbackReply(req.body.message || '', packages) });
  }
};

// POST /api/ai/generate-itinerary
exports.generateItinerary = async (req, res) => {
  try {
    const { destination, days, travelers, preferences } = req.body;
    if (!destination || !days) return res.status(400).json({ success: false, message: 'Destination and duration required' });

    const systemPrompt = `You are an expert travel architect at VistaVoyage. 
    Create a highly detailed, luxurious, and realistic ${days}-day itinerary for ${destination} for ${travelers}.
    Preferences: ${preferences || 'Standard'}.
    
    Format the response strictly as a JSON object with this structure:
    {
      "title": "A catchy title for the trip",
      "summary": "Short 2-3 sentence overview",
      "itinerary": [
        { "day": 1, "title": "Morning/Evening highlights", "activities": ["Activity 1", "Activity 2"] }
      ],
      "travelTips": "Top 3 tips for this trip"
    }
    Include local culture and hidden gems.`;

    if (!process.env.GEMINI_API_KEY) {
       return res.status(500).json({ success: false, message: 'AI service not configured' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();
    
    // Parse JSON safely (Gemini sometimes adds markdown blocks or extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI returned invalid itinerary format');
    const itinerary = JSON.parse(jsonMatch[0]);

    // Save to DB
    const newPlan = await AIPlan.create({
      user: req.user._id,
      destination,
      days,
      travelers,
      preferences,
      result: itinerary
    });

    res.json({ success: true, itinerary, planId: newPlan._id });
  } catch (err) {
    console.error('AI Generator Error:', err);
    // Use fallback if AI fails or quota reached
    const fallback = generateFallbackItinerary(req.body);
    
    // Save fallback to DB if user is logged in
    if (req.user) {
      await AIPlan.create({
        user: req.user._id,
        destination: req.body.destination,
        days: req.body.days,
        travelers: req.body.travelers,
        preferences: req.body.preferences,
        result: fallback
      });
    }

    res.json({ success: true, itinerary: fallback });
  }
};

// Admin Functions
exports.getAIPlans = async (req, res) => {
  console.log('GET /api/ai reached - Fetching AI plans...');
  try {
    const plans = await AIPlan.find().populate('user', 'name email').sort({ createdAt: -1 });
    console.log(`Found ${plans.length} plans`);
    res.json({ success: true, plans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePlanStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const plan = await AIPlan.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const plan = await AIPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.json({ success: true, message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.sendPlanEmail = async (req, res) => {
  try {
    const { message } = req.body;
    const plan = await AIPlan.findById(req.params.id).populate('user', 'name email');
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    await sendEmailService(plan.user.email, plan.user.name, plan.result.title, message);
    
    plan.emailsSent += 1;
    await plan.save();

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── FALLBACK HELPERS ──────────────────────────────────────────

function generateFallbackReply(msg, packages) {
  const m = msg.toLowerCase();
  const found = packages.filter(p => m.includes(p.location.toLowerCase()) || m.includes(p.title.toLowerCase()));
  if (found.length > 0) {
    return `I found some great options for you: ${found.map(p => p.title).join(', ')}. Which one would you like to know more about?`;
  }
  return "I'm currently experiencing high demand. While I can't chat right now, feel free to explore our featured packages on the home page!";
}

function generateFallbackItinerary({ destination, days, travelers, preferences }) {
  const numDays = Number(days) || 3;
  const activities = [
    "Morning exploration of local landmarks and heritage sites",
    "Traditional lunch at a highly-rated local eatery",
    "Afternoon leisure walk through scenic parks or markets",
    "Evening cultural performance or sunset view",
    "Dinner featuring authentic regional cuisine"
  ];

  const itinerary = [];
  for (let i = 1; i <= numDays; i++) {
    itinerary.push({
      day: i,
      title: `${destination} Discovery - Day ${i}`,
      activities: [
        activities[i % activities.length],
        `Special ${preferences || 'leisure'} activity tailored for ${travelers}`,
        "Relaxation at your premium accommodation"
      ]
    });
  }

  return {
    title: `Bespoke ${destination} Escape`,
    summary: `A carefully curated ${numDays}-day journey through the heart of ${destination}, designed specifically for ${travelers}.`,
    itinerary,
    travelTips: "1. Respect local customs. 2. Keep hydrated. 3. Carry a local map or offline GPS."
  };
}

