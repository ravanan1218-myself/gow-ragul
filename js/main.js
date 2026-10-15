document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  const friendshipStartDate = '2025-06-04';
  const daysCount = document.getElementById('daysCount');
  if (friendshipStartDate) {
    const start = new Date(friendshipStartDate + 'T00:00:00');
    const today = new Date();
    const days = Math.max(0, Math.floor((today - start) / 86400000));
    daysCount.textContent = days.toLocaleString();
  } else {
    daysCount.textContent = '∞';
  }

  // Smooth reveal on scroll.
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Gallery category filters.
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.memory-card-wrap').forEach(card => {
        card.classList.toggle('d-none', filter !== 'all' && card.dataset.category !== filter);
      });
    });
  });

  // Click-to-expand photo gallery.
  const photoModalEl = document.getElementById('photoModal');
  const photoModal = bootstrap.Modal.getOrCreateInstance(photoModalEl);
  document.querySelectorAll('.memory-card').forEach(card => {
    card.addEventListener('click', () => {
      document.getElementById('modalImage').src = card.dataset.full;
      document.getElementById('modalCaption').textContent = card.dataset.caption;
      photoModal.show();
    });
  });

  // Friendship quiz.
  const questions = [
    { q: 'Where did our friendship begin?', options: ['At a shopping mall', 'On the college-to-home bus', 'At a birthday party', 'In an online game'], answer: 1, why: 'Correct! The legendary ID-card incident happened on the bus. 😂' },
    { q: 'What did Ragul mischievously take?', options: ['Gowtham’s phone', 'His lunch', 'His ID card', 'His cricket bat'], answer: 2, why: 'The ID card — the funniest beginning to this friendship! 🚌' },
    { q: 'What did we do during our college-to-home journeys?', options: ['Never spoke', 'Teased and joked with each other', 'Only studied', 'Slept the whole way'], answer: 1, why: 'Exactly! The travel time became full of jokes and teasing. 😎' },
    { q: 'What did we exchange to start talking regularly?', options: ['Books', 'Phone numbers', 'Shoes', 'Game accounts'], answer: 1, why: 'Phone numbers — and then came our never-ending conversations. 📱' },
    { q: 'What is Gowtham’s favourite colour?', options: ['Red', 'Green', 'Blue', 'Black'], answer: 2, why: 'Blue for Gowtham! 💙' },
    { q: 'What is Ragul’s favourite colour?', options: ['Red', 'Blue', 'Yellow', 'White'], answer: 0, why: 'Red for Ragul! ❤️ Different colours, same bond.' },
    { q: 'What is Gowtham’s favourite game?', options: ['Football', 'Cricket', 'Basketball', 'Chess'], answer: 1, why: 'Cricket is his favourite! 🏏' },
    { q: 'What does Gowtham enjoy doing with his friends?', options: ['Going to cricket matches', 'Collecting stamps', 'Going fishing every day', 'Watching cooking shows'], answer: 0, why: 'Cricket matches with friends — a perfect hobby for a cricket fan! 🏏' },
    { q: 'What happens if we don’t have our daily conversation?', options: ['The day feels unfinished', 'We forget each other', 'Nothing matters', 'We stop being friends'], answer: 0, why: 'Our daily conversations are part of our routine. A day feels incomplete without them. 🫂' },
    { q: 'What dream is Gowtham working hard towards?', options: ['Becoming a movie star', 'Getting a government job', 'Opening a game shop', 'Becoming a singer'], answer: 1, why: 'He is preparing for a government examination. We are praying for his success! 🙏💙' },
    { q: 'What is Gowtham to Ragul?', options: ['Just a classmate', 'A random contact', 'My best friend, my person, my family', 'A bus conductor'], answer: 2, why: 'Always more than a friend — family by choice. 🖤' },
    { q: 'What is the most important part of our story?', options: ['The missing ID card only', 'The bus route', 'The friendship we built after it', 'The phone model'], answer: 2, why: 'The ID card started the conversation, but our bond made the story special. ❤️' }
  ];
  let currentQuestion = 0, score = 0, answered = false;
  const questionText = document.getElementById('questionText');
  const answers = document.getElementById('answers');
  const nextBtn = document.getElementById('nextQuestion');
  const feedback = document.getElementById('quizFeedback');
  const progress = document.getElementById('quizProgress');
  const progressText = document.getElementById('quizProgressText');
  const scoreText = document.getElementById('quizScoreText');
  function renderQuestion() {
    answered = false;
    const item = questions[currentQuestion];
    progressText.textContent = `QUESTION ${currentQuestion + 1} OF ${questions.length}`;
    scoreText.textContent = `Score: ${score}`;
    progress.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    questionText.textContent = item.q;
    answers.innerHTML = '';
    feedback.textContent = '';
    nextBtn.disabled = true;
    nextBtn.textContent = currentQuestion === questions.length - 1 ? 'See my result ✨' : 'Next question →';
    item.options.forEach((option, i) => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.textContent = `${String.fromCharCode(65 + i)}. ${option}`;
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const correct = i === item.answer;
        if (correct) score++;
        [...answers.children].forEach((b, index) => {
          b.disabled = true;
          if (index === item.answer) b.classList.add('correct');
          else if (index === i) b.classList.add('wrong');
        });
        feedback.textContent = correct ? item.why : `Not quite! ${item.why}`;
        feedback.style.color = correct ? '#86edbd' : '#f4a3bb';
        scoreText.textContent = `Score: ${score}`;
        nextBtn.disabled = false;
      });
      answers.appendChild(btn);
    });
  }
  renderQuestion();
  nextBtn.addEventListener('click', () => {
    if (!answered) return;
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      renderQuestion();
    } else {
      questionText.textContent = score === questions.length ? 'Perfect bestie score! 🏆💙' : score >= Math.ceil(questions.length * 0.6) ? 'You know our story pretty well! 🫂' : 'More memories and fun facts to learn! 🖤';
      answers.innerHTML = `<div class="result-card"><div style="font-size:3rem">🖤</div><h3>${score} / ${questions.length}</h3><p>${score === questions.length ? 'Officially the CEO of our friendship.' : 'The best part is that our story is still being written.'}</p><button class="btn btn-ghost" id="restartQuiz">Play again ↻</button></div>`;
      feedback.textContent = 'This friendship is a lifetime thing.';
      nextBtn.disabled = true;
      nextBtn.textContent = 'Quiz completed ✓';
      document.getElementById('restartQuiz').addEventListener('click', () => {
        currentQuestion = 0; score = 0; renderQuestion();
      });
      if (score >= 3) celebrate();
    }
  });

  // Open the personal letter.
  document.getElementById('openLetter').addEventListener('click', e => {
    const letter = document.getElementById('letterContent');
    letter.hidden = !letter.hidden;
    e.currentTarget.textContent = letter.hidden ? 'Open your letter 💌' : 'Close your letter ✉';
    if (!letter.hidden) letter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Toast message.
  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // Canvas confetti celebration, no extra library needed.
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [], animationFrame = null;
  function resizeCanvas() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  function celebrate() {
    const colors = ['#bba4ff', '#f17ac8', '#ffffff', '#79e6d0', '#f9d77e'];
    for (let i = 0; i < 150; i++) {
      particles.push({ x: window.innerWidth / 2, y: window.innerHeight * 0.48, vx: (Math.random() - .5) * 12, vy: (Math.random() - .8) * 12, size: Math.random() * 6 + 3, color: colors[Math.floor(Math.random() * colors.length)], life: 90 + Math.random() * 45, rotation: Math.random() * 6, spin: (Math.random() - .5) * .2 });
    }
    if (!animationFrame) animateConfetti();
    showToast('To more memories, more madness, and always us! 🫂🖤');
  }
  function animateConfetti() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += .13; p.vx *= .992; p.life--; p.rotation += p.spin;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation); ctx.fillStyle = p.color; ctx.globalAlpha = Math.min(1, p.life / 30); ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .65); ctx.restore();
    });
    if (particles.length) animationFrame = requestAnimationFrame(animateConfetti);
    else { cancelAnimationFrame(animationFrame); animationFrame = null; ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
  }
  document.getElementById('celebrateBtn').addEventListener('click', celebrate);

  // Optional gentle synthesized friendship melody. Starts only after a user click.
  let audioContext = null, soundOn = false, melodyTimer = null, melodyStep = 0;
  const soundToggle = document.getElementById('soundToggle');
  const melodyNotes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880.00, 698.46, 523.25, 659.25, 783.99, 1046.50];
  function playMelodyNote() {
    if (!audioContext || !soundOn) return;
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const volume = audioContext.createGain();
    osc.type = 'sine'; osc.frequency.value = melodyNotes[melodyStep % melodyNotes.length];
    volume.gain.setValueAtTime(0.0001, now); volume.gain.exponentialRampToValueAtTime(0.045, now + 0.035);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
    osc.connect(volume); volume.connect(audioContext.destination); osc.start(now); osc.stop(now + 0.34);
    melodyStep++;
  }
  soundToggle.addEventListener('click', async () => {
    if (!soundOn) {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') await audioContext.resume();
        soundOn = true; melodyStep = 0; playMelodyNote();
        melodyTimer = window.setInterval(playMelodyNote, 360);
        soundToggle.innerHTML = '♫ <span>Sound on</span>';
        showToast('Friendship melody is playing. ♫');
      } catch (e) { showToast('Audio is not supported in this browser.'); }
    } else {
      soundOn = false; if (melodyTimer) window.clearInterval(melodyTimer); melodyTimer = null;
      if (audioContext) audioContext.close(); audioContext = null;
      soundToggle.innerHTML = '♫ <span>Sound off</span>'; showToast('Melody turned off.');
    }
  });

  // Mobile menu closes after selecting a section.
  document.querySelectorAll('.navbar .nav-link').forEach(link => link.addEventListener('click', () => {
    const nav = document.getElementById('nav');
    if (nav.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(nav).hide();
  }));
});
