# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

---

## Deploying to Netlify

To deploy this application to a platform like Netlify, you need to configure environment variables for the AI and Firebase features to work correctly.

### Required Environment Variables

#### 1. Google AI (Gemini) API Key

The application uses Google AI (Gemini) to generate daily routines and motivational messages.

*   **`GEMINI_API_KEY`**
    *   **Purpose:** This key authenticates your application with the Google AI services.
    *   **How to get it:**
        1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
        2.  Sign in with your Google account.
        3.  Click on **"Create API key"** to generate a new key.
        4.  Copy the generated key.

#### 2. Firebase Configuration

This application uses Firebase for data storage (Firestore) and user authentication (Auth).

*   **`NEXT_PUBLIC_FIREBASE_API_KEY`**
*   **`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`**
*   **`NEXT_PUBLIC_FIREBASE_PROJECT_ID`**
*   **`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`**
*   **`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`**
*   **`NEXT_PUBLIC_FIREBASE_APP_ID`**

*   **How to get them:**
    1.  Go to the [Firebase Console](https://console.firebase.google.com/).
    2.  Select your project.
    3.  Click the gear icon (⚙️) next to **Project Overview** in the sidebar, then select **Project settings**.
    4.  In the **General** tab, scroll down to the **"Your apps"** section.
    5.  Select the web app you are using.
    6.  Choose **"Config"** for the SDK setup and configuration.
    7.  You will see a JSON object with all the required keys (apiKey, authDomain, etc.). Copy each value to its corresponding environment variable.

### How to Add Variables to Netlify

1.  In your Netlify site dashboard, go to **Site configuration** > **Build & deploy** > **Environment**.
2.  Under **Environment variables**, click **"Add a variable"**.
3.  For each variable listed above, enter its **Key** (e.g., `GEMINI_API_KEY`) and paste the **Value** you copied.
4.  Save the variables and redeploy your site.
