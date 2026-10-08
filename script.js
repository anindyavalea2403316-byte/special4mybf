/* ===== EDIT ME ===== */
const birthdayData = {
  name: "Zidan",
  birthdayMessage: "happy birthday to the man I adore, the one who keeps choosing me more and more. For your patience, kindness, and constant care, For staying beside me through everything we share.",
  photoCaption: "I love u always and I love u more than anything.",
  finalLetter: "Terima kasih telah mencintaiku. Terima kasih telah memilihku. Setiap hari, bahkan ketika itu tidak mudah. Terima kasih untuk hal-hal kecil yang mungkin bahkan tidak kamu sadari begitu penting. Caramu mendengarkanku, caramu memelukku ketika aku diam, caramu memberi ruang untuk perasaanku. Dan terima kasih untuk hal-hal besar juga. Untuk berdiri di sampingku, untuk melindungi hatiku, untuk menjadi seseorang yang bisa aku percayai dengan seluruh diriku. Kamu telah mencintaiku dengan cara yang menyembuhkan bagian-bagian diriku yang aku tidak tahu bagaimana memperbaikinya. Aku tidak akan pernah menganggap itu begitu saja. Aku melihatmu. Aku menghargaimu. Dan aku mencintaimu lebih dari yang bisa diungkapkan dengan kata-kata."
};
const chatMessages = [
  { sender: "Z", text: "namamu siapa?", time: "19.42" },
  { sender: "L", text: "aku lea, kamu?", time: "19.43" },
  { sender: "Z", text: "aku zidan.", time: "19.43" }
];
const chatDayLabel = "the very first day ♡";
// 0 = main, 1 = night view, 2 = park (swap paths/filenames freely)
const photos = ["assets/main.jpeg", "assets/photo1.jpeg", "assets/photo2.png", "assets/photo3.png", "assets/photo4.png", "assets/photo5.jpg"];
const scrapbook = [
  { p: 1, cap: "one of my favorite days ♡", s: "🎀" },
  { p: 2, cap: "this moment >>>", s: "⭐" },
  { p: 3, cap: "still makes me smile", s: "♡" },
  { p: 4, cap: "just us", s: "✦" },
  { p: 5, cap: "a memory worth keeping", s: "🌷" },
  { p: 6, cap: "my favorite person", s: "🎀" }
];
const questions = [
  "What's one thing you think I love most about you?", "Who fell first? 👀", "What's our most random memory?",
  "If we could go anywhere tomorrow, where would we go?", "What's one thing you want us to do together someday?",
  "Who is more annoying? Be honest.", "What's one word you'd use to describe us?", "What do you think I'm thinking right now? 👀"
];
const wishes = [
  ["01", "happiness", "I hope you find little reasons to smile every day."],
  ["02", "courage", "I hope you keep chasing the things that matter to you."],
  ["03", "peace", "I hope life becomes a little gentler with you."],
  ["04", "dreams", "I hope you get closer to every dream you're working toward."]
];
/* ===== CODE ===== */
const $ = s => document.querySelector(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));
let current = 1, token = 0, lastQ = -1;

// photos with placeholder fallback
function setPhoto(img, i) {
  img.src = photos[i % photos.length];
  img.onerror = () => { img.removeAttribute("src"); img.classList.add("missing"); img.alt = "photo coming soon"; };
}
document.querySelectorAll("[data-photo]").forEach(i => setPhoto(i, +i.dataset.photo));

// lightbox
document.addEventListener("click", e => {
  const img = e.target.closest("img[data-photo],.card img");
  if (img && img.getAttribute("src") && !img.closest(".lock")) { $("#lbimg").src = img.src; $("#lb").classList.remove("hidden"); }
});
const closeLb = () => $("#lb").classList.add("hidden");
$("#lbx").onclick = closeLb;
$("#lb").onclick = e => { if (e.target.id === "lb") closeLb(); };
document.addEventListener("keydown", e => e.key === "Escape" && closeLb());

// navigation
function go(n) {
  token++; current = n;
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const s = $("#s" + n); s.classList.add("active"); s.scrollTop = 0;
  if (n === 2) tick();
  if (n === 3) runChat(token);
  if (n === 8) typeMessage();
  if (n === 4) { const el = $("#s4"); el.classList.remove("active"); void el.offsetWidth; el.classList.add("active"); }
  if (n === 2) $("#music").classList.remove("hidden");
}
document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => go(+b.dataset.go)));
$("#s2 .lock .wall").addEventListener("click", () => go(3));

// clock
function tick() {
  const d = new Date();
  $("#clock").textContent = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":");
  $("#date").textContent = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
setInterval(tick, 20000); tick();

