const BIN_ID = "69c45f3dc3097a1dd55dc851";
const API_KEY = "$2a$10$o/pvgriM7eo1YnqkhuYdxOSndDugkOqYkDcC12nC4/tuSjW0gvDhW";

// ===== STATE =====
let db = { users: [], posts: [] };
let currentUser = JSON.parse(localStorage.getItem("taktak-user"));

// антиспам
let timers = {
  post: 0,
  like: 0,
  comment: 0
};

// ===== UI =====
const auth = document.getElementById("auth");
const mainUI = document.getElementById("mainUI");

// ===== INIT =====
if(currentUser){
  auth.classList.add("hidden");
  mainUI.classList.remove("hidden");
  loadDB();
}

// ===== LOAD DB =====
async function loadDB(){
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    headers: { "X-Master-Key": API_KEY }
  });

  const data = await res.json();
  db = data.record;

  render();
}

// ===== SAVE DB =====
async function saveDB(){
  await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method:"PUT",
    headers:{
      "Content-Type":"application/json",
      "X-Master-Key": API_KEY
    },
    body: JSON.stringify(db)
  });
}

// ===== AUTH =====
document.getElementById("login").onclick = () => {
  const nick = document.getElementById("nickname").value.trim();
  if(!nick) return alert("Введите ник");

  let user = db.users.find(u => u.nick === nick);

  if(!user){
    user = {
      id: Date.now(),
      nick,
      bio: "Новичок TakTak"
    };
    db.users.push(user);
    saveDB();
  }

  localStorage.setItem("taktak-user", JSON.stringify(user));
  location.reload();
};

// ===== CREATE POST =====
document.getElementById("postBtn").onclick = async () => {
  const now = Date.now();

  if(now - timers.post < 5000){
    return alert("Медленнее 😡");
  }

  const text = document.getElementById("postInput").value.trim();
  if(!text) return;

  timers.post = now;

  db.posts.unshift({
    id: Date.now(),
    author: currentUser.nick,
    text,
    likes: 0,
    comments: [],
    date: now
  });

  render();
  document.getElementById("postInput").value = "";

  saveDB();
};

// ===== RENDER =====
function render(){
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  db.posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "card post";

    div.innerHTML = `
      <b>${post.author}</b>
      <p>${post.text}</p>

      <div class="meta">
        <span class="like" data-id="${post.id}">❤️ ${post.likes}</span>
        • ${new Date(post.date).toLocaleString()}
      </div>

      <div class="comments">
        ${post.comments.map(c => `
          <div class="comment">
            <b>${c.author}</b>: ${c.text}
          </div>
        `).join("")}
      </div>

      <input class="comment-input" placeholder="Комментарий..." data-id="${post.id}">
    `;

    postsDiv.appendChild(div);
  });

  // ===== ЛАЙК =====
  document.querySelectorAll(".like").forEach(el=>{
    el.onclick = ()=>{
      const now = Date.now();

      if(now - timers.like < 1000) return;
      timers.like = now;

      const id = Number(el.dataset.id);
      const post = db.posts.find(p=>p.id===id);

      const liked = JSON.parse(localStorage.getItem("liked")||"[]");

      if(liked.includes(id)) return;

      liked.push(id);
      localStorage.setItem("liked", JSON.stringify(liked));

      post.likes++;
      render();
      saveDB();
    };
  });

  // ===== КОММЕНТ =====
  document.querySelectorAll(".comment-input").forEach(input=>{
    input.addEventListener("keydown", e=>{
      if(e.key === "Enter"){
        const now = Date.now();

        if(now - timers.comment < 2000){
          return alert("Не спамь комментариями");
        }

        const text = input.value.trim();
        if(!text) return;

        timers.comment = now;

        const id = Number(input.dataset.id);
        const post = db.posts.find(p=>p.id===id);

        post.comments.push({
          author: currentUser.nick,
          text
        });

        input.value = "";

        render();
        saveDB();
      }
    });
  });
}

// ===== ВАЙП (АДМИН) =====
window.wipe = async function(){
  if(prompt("Введи пароль") !== "admin123") return;

  db = { users: [], posts: [] };
  await saveDB();
  location.reload();
};
