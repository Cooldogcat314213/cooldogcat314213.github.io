(function() {
  const allowedRef = "linkvertise.com";
  const mainContent = document.getElementById("main-content");

  // Stop if referrer is invalid
  if (!document.referrer.includes(allowedRef)) {
    if (mainContent) {
      mainContent.innerHTML = `
        <div style="color:white; font-size:1.5rem; text-align:center; padding: 2rem;">
          Please access this page through Linkvertise!
        </div>
      `;
    }
    return;
  }

  // ---------- Canvas and Stars ----------
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

  // ---------- Premium Card ----------
  const secureKey = "!2Vu>_cEaL";
  const obfuscChars = "!@#$%^&*?<>0123456789";

  const card = document.createElement("div");
  card.className = "card";
  card.style.boxShadow = "0 0 20px #00ffff, 0 0 40px #00ffff33, 0 0 60px #00ffff22";
  card.style.transition = "box-shadow 1s ease-in-out";
  mainContent.appendChild(card);

  // Glow effect
  setInterval(() => {
    card.style.boxShadow = card.style.boxShadow.includes("20px") 
      ? "0 0 30px #00ffff, 0 0 50px #00ffff33, 0 0 70px #00ffff22" 
      : "0 0 20px #00ffff, 0 0 40px #00ffff33, 0 0 60px #00ffff22";
  }, 1000);

  // Key span
  const keySpan = document.createElement("span");
  card.appendChild(keySpan);

  // Copy button
  const copyBtn = document.createElement("button");
  copyBtn.id = "copy-btn";
  copyBtn.textContent = "Copy";
  card.appendChild(copyBtn);

  // Copy functionality
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(secureKey)
      .then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => copyBtn.textContent = "Copy", 1500);
      })
      .catch(() => {
        copyBtn.textContent = "Failed!";
        setTimeout(() => copyBtn.textContent = "Copy", 1500);
      });
  });

  // Locked/unlocked key reveal
  let revealIndex = 0;
  function typeEffect() {
    if (revealIndex < secureKey.length) {
      let displayKey = "";
      for (let i = 0; i <= revealIndex; i++) {
        displayKey += i === revealIndex 
          ? obfuscChars.charAt(Math.floor(Math.random() * obfuscChars.length)) 
          : secureKey[i];
      }
      keySpan.textContent = displayKey;
      revealIndex++;
      setTimeout(typeEffect, 100);
    } else {
      keySpan.textContent = secureKey;
    }
  }
  typeEffect();

})();
