/**
 * Firebase Cloud Functions for DateSpark
 */

// Import necessary modules
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// Removed unused HarmCategory, HarmBlockThreshold
import { GoogleGenerativeAI } from "@google/generative-ai";
import Razorpay from "razorpay";
import * as crypto from "crypto"; // For webhook verification

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore(); // Firestore instance

// --- IMPORTANT: API Key Configuration ---
// Keys MUST be configured securely in your Firebase Functions environment.
// DO NOT hardcode keys here.
// Use the Firebase CLI:
// firebase functions:config:set gemini.key="YOUR_GEMINI_API_KEY"
// firebase functions:config:set razorpay.key_id="YOUR_RAZORPAY_KEY_ID"
// firebase functions:config:set razorpay.key_secret="YOUR_RAZORPAY_KEY_SECRET"
// firebase functions:config:set razorpay.webhook_secret="YOUR_RAZORPAY_WEBHOOK_SECRET"

// --- Gemini Setup ---
let genAI: GoogleGenerativeAI | null = null;
let geminiApiKey: string | null = null;
try {
  geminiApiKey = functions.config().gemini?.key;
  if (!geminiApiKey) {
    console.error("Gemini API key not configured.");
  } else {
    genAI = new GoogleGenerativeAI(geminiApiKey);
  }
} catch (error) {
  console.error("Error accessing Firebase functions config for Gemini:", error);
}

// --- Razorpay Setup ---
let razorpay: Razorpay | null = null;
try {
  const razorpayKeyId = functions.config().razorpay?.key_id;
  const razorpayKeySecret = functions.config().razorpay?.key_secret;
  if (!razorpayKeyId || !razorpayKeySecret) {
    console.error("Razorpay Key ID or Key Secret not configured.");
  } else {
    razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });
  }
} catch (error) {
  console.error("Error accessing Firebase functions config for Razorpay:", error);
}

// --- Helper Functions ---
const ensureGemini = () => {
  if (!genAI) {
    console.error("Gemini client not initialized. Check API key configuration.");
    throw new functions.https.HttpsError("internal", "AI service is not configured.") ;
  }
  return genAI;
};

const ensureRazorpay = () => {
  if (!razorpay) {
    console.error("Razorpay client not initialized. Check API key configuration.");
    throw new functions.https.HttpsError("internal", "Payment service is not configured.") ;
  }
  return razorpay;
};

// Use 'any' for context to avoid import issues with CallableContext
const ensureAuthenticated = (context: any) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required.") ;
  }
  return context.auth.uid;
};

// Helper to convert base64 image to Gemini Part
function fileToGenerativePart(base64Data: string): { inlineData: { data: string; mimeType: string } } {
  const match = base64Data.match(/^data:(image\/\w+);base64,(.*)$/);
  if (!match || match.length < 3) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid base64 image format.") ;
  }
  return {
    inlineData: {
      data: match[2],
      mimeType: match[1],
    },
  };
}

// --- Gemini Callable Functions ---

// --- HTTPS Callable Function: generateBio ---
export const generateBio = functions.https.onCall(async (data: any, context: any)  => {
  const genAIClient = ensureGemini();
  ensureAuthenticated(context);
  const userInput = data.userInput;
  if (typeof userInput !== "string" || userInput.trim().length === 0 || userInput.length > 500) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid userInput provided (string, non-empty, max 500 chars) .");
  }

  const model = genAIClient.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `You are DateSpark, an AI assistant helping users write unique and engaging dating profile bios. Avoid clichés. Be witty, concise, and highlight the user's personality based on their input. Generate one bio option based on these user details: "${userInput}"`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const generatedBio = response.text().trim();

    if (!generatedBio) {
      throw new functions.https.HttpsError("internal", "AI failed to generate a bio.") ;
    }
    return { bio: generatedBio };
  } catch (error: any) {
    console.error("Error calling Gemini API for generateBio:", error);
    throw new functions.https.HttpsError("internal", "Failed to generate bio.", error.message) ;
  }
});

