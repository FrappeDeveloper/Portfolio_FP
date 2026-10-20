(() => {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  const byId = (id) => document.getElementById(id);
  const setText = (id, value) => { if (value) byId(id).textContent = value; };

  setText("hero-title", data.title || "Portfolio FP");
  setText("hero-subtitle", data.subtitle || "");
  setText("profile-name", data.name || "");
  setText("about-text", data.about || "");
  if (data.profileImage) byId("profile-image").src = data.profileImage;

  ["github-hero", "github-contact"].forEach((id) => {
    const link = byId(id);
    if (data.github) link.href = data.github;
    else link.hidden = true;
  });

  const contactDetails = byId("contact-details");
  const contactIcons = { email: "assets/images/mail_icon.png", phone: "assets/images/phone_icon.png", location: "assets/images/map_icon.webp" };
  const contactLabels = { email: "Correo", phone: "Teléfono", location: "Ubicación" };
  Object.entries(data.contact || {}).forEach(([key, value]) => {
    if (!value) return;
    const item = document.createElement("p");
    const img = document.createElement("img");
    img.src = contactIcons[key];
    img.alt = "";
    const span = document.createElement("span");
    span.textContent = value;
    item.append(img, span);
    item.setAttribute("aria-label", contactLabels[key] || key);
    contactDetails.append(item);
  });
  if (!contactDetails.children.length) contactDetails.remove();

  const projects = data.projects || [];
  const carouselInner = byId("portfolio-carousel-inner");
  const carouselIndicators = byId("portfolio-carousel-indicators");
  projects.forEach((project, index) => {
    const slug = (project.title || `proyecto-${index + 1}`)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const slide = document.createElement("div");
    slide.className = `carousel-item${index === 0 ? " active" : ""}`;
    const slideLink = document.createElement("a");
    slideLink.className = "carousel-project-link";
    slideLink.href = `#project-${slug}`;
    slideLink.setAttribute("aria-label", `Ver proyecto ${project.title || ""}`);

    if (project.image) {
      const image = document.createElement("img");
      image.className = "carousel-project-image";
      image.src = project.image;
      image.alt = project.title || "Imagen del proyecto";
      image.loading = index === 0 ? "eager" : "lazy";
      slideLink.append(image);
    } else {
      const cover = document.createElement("div");
      cover.className = "carousel-project-cover";
      const label = document.createElement("span");
      label.className = "carousel-project-category";
      label.textContent = project.category || "Proyecto";
      const title = document.createElement("strong");
      title.textContent = project.title || "Proyecto";
      const hint = document.createElement("span");
      hint.className = "carousel-project-hint";
      hint.textContent = "Ver proyecto ↓";
      cover.append(label, title, hint);
      slideLink.append(cover);
    }
    slide.append(slideLink);
    carouselInner.append(slide);

    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.setAttribute("data-bs-target", "#portfolioCarousel");
    indicator.setAttribute("data-bs-slide-to", String(index));
    indicator.setAttribute("aria-label", `Ir al proyecto ${index + 1}`);
    if (index === 0) {
      indicator.className = "active";
      indicator.setAttribute("aria-current", "true");
    }
    carouselIndicators.append(indicator);
  });
  if (projects.length < 2) {
    byId("portfolioCarousel").classList.add("carousel-single-slide");
  }

  const projectGrid = byId("project-grid");
  projects.forEach((project, index) => {
    const article = document.createElement("article");
    article.className = "project-card";
    const slug = (project.title || `proyecto-${index + 1}`)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    article.id = `project-${slug}`;
    if (project.image) {
      const image = document.createElement("img");
      image.className = "project-image";
      image.src = project.image;
      image.alt = `Imagen de ${project.title}`;
      image.loading = "lazy";
      article.append(image);
    } else {
      const cover = document.createElement("div");
      cover.className = "project-cover";
      cover.setAttribute("aria-hidden", "true");
      cover.innerHTML = '<span>&lt;/&gt;</span>';
      article.append(cover);
    }
    const content = document.createElement("div");
    content.className = "project-content";
    const category = document.createElement("p");
    category.className = "project-category";
    category.textContent = project.category || "Proyecto";
    const title = document.createElement("h3");
    title.textContent = project.title || "Proyecto sin título";
    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = project.description || "";
    const tags = document.createElement("div");
    tags.className = "tag-list";
    (project.tags || []).forEach((tag) => {
      const chip = document.createElement("span");
      chip.className = "tag";
      chip.textContent = tag;
      tags.append(chip);
    });
    content.append(category, title, description, tags);
    if (project.link) {
      const link = document.createElement("a");
      link.className = "project-link";
      link.href = project.link;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Ver proyecto ↗";
      content.append(link);
    }
    article.append(content);
    projectGrid.append(article);
  });

  const experienceList = byId("experience-list");
  (data.experiences || []).forEach((experience, index) => {
    const article = document.createElement("article");
    article.className = "experience-item";
    const number = document.createElement("span");
    number.className = "experience-number";
    number.textContent = String(index + 1).padStart(2, "0");
    const content = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = experience.title || "Experiencia";
    const description = document.createElement("p");
    description.textContent = experience.description || "";
    content.append(title, description);
    article.append(number, content);
    experienceList.append(article);
  });

  const skillsGrid = byId("skills-grid");
  (data.skills || []).forEach((skill) => {
    const article = document.createElement("article");
    article.className = "skill-card";
    const title = document.createElement("h3");
    title.textContent = skill.title || "Habilidades";
    const list = document.createElement("div");
    list.className = "tag-list";
    (skill.items || []).forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "tag";
      chip.textContent = item;
      list.append(chip);
    });
    article.append(title, list);
    skillsGrid.append(article);
  });

  const toggle = byId("menu-toggle");
  const nav = byId("main-nav");
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open", !expanded);
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }));
})();
