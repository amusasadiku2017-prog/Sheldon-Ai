const chat = document.getElementById("chat");
const input = document.getElementById("input");
const historyBox = document.getElementById("history");

const MAIN_WELCOME = "My name is Sheldon Lee Cooper. I'm the smartest man in the world. How may I help you?";

function speak(text) {
  const voiceCheckbox = document.getElementById("voiceOn");
  if (!voiceCheckbox || !voiceCheckbox.checked) return;
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1;
  u.pitch = 1.1;
  u.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const v = voices.find(function (voice) { return voice.lang.includes("en-US"); }) || voices[0];
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

function wakeSheldon() {
  addMsg(MAIN_WELCOME, "sheldon");
  speak(MAIN_WELCOME);
}

function newChat() {
  chat.innerHTML = "";
  addMsg(MAIN_WELCOME, "sheldon");
  speak(MAIN_WELCOME);
}

function addMsg(text, who) {
  const empty = document.querySelector(".empty");
  if (empty) empty.remove();
  const div = document.createElement("div");
  div.className = "msg " + who;
  if (who === "sheldon") {
    div.innerHTML = "<b>Sheldon:</b> " + text;
  } else {
    div.innerHTML = "<b>You:</b> " + text;
  }
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function quickAsk(t) {
  input.value = t;
  askSheldon();
}

function getSheldonReply(msg) {
  msg = msg.toLowerCase();
  if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey")) return "Hello. I suppose a greeting is in order. What do you want?";
  if (msg.includes("joke")) return "Why did the chicken cross the road? To prove to the obtuse, non-scientific community that the road-crossing phenomenon is not merely theoretical. Bazinga!";
  if (msg.includes("knock")) return "Knock knock. KNOCK. KNOCK. KNOCK. Sheldon! Sheldon who? Sheldon Cooper, your superior in every measurable way. Bazinga!";
  if (msg.includes("train")) return "Trains? TRAINS! The pinnacle of human engineering! I have a model train collection worth more than your education.";
  if (msg.includes("physics") || msg.includes("science") || msg.includes("quantum")) return "Ah, physics! Finally, a topic worthy of my intellect. String theory suggests the universe is made of tiny vibrating strings. I mastered it at age 11.";
  if (msg.includes("who are you")) return "I am Dr. Sheldon Lee Cooper, B.S., M.S., M.A., Ph.D., and Sc.D. Theoretical physicist at Caltech. IQ 187.";
  if (msg.includes("penny")) return "Penny is my neighbor. She is tolerable. She once called me sweetie. I am still processing that trauma.";
  if (msg.includes("leonard")) return "Leonard is my roommate. He is 5 foot 5, lactose intolerant, and lives in my shadow.";
  if (msg.includes("love")) return "Love is a chemical reaction designed to make mammals reproduce. I prefer a written agreement.";
  if (msg.includes("smart") || msg.includes("iq")) return "Yes, I am a genius. My IQ is 187. Bazinga!";
  if (msg.includes("bye")) return "Goodbye. Remember: My spot is mine. Do not sit in it. Bazinga!";
  const d = [
    "Fascinating. Your question displays a profound misunderstanding of basic scientific principles.",
    "That is incorrect. According to the Roommate Agreement, section 4, you are wrong. Bazinga!",
    "Interesting. In my 187 IQ brain, that question translates to I know nothing. Shall I explain it slowly?",
    "Bazinga! You actually thought that was a good question? I admire your confidence.",
    "As a theoretical physicist, I can confirm: your logic is flawed. Let me explain using a train analogy."
  ];
  return d[Math.floor(Math.random() * d.length)];
}

function askSheldon() {
  const text = input.value.trim();
  if (!text) return;
  addMsg(text, "user");
  const item = document.createElement("div");
  item.className = "history-item";
  item.textContent = text;
  historyBox.prepend(item);
  input.value = "";
  setTimeout(function () {
    const reply = getSheldonReply(text);
    addMsg(reply, "sheldon");
    speak(reply);
  }, 600);
}

if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = function () {
    window.speechSynthesis.getVoices();
  };
                                                                         }
