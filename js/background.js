// Background Effect with Mouse Interaction and Stars
(function() {
  let canvas, ctx;
  let mouse = { x: 0, y: 0 };
  let stars = [];
  let animationId;

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
      Math.max(canvas.width, canvas.height) * 0.8
    );

    const bgColor = getCSSVariable('--bg-primary');
    const accentColor = getCSSVariable('--accent');

    gradient.addColorStop(0, `${accentColor}15`);
    gradient.addColorStop(0.5, `${accentColor}08`);
    gradient.addColorStop(1, `${bgColor}00`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw and animate stars
    ctx.fillStyle = accentColor;
    stars.forEach(star => {
      star.x += star.vx;
      star.y += star.vy;

      // Wrap around edges
      if (star.x < 0) star.x = canvas.width;
      if (star.x > canvas.width) star.x = 0;
      if (star.y < 0) star.y = canvas.height;
      if (star.y > canvas.height) star.y = 0;

      // Draw star glow
      const glowGradient = ctx.createRadialGradient(
        star.x,
        star.y,
        0,
        star.x,
        star.y,
        star.radius * 3
      );
      glowGradient.addColorStop(0, `${accentColor}40`);
      glowGradient.addColorStop(1, `${accentColor}00`);
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw star
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
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

