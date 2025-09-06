const GST_ITEMS = [
  { id: 1,  name: "Mobile Phones",         old: 12, new: 18, note: "Standardized to 18% for electronics." },
  { id: 2,  name: "Laptops",               old: 12, new: 18, note: "Aligned with other computing devices." },
  { id: 3,  name: "Televisions (≤32\")",   old: 28, new: 18, note: "Reduced to boost affordability." },
  { id: 4,  name: "LED Bulbs",             old: 12, new: 12, note: "No change; energy-saving essential." },
  { id: 5,  name: "Packed Food (Branded)", old: 5,  new: 12, note: "Reclassified as processed convenience." },
  { id: 6,  name: "Restaurant Services",   old: 5,  new: 5,  note: "No ITC; rate unchanged." },
  { id: 7,  name: "Hotel Rooms (<₹7,500)", old: 12, new: 12, note: "Bracket unchanged; threshold-driven." },
  { id: 8,  name: "Hotel Rooms (≥₹7,500)", old: 18, new: 18, note: "High-tier stays remain at 18%." },
  { id: 9,  name: "Electric Vehicles",     old: 12, new: 5,  note: "Encouraging EV adoption; concessional rate." },
  { id: 10, name: "Gold Jewellery",        old: 3,  new: 3,  note: "No change; remains low to support sector." },
  { id: 11, name: "Health Insurance",      old: 18, new: 18, note: "Services category, unchanged." },
  { id: 12, name: "Online Gaming (RMG)",   old: 18, new: 28, note: "Higher slab for gaming w/ stakes." }
  // You can push 3 more to make 15 if you wish.
];

/* ====== Simple Router (3 views) ====== */
const views = {
  home: document.getElementById("view-home"),
  reviews: document.getElementById("view-reviews"),
  login: document.getElementById("view-login"),
};
const navButtons = document.querySelectorAll(".nav-btn[data-route]");
navButtons.forEach(btn => btn.addEventListener("click", () => navigate(btn.dataset.route)));
function navigate(route){
  Object.values(views).forEach(v => v.classList.remove("active"));
  (views[route] || views.home).classList.add("active");
  if(route === "reviews") fillReviewItems();
  window.location.hash = route;
}
window.addEventListener("load", () => {
  const route = window.location.hash.replace("#","") || "home";
  navigate(route);
  renderItems(GST_ITEMS);
  renderTable(GST_ITEMS);
  restoreLogin();
});

/* ====== Theme toggle ====== */
document.getElementById("themeToggle").addEventListener("click", () => {
  document.documentElement.classList.toggle("light");
});

/* ====== Search / Filter / Reset ====== */
const searchBox = document.getElementById("searchBox");
const rateFilter = document.getElementById("rateFilter");
const resetFilters = document.getElementById("resetFilters");

searchBox.addEventListener("input", applyFilters);
rateFilter.addEventListener("change", applyFilters);
resetFilters.addEventListener("click", () => {
  searchBox.value = "";
  rateFilter.value = "all";
  applyFilters();
});

function applyFilters(){
  const q = searchBox.value.trim().toLowerCase();
  const rate = rateFilter.value;
  let list = GST_ITEMS.filter(x => x.name.toLowerCase().includes(q));
  if(rate !== "all"){
    list = list.filter(x => String(x.new) === rate);
  }
  renderItems(list);
  renderTable(list);
}

/* ====== Render Cards ====== */
const itemsGrid = document.getElementById("itemsGrid");
function renderItems(items){
  itemsGrid.innerHTML = items.map(x => {
    const change = x.new - x.old;
    const isUp = change > 0;
    const delta = isUp ? `+${change}%` : `${change}%`;
    const deltaClass = isUp ? "up" : (change < 0 ? "down" : "");
    // public image by item keyword
    const img = imageFor(x.name);
    return `
      <article class="card">
        <img src="${img}" alt="${x.name}">
        <h4>${x.name}</h4>
        <div class="kv">
          <span class="tag">Old: ${x.old}%</span>
          <span class="tag">New: ${x.new}%</span>
          <span class="tag delta ${deltaClass}">${delta}</span>
        </div>
        <p class="muted" style="margin-top:6px">${x.note}</p>
      </article>
    `;
  }).join("");
}

