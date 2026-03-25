const BIN_ID = "69c45d0cb7ec241ddca2e1e2";
const API_KEY = "$2a$10$o/pvgriM7eo1YnqkhuYdxOSndDugkOqYkDcC12nC4/tuSjW0gvDhW";

let currentUser = localStorage.getItem("user");

// UI
const auth = document.getElementById("auth");
const mainUI = document.getElementById("mainUI");
const loginBtn = document.getElementById("login");

if(currentUser){
  auth.classList.add("hidden");
  mainUI.classList.remove("hidden");
  loadAndRender();
}

// Логин
loginBtn.onclick = () => {
  const nick = document.getElementById("nickname").value.trim();
  if(!nick) return alert("Введите ник");
  localStorage.setItem("user", nick);
  location.reload();
};

// Получение постов
async function loadPosts(){
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    headers: { "X-Master-Key": API_KEY }
  });

  const data = await res.json();
  return data.record.posts;
}

// Сохранение
async function savePosts(posts){
  await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method:"PUT",
    headers:{
      "Content-Type":"application/json",
      "X-Master-Key": API_KEY
    },
    body: JSON.stringify({ posts })
  });
}

// Создание поста
document.getElementById("postBtn").onclick = async () => {
  const text = document.getElementById("postInput").value.trim();
  if(!text) return;

  let posts = await loadPosts();

  posts.unshift({
    author: currentUser,
    text,
    date: Date.now(),
    likes: 0
  });

  await savePosts(posts);

  document.getElementById("postInput").value = "";
  loadAndRender();
};

// Рендер
async function loadAndRender(){
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "Загрузка...";

  let posts = await loadPosts();

  postsDiv.innerHTML = "";

  posts.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "card post";

    div.innerHTML = `
      <b>${p.author}</b>
      <p>${p.text}</p>
      <div class="meta">
        ❤️ <span data-i="${i}" class="like">${p.likes}</span>
        • ${new Date(p.date).toLocaleString()}
      </div>
    `;

    postsDiv.appendChild(div);
  });

  // лайки
  document.querySelectorAll(".like").forEach(el => {
    el.onclick = async () => {
      let posts = await loadPosts();
      const i = el.dataset.i;
      posts[i].likes++;

      await savePosts(posts);
      loadAndRender();
    };
  });
}
