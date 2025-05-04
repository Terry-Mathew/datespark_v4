/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Import necessary modules
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import OpenAI from "openai";
import Razorpay from "razorpay";
import * as crypto from "crypto"; // For webhook verification

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore(); // Firestore instance

// --- IMPORTANT: API Key Configuration ---
// You MUST configure your API keys securely in your Firebase Functions environment.
// DO NOT hardcode your keys here.
// Use the Firebase CLI on your local machine:
// firebase functions:config:set openai.key="YOUR_OPENAI_API_KEY"
// firebase functions:config:set razorpay.key_id="YOUR_RAZORPAY_KEY_ID"
// firebase functions:config:set razorpay.key_secret="YOUR_RAZORPAY_KEY_SECRET"
// firebase functions:config:set razorpay.webhook_secret="YOUR_RAZORPAY_WEBHOOK_SECRET"
// Then deploy your functions: firebase deploy --only functions

// --- OpenAI Setup ---
let openai: OpenAI;
try {
  const openaiApiKey = functions.config().openai?.key;
  if (!openaiApiKey) {
    console.error("OpenAI API key not configured.");
  } else {
    openai = new OpenAI({ apiKey: openaiApiKey });
  }
} catch (error) {
  console.error("Error accessing Firebase functions config for OpenAI:", error);
}

// --- Razorpay Setup ---
let razorpay: Razorpay;
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
const ensureOpenAI = () => {
  if (!openai) {
    console.error("OpenAI client not initialized. Check API key configuration.");
    throw new functions.https.HttpsError("internal", "AI service is not configured.");
  }
};

const ensureRazorpay = () => {
  if (!razorpay) {
    console.error("Razorpay client not initialized. Check API key configuration.");
    throw new functions.https.HttpsError("internal", "Payment service is not configured.");
  }
};

const ensureAuthenticated = (context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
  }
  return context.auth.uid;
};

// --- OpenAI Callable Functions (generateBio, generatePrompts, analyzeProfile, generateConversationStarters) ---
// ... (Existing OpenAI functions remain here, unchanged) ...

// --- HTTPS Callable Function: generateBio ---
export const generateBio = functions.https.onCall(async (data, context) => {
  ensureOpenAI();
  ensureAuthenticated(context);
  const userInput = data.userInput;
  if (typeof userInput !== "string" || userInput.trim().length === 0 || userInput.length > 500) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid userInput provided (string, non-empty, max 500 chars).");
  }

  const systemPrompt = "You are DateSpark, an AI assistant helping users write unique and engaging dating profile bios. Avoid clichés. Be witty, concise, and highlight the user's personality based on their input. Generate one bio option.";
  const userPrompt = `Generate a dating profile bio based on these user details: "${userInput}"`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });
    const generatedBio = completion.choices[0]?.message?.content?.trim();
    if (!generatedBio) {
      throw new functions.https.HttpsError("internal", "AI failed to generate a bio.");
    }
    return { bio: generatedBio };
  } catch (error: any) {
    console.error("Error calling OpenAI API for generateBio:", error);
    throw new functions.https.HttpsError("internal", "Failed to generate bio.", error.message);
  }
});

// --- HTTPS Callable Function: generatePrompts ---
export const generatePrompts = functions.https.onCall(async (data, context) => {
  ensureOpenAI();
  ensureAuthenticated(context);

  const userPromptText = data.prompt;
  const tone = data.tone || "witty";
  const culturalContext = data.culturalContext || "general";

  if (typeof userPromptText !== "string" || userPromptText.trim().length === 0 || userPromptText.length > 200) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid prompt provided (string, non-empty, max 200 chars).");
  }

  const systemPrompt = `You are DateSpark, an AI assistant helping users write responses for dating app prompts. Generate 3 distinct response options based on the user's prompt, desired tone, and cultural context. Keep responses concise and engaging. Tone: ${tone}. Cultural Context: ${culturalContext}. Number each response clearly starting from 1.`;
  const userMessage = `Generate 3 response options for the dating app prompt: "${userPromptText}"`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 250,
      temperature: 0.8,
      n: 1,
    });

    const rawResponse = completion.choices[0]?.message?.content?.trim();
    if (!rawResponse) {
      throw new functions.https.HttpsError("internal", "AI failed to generate responses.");
    }

    const responses = rawResponse.split(/\n?\d+\.\s/).map(r => r.trim()).filter(r => r.length > 0);
    const finalResponses = responses.length > 0 ? responses : [rawResponse];

    return { responses: finalResponses };

  } catch (error: any) {
    console.error("Error calling OpenAI API for generatePrompts:", error);
    throw new functions.https.HttpsError("internal", "Failed to generate prompt responses.", error.message);
  }
});

// --- HTTPS Callable Function: analyzeProfile (Vision) ---
export const analyzeProfile = functions.https.onCall(async (data, context) => {
  ensureOpenAI();
  ensureAuthenticated(context);

  const imageBase64 = data.imageBase64;
  if (typeof imageBase64 !== "string" || !imageBase64.startsWith("data:image/")) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid imageBase64 provided.");
  }
  if (imageBase64.length > 10 * 1024 * 1024) {
     throw new functions.https.HttpsError("invalid-argument", "Image size is too large.");
  }

  const systemPrompt = "You are DateSpark, an AI assistant reviewing a user's dating profile screenshot. Analyze the photo(s), bio, and prompts visible. Provide constructive feedback focusing on authenticity, clarity, photo quality (lighting, composition, background), and overall appeal. Give a numeric score out of 10 for overall profile effectiveness. Structure the feedback clearly with sections for Photos, Bio/Prompts, and Overall Score/Summary. Be encouraging but honest.";
  const userMessage = "Analyze the attached dating profile screenshot and provide feedback as described.";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: userMessage },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const analysisResult = completion.choices[0]?.message?.content?.trim();
    if (!analysisResult) {
      throw new functions.https.HttpsError("internal", "AI failed to analyze the profile.");
    }
    return { analysis: analysisResult };

  } catch (error: any) {
    console.error("Error calling OpenAI Vision API for analyzeProfile:", error);
    throw new functions.https.HttpsError("internal", "Failed to analyze profile.", error.message);
  }
});

