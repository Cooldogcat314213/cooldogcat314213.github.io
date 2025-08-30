const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.style.position = "absolute";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = 0;
const ctx = canvas.getContext("2d");

// Resize canvas
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
  // Draw semi-transparent black to create trails
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  stars.forEach(star => {
    // Repel stars from mouse
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

    // Update position
    star.y += star.speed + star.dy;
    star.x += star.dx;

    // Friction
    star.dx *= 0.95;
    star.dy *= 0.95;

    // Wrap around
    if (star.y > canvas.height) star.y = 0;
    if (star.x > canvas.width) star.x = 0;
    if (star.x < 0) star.x = canvas.width;

    // Draw star
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

draw();
