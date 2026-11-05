const sections = document.querySelectorAll('section, div[id]');
const navLinks = document.querySelectorAll(".pt-sidebar-nav a");
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove("pt-active");
    if (current && link.getAttribute('href') === '#' + current) {
      link.classList.add("pt-active");
    }
  });
});

/** Keep print behavior compatible with the existing script policy. */
document.querySelector("[data-print]")?.addEventListener("click", () => window.print());