/* ====== Render Table ====== */
const itemsTableBody = document.getElementById("itemsTableBody");
function renderTable(items){
  itemsTableBody.innerHTML = items.map(x => {
    const change = x.new - x.old;
    const label = change === 0 ? "No change" : (change > 0 ? `+${change}%` : `${change}%`);
    return `
      <tr>
        <td>${x.name}</td>
        <td>${x.old}%</td>
        <td>${x.new}%</td>
        <td>${label}</td>
        <td>${x.note}</td>
      </tr>
    `;
  }).join("");
}

/* ====== Public images (Unsplash query strings) ====== */
function imageFor(name){
  const map = {
    "Mobile Phones":"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop",
    "Laptops":"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop",
    "Televisions (≤32\")":"https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop",
    "LED Bulbs":"https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?q=80&w=1600&auto=format&fit=crop",
    "Packed Food (Branded)":"https://images.unsplash.com/photo-1505575967455-40e256f73376?q=80&w=1600&auto=format&fit=crop",
    "Restaurant Services":"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop",
    "Hotel Rooms (<₹7,500)":"https://images.unsplash.com/photo-1501117716987-c8e2a3a67c37?q=80&w=1600&auto=format&fit=crop",
    "Hotel Rooms (≥₹7,500)":"https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop",
    "Electric Vehicles":"https://images.unsplash.com/photo-1511390427070-4ac6b682ab1b?q=80&w=1600&auto=format&fit=crop",
    "Gold Jewellery":"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop",
    "Health Insurance":"https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1600&auto=format&fit=crop",
    "Online Gaming (RMG)":"https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop"
  };
  return map[name] || "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop";
}

/* ====== Reviews (Healthy Conversation Only) ====== */
const reviewForm = document.getElementById("reviewForm");
const reviewsList = document.getElementById("reviewsList");
const revError = document.getElementById("revError");
const revItem = document.getElementById("revItem");

function fillReviewItems(){
  revItem.innerHTML = `<option value="">Select item</option>` + GST_ITEMS.map(x => `<option>${x.name}</option>`).join("");
}

const BAD_WORDS = [
  // light moderation list: add more as needed
  "stupid","idiot","hate","kill","threat","racist","sexist","abuse","abusive",
  "dumb","shut up","nonsense","moron","trash","garbage","fraud","scam"
];

function isHealthy(text){
  const t = text.toLowerCase();
  return !BAD_WORDS.some(b => t.includes(b));
}

function saveReviews(revs){
  localStorage.setItem("gst_reviews", JSON.stringify(revs));
}
function loadReviews(){
  try{
    return JSON.parse(localStorage.getItem("gst_reviews")) || [];
  }catch{
    return [];
  }
}
function renderReviews(){
  const revs = loadReviews();
  if(revs.length === 0){
    reviewsList.innerHTML = `<div class="review"><div class="muted">No reviews yet. Be the first!</div></div>`;
    return;
  }
  reviewsList.innerHTML = revs.map(r => `
    <article class="review">
      <div class="meta">
        <span class="name">${r.name}</span>
        <span class="tiny muted">${new Date(r.time).toLocaleString()}</span>
      </div>
      <div class="tiny">${r.item} • ${r.rating}</div>
      <p>${escapeHTML(r.text)}</p>
    </article>
  `).join("");
}
function escapeHTML(s){
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

reviewForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("revName").value.trim() || "Anonymous";
  const item = document.getElementById("revItem").value;
  const rating = document.getElementById("revRating").value;
  const text = document.getElementById("revText").value.trim();

  if(!item || !rating || !text){
    showRevError("Please fill all fields.");
    return;
  }
  if(!isHealthy(text)){
    showRevError("Please keep it respectful. Your review contains disallowed content.");
    return;
  }

  const revs = loadReviews();
  revs.unshift({ name, item, rating, text, time: Date.now() });
  saveReviews(revs);
  reviewForm.reset();
  showRevError(""); // clear
  renderReviews();
});

function showRevError(msg){
  if(!msg){
    revError.classList.add("hide");
    revError.textContent = "";
  }else{
    revError.classList.remove("hide");
    revError.textContent = msg;
  }
}
renderReviews();

/* ====== Login (client-side demo) ====== */
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const userBar = document.getElementById("userBar");
const welcomeText = document.getElementById("welcomeText");
const logoutBtn = document.getElementById("logoutBtn");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value;

  if(!u || p.length < 6){
    showLoginError("Password must be at least 6 characters.");
    return;
  }
  const user = { username: u, token: "demo-" + Math.random().toString(36).slice(2) };
  localStorage.setItem("gst_user", JSON.stringify(user));
  showLoginError("");
  restoreLogin();
  navigate("home");
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("gst_user");
  restoreLogin();
});