// --- HTTPS Callable Function: punchupPrompt (replaces generatePrompts) ---
export const punchupPrompt = functions.https.onCall(async (data: any, context: any)  => {
  const genAIClient = ensureGemini();
  ensureAuthenticated(context);

  const userPromptText = data.prompt;
  const tone = data.tone || "witty";
  const culturalContext = data.culturalContext || "general";

  if (typeof userPromptText !== "string" || userPromptText.trim().length === 0 || userPromptText.length > 200) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid prompt provided (string, non-empty, max 200 chars) .");
  }

  const model = genAIClient.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `You are DateSpark, an AI assistant helping users write responses for dating app prompts. Generate 3 distinct response options based on the user's prompt: "${userPromptText}". Desired tone: ${tone}. Cultural Context: ${culturalContext}. Keep responses concise and engaging. Number each response clearly starting from 1.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawResponse = response.text().trim();

    if (!rawResponse) {
      throw new functions.https.HttpsError("internal", "AI failed to generate responses.") ;
    }

    // Attempt to split numbered responses
    const responses = rawResponse.split(/\n?\d+\.\s/).map(r => r.trim()).filter(r => r.length > 0);
    const finalResponses = responses.length > 0 ? responses : [rawResponse]; // Fallback if splitting fails

    return { responses: finalResponses };

  } catch (error: any) {
    console.error("Error calling Gemini API for punchupPrompt:", error);
    throw new functions.https.HttpsError("internal", "Failed to generate prompt responses.", error.message) ;
  }
});

// --- HTTPS Callable Function: analyzeProfilePhotos (replaces analyzeProfile) ---
export const analyzeProfilePhotos = functions.https.onCall(async (data: any, context: any)  => {
  const genAIClient = ensureGemini();
  ensureAuthenticated(context);

  const imageBase64 = data.imageBase64;
  if (typeof imageBase64 !== "string" || !imageBase64.startsWith("data:image/")) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid imageBase64 provided.") ;
  }
  // Basic size check (adjust limit as needed, ~10MB)
  if (imageBase64.length > 10 * 1024 * 1024 * 1.4) { // Base64 is larger than raw bytes
     throw new functions.https.HttpsError("invalid-argument", "Image size might be too large.") ;
  }

  const model = genAIClient.getGenerativeModel({ model: "gemini-pro-vision" });
  const prompt = "You are DateSpark, an AI assistant reviewing a user's dating profile screenshot (photos, bio, prompts). Provide constructive feedback focusing on authenticity, clarity, photo quality (lighting, composition, background), and overall appeal. Give a numeric score out of 10 for overall profile effectiveness. Structure the feedback clearly with sections for Photos, Bio/Prompts, and Overall Score/Summary. Be encouraging but honest.";

  try {
    const imagePart = fileToGenerativePart(imageBase64);
    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    const analysisResult = response.text().trim();

    if (!analysisResult) {
      throw new functions.https.HttpsError("internal", "AI failed to analyze the profile.") ;
    }
    return { analysis: analysisResult };

  } catch (error: any) {
    console.error("Error calling Gemini Vision API for analyzeProfilePhotos:", error);
    // Check for specific safety errors
    if (error.message?.includes("SAFETY")) {
        throw new functions.https.HttpsError("permission-denied", "Image analysis blocked due to safety settings.", error.message) ;
    }
    throw new functions.https.HttpsError("internal", "Failed to analyze profile.", error.message) ;
  }
});

// --- HTTPS Callable Function: generateConversationStarters ---
export const generateConversationStarters = functions.https.onCall(async (data: any, context: any)  => {
  const genAIClient = ensureGemini();
  ensureAuthenticated(context);

  const imageBase64 = data.imageBase64;
  if (typeof imageBase64 !== "string" || !imageBase64.startsWith("data:image/")) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid imageBase64 provided.") ;
  }
  if (imageBase64.length > 10 * 1024 * 1024 * 1.4) {
     throw new functions.https.HttpsError("invalid-argument", "Image size might be too large.") ;
  }

  const model = genAIClient.getGenerativeModel({ model: "gemini-pro-vision" });
  const prompt = "You are DateSpark, an AI assistant helping users craft conversation starters based on someone else's dating profile screenshot. Analyze the visible photos, bio, and prompts. Generate 3 distinct conversation starters that are specific, engaging, and reference details from the profile. Offer a mix of playful, sincere, and specific options. Number each starter clearly starting from 1.";

  try {
    const imagePart = fileToGenerativePart(imageBase64);
    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    const rawResponse = response.text().trim();

    if (!rawResponse) {
      throw new functions.https.HttpsError("internal", "AI failed to generate conversation starters.") ;
    }

    const starters = rawResponse.split(/\n?\d+\.\s/).map(r => r.trim()).filter(r => r.length > 0);
    const finalStarters = starters.length > 0 ? starters : [rawResponse];

    return { starters: finalStarters };

  } catch (error: any) {
    console.error("Error calling Gemini Vision API for generateConversationStarters:", error);
    if (error.message?.includes("SAFETY")) {
        throw new functions.https.HttpsError("permission-denied", "Image analysis blocked due to safety settings.", error.message) ;
    }
    throw new functions.https.HttpsError("internal", "Failed to generate conversation starters.", error.message) ;
  }
});

// --- Razorpay Payment Functions ---

// --- HTTPS Callable Function: createRazorpayOrder ---
export const createRazorpayOrder = functions.https.onCall(async (data: any, context: any)  => {
  const razorpayClient = ensureRazorpay();
  const uid = ensureAuthenticated(context);
  const amount = data.amount; // Amount in smallest currency unit (e.g., paise for INR)
  const currency = data.currency || "INR"; // Default to INR

  if (typeof amount !== "number" || amount <= 0) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid amount provided.") ;
  }

  const options = {
    amount: amount,
    currency: currency,
    receipt: `receipt_user_${uid}_${Date.now()}`, // Unique receipt ID
    notes: {
      userId: uid,
      // Add any other relevant notes, e.g., planId
    },
  };

  try {
    const order = await razorpayClient.orders.create(options);
    if (!order) {
      throw new Error("Failed to create Razorpay order.");
    }
    console.log("Razorpay Order Created:", order);
    return { orderId: order.id }; // Return only the order ID to the client
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    throw new functions.https.HttpsError("internal", "Could not create payment order.", error.message) ;
  }
});

// --- HTTPS Function: verifyRazorpayPayment (Webhook) ---
export const verifyRazorpayPayment = functions.https.onRequest(async (req, res)  => {
  // Removed unused razorpayClient variable declaration
  ensureRazorpay(); // Ensure Razorpay client is initialized via the global variable
  const webhookSecret = functions.config().razorpay?.webhook_secret;

  if (!webhookSecret) {
    console.error("Razorpay webhook secret is not configured.");
    res.status(500).send("Webhook secret not configured.");
    return;
  }

  const receivedSignature = req.headers["x-razorpay-signature"];
  let requestBodyString: string;
  try {
      requestBodyString = JSON.stringify(req.body);
  } catch (e) {
      console.error("Failed to stringify request body for webhook verification:", e);
      res.status(400).send("Invalid request body.");
      return;
  }

  // 1. Verify Webhook Signature
  try {
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(requestBodyString)
      .digest("hex");

    if (expectedSignature !== receivedSignature) {
      console.warn("Invalid Razorpay webhook signature received.");
      res.status(400).send("Invalid signature.");
      return;
    }
  } catch (error) {
    console.error("Error verifying Razorpay webhook signature:", error);
    res.status(500).send("Signature verification failed.");
    return;
  }

  // 2. Process the Event (Signature is valid)
  const event = req.body;
  console.log("Received valid Razorpay webhook event:", event.event, event.payload?.payment?.entity?.id);

  // Handle the 'payment.captured' event
  if (event.event === "payment.captured") {
    const paymentEntity = event.payload.payment.entity;
    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;
    const amount = paymentEntity.amount;
    const currency = paymentEntity.currency;
    const status = paymentEntity.status;
    const userId = paymentEntity.notes?.userId; // Retrieve userId from notes

    if (!userId) {
      console.error("User ID not found in payment notes for order:", orderId);
      res.status(200).send("Webhook received, but user ID missing in notes.");
      return;
    }

    try {
      // 3. Update Firestore
      const userRef = db.collection("users").doc(userId);
      const transactionRef = db.collection("transactions").doc(paymentId);

      await db.runTransaction(async (transaction) => {
        const existingTransaction = await transaction.get(transactionRef);
        if (existingTransaction.exists) {
          console.log(`Transaction ${paymentId} already processed.`);
          return;
        }

        // Update user's premium status
        transaction.update(userRef, {
          isPremium: true,
          lastPaymentId: paymentId,
          // Consider adding premiumExpiry based on plan
        });

        // Save transaction details
        transaction.set(transactionRef, {
          userId: userId,
          orderId: orderId,
          paymentId: paymentId,
          amount: amount,
          currency: currency,
          status: status,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          razorpayEvent: event, // Store event for auditing
        });
      });

      console.log(`Successfully processed payment ${paymentId} for user ${userId}.`);
      res.status(200).send("Webhook processed successfully.");

    } catch (error) {
      console.error(`Error updating Firestore for payment ${paymentId}:`, error);
      res.status(500).send("Error processing payment update.");
    }
  } else {
    console.log("Ignoring Razorpay event:", event.event);
    res.status(200).send("Webhook received, event ignored.");
  }
});
