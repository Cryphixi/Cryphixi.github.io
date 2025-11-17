// Mini Game
(function() {
  let score = 0;
  let time = 0;
  let isPlaying = false;
  let targets = [];
  let gameInterval = null;
  let timeInterval = null;
  let spawnInterval = null;

  function init() {
    const startBtn = document.getElementById('start-game-btn');
    const stopBtn = document.getElementById('stop-game-btn');
    const gameArea = document.getElementById('game-area');

    if (!startBtn || !gameArea) return;

    startBtn.addEventListener('click', startGame);
    if (stopBtn) {
      stopBtn.addEventListener('click', stopGame);
    }

    // Handle target clicks
    gameArea.addEventListener('click', handleTargetClick);
  }

  function startGame() {
    score = 0;
    time = 0;
    isPlaying = true;
    targets = [];

    updateScore();
    updateTime();

    // Show stop button, hide start button
    const startBtn = document.getElementById('start-game-btn');
    const stopBtn = document.getElementById('stop-game-btn');
    if (startBtn) startBtn.style.display = 'none';
    if (stopBtn) stopBtn.style.display = 'block';

    // Start timer
    timeInterval = setInterval(() => {
      time++;
      updateTime();
    }, 1000);

    // Start spawning targets
    spawnTarget();
    spawnInterval = setInterval(() => {
      if (isPlaying) {
        spawnTarget();
      }
    }, 1500);
  }

  function stopGame() {
    isPlaying = false;
    targets = [];
    clearAllIntervals();

    // Show start button, hide stop button
    const startBtn = document.getElementById('start-game-btn');
    const stopBtn = document.getElementById('stop-game-btn');
    if (startBtn) startBtn.style.display = 'block';
    if (stopBtn) stopBtn.style.display = 'none';

    // Clear game area
    const gameArea = document.getElementById('game-area');
    if (gameArea) {
      gameArea.innerHTML = '<div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;"><p style="color: var(--text-secondary); font-size: 1.25rem;">Click "Start Game" to begin!</p></div>';
    }
  }

  function spawnTarget() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea || !isPlaying) return;

    const target = document.createElement('button');
    const id = Date.now() + Math.random();
    target.id = `target-${id}`;
    target.className = 'game-target';
    target.innerHTML = '⭐';
    target.setAttribute('aria-label', 'Target');
    
    const x = Math.random() * 80 + 10; // 10-90%
    const y = Math.random() * 80 + 10;
    
    target.style.position = 'absolute';
    target.style.left = `${x}%`;
    target.style.top = `${y}%`;
    target.style.transform = 'translate(-50%, -50%)';
    target.style.width = '3rem';
    target.style.height = '3rem';
    target.style.fontSize = '1.5rem';
    target.style.background = 'var(--accent)';
    target.style.border = 'none';
    target.style.borderRadius = '50%';
    target.style.cursor = 'pointer';
    target.style.transition = 'transform 0.3s ease';
    target.style.animation = 'float 3s ease-in-out infinite';
    target.dataset.targetId = id.toString();

    gameArea.appendChild(target);
    targets.push({ id, element: target });

    // Remove target after 2 seconds
    setTimeout(() => {
      const targetEl = document.getElementById(`target-${id}`);
      if (targetEl) {
        targetEl.remove();
        targets = targets.filter(t => t.id !== id);
      }
    }, 2000);
  }

  function handleTargetClick(e) {
    if (!isPlaying) return;
    
    const target = e.target.closest('.game-target');
    if (!target) return;

    const targetId = parseFloat(target.dataset.targetId);
    score += 10;
    updateScore();

    // Remove target
    target.remove();
    targets = targets.filter(t => t.id !== targetId);
  }

  function updateScore() {
    const scoreEl = document.getElementById('game-score');
    if (scoreEl) {
      scoreEl.textContent = score;
    }
  }

  function updateTime() {
    const timeEl = document.getElementById('game-time');
    if (timeEl) {
      timeEl.textContent = `${time}s`;
    }
  }

  function clearAllIntervals() {
    if (timeInterval) {
      clearInterval(timeInterval);
      timeInterval = null;
    }
    if (spawnInterval) {
      clearInterval(spawnInterval);
      spawnInterval = null;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

