// js/auth.js

console.log("auth.js loaded");

document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const role = document.getElementById("role").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;
      return db.collection("users").doc(uid).set({
        uid,
        name,
        email,
        role,
        createdAt: new Date()
      });
    })
    .then(() => {
      alert("Registration successful!");
      window.location.href = "index.html"; // or dashboard.html
    })
    .catch((error) => {
      console.error("Firebase error:", error.message);
      alert("Error: " + error.message);
    });
});
