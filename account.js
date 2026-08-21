const registerTab = document.getElementById("registerTab");
const loginTab = document.getElementById("loginTab");
const registerPanel = document.getElementById("registerPanel");
const loginPanel = document.getElementById("loginPanel");

function showAccountPanel(panelName) {
    const registerActive = panelName === "register";
    registerTab.classList.toggle("active", registerActive);
    loginTab.classList.toggle("active", !registerActive);
    registerTab.setAttribute("aria-selected", String(registerActive));
    loginTab.setAttribute("aria-selected", String(!registerActive));
    registerPanel.hidden = !registerActive;
    loginPanel.hidden = registerActive;
}

registerTab.addEventListener("click", () => showAccountPanel("register"));
loginTab.addEventListener("click", () => showAccountPanel("login"));

document.querySelectorAll(".password-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
        const input = document.getElementById(toggle.dataset.target);
        const showing = input.type === "text";
        input.type = showing ? "password" : "text";
        toggle.setAttribute("aria-label", showing ? "Show password" : "Hide password");
        toggle.innerHTML = `<i class="fas fa-eye${showing ? "" : "-slash"}"></i>`;
    });
});

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const registerStatus = document.getElementById("registerStatus");
const loginStatus = document.getElementById("loginStatus");

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;
    submitAccountRequest("/api/register", { name, email, password }, registerStatus, (user) => {
        registerStatus.textContent = `Welcome, ${user.name}. Your account has been created.`;
        registerStatus.className = "account-status success";
        registerForm.reset();
    });
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    submitAccountRequest("/api/login", { email, password }, loginStatus, (user) => {
        loginStatus.textContent = `Welcome back, ${user.name}. You are logged in.`;
        loginStatus.className = "account-status success";
        loginForm.reset();
    });
});

async function submitAccountRequest(endpoint, payload, statusElement, onSuccess) {
    statusElement.textContent = "";
    statusElement.className = "account-status";
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "The request could not be completed.");
        onSuccess(result.user);
    } catch (error) {
        statusElement.textContent = error.message === "Failed to fetch" ? "The account service is unavailable. Start the website server and try again." : error.message;
        statusElement.className = "account-status error";
    }
}
