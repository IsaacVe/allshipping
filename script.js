const supportedLanguages = ["es", "en", "zh-Hant"];
const pageTitles = {
  home: {
    es: "allshipping | Desaduanaje en Lima, Perú",
    en: "allshipping | Customs Clearance in Lima, Peru",
    "zh-Hant": "allshipping | 秘魯利馬報關服務"
  },
  services: {
    es: "Servicios | allshipping",
    en: "Services | allshipping",
    "zh-Hant": "我的服務 | allshipping"
  },
  about: {
    es: "Sobre nosotros | allshipping",
    en: "About us | allshipping",
    "zh-Hant": "關於我們 | allshipping"
  },
  contact: {
    es: "Contáctanos | allshipping",
    en: "Contact us | allshipping",
    "zh-Hant": "聯絡我們 | allshipping"
  },
  legal: {
    es: "Aviso legal | allshipping",
    en: "Legal notice | allshipping",
    "zh-Hant": "法律聲明 | allshipping"
  },
  privacy: {
    es: "Política de privacidad | allshipping",
    en: "Privacy policy | allshipping",
    "zh-Hant": "隱私政策 | allshipping"
  },
  cookies: {
    es: "Configuración de cookies | allshipping",
    en: "Cookie settings | allshipping",
    "zh-Hant": "Cookie 設定 | allshipping"
  }
};

function getLanguage() {
  const stored = localStorage.getItem("allshipping-language");
  if (supportedLanguages.includes(stored)) {
    return stored;
  }

  const browserLanguage = navigator.language || "es";
  if (browserLanguage.toLowerCase().startsWith("zh")) {
    return "zh-Hant";
  }
  if (browserLanguage.toLowerCase().startsWith("en")) {
    return "en";
  }
  return "es";
}

function applyTranslations(language) {
  const messages = window.TRANSLATIONS[language] || window.TRANSLATIONS.es;
  document.documentElement.lang = language;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (messages[key]) {
      element.textContent = messages[key];
    }
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    const key = element.dataset.i18nAlt;
    if (messages[key]) {
      element.setAttribute("alt", messages[key]);
    }
  });

  const currentPage = document.body.dataset.page;
  if (pageTitles[currentPage] && pageTitles[currentPage][language]) {
    document.title = pageTitles[currentPage][language];
  }
}

function markActiveLink() {
  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const linkFile = link.getAttribute("href");
    link.classList.toggle("active", linkFile === currentFile);
  });
}

function bindLanguageSelector() {
  const selector = document.getElementById("language-select");
  if (!selector) {
    return;
  }

  const initialLanguage = getLanguage();
  selector.value = initialLanguage;
  applyTranslations(initialLanguage);

  selector.addEventListener("change", (event) => {
    const language = event.target.value;
    localStorage.setItem("allshipping-language", language);
    applyTranslations(language);
  });
}

function bindContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("contact-name").value.trim();
    const company = document.getElementById("contact-company").value.trim();
    const message = document.getElementById("contact-message").value.trim();
    const language = getLanguage();

    const introByLanguage = {
      es: "Hola, quiero información sobre sus servicios de desaduanaje.",
      en: "Hello, I would like information about your customs clearance services.",
      "zh-Hant": "您好，我想了解貴公司的報關服務。"
    };

    const lines = [
      introByLanguage[language],
      name ? `Nombre / Name: ${name}` : "",
      company ? `Empresa / Company: ${company}` : "",
      message ? `Mensaje / Message: ${message}` : ""
    ].filter(Boolean);

    const whatsappUrl = `https://wa.me/51920489288?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(whatsappUrl, "_blank", "noopener");
  });
}

function bindMobileMenu() {
  const topbar = document.querySelector(".topbar");
  const toggle = document.querySelector(".menu-toggle");
  const siteMenu = document.getElementById("site-menu");
  if (!topbar || !toggle || !siteMenu) {
    return;
  }

  const closeMenu = () => {
    topbar.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = topbar.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 600) {
      closeMenu();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  markActiveLink();
  bindLanguageSelector();
  bindContactForm();
  bindMobileMenu();
});
