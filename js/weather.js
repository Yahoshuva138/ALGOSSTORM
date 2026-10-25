// ========================================================
// ALGOSSTORM — Canvas 2D Autumn Leaves & Storm Physics
// ========================================================

(function() {
  const canvas = document.getElementById('stormCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let mouseX = width / 2;
  let mouseY = height / 2;
  let stormWind = 1.6;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const leafColors = [
    '#e63946', // Crimson red
    '#fb8500', // Maple orange
    '#ffb703', // Amber gold
    '#d90429', // Deep scarlet
    '#ff9f1c', // Bright saffron
    '#9d0208'  // Deep autumn burgundy
  ];

  class Leaf {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * (width + 250) - 100;
      this.y = initial ? Math.random() * height : -40;
      this.size = Math.random() * 14 + 10;
      this.speedY = Math.random() * 1.5 + 1.1;
      this.speedX = Math.random() * 1.2 + 0.4;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
      this.color = leafColors[Math.floor(Math.random() * leafColors.length)];
      this.sway = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.012;
      this.aspect = Math.random() * 0.4 + 0.8;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.sway) * 1.3 + stormWind;
      this.sway += this.swaySpeed;
      this.rotation += this.rotSpeed;

      // Cursor repel force
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.hypot(dx, dy);
      if (dist < 130) {
        const force = (130 - dist) / 130;
        this.x += (dx / (dist || 1)) * force * 5;
        this.y += (dy / (dist || 1)) * force * 5;
      }

      // Reset when off bounds
      if (this.y > height + 60 || this.x > width + 120) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(1, this.aspect);
      ctx.fillStyle = this.color;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 4;

      // Realistic maple leaf contour
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.6, this.size * 0.9, this.size * 0.2, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.9, this.size * 0.2, -this.size * 0.8, -this.size * 0.6, 0, -this.size);
      ctx.fill();

      // Delicate leaf stem
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.7);
      ctx.lineTo(0, this.size * 1.15);
      ctx.stroke();

      ctx.restore();
    }
  }

  const leafCount = Math.min(42, Math.floor(width / 32));
  const leaves = Array.from({ length: leafCount }, () => new Leaf());

  window.triggerLightning = function() {
    const flash = document.getElementById('lightningFlash');
    if (!flash) return;
    
    flash.style.opacity = '0.4';
    if (typeof soundThunder === 'function') {
      soundThunder();
    }

    setTimeout(() => { flash.style.opacity = '0'; }, 65);
    setTimeout(() => { flash.style.opacity = '0.22'; }, 110);
    setTimeout(() => { flash.style.opacity = '0'; }, 175);
  };

  // Occasional natural lightning strikes
  setInterval(() => {
    if (Math.random() < 0.22) {
      window.triggerLightning();
    }
  }, 22000);

  function weatherLoop() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < leaves.length; i++) {
      leaves[i].update();
      leaves[i].draw();
    }
    requestAnimationFrame(weatherLoop);
  }

  weatherLoop();
})();
