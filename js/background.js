// Background Effect with Mouse Interaction and Stars
(function() {
  let canvas, ctx;
  let mouse = { x: 0, y: 0 };
  let stars = [];
  let shootingStars = [];
  let animationId;
  let lastShootingStarTime = 0;

  function init() {
    canvas = document.getElementById('background-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resizeCanvas();

    // Create stars
    createStars();

    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    // Start animation
    animate();
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars(); // Recreate stars on resize
  }

  function createStars() {
    const numStars = 50;
    stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * (canvas?.width || window.innerWidth),
        y: Math.random() * (canvas?.height || window.innerHeight),
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }
  }

  function handleMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  function getCSSVariable(name) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  function createShootingStar() {
    // Random side to start from (0 = top, 1 = right, 2 = bottom, 3 = left)
    const side = Math.floor(Math.random() * 4);
    let x, y, vx, vy;
    
    switch(side) {
      case 0: // Top
        x = Math.random() * canvas.width;
        y = -10;
        vx = (Math.random() - 0.5) * 2;
        vy = Math.random() * 3 + 2;
        break;
      case 1: // Right
        x = canvas.width + 10;
        y = Math.random() * canvas.height;
        vx = -(Math.random() * 3 + 2);
        vy = (Math.random() - 0.5) * 2;
        break;
      case 2: // Bottom
        x = Math.random() * canvas.width;
        y = canvas.height + 10;
        vx = (Math.random() - 0.5) * 2;
        vy = -(Math.random() * 3 + 2);
        break;
      case 3: // Left
        x = -10;
        y = Math.random() * canvas.height;
        vx = Math.random() * 3 + 2;
        vy = (Math.random() - 0.5) * 2;
        break;
    }
    
    shootingStars.push({
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      life: 1.0,
      decay: Math.random() * 0.02 + 0.01,
      trail: []
    });
  }

  function animate() {
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw gradient background that follows mouse
    const gradient = ctx.createRadialGradient(
      mouse.x,
      mouse.y,
      0,
      mouse.x,
      mouse.y,
      Math.max(canvas.width, canvas.height) * 0.4
    );

    const bgColor = getCSSVariable('--bg-primary');
    const accentColor = getCSSVariable('--accent');

    // Brighter and smoother gradient with more color stops for seamless blending
    gradient.addColorStop(0, `${accentColor}40`);      // 25% opacity at center
    gradient.addColorStop(0.2, `${accentColor}30`);    // 19% opacity
    gradient.addColorStop(0.4, `${accentColor}20`);     // 12.5% opacity
    gradient.addColorStop(0.6, `${accentColor}10`);     // 6% opacity
    gradient.addColorStop(0.8, `${accentColor}05`);     // 2% opacity
    gradient.addColorStop(1, `${bgColor}00`);           // Fully transparent

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw and animate regular stars (white)
    const starColor = '#ffffff';
    stars.forEach(star => {
      star.x += star.vx;
      star.y += star.vy;

      // Wrap around edges
      if (star.x < 0) star.x = canvas.width;
      if (star.x > canvas.width) star.x = 0;
      if (star.y < 0) star.y = canvas.height;
      if (star.y > canvas.height) star.y = 0;

      // Draw star glow (subtle white glow)
      const glowGradient = ctx.createRadialGradient(
        star.x,
        star.y,
        0,
        star.x,
        star.y,
        star.radius * 3
      );
      glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw star (stark white)
      ctx.fillStyle = starColor;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Create new shooting star occasionally (every 2-5 seconds)
    const currentTime = Date.now();
    if (currentTime - lastShootingStarTime > (Math.random() * 3000 + 2000)) {
      createShootingStar();
      lastShootingStarTime = currentTime;
    }

    // Draw and animate shooting stars
    shootingStars = shootingStars.filter(shootingStar => {
      shootingStar.x += shootingStar.vx;
      shootingStar.y += shootingStar.vy;
      shootingStar.life -= shootingStar.decay;
      
      // Store trail points
      shootingStar.trail.push({ x: shootingStar.x, y: shootingStar.y });
      if (shootingStar.trail.length > 20) {
        shootingStar.trail.shift();
      }

      // Draw trail
      if (shootingStar.trail.length > 1) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${shootingStar.life})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(shootingStar.trail[0].x, shootingStar.trail[0].y);
        for (let i = 1; i < shootingStar.trail.length; i++) {
          ctx.lineTo(shootingStar.trail[i].x, shootingStar.trail[i].y);
        }
        ctx.stroke();
      }

      // Draw shooting star head (bright white)
      ctx.fillStyle = `rgba(255, 255, 255, ${shootingStar.life})`;
      ctx.beginPath();
      ctx.arc(shootingStar.x, shootingStar.y, 2, 0, Math.PI * 2);
      ctx.fill();

      // Remove if off screen or life is depleted
      const isOffScreen = shootingStar.x < -50 || shootingStar.x > canvas.width + 50 ||
                         shootingStar.y < -50 || shootingStar.y > canvas.height + 50;
      
      return shootingStar.life > 0 && !isOffScreen;
    });

    animationId = requestAnimationFrame(animate);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Cleanup
  window.addEventListener('beforeunload', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
})();

