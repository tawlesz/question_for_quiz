let answered = false;

function initTheme() {
  const saved = localStorage.getItem('quiz-theme');
  if (saved === 'light') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('quiz-theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('quiz-theme', 'dark');
  }
}

function render() {
  const area = document.getElementById('quizArea');
  const letters = ['A', 'B', 'C', 'D', 'E'];

  area.innerHTML = `
    <div class="card">
      <p class="q-text">${question.text}</p>
      ${question.context ? `<div class="q-context">${question.context}</div>` : ''}
      <div class="options" id="options">
        ${question.options.map((opt, i) => `
          <button class="opt" id="opt-${i}" onclick="choose(${i})">
            <span class="opt-letter">${letters[i]}</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
      <div class="feedback" id="feedback"></div>
      <div id="scoreArea"></div>
    </div>
  `;
  answered = false;
}

function choose(idx) {
  if (answered) return;
  answered = true;

  const opts = document.querySelectorAll('.opt');
  const feedback = document.getElementById('feedback');
  const isCorrect = idx === question.answer;

  opts.forEach((btn, i) => {
    btn.disabled = true;
    if (isCorrect) {
      if (i === question.answer) btn.classList.add('correct');
      else btn.classList.add('dimmed');
    } else {
      if (i === idx) btn.classList.add('wrong');
      else btn.classList.add('dimmed');
    }
  });

  feedback.className = `feedback show ${isCorrect ? 'ok' : 'err'}`;
  if (isCorrect) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    feedback.innerHTML = `
      <strong>Correto!</strong>
      <span>${question.explanation}</span>
      <div class="acertou-cat">
        <img src="img/56ce7a59663a7e71d588bc98045e468c.jpg" alt="acertou">
      </div>
    `;
  } else {
    feedback.innerHTML = `
      <strong>Incorreto</strong>
      ${question.hint ? `<span>${question.hint}</span>` : ''}
      <div class="errou-cat">
        <img src="img/IMG-20260407-WA0016.jpg" alt="errou">
      </div>
    `;
  }

  document.getElementById('scoreArea').innerHTML = `
    <button class="btn-next show" onclick="reset()">Tentar novamente</button>
  `;
}

function reset() {
  render();
}

function updateArticleLink() {
  const articleContainer = document.getElementById('articleLink');
  const slideContainer = document.getElementById('slideLink');
  
  if (question.articleUrl) {
    articleContainer.querySelector('a').href = question.articleUrl;
    articleContainer.style.display = 'inline-block';
  } else {
    articleContainer.style.display = 'none';
  }
  
  if (question.slideUrl) {
    slideContainer.querySelector('a').href = question.slideUrl;
    slideContainer.style.display = 'inline-block';
  } else {
    slideContainer.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  render();
  updateArticleLink();
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});
