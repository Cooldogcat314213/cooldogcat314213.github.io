// === Background Stars ===
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.style.position = "absolute";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = 0; // behind the card
const ctx = canvas.getContext("2d");

// Resize canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Mouse
const mouse = { x: null, y: null };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Stars
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

  stars.forEach(star => {
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

// === Secure Key System ===
const card = document.getElementById("card");
const secureKey = "!2Vu>_cEaL"; // The key (not in HTML)

// Only show key if came from linkvertise
if (document.referrer.includes("linkvertise.com")) {
  card.innerHTML = `
    ${secureKey}
    <button id="copy-btn">Copy</button>
  `;

  document.getElementById("copy-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(secureKey).then(() => {
      alert("Copied to clipboard!");
    });
  });
} else {
  card.textContent = "L why did you try bypass it 😝";
}
