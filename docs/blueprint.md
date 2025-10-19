# **App Name**: Super Charge

## Core Features:

- Onboarding: Collect user name, age, and primary goal, storing it in localStorage.
- Gamification Summary: Display personalized welcome message, current level, XP, and progress bar.
- Daily Motivation: Generate a personalized daily motivational message in Arabic using Gemini, tailored to the user's name, age, and primary goal. Uses the LLM as a tool.
- AI Routine Generation: Generate a detailed daily routine tailored to the user's goal using Genkit and Gemini.  The routine includes a list of tasks with descriptions, categories (e.g., learning, sport, work), and suggested times. Uses the LLM as a tool.
- Task Tracking: Allow users to mark tasks as complete, earning XP and leveling up. Store routine state in localStorage.
- Progress Tracking: Display progress using bar charts (weekly/monthly) categorized by task type (work, sport, etc.).
- Achievements: Unlock achievements based on progress (e.g., completing tasks, leveling up), rewarding extra XP.

## Style Guidelines:

- Primary color: Use colors from the Super Charge logo (Blue and Yellow).
- Headline font: 'Belleza' sans-serif for a stylish, artistic touch.
- Body font: 'Alegreya' serif for longer reading, contrasting with Belleza.
- Use Lucide React icons for a clean and modern look.
- Right-to-left (RTL) layout to support Arabic language.
- Use Toasts for immediate user feedback (e.g., XP earned).