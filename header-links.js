/* YOUR SOCIAL LINKS AND CV
 * Replace an empty string below with your full https:// profile URL.
 * Upload your PDF to assets/ and set cv to "assets/your-cv.pdf".
 * Leave a value empty to keep its visible placeholder disabled.
 * These settings are separate from content.js, so editor exports cannot overwrite them.
 */
const HEADER_LINKS = {
  linkedin: "https://www.linkedin.com/in/kazi-anik-arman/",      // Example: "https://www.linkedin.com/in/your-name/"
  github: "https://github.com/armanxer",        // Example: "https://github.com/your-username"
  google_scholar: "https://scholar.google.com/citations?user=F6tEpFAAAAAJ&hl=en",  // Example: "https://www.researchgate.net/profile/Your-Name"
  instagram: "https://www.instagram.com/arman_xer/",     // Example: "https://www.instagram.com/your-username/"
  cv: ""            // Example: "assets/Arman-CV.pdf" (upload this file first)
};

// No href is assigned until a valid URL is provided: placeholders never jump the page.
document.querySelectorAll("[data-header-link]").forEach(link => {
  const key = link.dataset.headerLink;
  const value = (HEADER_LINKS[key] || "").trim();
  const socialURL = /^https:\/\//i.test(value);
  const localPDF = /^assets\/[a-zA-Z0-9_./-]+\.pdf$/i.test(value) && !value.includes("..");
  const valid = key === "cv" ? (socialURL || localPDF) : socialURL;

  if (!value || !valid) {
    link.removeAttribute("href");
    link.setAttribute("aria-disabled", "true");
    link.title = key === "cv" ? "CV will be added soon" : "Profile link will be added soon";
    return;
  }

  link.href = key === 'cv' && localPDF ? (window.AMIO_PAGE?.root || './') + value : value;
  link.removeAttribute("aria-disabled");
  link.title = key === "cv" ? "Download CV" : "Open " + link.textContent;
  if (key === "cv" && localPDF) {
    link.setAttribute("download", value.split("/").pop());
  } else {
    // External sites (including externally hosted PDFs) open in a new tab.
    // Browsers may ignore download for cross-origin PDFs; use assets/ for direct download.
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
});
