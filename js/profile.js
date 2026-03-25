const form=document.getElementById('post-form');
form.addEventListener('submit',e=>{
  e.preventDefault();
  const author=document.getElementById('author').value.trim();
  const text=document.getElementById('text').value.trim();
  if(!author||!text){ alert('Заполните все поля!'); return; }
  const newPost={author,text,likes:0,date:new Date().toISOString()};
  console.log('Новый пост:',newPost);
  alert('Пост готов! Добавление работает через редактирование posts.json или localStorage.');
  form.reset();
});
