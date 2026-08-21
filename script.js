const darkModeToggle = document.getElementById("darkModeToggle");

if (darkModeToggle) {
    // Load saved theme
    if (localStorage.getItem("theme") === "dark") {
     document.body.classList.add("dark-mode");
    }

    darkModeToggle.addEventListener("click", () => {  
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark"); 
        } else {
            localStorage.setItem("theme", "light");
        }
    });

}
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobileMenu");
const closeMenu = document.getElementById("closeMenu");

function setMenu(open) {
    mobileMenu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
}

if (menuToggle && mobileMenu && closeMenu) {
    menuToggle.addEventListener("click", () => setMenu(true));
    closeMenu.addEventListener("click", () => setMenu(false));
    document.querySelectorAll("#nav-links a").forEach((link) => {
        link.addEventListener("click", () => setMenu(false));
    });
}

async function loadDailyVerse() {
    const verse = document.getElementById("dailyVerse");
    const reference = document.getElementById("verseReference");
    const fallback = {
        text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
        reference: "Joshua 1:9"
    };

    if (!verse || !reference) return;

    try {
        const response = await fetch("https://labs.bible.org/api/?passage=votd&type=json&formatting=plain");
        if (!response.ok) throw new Error("Verse request failed");
        const data = await response.json();
        verse.textContent = `“${data[0].text}”`;
        reference.textContent = `${data[0].bookname} ${data[0].chapter}:${data[0].verse}`;
    } catch (error) {
        verse.textContent = `“${fallback.text}”`;
        reference.textContent = fallback.reference;
    }
}

loadDailyVerse();

const worshipLabel = [...document.querySelectorAll('.give-values strong')].find((label) => label.textContent.trim() === 'Worship');
if (worshipLabel) {
    const worshipIcon = worshipLabel.previousElementSibling;
    worshipIcon.className = 'fas fa-hands-praying';
    worshipIcon.setAttribute('aria-hidden', 'true');
}

const planVisitLink = document.querySelector('.hero-actions .button-gold');
if (planVisitLink) {
    planVisitLink.href = "https://www.google.com/maps/dir/?api=1&destination=Jubilee+Arena,+No.+42,+Calvary+Road+Aso,+Mararaba-Nyanya,+Abuja,+Nigeria&travelmode=driving";
    planVisitLink.target = "_self";
}

const mapsDirectionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Jubilee+Arena,+No.+42,+Calvary+Road+Aso,+Mararaba-Nyanya,+Abuja,+Nigeria&travelmode=driving";
document.querySelectorAll('a').forEach((link) => {
    if (link.textContent.trim().startsWith('Plan your visit')) {
        link.href = mapsDirectionsUrl;
        link.target = "_self";
        link.addEventListener('click', () => { window.location.href = mapsDirectionsUrl; });
    }
});

const bankDetails = document.querySelector('.bank-transfer-banner');
const requestDetailsLink = [...document.querySelectorAll('a')].find((link) => link.textContent.trim().startsWith('Request details'));
if (bankDetails && requestDetailsLink) {
    bankDetails.id = "bank-details";
    requestDetailsLink.href = "#bank-details";
    requestDetailsLink.innerHTML = 'Request details <i class="fas fa-arrow-up"></i>';
}

const prayerForm = document.getElementById("prayerForm");
const formStatus = document.getElementById("formStatus");

if (prayerForm && formStatus) {
    prayerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        formStatus.textContent = "Thank you. Our prayer team will stand with you in faith.";
        prayerForm.reset();
    });
}