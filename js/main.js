fetch('data/posts.json')
.then(res => res.json())
.then(posts => {
  const list = document.getElementById('post-list');
  posts.sort((a,b)=>new Date(b.date)-new Date(a.date));
  posts.forEach(post => {
    const card = document.createElement('div');
    card.className='post-card';
    card.innerHTML=`
      <h3>${post.author}</h3>
      <p>${post.text}</p>
      <div class="post-meta">❤️ <span class="likes">${post.likes}</span> • ${new Date(post.date).toLocaleDateString()}</div>
    `;
    card.querySelector('.likes').addEventListener('click',()=>{ post.likes++; card.querySelector('.likes').textContent=post.likes; });
    list.appendChild(card);
  });
});
