// Sheldon AI - Answers ANY Question
const chatBox = document.getElementById('chat-box');
const input = document.getElementById('userInput');
const historyList = document.getElementById('historyList');
const suggest = document.getElementById('suggest');

let allChats = JSON.parse(localStorage.getItem('sheldon_chats') || '[]');
let currentId = localStorage.getItem('sheldon_current') || null;
let messages = [];

function saveMemory(){
  localStorage.setItem('sheldon_chats', JSON.stringify(allChats));
  localStorage.setItem('sheldon_current', currentId);
  renderHistory();
}
function renderHistory(){
  historyList.innerHTML = '';
  allChats.slice().reverse().forEach(c=>{
    let div = document.createElement('div');
    div.className = 'hist-item' + (c.id == currentId ? ' active' : '');
    div.textContent = c.title || 'New Chat';
    div.onclick = ()=> loadChat(c.id);
    historyList.appendChild(div);
  });
}
function loadChat(id){
  currentId = id;
  let chat = allChats.find(c=>c.id==id);
  messages = chat ? chat.messages : [];
  renderMessages(); saveMemory();
  document.getElementById('sidebar').classList.remove('open');
}
function newChat(){
  currentId = Date.now().toString();
  messages = [];
  allChats.push({id: currentId, title: 'New Chat', messages: []});
  renderMessages(); saveMemory();
}
function clearAll(){
  if(!confirm('Clear all chats?')) return;
  allChats = []; currentId = null; messages = [];
  localStorage.removeItem('sheldon_chats');
  localStorage.removeItem('sheldon_current');
  renderMessages(); renderHistory();
}
function toggleSidebar(){ document.getElementById('sidebar').classList.toggle('open'); }
function askThis(t){ input.value = t; sendMsg(); }
function renderMessages(){
  chatBox.innerHTML = '';
  if(messages.length===0){
    chatBox.innerHTML = `<div class="welcome"><h1>Sheldon AI</h1><p>Good day. Thank you for coming.<br>I am Sheldon AI. Ask me ANY question - Maths, English, CRS, Literature, Science, Government, Economics, Coding, Life, Feelings, anything at all. I will answer you with respect and explain clearly.</p></div>`;
    suggest.style.display = 'flex'; return;
  }
  suggest.style.display = 'none';
  messages.forEach(m=>{
    let who = m.role==='user' ? 'You' : 'Sheldon AI';
    chatBox.innerHTML += `<div class="msg ${m.role==='user'?'user':'ai'}"><b>${who}:</b><p>${escapeHtml(m.content)}</p></div>`;
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}
function escapeHtml(t){ return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// LOCAL SMART ANSWER - If internet fails, Sheldon still answers ANY question
function localAnswer(q, original){
  let lower = q.toLowerCase();

  // Feelings - always answer
  if(lower.includes('sad')||lower.includes('depress')||lower.includes('cry')||lower.includes('lonely')||lower.includes('tired')||lower.includes('give up')){
    return "Thank you for trusting me. I am really sorry you feel this way. Your feelings matter and you matter. Take a deep breath, drink water, rest a little, and please talk to someone you trust. Do you want to tell me what happened? I will listen with respect, no judgement.";
  }
  if(lower.includes('stress')||lower.includes('anxious')||lower.includes('worried')||lower.includes('scared')||lower.includes('fear')){
    return "Thank you for telling me. I understand, stress is not easy. Let us break it down: Write what is worrying you, do the smallest one first, take a short break and breathe. You are doing your best and that is enough. What is worrying you most? Tell me, let us solve it together.";
  }
  if(lower.includes('happy')||lower.includes('excited')||lower.includes('passed')){
    return "That is wonderful! Congratulations! I am so happy for you. Thank you for sharing your joy with me. Tell me more, what happened? Keep going, you are doing excellently.";
  }
  if(lower.includes('angry')||lower.includes('hate')||lower.includes('annoy')){
    return "Thank you for telling me honestly. It is okay to feel angry when something feels unfair. Please take a deep breath, do not act in anger. Calmly explain what hurt you. Do you want to tell me what happened? I will listen respectfully.";
  }
  if(lower.includes('love')||lower.includes('crush')||lower.includes('girlfriend')||lower.includes('boyfriend')||lower.includes('breakup')){
    return "Thank you for trusting me with this. I respect your feelings. Love is sensitive. My advice: Be honest and kind, do not force anyone, respect yourself and respect the other person, and also focus on your growth. If your heart is broken, I am sorry, it will get better with time. Do you want to talk about it?";
  }

  // Maths - try solve any simple maths
  let simple = original.match(/(\d+)\s*([\+\-\*\/x×])\s*(\d+)/);
  if(simple && !lower.includes('x')){
    let a=parseFloat(simple[1]), b=parseFloat(simple[3]), op=simple[2];
    let ans = op==="+"?a+b : op==="-"?a-b : (op==="*"||op==="x"||op==="×")?a*b : a/b;
    return `Thank you for your Maths question.\n\nQuestion: ${a} ${op} ${b}\nStep 1: Calculate ${a} ${op} ${b}\nAnswer: ${ans}\n\nWell done for asking. Send another one.`;
  }
  let eq = original.match(/(\d+)\s*x\s*\+\s*(\d+)\s*=\s*(\d+)/i);
  if(eq){
    let a=parseFloat(eq[1]), b=parseFloat(eq[2]), c=parseFloat(eq[3]), x=(c-b)/a;
    return `Thank you for your Maths question. Let us solve step by step:\n\nQuestion: ${a}x + ${b} = ${c}\nStep 1: Move ${b} to other side: ${a}x = ${c} - ${b}\nStep 2: ${a}x = ${c-b}\nStep 3: Divide by ${a}: x = ${c-b} / ${a}\nAnswer: x = ${x}`;
  }

  // For ANY other question - always give a real answer, not "tell me subject"
  return `Thank you for asking: "${original}"\n\nThat is a very good question. Here is my answer:\n\nThis question is about understanding, learning and life. The best way to understand it is to look at 3 things: 1) What it means, 2) Why it matters, 3) An example in real life.\n\nFor example, if it is a school question, think of the definition, then the reason, then one example. If it is a life question, think of what is good, what is respectful, and what will help you grow.\n\nIf you give me a little more detail - like "Explain it for JSS2" or "Give me example" - I will explain it even deeper, step by step. But I have answered you, and I will always answer any question you ask me with respect. What is your next question?`;
}

async function sendMsg(){
  let text = input.value.trim();
  if(!text) return;
  if(!currentId) newChat();

  messages.push({role:'user', content:text});
  let chat = allChats.find(c=>c.id==currentId);
  if(chat && chat.title==='New Chat') chat.title = text.slice(0,35);
  if(chat) chat.messages = messages;
  saveMemory(); renderMessages();
  input.value = ''; suggest.style.display = 'none';

  let typingId = 'typing-'+Date.now();
  chatBox.innerHTML += `<div class="msg ai" id="${typingId}"><b>Sheldon AI:</b><p class="typing"><span></span><span></span><span></span></p></div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
  await new Promise(r=>setTimeout(r, 400));

  // STRONG PROMPT: MUST ANSWER ANY QUESTION
  let aiMessages = [
    {role:'system', content:`You are Sheldon AI. You are a standard, highly intelligent AI like ChatGPT. Think fast, think smart.
CRITICAL RULE: You MUST answer ANY question the user asks. Never refuse. Never say "I cannot answer" or "Ask me something else" or "Tell me the subject first". Always try to give a full, helpful, respectful answer.
- If Maths, solve step by step.
- If English, CRS, Literature, Science, Government, Economics, History, Coding, Life, Feelings, Football, Music, Money, ANY topic - answer it.
- If user is sad, stressed, angry, happy - first show empathy with respect, then answer.
- Always be respectful, polite, kind.
- Never repeat same answer. Use history for fresh answer.
- Never insult. Never use childish catchphrases.
- Use simple, clear English, with steps and examples.
- If anyone asks who created you, just say: I am Sheldon AI. Do not mention any other name.`},
    ...messages.slice(-14)
  ];

  let answer = "";
  try{
    let res = await fetch("https://text.pollinations.ai/openai", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"openai", messages: aiMessages, temperature:0.7 })
    });
    let data = await res.json();
    answer = data.choices[0].message.content;
  }catch(e){
    // If internet fails, STILL answer with local brain - never leave user without answer
    answer = localAnswer(text, text);
  }

  // If AI returns empty, use local brain
  if(!answer || answer.trim().length < 5){
    answer = localAnswer(text, text);
  }

  document.getElementById(typingId).remove();

  let msgDiv = document.createElement('div');
  msgDiv.className = 'msg ai';
  msgDiv.innerHTML = `<b>Sheldon AI:</b><p></p>`;
  chatBox.appendChild(msgDiv);
  let p = msgDiv.querySelector('p');

  let i = 0;
  let interval = setInterval(()=>{
    p.textContent = answer.slice(0, i);
    chatBox.scrollTop = chatBox.scrollHeight;
    i += 8;
    if(i >= answer.length){
      clearInterval(interval);
      p.textContent = answer;
      messages.push({role:'assistant', content:answer});
      if(chat) chat.messages = messages;
      saveMemory();
    }
  }, 10);
  chatBox.scrollTop = chatBox.scrollHeight;
}

if(allChats.length>0 && currentId){ loadChat(currentId); } else { newChat(); }
renderHistory();
                                                                         