// --- HTTPS Callable Function: generateConversationStarters (Vision) ---
export const generateConversationStarters = functions.https.onCall(async (data, context) => {
  ensureOpenAI();
  ensureAuthenticated(context);

  const imageBase64 = data.imageBase64;
  if (typeof imageBase64 !== "string" || !imageBase64.startsWith("data:image/")) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid imageBase64 provided.");
  }
  if (imageBase64.length > 10 * 1024 * 1024) {
     throw new functions.https.HttpsError("invalid-argument", "Image size is too large.");
  }

  const systemPrompt = "You are DateSpark, an AI assistant helping users craft conversation starters based on someone else's dating profile screenshot. Analyze the visible photos, bio, and prompts. Generate 3 distinct conversation starters that are specific, engaging, and reference details from the profile. Offer a mix of playful, sincere, and specific options. Number each starter clearly starting from 1.";
  const userMessage = "Analyze the attached dating profile screenshot and generate 3 conversation starters based on it.";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: userMessage },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    const rawResponse = completion.choices[0]?.message?.content?.trim();
    if (!rawResponse) {
      throw new functions.https.HttpsError("internal", "AI failed to generate conversation starters.");
    }

    const starters = rawResponse.split(/\n?\d+\.\s/).map(r => r.trim()).filter(r => r.length > 0);
    const finalStarters = starters.length > 0 ? starters : [rawResponse];

    return { starters: finalStarters };

  } catch (error: any) {
    console.error("Error calling OpenAI Vision API for generateConversationStarters:", error);
    throw new functions.https.HttpsError("internal", "Failed to generate conversation starters.", error.message);
  }
});

// --- Razorpay Payment Functions ---

// --- HTTPS Callable Function: createRazorpayOrder ---
export const createRazorpayOrder = functions.https.onCall(async (data, context) => {
  ensureRazorpay();
  const uid = ensureAuthenticated(context);
  const amount = data.amount; // Amount in smallest currency unit (e.g., paise for INR)
  const currency = data.currency || "INR"; // Default to INR

  if (typeof amount !== "number" || amount <= 0) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid amount provided.");
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
    const order = await razorpay.orders.create(options);
    if (!order) {
      throw new Error("Failed to create Razorpay order.");
    }
    console.log("Razorpay Order Created:", order);
    return { orderId: order.id }; // Return only the order ID to the client
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    throw new functions.https.HttpsError("internal", "Could not create payment order.", error.message);
  }
});

// --- HTTPS Function: verifyRazorpayPayment (Webhook) ---
export const verifyRazorpayPayment = functions.https.onRequest(async (req, res) => {
  ensureRazorpay(); // Ensure Razorpay client is initialized
  const webhookSecret = functions.config().razorpay?.webhook_secret;

  if (!webhookSecret) {
    console.error("Razorpay webhook secret is not configured.");
    res.status(500).send("Webhook secret not configured.");
    return;
  }

  const receivedSignature = req.headers["x-razorpay-signature"];
  const requestBody = JSON.stringify(req.body);

  // 1. Verify Webhook Signature
  try {
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(requestBody)
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
      // Respond early but log the issue - don't block Razorpay
      res.status(200).send("Webhook received, but user ID missing in notes.");
      return;
    }

    try {
      // 3. Update Firestore
      const userRef = db.collection("users").doc(userId);
      const transactionRef = db.collection("transactions").doc(paymentId); // Use paymentId as doc ID

      await db.runTransaction(async (transaction) => {
        // Check if transaction already processed
        const existingTransaction = await transaction.get(transactionRef);
        if (existingTransaction.exists) {
          console.log(`Transaction ${paymentId} already processed.`);
          return; // Avoid double processing
        }

        // Update user's premium status (example: set isPremium to true)
        // You might want to add an expiry date based on the plan purchased
        transaction.update(userRef, {
          isPremium: true,
          // premiumExpiry: admin.firestore.Timestamp.fromDate(calculateExpiryDate()),
          lastPaymentId: paymentId,
        });

        // Save transaction details
        transaction.set(transactionRef, {
          userId: userId,
          orderId: orderId,
          paymentId: paymentId,
          amount: amount,
          currency: currency,
          status: status,
          createdAt: admin.firestore.FieldValue.serverTimestamp(), // Use server timestamp
          razorpayEvent: event, // Store the full event for auditing if needed
        });
      });

      console.log(`Successfully processed payment ${paymentId} for user ${userId}.`);
      res.status(200).send("Webhook processed successfully.");

    } catch (error) {
      console.error(`Error updating Firestore for payment ${paymentId}:`, error);
      // Respond with 500 to signal Razorpay to retry if appropriate
      res.status(500).send("Error processing payment update.");
    }
  } else {
    // Handle other events if needed, or ignore them
    console.log("Ignoring Razorpay event:", event.event);
    res.status(200).send("Webhook received, event ignored.");
  }
});

