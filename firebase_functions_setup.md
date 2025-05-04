# Firebase Functions Setup Guide (Beginner-Friendly)

This guide explains how to set up and deploy the Firebase Functions included in this project. These functions act as a secure backend to handle tasks like calling the OpenAI API, keeping your secret API keys safe.

You need to perform these steps **on your own computer** after you download the project code, as they require logging into your Firebase account.

**Prerequisites:**

1.  **Node.js and npm:** Make sure you have Node.js (which includes npm) installed. You can download it from [https://nodejs.org/](https://nodejs.org/).
2.  **Firebase Project:** You should already have a Firebase project created (as you mentioned setting up Auth, Firestore, etc.). Make sure your project is upgraded to the **Blaze (Pay-as-you-go)** plan, as Firebase Functions (especially those calling external APIs like OpenAI) require this plan.

**Steps:**

1.  **Install Firebase CLI Globally:**
    *   Open your computer's terminal or command prompt.
    *   Run the following command to install the Firebase Command Line Interface (CLI) tools globally:
        ```bash
        npm install -g firebase-tools
        ```
    *   If you encounter permission errors, you might need to use `sudo` on macOS/Linux (`sudo npm install -g firebase-tools`) or run the command prompt as Administrator on Windows.

2.  **Log in to Firebase:**
    *   In the same terminal, run:
        ```bash
        firebase login
        ```
    *   This will open a browser window asking you to log in to the Google account associated with your Firebase project. Follow the prompts to authorize the CLI.

3.  **Navigate to Project Directory:**
    *   Using the terminal, navigate to the main project folder (`DateSpark_v3`) where you downloaded the code.
        ```bash
        cd path/to/your/DateSpark_v3
        ```
        (Replace `path/to/your/` with the actual path on your computer).

4.  **Initialize Firebase Functions:**
    *   Run the following command **inside** the `DateSpark_v3` directory:
        ```bash
        firebase init functions
        ```
    *   The CLI will ask you a few questions:
        *   **"What language would you like to use...?"** Select **TypeScript**.
        *   **"Do you want to use ESLint...?"** You can choose **Yes** (recommended) or No.
        *   **"File functions/package.json already exists. Overwrite?"** Select **No** (important!). We want to keep the dependencies I already added.
        *   **"File functions/tsconfig.json already exists. Overwrite?"** Select **No**.
        *   **"File functions/src/index.ts already exists. Overwrite?"** Select **No** (very important!). This keeps the function code I wrote.
        *   **"Do you want to install dependencies with npm now?"** Select **Yes**.
    *   This command sets up the necessary Firebase configuration files for the `functions` directory based on the code already present.

5.  **Set Your OpenAI API Key Securely:**
    *   You need to tell Firebase Functions what your secret OpenAI API key is without putting it directly in the code.
    *   Run this command in the terminal (still inside the `DateSpark_v3` directory):
        ```bash
        firebase functions:config:set openai.key="YOUR_OPENAI_API_KEY"
        ```
        *   **Replace `YOUR_OPENAI_API_KEY`** with your actual secret key obtained from OpenAI.
    *   This securely stores the key in your Firebase project's environment configuration.

6.  **Deploy Your Functions:**
    *   Now, upload the function code to Firebase by running:
        ```bash
        firebase deploy --only functions
        ```
    *   This process might take a few minutes. It compiles the TypeScript code, packages it, and uploads it to your Firebase project.
    *   Once deployment is successful, your backend functions are live and ready to be called by the frontend app!

**Summary:**

You only need to run `firebase login`, `firebase init functions` (carefully answering "No" to overwrites), `firebase functions:config:set`, and `firebase deploy --only functions` **once** initially. If you later modify the function code (in the `functions/src` directory), you only need to run `firebase deploy --only functions` again to update them.

Keep this guide handy when you receive the final code package.
