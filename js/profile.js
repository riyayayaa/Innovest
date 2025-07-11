// js/profile.js
const params = new URLSearchParams(window.location.search);
const startupId = params.get("startup");

if (!startupId) {
  document.body.innerHTML = "<h2>Invalid startup ID.</h2>";
}

firebase.auth().onAuthStateChanged(async (user) => {
  try {
    const startupDoc = await db.collection("startups").doc(startupId).get();
    if (!startupDoc.exists) {
      document.body.innerHTML = "<h2>Startup not found.</h2>";
      return;
    }

    const s = startupDoc.data();
    document.getElementById("startupName").innerText = s.name;
    document.getElementById("startupDesc").innerText = s.description;

    const ownerDoc = await db.collection("users").doc(s.owner).get();
    const founder = ownerDoc.data();

    document.getElementById("founderName").innerText = founder.name;
    document.getElementById("founderEmail").innerText = founder.email;
  } catch (err) {
    console.error("Error loading profile:", err);
    document.body.innerHTML = "<h2>Error loading profile.</h2>";
  }
});
