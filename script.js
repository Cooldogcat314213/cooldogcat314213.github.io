// === Canvas background (stars) ===
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.style.position = "absolute";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = 0; // behind card
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

const stars = Array.from({ length: 150 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  size: Math.random() * 2 + 1,
  speed: Math.random() * 0.5 + 0.2,
  dx: 0,
  dy: 0,
}));

const repulsionRadius = 100;
const repulsionStrength = 3;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";

  stars.forEach((star) => {
    if (mouse.x !== null && mouse.y !== null) {
      const dx = star.x - mouse.x;
      const dy = star.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < repulsionRadius) {
        const angle = Math.atan2(dy, dx);
        const force =
          ((repulsionRadius - dist) / repulsionRadius) * repulsionStrength;
        star.dx += Math.cos(angle) * force;
        star.dy += Math.sin(angle) * force;
      }
    }

    star.y += star.speed + star.dy;
    star.x += star.dx;

    star.dx *= 0.95;
    star.dy *= 0.95;

    if (star.y > canvas.height) star.y = 0;
    if (star.x > canvas.width) star.x = 0;
    if (star.x < 0) star.x = canvas.width;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(draw);
}
draw();

// === Secure key reveal ===
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

// === Floating Watermark ===
const watermark = document.createElement("div");
watermark.textContent = "ORIGINAL OWNER - mr_i_want_weapon ON DISCORD";
watermark.style.position = "absolute";
watermark.style.top = "50%";
watermark.style.left = "50%";
watermark.style.transform = "translate(-50%, -50%)";
watermark.style.fontSize = "2rem";
watermark.style.fontWeight = "bold";
watermark.style.color = "rgba(255,255,255,0.25)";
watermark.style.pointerEvents = "none";
watermark.style.zIndex = 10;
document.body.appendChild(watermark);

// Animate floating watermark
let angle = 0;
function animateWatermark() {
  angle += 0.01;
  const x = Math.sin(angle) * 50;
  const y = Math.cos(angle) * 30;
  watermark.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
  requestAnimationFrame(animateWatermark);
}
animateWatermark();
