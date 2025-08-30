// ---------- Linkvertise Referrer Check ----------
(function() {
  const allowedRef = "linkvertise.com";
  const mainContent = document.getElementById("main-content");

  // If referrer is invalid, immediately show warning and do not render card or button
  if (!document.referrer.includes(allowedRef)) {
    if (mainContent) {
      mainContent.innerHTML = `
        <div style="color:white; font-size:1.5rem; text-align:center; padding: 2rem;">
          Please access this page through Linkvertise!
        </div>
      `;
    }
    return; // stop script execution here
  }

  // ---------- Canvas and Stars ----------
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.style.position = "absolute";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.zIndex = 0; // behind the card
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

    stars.forEach(star => {
      if (mouse.x !== null && mouse.y !== null) {
        const dx = star.x - mouse.x;
        const dy = star.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < repulsionRadius) {
          const angle = Math.atan2(dy, dx);
          const force = (repulsionRadius - dist)/repulsionRadius * repulsionStrength;
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
      ctx.arc(star.x, star.y, star.size, 0, Math.PI*2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();

  // ---------- Copy to Clipboard ----------
  const copyBtn = document.getElementById("copy-btn");
  const card = document.querySelector(".card");

  if (copyBtn && card) {
    copyBtn.addEventListener("click", () => {
      const textToCopy = card.textContent.replace("Copy","").trim();
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          copyBtn.textContent = "Copied!";
          setTimeout(() => copyBtn.textContent = "Copy", 1500);
        })
        .catch(() => {
          copyBtn.textContent = "Failed!";
          setTimeout(() => copyBtn.textContent = "Copy", 1500);
        });
    });
  }
})();
