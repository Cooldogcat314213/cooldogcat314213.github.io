const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.style.position = "absolute";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = 0;
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Mouse position
const mouse = { x: null, y: null };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Star setup with history for trails
const stars = Array.from({ length: 100 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  size: Math.random() * 2 + 1,
  speed: Math.random() * 0.3 + 0.1, // slowed down
  dx: 0,
  dy: 0,
  history: []
}));

const repulsionRadius = 100;
const repulsionStrength = 3;

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    // Repulsion from mouse
    if (mouse.x !== null && mouse.y !== null) {
      const dx = star.x - mouse.x;
      const dy = star.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < repulsionRadius) {
        const angle = Math.atan2(dy, dx);
        const force = (repulsionRadius - dist) / repulsionRadius * repulsionStrength;
        star.dx += Math.cos(angle) * force;
        star.dy += Math.sin(angle) * force;
      }
    }

    // Move star
    star.y += star.speed + star.dy;
    star.x += star.dx;

    // Friction
    star.dx *= 0.95;
    star.dy *= 0.95;

    // Wrap around
    if (star.y > canvas.height) star.y = 0;
    if (star.x > canvas.width) star.x = 0;
    if (star.x < 0) star.x = canvas.width;

    // Save history for trails
    star.history.push({ x: star.x, y: star.y });
    if (star.history.length > 15) {
      star.history.shift();
    }

    // Draw trail
    if (star.history.length > 1) {
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      for (let i = star.history.length - 1; i >= 0; i--) {
        const pos = star.history[i];
        const alpha = i / star.history.length;
        ctx.strokeStyle = `rgba(0, 100, 255, ${alpha})`;
        ctx.lineTo(pos.x, pos.y);
      }
      ctx.stroke();
    }

    // Draw star itself
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(draw);
}
draw();

// Copy button functionality
const copyBtn = document.getElementById("copy-btn");
const keyText = document.getElementById("key-text");

if (copyBtn && keyText) {
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(keyText.textContent).then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy"), 2000);
    });
  });
}

// Linkvertise check
const allowedReferrers = ["linkvertise.com"];
const ref = document.referrer;

if (!allowedReferrers.some(site => ref.includes(site))) {
  const card = document.querySelector(".card");
  if (card) {
    card.innerHTML = "L why did you try bypass it 😝";
  }
}
