const registerTab = document.getElementById("registerTab");
const loginTab = document.getElementById("loginTab");
const registerPanel = document.getElementById("registerPanel");
const loginPanel = document.getElementById("loginPanel");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const recoveryLink = document.createElement("a");
recoveryLink.className = "account-help-link";
recoveryLink.href = "forgot-password.html";
recoveryLink.textContent = "Forgot your password?";
loginForm.after(recoveryLink);

registerTab.addEventListener("click", () => { registerTab.classList.add("active"); loginTab.classList.remove("active"); registerPanel.hidden = false; loginPanel.hidden = true; });
loginTab.addEventListener("click", () => { loginTab.classList.add("active"); registerTab.classList.remove("active"); loginPanel.hidden = false; registerPanel.hidden = true; });

async function submitAccount(endpoint, payload, status, successMessage, form) {
    status.textContent = "";
    try {
        if (window.location.protocol === "file:") {
            throw new Error("Open the account page through http://localhost:3000/account.html so registration can reach the backend.");
        }
        const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(payload) });
        const responseText = await response.text();
        let result;
        try {
            result = responseText ? JSON.parse(responseText) : {};
        } catch {
            throw new Error(`The account service returned an invalid response (${response.status}).`);
        }
        if (!response.ok) throw new Error(result.error || "The request failed.");
        successMessage(result);
        status.className = "account-status success";
        form.reset();
    } catch (error) {
        status.textContent = error.message === "Failed to fetch" ? "The account service is unavailable. Open this page through http://localhost:3000." : error.message;
        status.className = "account-status error";
    }
}

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitAccount("/api/register", { name: document.getElementById("registerName").value.trim(), email: document.getElementById("registerEmail").value.trim(), password: document.getElementById("registerPassword").value }, document.getElementById("registerStatus"), (result) => { window.location.href = `confirmation.html?email=${encodeURIComponent(result.user.email)}${result.development_code ? `&code=${result.development_code}` : ""}`; }, registerForm);
});
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitAccount("/api/login", { email: document.getElementById("loginEmail").value.trim(), password: document.getElementById("loginPassword").value }, document.getElementById("loginStatus"), (result) => { document.getElementById("loginStatus").textContent = `Welcome back, ${result.user.name}. You are logged in.`; document.getElementById("loginStatus").className = "account-status success"; loginForm.reset(); }, loginForm);
});
