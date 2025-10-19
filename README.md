# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

---

## Deploying to Netlify

To deploy this application to a platform like Netlify, you need to configure one environment variable for the AI features to work correctly.

### Required Environment Variable

The application uses Google AI (Gemini) to generate daily routines and motivational messages. To enable this, you must provide a Google AI API key.

1.  **`GEMINI_API_KEY`**
    *   **Purpose:** This key authenticates your application with the Google AI services.
    *   **How to get it:**
        1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
        2.  Sign in with your Google account.
        3.  Click on **"Create API key"** to generate a new key.
        4.  Copy the generated key.
    *   **How to add it to Netlify:**
        1.  In your Netlify site dashboard, go to **Site configuration** > **Build & deploy** > **Environment**.
        2.  Under **Environment variables**, click **"Add a variable"**.
        3.  For the **Key**, enter `GEMINI_API_KEY`.
        4.  For the **Value**, paste the API key you copied from Google AI Studio.
        5.  Save the variable and redeploy your site.

**Important Note:** This application **DOES NOT USE FIREBASE**. You do not need any Firebase Project ID, Firebase API Key, or any other Firebase configuration to deploy this application. The state is managed locally in the browser's localStorage.
