const chat = document.getElementById("chat");
const input = document.getElementById("input");
let sheldonAwake = false;

// ===== VOICE =====
function speak(text){
  if(!document.getElementById("voiceOn").checked) return;
  if(!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  let utter = new SpeechSynthesisUtterance(text);
  utter.rate = parseFloat(document.getElementById("voiceSpeed").value);
  utter.pitch = 1.1;
  utter.volume = 1;
  let voices = window.speechSynthesis.getVoices();
  let enVoice = voices.find(v => v.lang.includes("en") && v.name.toLowerCase().includes("male")) || voices.find(v => v.lang.includes("en-US")) || voices[0];
  if(enVoice) utter.voice = enVoice;
  window.speechSynthesis.speak(utter);
}

// ===== WELCOME VOICE - YOUR VERSION =====
function wakeSheldon(){
  sheldonAwake = true;
  document.getElementById("wakeBtn").textContent = "✅ SHELDON IS AWAKE";
  document.getElementById("wakeBtn").disabled = true;
  let welcomeText = "My name is Sheldon Lee Cooper. I'm the smartest man in the world. How may I help you?";
  addMsg("<b>Sheldon:</b> " + welcomeText, "sheldon");
  speak(welcomeText);
}

function addMsg(text, who){
  let div = document.createElement("div");
  div.className = "msg " + who;
  div.innerHTML = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function quickAsk(text){ input.value = text; askSheldon(); }

function getSheldonReply(msg){
  msg = msg.toLowerCase();
  if(msg.includes("hi") || msg.includes("hello") || msg.includes("hey"))
    return "Hello. I suppose a greeting is in order, though I prefer to communicate via a pre-approved social interaction schedule. What do you want?";
  if(msg.includes("joke") || msg.includes("funny"))
    return "Why did the chicken cross the road? To prove to the obtuse, non-scientific community that the road-crossing phenomenon is not merely theoretical. Bazinga! That was a joke. You may laugh now. Ha. Ha. Ha.";
  if(msg.includes("knock"))
    return "Knock knock. Oh, you were supposed to say Who's there? This is why I have a 3-knock rule. KNOCK. KNOCK. KNOCK. Sheldon! Sheldon who? Sheldon Cooper, your superior in every measurable way. Bazinga!";
  if(msg.includes("train"))
    return "Trains? TRAINS! The pinnacle of human engineering! I have a model train collection worth more than your education. If you ever get a chance, ride the Santa Fe Super Chief. It is perfection on rails.";
  if(msg.includes("physics") || msg.includes("science") || msg.includes("quantum") || msg.includes("string"))
    return "Ah, physics! Finally, a topic worthy of my intellect. String theory suggests the universe is made of tiny vibrating strings. I, of course, mastered it at age 11 while you were still struggling with addition.";
  if(msg.includes("math") || msg.includes("calculate") || msg.includes("solve"))
    return "Mathematics is trivial for me. I finished calculus at age 8. Give me a real challenge.";
  if(msg.includes("who are you") || msg.includes("your name"))
    return "I am Dr. Sheldon Lee Cooper, B.S., M.S., M.A., Ph.D., and Sc.D. Theoretical physicist at Caltech. I have an eidetic memory and an IQ of 187.";
  if(msg.includes("penny")) return "Penny is my neighbor. She is tolerable. She once called me sweetie. I am still processing that trauma.";
  if(msg.includes("leonard")) return "Leonard is my roommate. He is 5 foot 5, lactose intolerant, and lives in my shadow. But he does pay half the rent.";
  if(msg.includes("amy")) return "Amy Farrah Fowler is my girlfriend. I mean, my coitus-free romantic partner. We have a Relationship Agreement. It is 31 pages long.";
  if(msg.includes("howard")) return "Howard Wolowitz is an engineer. He is not a real doctor. He went to space, but so did a monkey. I rest my case.";
  if(msg.includes("raj")) return "Rajesh Koothrappali cannot talk to women without alcohol. A fascinating, if pathetic, psychological condition.";
  if(msg.includes("love") || msg.includes("girlfriend") || msg.includes("crush"))
    return "Love is a chemical reaction designed to make mammals reproduce. I prefer my relationships to be governed by a written agreement.";
  if(msg.includes("smart") || msg.includes("genius") || msg.includes("iq"))
    return "Yes, I am a genius. My IQ is 187. Yours is... let us not dwell on depressing numbers. Bazinga!";
  if(msg.includes("dumb") || msg.includes("stupid") || msg.includes("idiot"))
    return "Excuse me? I am not the one talking to a computer program built by a 14-year-old in Lagos. Oh wait, that is actually impressive. Continue.";
  if(msg.includes("food") || msg.includes("eat") || msg.includes("pizza") || msg.includes("thai"))
    return "Today is Thursday. Thursday is pizza night. We order from Franconi's. If you suggest another day, you will be in violation of the Roommate Agreement.";
  if(msg.includes("bye") || msg.includes("goodbye"))
    return "Goodbye. Remember: My spot is mine. Do not sit in it. And wash your hands. Bazinga!";
  let defaults = [
    "Fascinating. Your question displays a profound misunderstanding of basic scientific principles. Allow me to correct you.",
    "I'm sorry, I was not listening. I was thinking about how superior string theory is to your question. Repeat it?",
    "That is incorrect. According to the Roommate Agreement, section 4, paragraph 2, you are wrong. Bazinga!",
    "Interesting. In my 187 IQ brain, that question translates to I know nothing. Shall I explain it slowly?",
    "Bazinga! You actually thought that was a good question? I admire your confidence.",
    "As a theoretical physicist, I can confirm: your logic is flawed. Let me explain using a train analogy.",
    "Oh, please. Even Penny understands that. And Penny thought Thor was a planet."
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

function askSheldon(){
  let text = input.value.trim();
  if(!text) return;
  addMsg("<b>You:</b> " + text, "user");
  input.value = "";
  setTimeout(()=>{
    let reply = getSheldonReply(text);
    addMsg("<b>Sheldon:</b> " + reply, "sheldon");
    speak(reply);
  }, 500);
}

if('speechSynthesis' in window){
  window.speechSynthesis.onvoiceschanged = ()=>{ window.speechSynthesis.getVoices(); };
    }
