// Инициализация localStorage
let users = JSON.parse(localStorage.getItem('cs-users')) || [];
let posts = JSON.parse(localStorage.getItem('cs-posts')) || [];
let currentUser = localStorage.getItem('cs-currentUser') || null;

// DOM элементы
const authContainer = document.getElementById('auth-container');
const socialContainer = document.getElementById('social-container');
const loginBtn = document.getElementById('login-btn');
const nicknameInput = document.getElementById('nickname');
const postText = document.getElementById('post-text');
const postBtn = document.getElementById('post-btn');
const postList = document.getElementById('post-list');

// Логин / регистрация
loginBtn.addEventListener('click', () => {
  const nick = nicknameInput.value.trim();
  if(!nick) return alert('Введите ник!');
  if(!users.includes(nick)) users.push(nick);
  currentUser = nick;
  localStorage.setItem('cs-users', JSON.stringify(users));
  localStorage.setItem('cs-currentUser', currentUser);
  authContainer.classList.add('hidden');
  socialContainer.classList.remove('hidden');
  renderPosts();
});

// Создание поста
postBtn.addEventListener('click', () => {
  const text = postText.value.trim();
  if(!text) return alert('Введите текст поста!');
  const newPost = { author: currentUser, text, likes: 0, date: new Date().toISOString() };
  posts.unshift(newPost); // свежие сверху
  localStorage.setItem('cs-posts', JSON.stringify(posts));
  postText.value='';
  renderPosts();
});

// Рендер постов
function renderPosts() {
  postList.innerHTML='';
  posts.forEach((post, i) => {
    const card = document.createElement('div');
    card.className='post-card';
    card.innerHTML=`
      <h3>${post.author}</h3>
      <p>${post.text}</p>
      <div class="post-meta">
        <span class="like-btn" data-index="${i}">❤️ ${post.likes}</span>
        • ${new Date(post.date).toLocaleString()}
      </div>
    `;
    postList.appendChild(card);
  });

  // лайки
  document.querySelectorAll('.like-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const idx=btn.dataset.index;
      posts[idx].likes++;
      localStorage.setItem('cs-posts', JSON.stringify(posts));
      renderPosts();
    });
  });
}

// Если уже залогинен
if(currentUser){
  authContainer.classList.add('hidden');
  socialContainer.classList.remove('hidden');
  renderPosts();
}
