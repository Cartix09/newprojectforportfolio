import {
  profile, links, about, projects, experience,
  skillGroups, education, certificates, languages,
} from '../data/content.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function renderContent() {
  // Simple text bindings: data-content="key" with profile keys
  $$('[data-content="name"]').forEach(n => n.textContent = profile.name);
  $$('[data-content="tagline"]').forEach(n => n.textContent = profile.tagline);
  $$('[data-content="intro"]').forEach(n => n.textContent = profile.intro);
  $$('[data-content="status"]').forEach(n => n.textContent = profile.status);
  $$('[data-content="location"]').forEach(n => n.textContent = profile.location);

  // Link wiring: data-link="github|email|linkedin"
  $$('[data-link]').forEach((node) => {
    const key = node.getAttribute('data-link');
    if (links[key]) node.setAttribute('href', links[key]);
  });
  $$('[data-link-text]').forEach((node) => {
    const key = node.getAttribute('data-link-text');
    if (key === 'email') {
      const v = links.email.replace('mailto:', '');
      node.textContent = v;
    }
  });

  // About paragraphs
  const aboutEl = $('[data-content="about"]');
  if (aboutEl) {
    aboutEl.innerHTML = about.map((p, i) =>
      `<p class="reveal" style="transition-delay:${i * 0.08}s">${escapeHtml(p)}</p>`
    ).join('');
  }

  // Projects
  const projEl = $('[data-content="projects"]');
  if (projEl) {
    const VISIBLE = 6;
    const cardsHtml = projects.map((p, i) => {
      const extra = i >= VISIBLE ? ' is-extra' : '';
      const link = p.url
        ? `<a class="project-link" href="${escapeHtml(p.url)}" target="_blank" rel="noreferrer noopener" data-cursor="hover">Visit site
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M9 7h8v8"/></svg>
           </a>`
        : '';
      const type = p.type ? `<span class="project-type">${escapeHtml(p.type)}</span>` : `<span></span>`;
      return `
      <article class="project-card reveal${extra}" style="--card-accent:${p.accent}; transition-delay:${(i % VISIBLE) * 0.06}s" data-cursor="hover" data-section="projects">
        <span class="project-accent" aria-hidden="true"></span>
        <span class="project-mark" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </span>
        <div class="project-meta-row">
          ${type}
          <span class="project-year">${escapeHtml(p.year)}</span>
        </div>
        <h3 class="project-name">${escapeHtml(p.name)}</h3>
        <p class="project-summary">${escapeHtml(p.summary)}</p>
        <p class="project-role"><strong>Role</strong> ${escapeHtml(p.role)}</p>
        <div class="project-tags">
          ${p.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
        </div>
        ${link}
      </article>
    `;
    }).join('');
    projEl.innerHTML = cardsHtml;

    // Show more button if needed
    if (projects.length > VISIBLE) {
      const moreWrap = document.createElement('div');
      moreWrap.className = 'projects-more';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = `Show all ${projects.length} projects`;
      btn.setAttribute('data-cursor', 'hover');
      btn.addEventListener('click', () => {
        const isOpen = projEl.classList.toggle('is-expanded');
        btn.textContent = isOpen ? 'Show fewer projects' : `Show all ${projects.length} projects`;
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
      moreWrap.appendChild(btn);
      projEl.parentElement.appendChild(moreWrap);
    }
  }

  // Experience
  const expEl = $('[data-content="experience"]');
  if (expEl) {
    expEl.innerHTML = experience.map((e, i) => `
      <li class="exp-item reveal" style="transition-delay:${i * 0.08}s">
        <div class="exp-meta">
          <p class="exp-period">${escapeHtml(e.period)}</p>
        </div>
        <div class="exp-body">
          <h3 class="exp-role">${escapeHtml(e.role)}</h3>
          <p class="exp-company">${escapeHtml(e.company)}</p>
          <ul class="exp-points">
            ${e.points.map(pt => `<li>${escapeHtml(pt)}</li>`).join('')}
          </ul>
        </div>
      </li>
    `).join('');
  }

  // Skills
  const skillsEl = $('[data-content="skills"]');
  if (skillsEl) {
    skillsEl.innerHTML = skillGroups.map((g, i) => `
      <div class="skill-group reveal" style="transition-delay:${i * 0.06}s">
        <h3 class="skill-title">${escapeHtml(g.title)}</h3>
        <div class="skill-chips">
          ${g.items.map(s => `<span class="tag">${escapeHtml(s)}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // Education
  const eduEl = $('[data-content="education"]');
  if (eduEl) {
    eduEl.innerHTML = education.map((e, i) => `
      <div class="edu-card reveal" style="transition-delay:${i * 0.08}s">
        <h3 class="edu-school">${escapeHtml(e.school)}</h3>
        <p class="edu-degree">${escapeHtml(e.degree)}</p>
        <span class="edu-period">${escapeHtml(e.period)}</span>
        ${e.note ? `<p class="edu-note">${escapeHtml(e.note)}</p>` : ''}
      </div>
    `).join('');
  }

  // Certificates
  const certEl = $('[data-content="certificates"]');
  if (certEl) {
    certEl.innerHTML = certificates.map(c => `<li>${escapeHtml(c)}</li>`).join('');
  }

  // Languages
  const langEl = $('[data-content="languages"]');
  if (langEl) {
    langEl.innerHTML = languages.map(l => `
      <li><span class="lang-name">${escapeHtml(l.name)}</span><span class="lang-level">${escapeHtml(l.level)}</span></li>
    `).join('');
  }

  // Year in footer
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
}
