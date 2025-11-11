# Project 8 · L'Oréal Beauty Concierge

A branded AI chatbot that helps guests explore L'Oréal's makeup, skincare, haircare, and fragrance portfolio. The interface mirrors the brand's premium look & feel and proxies every OpenAI request through a Cloudflare Worker so the API key stays private.

## Run the project locally

1. Install dependencies (none required beyond a browser).
2. Serve the site (e.g., `npx serve` or the VS Code Live Server extension).
3. Open `http://localhost:3000` (or the served URL) and start chatting.

## Cloudflare Worker

- **Endpoint:** `https://loreal-worker.jaretva.workers.dev/`
- The worker expects a JSON payload with a `messages` array, mirroring OpenAI's Chat Completions format, and returns `choices[0].message.content`.

## LevelUp features implemented

1. **Conversation history (10 pts):** The assistant maintains the full dialog context so it can remember user preferences and prior answers.
2. **Latest question display (5 pts):** Each assistant response is prefaced with the user's most recent question and the banner above the chat resets per turn.
3. **Conversation UI (10 pts):** Distinct user/assistant bubbles, avatars, and motion affordances mimic modern messaging apps.

## Reflection responses

### 1. Project URL & LevelUps
- Live URL: https://jaretva.github.io/loreal_chat/
- LevelUps: Conversation history, latest-question banner, chat bubble UI.

### 2. Build reflections (10 pt)
Connecting the chat interface to OpenAI *through* a Cloudflare Worker took the most problem-solving. I had to structure the payload exactly like the Chat Completions API, handle streamed vs. non-streamed responses, and harden error states so the UI never freezes. Testing in DevTools uncovered a few mixed-content and CORS gotchas, which I solved by mirroring the correct headers in the worker. I was pleasantly surprised by how much brand polish came from small touches—like Montserrat typography, gold accent colors, and contextual question labels.

### 3. Networking talking points (10 pt)
- Designed and shipped a branded AI chatbot for L'Oréal that routes every request through a Cloudflare Worker for secure API usage.
- Built a conversational UI with multi-turn memory so users can discuss routines, ingredients, and product pairings naturally.
- Implemented guardrails that keep the model focused on L'Oréal's portfolio and politely decline off-topic questions.

### 4. Recruiter highlight (10 pt)
I'd spotlight how the chatbot mirrors L'Oréal's luxury aesthetic—clean typography, black-and-gold palette, and logo integration—while also showcasing technical rigor. The Cloudflare Worker keeps the API key secret, the system prompt anchors every response to L'Oréal expertise, and the LevelUp features demonstrate both creativity (context banners) and user empathy (clear message bubbles, typing indicators).
