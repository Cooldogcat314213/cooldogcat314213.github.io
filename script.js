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

const mouse = { x: null, y: null };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

const stars = Array.from({ length: 100 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  size: Math.random() * 2 + 1,
  speed: Math.random() * 0.3 + 0.1,
  dx: 0,
  dy: 0,
  history: []
}));

const repulsionRadius = 100;
const repulsionStrength = 3;

function draw() {
  // Gradient background for premium effect
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(10, 10, 40, 1)"); // dark blue
  gradient.addColorStop(1, "rgba(0,0,0,1)"); // black
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    // Mouse repulsion
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
    star.x += star.dx;
    star.y += star.speed + star.dy;

    // Friction
    star.dx *= 0.95;
    star.dy *= 0.95;

    // Wrap around
    if (star.y > canvas.height) star.y = 0;
    if (star.x > canvas.width) star.x = 0;
    if (star.x < 0) star.x = canvas.width;

    // Trails
    star.history.push({ x: star.x, y: star.y });
    if (star.history.length > 15) star.history.shift();

    if (star.history.length > 1) {
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      for (let i = star.history.length - 1; i >= 0; i--) {
        const pos = star.history[i];
        const alpha = i / star.history.length;
        ctx.strokeStyle = `rgba(0, 100, 255, ${alpha * 0.7})`;
        ctx.lineTo(pos.x, pos.y);
      }
      ctx.stroke();
    }

    // Draw star
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI*2);
    ctx.fill();
  });

  requestAnimationFrame(draw);
}
draw();

// Copy button and key
const card = document.querySelector(".card");
const secureKey = "!2Vu>_cEaL";

if (document.referrer.includes("linkvertise.com")) {
  card.innerHTML = `
    <span id="key-text">${secureKey}</span>
    <button id="copy-btn">Copy</button>
  `;

  document.getElementById("copy-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(secureKey).then(() => {
      const btn = document.getElementById("copy-btn");
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = "Copy"), 1500);
    });
  });
} else {
  card.textContent = "L why did you try bypass it 😝";
}

// Watermark
const watermark = document.getElementById("watermark");
let wmX = window.innerWidth / 2;
let wmY = window.innerHeight / 4;
let vx = 1.2;
let vy = 1;

function moveWatermark() {
  const cardRect = card.getBoundingClientRect();
  const wmRect = watermark.getBoundingClientRect();

  wmX += vx;
  wmY += vy;

  if (wmX < 0 || wmX + wmRect.width > window.innerWidth) vx *= -1;
  if (wmY < 0 || wmY + wmRect.height > window.innerHeight) vy *= -1;

  // Avoid overlapping card
  if (
    wmX < cardRect.right &&
    wmX + wmRect.width > cardRect.left &&
    wmY < cardRect.bottom &&
    wmY + wmRect.height > cardRect.top
  ) {
    vx *= -1;
    vy *= -1;
    wmX += vx * 10;
    wmY += vy * 10;
  }

  watermark.style.left = wmX + "px";
  watermark.style.top = wmY + "px";

  requestAnimationFrame(moveWatermark);
}
moveWatermark();
