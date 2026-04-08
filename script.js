const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const themeToggle = document.getElementById("themeToggle");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", navMenu.classList.contains("open"));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const savedTheme = localStorage.getItem("aurum-theme");
if (savedTheme === "light") {
  document.body.classList.add("light-mode");
  themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");
  localStorage.setItem("aurum-theme", isLight ? "light" : "dark");
  themeToggle.innerHTML = isLight
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hide", !matches);
    });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (entry.isIntersecting && activeLink) {
        navLinks.forEach((link) => link.classList.remove("active"));
        activeLink.classList.add("active");
      }
    });
  },
  {
    threshold: 0.45,
    rootMargin: "-10% 0px -35% 0px"
  }
);

sections.forEach((section) => sectionObserver.observe(section));

if (window.emailjs) {
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nameInput = contactForm.querySelector("#name");
    const emailInput = contactForm.querySelector("#email");
    const companyInput = contactForm.querySelector("#company");
    const messageInput = contactForm.querySelector("#message");

    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      company: companyInput.value.trim(),
      message: messageInput.value.trim()
    };

    if (
      !formData.name ||
      !formData.email ||
      !formData.message
    ) {
      formStatus.textContent = "Te rugăm să completezi câmpurile obligatorii.";
      return;
    }

    if (
      EMAILJS_PUBLIC_KEY === "YOUR_EMAILJS_PUBLIC_KEY" ||
      EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" ||
      EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID"
    ) {
      formStatus.textContent =
        "Adaugă cheile tale EmailJS în script.js pentru a activa trimiterea formularului.";
      return;
    }

    const submitButton = contactForm.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Se trimite...";
    formStatus.textContent = "";

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData);
      formStatus.textContent = "Mesaj trimis cu succes. Revenim rapid cu un răspuns.";
      contactForm.reset();
    } catch (error) {
      formStatus.textContent =
        "A apărut o problemă la trimitere. Încearcă din nou sau scrie-ne direct pe email.";
      console.error("EmailJS error:", error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Trimite mesajul";
    }
  });
}
