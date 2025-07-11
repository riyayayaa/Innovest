firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) return (window.location.href = "login.html");

  const uid = user.uid;
  const doc = await db.collection("users").doc(uid).get();
  const data = doc.data();

  document.getElementById("userName").textContent = data.name;
  document.getElementById("userRole").textContent = data.role;
  document.getElementById("dashboardGreeting").textContent = `Welcome back, ${data.name}!`;

  document.getElementById("editName").value = data.name;
  document.getElementById("editEmail").value = user.email;
  document.getElementById("editRole").value = data.role;

  renderRoleInputs(data.role, uid);
});

async function saveProfile() {
  const name = document.getElementById("editName").value.trim();
  const user = firebase.auth().currentUser;
  if (!user) return;

  try {
    await db.collection("users").doc(user.uid).update({ name });
    alert("Profile updated!");
  } catch (err) {
    console.error("Error updating profile:", err);
  }
}

function renderRoleInputs(role, uid) {
  const container = document.getElementById("roleSection");
  container.innerHTML = "";

  if (role === "entrepreneur") {
    container.innerHTML = `
      <h3>🚀 My Startups</h3>

      <div id="startupList"></div>

      <div id="startupForms">
        <form class="startupForm">
          <input type="text" class="startupName" placeholder="Startup Name" required />
          <textarea class="startupDesc" placeholder="Brief Description" required></textarea>
          <input type="number" class="startupGoal" placeholder="Funding Goal (₹)" required />
          <button type="button" onclick="saveStartup(this)">💾 Save Startup</button>
        </form>
      </div>

      <button type="button" onclick="addStartupForm()">➕ Add Another Startup</button>
    `;

    const startupList = document.getElementById("startupList");

    // Load existing startups
    db.collection("users").doc(uid).collection("startups")
      .orderBy("updatedAt", "desc")
      .onSnapshot(snapshot => {
        startupList.innerHTML = "";
        snapshot.forEach(doc => {
          const s = doc.data();
          const card = document.createElement("div");
          card.className = "startup-card";
          card.innerHTML = `
            <h4>${s.name}</h4>
            <p>${s.description}</p>
            <p><strong>Funding Goal:</strong> ₹${s.goal}</p>
          `;
          startupList.appendChild(card);
        });
      });
  } else if (role === "investor") {
    container.innerHTML = `
      <h3>💰 Investment Preferences</h3>
      <input type="text" id="sectorInterest" placeholder="Interested Sectors (comma separated)">
      <input type="number" id="investmentCap" placeholder="Max Investment Capacity (₹)">
      <button onclick="saveInvestor('${uid}')">Save Investment Profile</button>
    `;
  } else if (role === "advisor") {
    container.innerHTML = `
      <h3>📊 Advisor Info</h3>
      <input type="text" id="advisorExpertise" placeholder="Expertise Area">
      <input type="text" id="availability" placeholder="Availability (e.g., Weekends)">
      <button onclick="saveAdvisor('${uid}')">Save Advisor Profile</button>
    `;
  }
}

function addStartupForm() {
  const startupForms = document.getElementById("startupForms");
  const form = document.createElement("form");
  form.className = "startupForm";
  form.innerHTML = `
    <input type="text" class="startupName" placeholder="Startup Name" required />
    <textarea class="startupDesc" placeholder="Brief Description" required></textarea>
    <input type="number" class="startupGoal" placeholder="Funding Goal (₹)" required />
    <button type="button" onclick="saveStartup(this)">💾 Save Startup</button>
  `;
  startupForms.appendChild(form);
}

async function saveStartup(button) {
  const form = button.closest("form");
  const name = form.querySelector(".startupName").value;
  const description = form.querySelector(".startupDesc").value;
  const goal = parseFloat(form.querySelector(".startupGoal").value);

  const user = firebase.auth().currentUser;
  if (!user || !name || !description || isNaN(goal)) return alert("Fill all fields correctly.");

  try {
    await db.collection("users").doc(user.uid).collection("startups").add({
      name,
      description,
      goal,
      owner: user.uid,
      updatedAt: new Date()
    });
    alert("Startup saved!");
    form.reset();
  } catch (err) {
    console.error(err);
    alert("Failed to save startup.");
  }
}

async function saveInvestor(uid) {
  const sectors = document.getElementById("sectorInterest").value.split(",");
  const cap = parseFloat(document.getElementById("investmentCap").value);

  try {
    await db.collection("investors").doc(uid).set({
      sectors,
      cap,
      uid,
      updatedAt: new Date()
    });
    alert("Investor profile saved.");
  } catch (err) {
    console.error(err);
    alert("Failed to save investor data.");
  }
}

async function saveAdvisor(uid) {
  const expertise = document.getElementById("advisorExpertise").value.trim();
  const availability = document.getElementById("availability").value.trim();

  try {
    await db.collection("advisors").doc(uid).set({
      expertise,
      availability,
      uid,
      updatedAt: new Date()
    });
    alert("Advisor profile saved.");
  } catch (err) {
    console.error(err);
    alert("Failed to save advisor data.");
  }
}

function logout() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}
