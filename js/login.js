// js/login.js

console.log("login.js loaded");

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Login successful!");
      window.location.href = "dashboard.html"; // Redirect after login
    })
    .catch((error) => {
      console.error("Login error:", error.message);
      alert("Login failed: " + error.message);
    });
});

// 🔁 Reset Password Function
function resetPassword() {
  const email = prompt("Enter your email to receive a password reset link:");
  if (!email) return;

  auth.sendPasswordResetEmail(email)
    .then(() => {
      alert("Password reset email sent! Please check your inbox.");
    })
    .catch((error) => {
      console.error("Reset password error:", error.message);
      alert("Error: " + error.message);
    });
}
