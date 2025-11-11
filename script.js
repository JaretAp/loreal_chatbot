const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const latestQuestionBanner = document.getElementById("latestQuestion");

const workerUrl = "https://loreal-worker.jaretva.workers.dev/";

const systemPrompt = `You are the official L'Oréal Beauty Concierge. Answer only
questions related to L'Oréal brands, their products, ingredients, application
techniques, routines, shade matching, or beauty education. If someone asks about
unrelated topics, politely steer them back to beauty, haircare, skincare,
fragrance, or brand initiatives. Provide concise, friendly answers grounded in
L'Oréal's portfolio. When relevant, suggest next steps or follow-up questions.`;

const messages = [{ role: "system", content: systemPrompt }];
let typingBubble = null;

const createTypingIndicator = () => {
  const indicator = document.createElement("div");
  indicator.className = "msg ai";
  const dots = document.createElement("div");
  dots.className = "typing-indicator";
  dots.innerHTML = "<span></span><span></span><span></span>";
  indicator.appendChild(dots);
  return indicator;
};

const scrollToBottom = () => {
  chatWindow.scrollTop = chatWindow.scrollHeight;
};

const updateLatestQuestion = (text) => {
  if (!text) {
    latestQuestionBanner.classList.add("visually-hidden");
    latestQuestionBanner.textContent = "";
    return;
  }
  latestQuestionBanner.textContent = `Latest question · ${text}`;
  latestQuestionBanner.classList.remove("visually-hidden");
};

const appendMessage = (role, content, options = {}) => {
  const row = document.createElement("div");
  row.className = `msg-row ${role}`;

  const avatar = document.createElement("div");
  avatar.className = `avatar ${role}`;
  avatar.textContent = role === "ai" ? "AI" : "YOU";

  const bubble = document.createElement("div");
  bubble.className = `msg ${role}`;

  if (role === "ai" && options.question) {
    const questionLabel = document.createElement("p");
    questionLabel.className = "msg-question";
    questionLabel.textContent = options.question;
    bubble.appendChild(questionLabel);
  }

  const messageContent = document.createElement("p");
  messageContent.textContent = content;
  bubble.appendChild(messageContent);

  if (role === "user") {
    row.appendChild(bubble);
    row.appendChild(avatar);
  } else {
    row.appendChild(avatar);
    row.appendChild(bubble);
  }

  chatWindow.appendChild(row);
  scrollToBottom();
};

const setTyping = (isTyping) => {
  if (isTyping) {
    const row = document.createElement("div");
    row.className = "msg-row ai";

    const avatar = document.createElement("div");
    avatar.className = "avatar ai";
    avatar.textContent = "AI";
    row.appendChild(avatar);

    typingBubble = createTypingIndicator();
    row.appendChild(typingBubble);
    chatWindow.appendChild(row);
  } else if (typingBubble?.parentElement) {
    typingBubble.parentElement.remove();
    typingBubble = null;
  }
  scrollToBottom();
};

appendMessage(
  "ai",
  "Bonjour! I'm your L'Oréal beauty concierge. Ask me about skincare, makeup, haircare, fragrances, or how to build a tailored routine."
);

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = userInput.value.trim();
  if (!question) return;

  appendMessage("user", question);
  updateLatestQuestion(question);
  messages.push({ role: "user", content: question });
  userInput.value = "";

  setTyping(true);

  try {
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data?.error?.message || `Worker error: ${response.status}`
      );
    }

    if (data?.error?.message) {
      throw new Error(data.error.message);
    }

    const aiContent = data?.choices?.[0]?.message?.content?.trim();

    if (!aiContent) {
      throw new Error("Missing response from assistant");
    }

    messages.push({ role: "assistant", content: aiContent });
    appendMessage("ai", aiContent, { question });
  } catch (error) {
    appendMessage(
      "ai",
      `I couldn't reach our beauty lab right now. ${error.message || ""}`.trim()
    );
    console.error(error);
  } finally {
    setTyping(false);
  }
});