function showLoginError(msg){
  if(!msg){
    loginError.classList.add("hide"); loginError.textContent = "";
  }else{
    loginError.classList.remove("hide"); loginError.textContent = msg;
  }
}

function restoreLogin(){
  const data = localStorage.getItem("gst_user");
  if(data){
    try{
      const user = JSON.parse(data);
      welcomeText.textContent = `Welcome, ${user.username}`;
      logoutBtn.classList.remove("hide");
    }catch{
      welcomeText.textContent = "Welcome, Guest";
      logoutBtn.classList.add("hide");
    }
  }else{
    welcomeText.textContent = "Welcome, Guest";
    logoutBtn.classList.add("hide");
  }
}

/* ====== Chatbot (GST Q&A + moderation) ====== */
const chatToggle = document.getElementById("chatToggle");
const chatClose = document.getElementById("chatClose");
const chatbot = document.getElementById("chatbot");
const chatBody = document.getElementById("chatBody");
const chatForm = document.getElementById("chatForm");
const chatText = document.getElementById("chatText");

chatToggle.addEventListener("click", () => chatbot.classList.toggle("hide"));
chatClose.addEventListener("click", () => chatbot.classList.add("hide"));

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = chatText.value.trim();
  if(!msg) return;
  if(!isHealthy(msg)){
    pushBot("Let's keep it respectful. Try rephrasing your question.");
    chatText.value = "";
    return;
  }
  pushUser(msg);
  const reply = answerGST(msg);
  pushBot(reply);
  chatText.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;
});

function pushUser(text){
  const div = document.createElement("div");
  div.className = "msg user";
  div.textContent = text;
  chatBody.appendChild(div);
}
function pushBot(text){
  const div = document.createElement("div");
  div.className = "msg bot";
  div.textContent = text;
  chatBody.appendChild(div);
}

function answerGST(q){
  const lower = q.toLowerCase();
  // Try to map to known item
  for(const item of GST_ITEMS){
    const key = item.name.toLowerCase().replace(/[^a-z0-9]/g,'');
    if(lower.replace(/[^a-z0-9]/g,'').includes(key.replace(/[^a-z0-9]/g,'')) ||
       lower.includes(item.name.toLowerCase().split(" ")[0])) {
      const change = item.new - item.old;
      const delta = change === 0 ? "no change" : (change > 0 ? `increased by ${change}%` : `reduced by ${Math.abs(change)}%`);
      return `${item.name}: new GST is ${item.new}%. It has ${delta} (earlier ${item.old}%). Note: ${item.note}`;
    }
  }
  // Fallback intents
  if(lower.includes("gst") && (lower.includes("list") || lower.includes("items"))){
    const top = GST_ITEMS.map(x => `${x.name} (${x.new}%)`).slice(0,8).join(", ");
    return `Here are a few: ${top}. Ask about any one to know the change.`;
  }
  if(lower.includes("hello") || lower.includes("hi")){
    return "Hello! Ask me about the GST rate or change for any item listed on this page.";
  }
  return "I couldn’t match that. Try asking like: “What’s the GST on electric vehicles now?”";
}

/* ====== Populate reviews initially ====== */
if(loadReviews().length === 0){
  saveReviews([
    {name:"Riya", item:"Electric Vehicles", rating:"⭐⭐⭐⭐", text:"Lower GST is great for EV adoption!", time: Date.now()-864e5},
    {name:"Arun", item:"Packed Food (Branded)", rating:"⭐⭐⭐", text:"A bit costlier now, but okay if quality improves.", time: Date.now()-3600e3}
  ]);
  renderReviews();
}

/* ====== Hash link support for <a data-route> ====== */
document.querySelectorAll('a[data-route]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    navigate(a.getAttribute('data-route'));
  });
});

/* ====== Optional: light theme (toggle adds .light on <html>) ====== */
const lightStyles = `
  html.light body{background:linear-gradient(120deg,#f6f7fb 0%,#eef2ff 100%);color:#0b1023}
  html.light .site-header{background:linear-gradient(90deg, rgba(124,58,237,.15), rgba(34,211,238,.15));}
  html.light .card, html.light .table-wrap, html.light .login-card, html.light #reviewForm{background:white;color:#0b1023;border-color:rgba(0,0,0,.08)}
  html.light .muted{color:#475569}
  html.light .chatbot{background:#ffffff}
`;
const style = document.createElement("style");
style.textContent = lightStyles;
document.head.appendChild(style);