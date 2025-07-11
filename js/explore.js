firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const listContainer = document.getElementById("startupList");

  try {
    const snapshot = await db.collection("startups").orderBy("updatedAt", "desc").get();

    if (snapshot.empty) {
      listContainer.innerHTML = "<p>No startups found.</p>";
      return;
    }

    snapshot.forEach(doc => {
      const s = doc.data();
      const startupId = doc.id;

      const card = document.createElement("div");
      card.className = "startup-card";
      card.innerHTML = `
        <h3>${s.name}</h3>
        <p>${s.description}</p>
        <p><strong>Funding Goal:</strong> $${s.goal.toLocaleString()}</p>
        <div class="buttons">
          <button onclick="bookmark('${startupId}')">🔖 Save</button>
          <button onclick="contact('${startupId}')">📩 Contact Business</button>
        </div>
      `;

      listContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading startups:", err);
    listContainer.innerHTML = "<p>Error loading data.</p>";
  }
});

async function bookmark(startupId) {
  const user = firebase.auth().currentUser;
  if (!user) return;

  try {
    await db.collection("bookmarks").add({
      userId: user.uid,
      startupId,
      timestamp: new Date()
    });
    alert("Startup bookmarked!");
  } catch (e) {
    alert("Failed to bookmark.");
    console.error(e);
  }
}

function contact(startupId) {
  window.location.href = `profile.html?startup=${startupId}`;
}
function toggleLeftMenu() {
  document.getElementById('leftPanel').classList.toggle('open');
}
