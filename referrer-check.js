// Check if the user came from Linkvertise
const allowedRef = "linkvertise.com";

if (!document.referrer.includes(allowedRef)) {
  // Hide the content
  const content = document.getElementById("main-content");
  if (content) {
    content.innerHTML = `
      <div style="color:white; font-size:1.5rem; text-align:center; padding: 2rem;">
        Please access this page through Linkvertise!
      </div>
    `;
  }
}
