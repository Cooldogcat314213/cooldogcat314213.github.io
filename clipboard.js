const copyBtn = document.getElementById("copy-btn");
const card = document.querySelector(".card");

copyBtn.addEventListener("click", () => {
  const textToCopy = card.textContent;
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