// chat
async function runChat(t) {
  const body = $("#chatBody");
  body.innerHTML = '<div class="daychip"></div>'; body.firstChild.textContent = chatDayLabel;
  $("#chatAfter").style.display = "none"; $("#chatNext").classList.add("hidden");
  $("#status").textContent = "online";
  await sleep(700);
  for (const m of chatMessages) {
    if (t !== token) return;
    $("#status").textContent = "typing...";
    const d = document.createElement("div"); d.className = "dots"; d.innerHTML = "<i></i><i></i><i></i>";
    body.appendChild(d); body.scrollTop = body.scrollHeight;
    await sleep(1100 + m.text.length * 40);
    if (t !== token) return;
    d.remove();
    const b = document.createElement("div"); b.className = "b " + m.sender;
    b.textContent = m.text; const tm = document.createElement("small"); tm.textContent = m.time; b.appendChild(tm);
    body.appendChild(b); body.scrollTop = body.scrollHeight;
    $("#status").textContent = "online";
    await sleep(600);
  }
  if (t !== token) return;
  $("#chatAfter").style.display = ""; $("#chatNext").classList.remove("hidden");
  $("#s3").scrollTop = 9999;
}

// scrapbook
$("#scrap").innerHTML = scrapbook.map((m, i) => `<div class="card" style="transform:rotate(${[-4, 3, -2, 5, -5, 2][i % 6]}deg)"><span class="tape"></span><img data-i="${m.p}" alt="${m.cap}"><p>${m.cap}</p><span class="stick">${m.s}</span></div>`).join("");
document.querySelectorAll("#scrap img").forEach(i => setPhoto(i, +i.dataset.i));

// randomizer
$("#ask").onclick = () => {
  let i; do { i = Math.floor(Math.random() * questions.length); } while (i === lastQ);
  lastQ = i; const q = $("#qcard"); q.textContent = questions[i];
  q.classList.remove("pop"); void q.offsetWidth; q.classList.add("pop");
  $("#ask").textContent = "another one →";
};

// wish (kept only in this page)
$("#keepWish").onclick = () => {
  if (!$("#wish").value.trim()) { $("#wish").focus(); $("#wish").placeholder = "write a little wish first ♡"; return; }
  $("#wish").disabled = true; $("#keepWish").classList.add("hidden");
  $("#wishReply").classList.remove("hidden"); $("#wishNext").classList.remove("hidden");
};

// birthday message
function typeMessage() {
  $("#msg").innerHTML = '"' + birthdayData.birthdayMessage.split(" ").map((w, i) => `<span style="animation-delay:${i * 0.12}s">${w}</span>`).join(" ") + '"';
}

// wish cards
$("#cards").innerHTML = wishes.map(w => `<button class="wc"><b>${w[0]} — ${w[1]}</b><span hidden>${w[2]}</span></button>`).join("");
document.querySelectorAll(".wc").forEach(c => c.onclick = () => c.querySelector("span").hidden = false);

// envelope
$("#paper").textContent = "";
$("#env").onclick = function () {
  if (this.classList.contains("open")) return;
  this.classList.add("open");
  setTimeout(() => {
    $("#paper").textContent = birthdayData.finalLetter;
    this.classList.add("read");
    $("#letterNext").classList.remove("hidden");
    this.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 1500);
};

// music
const audio = $("#audio"), mb = $("#music");
mb.onclick = () => {
  if (audio.paused) { audio.play().then(() => { mb.textContent = "♪"; mb.classList.remove("off"); }).catch(() => { mb.title = "birthday.mp3 not found"; }); }
  else { audio.pause(); mb.classList.add("off"); mb.textContent = "🔇"; }
};
mb.classList.add("off");

// replay
$("#replay").onclick = () => {
  $("#wish").value = ""; $("#wish").disabled = false; $("#wish").placeholder = "type your wish here...";
  $("#keepWish").classList.remove("hidden"); $("#wishReply").classList.add("hidden"); $("#wishNext").classList.add("hidden");
  $("#qcard").textContent = "?"; $("#ask").textContent = "ask me something ♡"; lastQ = -1;
  document.querySelectorAll(".wc span").forEach(s => s.hidden = true);
  const env = $("#env"); env.classList.remove("open", "read"); $("#paper").textContent = ""; $("#letterNext").classList.add("hidden");
  audio.pause(); audio.currentTime = 0; mb.classList.add("off", "hidden"); mb.textContent = "♪";
  go(1);
};

// floating hearts
$("#floaty").innerHTML = Array.from({ length: 14 }, () => `<span style="left:${Math.random() * 100}%;font-size:${12 + Math.random() * 16}px;animation-duration:${12 + Math.random() * 14}s;animation-delay:${-Math.random() * 20}s">${["♡", "✦", "★"][Math.floor(Math.random() * 3)]}</span>`).join("");
