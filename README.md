# DateSpark v3 - Setup and Deployment Guide (Beginner-Friendly)

Welcome to DateSpark v3! This guide will walk you through setting up, configuring, running, and deploying the application. It assumes you have basic familiarity with using a terminal or command prompt.

**Table of Contents:**

1.  [Project Overview](#project-overview)
2.  [Getting Started (Prerequisites & Installation)](#getting-started)
3.  [Configuration (Firebase & OpenAI)](#configuration)
4.  [Running the App Locally](#running-the-app-locally)
5.  [Deploying Backend (Firebase Functions)](#deploying-backend-firebase-functions)
6.  [Deploying Frontend (Hosting)](#deploying-frontend-hosting)
7.  [Privacy & Security](#privacy--security)
8.  [Code Structure Overview](#code-structure-overview)
9.  [Setting Up Your New GitHub Repository](#setting-up-your-new-github-repository)

---

## Project Overview

DateSpark is a web application designed to help users improve their dating profiles and interactions using AI. It features:

*   **Profile Optimizer:** Analyzes screenshots of your dating profile for feedback.
*   **Dating App Prompts:** Generates creative answers for dating app prompts.
*   **Bio Generator:** Creates unique dating profile bios based on your input.
*   **Conversation Starter:** Suggests opening messages based on a screenshot of someone else's profile.

The application uses React, Vite, TypeScript, and TailwindCSS for the frontend, and Firebase (Authentication, Firestore, Functions) and OpenAI (GPT-4o for text and vision) for the backend and AI capabilities.

---

## Getting Started

**Prerequisites:**

*   **Node.js and npm/pnpm:** You need Node.js installed, which includes npm (Node Package Manager). We recommend using `pnpm` for faster dependency management. Download Node.js from [https://nodejs.org/](https://nodejs.org/). Install `pnpm` globally by running `npm install -g pnpm` in your terminal.
*   **Git:** You need Git installed to manage the code. Download it from [https://git-scm.com/](https://git-scm.com/).
*   **Firebase Account:** A Google account to use Firebase services.
*   **OpenAI Account:** An account with OpenAI to get an API key.

**Installation:**

1.  **Clone the Repository:** You will create a new, private GitHub repository for this code later. For now, download the code ZIP file I provide and extract it to a folder on your computer.
2.  **Open Terminal:** Navigate to the project folder (e.g., `DateSpark_v3`) in your terminal or command prompt.
    ```bash
    cd path/to/your/DateSpark_v3
    ```
3.  **Install Dependencies:** Run the following command to install all the necessary libraries for both the frontend and the backend functions:
    ```bash
    # For the frontend (in the main DateSpark_v3 folder)
    pnpm install 
    
    # For the backend functions (navigate into the functions folder)
    cd functions
    pnpm install
    cd .. # Go back to the main project folder
    ```
    *(If you prefer npm, use `npm install` instead of `pnpm install`)*

---

## Configuration

This is the most crucial step. You need to connect the app to your Firebase project and provide API keys.

**1. Firebase Setup:**

*   **Create Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project if you haven't already.
*   **Upgrade to Blaze Plan:** Firebase Functions (especially those calling external APIs like OpenAI) require the **Blaze (Pay-as-you-go)** plan. In your Firebase project settings, upgrade your plan. *Set up budget alerts to avoid unexpected costs!*.
*   **Enable Services:**
    *   In the Firebase console, go to 

        *   **Authentication:** Enable the **Email/Password** sign-in method.
        *   **Firestore Database:** Create a Firestore database. Start in **production mode** (which has secure default rules) or test mode if you prefer, but be sure to update security rules before launch.
        *   **Functions:** No specific enablement needed here, but ensure your project is on the Blaze plan.
*   **Get Firebase Config for Web App:**
    *   In your Firebase project settings (click the gear icon), go to the "General" tab.
    *   Scroll down to "Your apps".
    *   Click the **</>** icon (Web) to register a new web app or select your existing one.
    *   Give it a nickname (e.g., "DateSpark Frontend").
    *   **Important:** You do **NOT** need to set up Firebase Hosting through this interface if you plan to host elsewhere (like Vercel/Netlify).
    *   After registering, Firebase will show you a configuration object (`firebaseConfig`). **Copy this entire object.**

**2. Create `.env.local` File (Frontend Configuration):**

*   In the main project folder (`DateSpark_v3`), create a new file named `.env.local` (note the leading dot).
*   Paste the `firebaseConfig` object you copied, but format it like this, adding the `VITE_` prefix to each key (this is required by Vite, the tool used to build the frontend):

    ```dotenv
    # /DateSpark_v3/.env.local
    
    VITE_FIREBASE_API_KEY="YOUR_API_KEY"
    VITE_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    VITE_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
    VITE_FIREBASE_APP_ID="YOUR_APP_ID"
    VITE_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID" # Optional, if present in your config
    ```
*   **Replace** `"YOUR_..."` with the actual values from your `firebaseConfig` object.
*   **Security:** This `.env.local` file is **only** used during local development and is **ignored by Git** (due to `.gitignore`). The build process will embed these values into the frontend code. These keys are generally considered safe to expose in frontend code, as Firebase security rules protect your backend data.

**3. OpenAI API Key:**

*   Go to the [OpenAI API Keys page](https://platform.openai.com/api-keys).
*   Create a new **secret key**. Copy it immediately and store it securely – you won't be able to see it again.
*   **Do NOT put this key in `.env.local` or anywhere in the frontend code.** It will be configured securely in Firebase Functions environment variables (see [Deploying Backend](#deploying-backend-firebase-functions) section).

---

## Running the App Locally

1.  **Start Frontend Development Server:**
    *   In your terminal, make sure you are in the main project directory (`DateSpark_v3`).
    *   Run:
        ```bash
        pnpm run dev
        # or npm run dev
        ```
    *   This will start the frontend application, usually accessible at `http://localhost:5173` (the terminal will show the exact address).
    *   You can now open this address in your browser, sign up, sign in, and use the features. The frontend will connect to your **live** Firebase project using the configuration in `.env.local`.

2.  **(Optional) Running Firebase Functions Locally (Emulation):**
    *   To test backend functions without deploying them, you can use the Firebase Local Emulator Suite.
    *   **First-time setup:** Run `firebase init emulators` in the main project directory. Select Functions, Firestore, and Auth emulators. Configure the default ports (or choose others if needed).
    *   **Start Emulators:** Run `firebase emulators:start` in the main project directory.
    *   **Configure Frontend for Emulators:** The application code in `src/config/firebase.ts` includes logic to automatically connect to the emulators if they are detected running on their default ports *while in development mode* (`pnpm run dev`). You generally don't need extra configuration unless you changed the emulator ports.
    *   **Note:** When using emulators, the functions won't have access to the OpenAI API key configured via `functions:config:set`. You might need to temporarily modify the function code (`functions/src/index.ts`) to read the key from a local environment variable or a temporary file *only during emulation* if you need to test the full OpenAI interaction locally. Remember to remove any hardcoded keys before deploying!

---

## Deploying Backend (Firebase Functions)

These are the backend functions that securely call the OpenAI API.

1.  **Follow the Separate Guide:** Open the `firebase_functions_setup.md` file included in the project. It contains detailed, step-by-step instructions for:
    *   Installing the Firebase CLI.
    *   Logging into Firebase.
    *   Initializing Functions in your local project (linking the code to your Firebase project).
    *   **Securely setting your OpenAI API key** using `firebase functions:config:set openai.key="YOUR_KEY"`.
    *   Deploying the functions using `firebase deploy --only functions`.

2.  **Verification:** After deployment, your frontend application (whether running locally or deployed) will automatically call these live backend functions.

---

## Deploying Frontend (Hosting)

You need to host the built static files of the React application.

1.  **Build the Frontend:**
    *   In your terminal (in the main `DateSpark_v3` directory), run:
        ```bash
        pnpm run build
        # or npm run build
        ```
    *   This command creates an optimized, static version of your frontend application in a `dist` folder.

2.  **Choose a Hosting Provider:** You have several excellent options:
    *   **Vercel:** (Recommended for ease of use)
        *   Sign up at [vercel.com](https://vercel.com/) using your GitHub account.
        *   Create a new project and link it to the **new GitHub repository** you will create for this code.
        *   Configure the build settings:
            *   Framework Preset: `Vite`
            *   Build Command: `pnpm run build` (or `npm run build`)
            *   Output Directory: `dist`
        *   Vercel will automatically build and deploy your site. Add your domain if desired.
    *   **Netlify:**
        *   Similar process to Vercel. Sign up at [netlify.com](https://netlify.com/), link your GitHub repo.
        *   Build Command: `pnpm run build` (or `npm run build`)
        *   Publish directory: `dist`
    *   **Firebase Hosting:**
        *   Run `firebase init hosting` in your main project directory.
        *   Select your Firebase project.
        *   Public directory: `dist`
        *   Configure as a single-page app: `Yes`
        *   Set up automatic builds and deploys with GitHub: `No` (unless you want to configure this)
        *   After building (`pnpm run build`), deploy using `firebase deploy --only hosting`.

---

## Privacy & Security

*   **Firebase Security Rules:** The default Firestore rules might be too open for production. Review and tighten your Firestore security rules in the Firebase console to ensure users can only access their own data.
*   **OpenAI API Key:** Your key is stored securely as a Firebase Function environment variable, **not** in the frontend code.
*   **Image Handling:**
    *   Images uploaded for **Profile Analysis** and **Conversation Starters** are converted to Base64 format in the user's browser.
    *   This Base64 data is sent directly to the secure Firebase Function.
    *   The Firebase Function sends the image data directly to the OpenAI API for processing.
    *   **Crucially, the images themselves are NOT stored in Firebase Storage or any database.** They are processed ephemerally by OpenAI via the backend function.
*   **User Data:** Basic user information (UID, email) is stored in Firebase Authentication. Associated data (like saved preferences, if any were added) would be in Firestore, protected by security rules.
*   **Disclaimer:** The footer includes a disclaimer reminding users that AI suggestions are not guarantees.

---

## Code Structure Overview

```
/DateSpark_v3
├── /dist/             # Build output (created by `pnpm run build`)
├── /functions/        # Firebase Functions (Backend)
│   ├── /src/          # TypeScript source code for functions
│   │   └── index.ts   # Main functions file (generateBio, etc.)
│   ├── package.json   # Backend dependencies
│   └── tsconfig.json  # TypeScript config for functions
├── /public/           # Static assets (e.g., favicon)
├── /src/              # Frontend React application source
│   ├── /components/   # Reusable UI components (Button, Card, Navbar, etc.)
│   │   ├── /auth/     # Sign-in/Sign-up forms
│   │   └── ...
│   ├── /contexts/     # React contexts (e.g., AuthContext)
│   ├── /hooks/        # Custom React hooks (if any)
│   ├── /lib/          # Utility functions (e.g., Shadcn utils)
│   ├── /pages/        # Page components (BuildProfile, PromptPunchUp, etc.)
│   ├── App.tsx        # Main application component with routing
│   ├── main.tsx       # Entry point for the React app
│   └── index.css      # Global styles (Tailwind)
├── .env.local         # Local environment variables (Firebase config - YOU CREATE THIS)
├── .gitignore         # Files ignored by Git
├── firebase.json      # Firebase project configuration (hosting, functions)
├── index.html         # Main HTML file for Vite
├── package.json       # Frontend dependencies and scripts
├── pnpm-lock.yaml     # Exact dependency versions (or package-lock.json for npm)
├── postcss.config.js  # PostCSS config (for Tailwind)
├── README.md          # This file!
├── tailwind.config.js # Tailwind CSS config
├── tsconfig.json      # TypeScript config for frontend
├── tsconfig.node.json # TypeScript config for Vite node environment
├── vite.config.ts     # Vite build tool configuration
└── firebase_functions_setup.md # Separate guide for Functions setup
```

---

## Setting Up Your New GitHub Repository

1.  **Create a New Repository on GitHub:**
    *   Go to [GitHub](https://github.com/) and create a **new private repository**. Do *not* initialize it with a README, .gitignore, or license file, as you already have these.
2.  **Link Local Project to GitHub:**
    *   Open your terminal in the `DateSpark_v3` project folder.
    *   Initialize Git if it's not already (it likely is from the clone/download):
        ```bash
        git init
        ```
    *   Add the remote repository URL (replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME`):
        ```bash
        git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
        ```
3.  **Stage, Commit, and Push:**
    *   Stage all your files:
        ```bash
        git add .
        ```
    *   Commit the files:
        ```bash
        git commit -m "Initial commit of DateSpark v3 project"
        ```
    *   Rename the default branch to `main` (if needed):
        ```bash
        git branch -M main
        ```
    *   Push the code to your GitHub repository:
        ```bash
        git push -u origin main
        ```

Your code is now safely stored in your private GitHub repository!




---

## Firebase Costs (Blaze Plan)

**Why the Blaze Plan is Needed:**

*   This application uses Firebase Functions to securely call the OpenAI API. 
*   Firebase Functions that make outbound network requests (like calling external APIs) require the project to be on the **Blaze (Pay-as-you-go)** plan. The free Spark plan does not allow this.

**Understanding Blaze Plan Costs:**

*   **Pay-as-you-go:** You only pay for the resources you consume *above* a generous free tier.
*   **Free Tier Included:** The Blaze plan *includes* the same free usage limits as the Spark plan. For many small applications, usage might stay within this free tier, meaning you pay $0.
*   **You Only Pay for Overages:** Costs are incurred only if your usage exceeds the free limits for services like:
    *   **Cloud Functions:** Invocation time, number of invocations, outbound data transfer.
    *   **Firestore:** Document reads, writes, deletes, data storage.
    *   **Authentication:** Free for the first 50,000 monthly active users (MAU) with Email/Password.
    *   **Cloud Storage:** Data stored, downloads, operations (currently not used for image storage in this app, but good to be aware of).

**Estimating Costs:**

*   **Firebase Pricing Calculator:** The best way to estimate potential costs is to use the official [Firebase Pricing Calculator](https://firebase.google.com/pricing#blaze-calculator). Input your expected usage (e.g., number of users, function calls per user, average data read/written).
*   **Low Initial Costs Likely:** For a new application with a small user base, costs are likely to be very low or $0, staying within the free tier.

**Managing Costs (Crucial!):**

*   **Set Budget Alerts:** This is highly recommended!
    *   Your Firebase project is linked to a Google Cloud Billing account.
    *   Go to the [Google Cloud Billing console](https://console.cloud.google.com/billing).
    *   Select your billing account.
    *   Go to "Budgets & alerts".
    *   Create a budget for your Firebase project (e.g., $5 or $10 per month initially).
    *   Set alert thresholds (e.g., notify you when 50%, 90%, and 100% of the budget is reached).
    *   This helps prevent unexpected charges.
*   **Monitor Usage:** Regularly check the "Usage and billing" section in the Firebase console to understand resource consumption.

**Alternatives:**

*   **Firebase is Well-Integrated:** Given the use of Firebase Auth, Firestore, and Functions, sticking with Firebase is the most straightforward path, especially for a beginner.
*   **Other BaaS Providers:** Services like Supabase or AWS Amplify offer similar features but would require significant code changes to migrate.
*   **Self-Hosting:** You could build and host your own backend (e.g., using Node.js/Express or Python/Flask on a server), which gives more control but adds complexity in setup, maintenance, and security.

**Recommendation:** Start with the Firebase Blaze plan, utilize the free tier, set budget alerts immediately, and monitor usage. For most new apps, this is a cost-effective and scalable solution.




### Image Handling (Privacy Focus)

*   **Ephemeral Processing:** When you upload a screenshot for features like "Profile Analysis" or "Conversation Starters", the image is converted into a temporary format (Base64) directly in your browser.
*   **Secure Transmission:** This temporary data is sent securely to our backend Firebase Function.
*   **Direct to AI:** The backend function immediately forwards this data to the OpenAI API for analysis.
*   **NO STORAGE:** **Crucially, the uploaded image file or its data is NEVER stored permanently in Firebase Storage, Firestore Database, or anywhere else on our servers.** The processing happens in memory and is discarded once the AI analysis is complete.
*   **Firebase Storage Not Used:** For these core AI features involving screenshots, Firebase Storage is **not** utilized.

### Data Stored in Firestore

Firestore Database is used to store essential application data, protected by security rules:

*   **User Information:** Basic user details linked to their authentication (e.g., user ID, email, premium status).
*   **Transaction Metadata:** When a payment is made via Razorpay, we store **only non-sensitive** information for record-keeping in a separate `transactions` collection. This includes the Razorpay transaction ID, order ID, payment status, amount, currency, date, and the associated user ID. **We do NOT store credit card numbers or other sensitive payment details.**

### Analytics Data

*   We use Firebase Analytics to understand feature usage and improve the app. This data is collected according to Firebase's standard practices and can be managed within your Firebase project settings.




## Firestore Database Structure

This application uses Firestore to store user data and transaction history. Here is the proposed structure:

**1. `users` Collection:**

*   Each document ID is the Firebase Authentication `uid`.
*   Fields:
    *   `email` (string): User's email address (stored during sign-up).
    *   `createdAt` (timestamp): When the user account was created.
    *   `isPremium` (boolean): `true` if the user has an active subscription, `false` otherwise. Updated by the `verifyRazorpayPayment` webhook.
    *   `premiumExpiry` (timestamp, optional): If subscriptions have an expiry date, store it here.
    *   `lastPaymentId` (string, optional): The ID of the last successful Razorpay payment for reference.
    *   `role` (string): User role for access control. Defaults to `'user'`. Can be manually set to `'admin'` or `'developer'` directly in the Firestore console for specific users.

**Example `users` document (`/users/{userId}`):**
```json
{
  "email": "user@example.com",
  "createdAt": Timestamp(seconds=..., nanoseconds=...),
  "isPremium": true,
  "lastPaymentId": "pay_ABC123XYZ",
  "role": "user"
}
```

**2. `transactions` Collection:**

*   Each document ID is the Razorpay `paymentId`.
*   Stores details of each payment attempt captured by the webhook.
*   Fields:
    *   `userId` (string): The `uid` of the user who made the payment.
    *   `orderId` (string): The Razorpay order ID.
    *   `paymentId` (string): The Razorpay payment ID (also the document ID).
    *   `amount` (number): Amount paid (in smallest currency unit, e.g., paise).
    *   `currency` (string): Currency code (e.g., "INR").
    *   `status` (string): Payment status from Razorpay (e.g., "captured").
    *   `createdAt` (timestamp): When the transaction record was created in Firestore (server timestamp).
    *   `razorpayEvent` (map, optional): The full event payload from Razorpay webhook for auditing purposes.

**Example `transactions` document (`/transactions/{paymentId}`):**
```json
{
  "userId": "userUid123",
  "orderId": "order_XYZ789",
  "paymentId": "pay_ABC123XYZ",
  "amount": 49900,
  "currency": "INR",
  "status": "captured",
  "createdAt": Timestamp(seconds=..., nanoseconds=...)
}
```

**Admin/Developer Access:**

*   The `role` field in the `users` collection allows for basic role-based access control.
*   You would need to manually update the `role` field for specific users directly in the Firebase Firestore console to grant them `'admin'` or `'developer'` privileges.
*   **Crucially:** You must implement **Firestore Security Rules** to enforce these roles. For example, rules could allow users with the `'admin'` role to read all transaction data, while regular users can only read their own data. Security rules are configured in the Firebase console under Firestore Database -> Rules.
    *   *Example Rule Snippet (Conceptual - adapt carefully!):*
        ```firestore-rules
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            // Users can read/write their own user doc
            match /users/{userId} {
              allow read, write: if request.auth.uid == userId;
              // Admins can read any user doc
              allow read: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
            }
            // Users can read their own transactions
            match /transactions/{transactionId} {
              allow read: if request.auth.uid == resource.data.userId;
              // Admins can read any transaction
              allow read: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
              // Generally, only backend functions should write transactions
              allow write: if false; // Or allow specific backend service accounts
            }
          }
        }
        ```

This structure provides a foundation for managing user subscriptions and transaction history, along with basic admin capabilities when combined with appropriate security rules.

