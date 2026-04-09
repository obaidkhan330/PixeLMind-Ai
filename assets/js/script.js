/* ============================================================
   PIXELMIND AI - MAIN SCRIPT
   Gemini API Integration + UI Logic
============================================================ */

// ── DARK MODE ───────────────────────────────────────────────
function initDarkMode() {
  const body = document.body;
  const btns = document.querySelectorAll('.dark-toggle');
  const stored = localStorage.getItem('theme') || 'dark';
  if (stored === 'light') body.classList.add('light-mode');
  btns.forEach(btn => {
    updateToggleIcon(btn);
    btn.addEventListener('click', () => {
      body.classList.toggle('light-mode');
      localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
      btns.forEach(b => updateToggleIcon(b));
    });
  });
}
function updateToggleIcon(btn) {
  const isLight = document.body.classList.contains('light-mode');
  btn.innerHTML = isLight ? '🌙' : '☀️';
  btn.title = isLight ? 'Switch to Dark' : 'Switch to Light';
}

// ── NAVBAR ──────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.querySelector('.navbar-custom');
  if (!navbar) return;
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));
  const toggler = document.querySelector('.navbar-toggler-custom');
  const menu = document.querySelector('.navbar-menu');
  if (toggler && menu) {
    toggler.addEventListener('click', () => menu.classList.toggle('show'));
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) menu.classList.remove('show');
    });
  }
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link-custom').forEach(link => {
    if (link.getAttribute('href') === current) link.classList.add('active');
  });
}

// ── SCROLL TOP ──────────────────────────────────────────────
function initScrollTop() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── TOAST ───────────────────────────────────────────────────
let toastContainer;
function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container-custom';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}
function showToast(message, type = 'info', duration = 3500) {
  const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]||icons.info}</span><span style="flex:1">${message}</span><button class="toast-close">✕</button>`;
  getToastContainer().appendChild(toast);
  toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));
  setTimeout(() => removeToast(toast), duration);
}
function removeToast(toast) {
  toast.style.animation = 'slideInRight .3s ease reverse';
  setTimeout(() => toast.remove(), 280);
}

// ── RIPPLE ──────────────────────────────────────────────────
function initRipple() {
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const r = document.createElement('span');
      r.className = 'ripple-effect';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
      this.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  });
}

// ── SCROLL REVEAL ───────────────────────────────────────────
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── SMOOTH SCROLL ───────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

// ── FAQ ─────────────────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ── TESTIMONIAL SLIDER ──────────────────────────────────────
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  if (!track) return;
  const dots = document.querySelectorAll('.slider-dot');
  let current = 0;
  const cards = track.querySelectorAll('.testimonial-card');

  function getVisible() {
    if (window.innerWidth <= 576) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }
  function slide(idx) {
    const total = Math.max(0, cards.length - getVisible());
    current = ((idx % (total + 1)) + (total + 1)) % (total + 1);
    const cardW = (cards[0]?.offsetWidth || 0) + 22;
    track.style.transform = `translateX(-${current * cardW}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === Math.min(current, dots.length - 1)));
  }
  document.querySelector('.slider-prev')?.addEventListener('click', () => slide(current - 1));
  document.querySelector('.slider-next')?.addEventListener('click', () => slide(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => slide(i)));
  let timer = setInterval(() => slide(current + 1), 4000);
  track.addEventListener('mouseenter', () => clearInterval(timer));
  track.addEventListener('mouseleave', () => { timer = setInterval(() => slide(current + 1), 4000); });
  window.addEventListener('resize', () => slide(0));
}

// ── GALLERY FILTERS ─────────────────────────────────────────
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.masonry-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.style.opacity = show ? '1' : '0.2';
        item.style.transform = show ? '' : 'scale(0.95)';
        item.style.pointerEvents = show ? '' : 'none';
        item.style.transition = 'all 0.3s ease';
      });
    });
  });
}

// ── LIGHTBOX ───────────────────────────────────────────────
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  document.querySelectorAll('.masonry-item[data-src]').forEach(item => {
    item.addEventListener('click', () => {
      const img = lightbox.querySelector('.lightbox-img');
      if (img) img.src = item.dataset.src;
      lightbox.dataset.currentSrc = item.dataset.src;
      lightbox.dataset.currentPrompt = item.dataset.prompt || 'ai-image';
      lightbox.classList.add('active');
    });
  });
  lightbox.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('active'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lightbox.classList.remove('active'); });

  // Lightbox download
  lightbox.querySelector('#lightboxDownload')?.addEventListener('click', () => {
    downloadImage(lightbox.dataset.currentSrc, lightbox.dataset.currentPrompt);
  });
}

// ── SIZE SELECTOR ───────────────────────────────────────────
function initSizeSelector() {
  document.querySelectorAll('.size-option').forEach(opt => {
    opt.addEventListener('click', function() {
      document.querySelectorAll('.size-option').forEach(o => o.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// ── PROMPT SUGGESTIONS ──────────────────────────────────────
function initPromptSuggestions() {
  const textarea = document.querySelector('#promptInput');
  if (!textarea) return;
  document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      textarea.value = chip.textContent.trim();
      textarea.focus();
      updateCharCounter();
    });
  });
}

// ── CHAR COUNTER ────────────────────────────────────────────
function updateCharCounter() {
  const ta = document.querySelector('#promptInput');
  const counter = document.querySelector('.char-counter');
  if (ta && counter) counter.textContent = `${ta.value.length}/500`;
}
function initCharCounter() {
  const ta = document.querySelector('#promptInput');
  if (ta) { ta.addEventListener('input', updateCharCounter); updateCharCounter(); }
}

// ── API KEY MANAGEMENT ──────────────────────────────────────
function getApiKey() {
  return localStorage.getItem('gemini_api_key') || '';
}
function saveApiKey(key) {
  localStorage.setItem('gemini_api_key', key.trim());
}
function initApiKeyBox() {
  const input = document.querySelector('#apiKeyInput');
  const saveBtn = document.querySelector('#apiKeySaveBtn');
  const status = document.querySelector('#apiKeyStatus');
  if (!input) return;

  // Load saved key (masked)
  const saved = getApiKey();
  if (saved) {
    input.value = saved;
    if (status) { status.textContent = '✓ API key saved'; status.className = 'api-key-status set'; }
  }
  saveBtn?.addEventListener('click', () => {
    const key = input.value.trim();
    if (!key) { showToast('Please enter your Gemini API key', 'warning'); return; }
    if (!key.startsWith('AI')) { showToast('API key should start with "AI..."', 'warning'); return; }
    saveApiKey(key);
    if (status) { status.textContent = '✓ API key saved successfully!'; status.className = 'api-key-status set'; }
    showToast('API key saved! ✓', 'success');
  });
}

// ── DAILY LIMIT ─────────────────────────────────────────────
const DAILY_LIMIT = 10; // Display only (actual limit depends on Gemini quota)
function getDailyCount() {
  const today = new Date().toDateString();
  const stored = JSON.parse(localStorage.getItem('dailyCount') || '{}');
  if (stored.date !== today) return 0;
  return stored.count || 0;
}
function incrementDailyCount() {
  const today = new Date().toDateString();
  const count = getDailyCount() + 1;
  localStorage.setItem('dailyCount', JSON.stringify({ date: today, count }));
}
function updateDailyLimitUI() {
  const count = getDailyCount();
  const el = document.querySelector('#dailyCount');
  const fill = document.querySelector('#dailyFill');
  const pct = Math.min((count / DAILY_LIMIT) * 100, 100);
  if (el) el.textContent = `${count}/${DAILY_LIMIT}`;
  if (fill) fill.style.width = `${pct}%`;
}

// ── GEMINI API CALL ─────────────────────────────────────────
async function callGeminiAPI(prompt) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API key not set. Please enter your Gemini API key above.');

  // Gemini 2.0 Flash image generation
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || `API error: ${res.status}`;
    throw new Error(msg);
  }

  const data = await res.json();

  // Extract image from response
  const parts = data?.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error('No image returned. Try a more detailed prompt.');
}

// ── GENERATE IMAGE ──────────────────────────────────────────
async function generateImage() {
  const promptEl = document.querySelector('#promptInput');
  const prompt = promptEl?.value?.trim();
  const style = document.querySelector('#styleSelect')?.value || 'Realistic';
  const size = document.querySelector('.size-option.active')?.dataset?.size || '1024x1024';
  const btn = document.querySelector('.generate-btn');
  const loader = document.querySelector('.loader-overlay');
  const resultArea = document.querySelector('.image-result-area');
  const imageActions = document.querySelector('#imageActions');

  if (!prompt) { showToast('Please enter a prompt first!', 'warning'); promptEl?.focus(); return; }
  if (prompt.length < 5) { showToast('Prompt is too short. Please be more descriptive.', 'warning'); return; }

  const apiKey = getApiKey();
  if (!apiKey) {
    showToast('Please save your Gemini API key first!', 'error');
    document.querySelector('#apiKeyInput')?.focus();
    return;
  }

  // Build full prompt with style
  const fullPrompt = `${style} style, ${prompt}, high quality, detailed, ${size} resolution`;

  // UI: loading state
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-custom" style="width:22px;height:22px;border-width:3px"></span><span>Generating...</span>'; }
  if (loader) loader.classList.remove('hidden');
  if (imageActions) imageActions.style.display = 'none';
  document.querySelector('#genStatus') && (document.querySelector('#genStatus').textContent = 'Generating...');

  try {
    const imgSrc = await callGeminiAPI(fullPrompt);
    displayGeneratedImage(imgSrc, prompt, style, size);
    incrementDailyCount();
    updateDailyLimitUI();
    saveToHistory({ src: imgSrc, prompt, style, size, date: new Date().toISOString() });
    showToast('Image generated successfully! 🎉', 'success');
    document.querySelector('#genStatus') && (document.querySelector('#genStatus').textContent = '✓ Generated!');
    document.dispatchEvent(new CustomEvent('imageGenerated', { detail: { src: imgSrc, prompt, style, size } }));
  } catch (err) {
    console.error(err);
    showToast(err.message || 'Generation failed. Check your API key and try again.', 'error');
    if (loader) loader.classList.add('hidden');
    document.querySelector('#genStatus') && (document.querySelector('#genStatus').textContent = 'Error — try again');
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<span>✦</span><span>Generate Image</span>'; }
  }
}

function displayGeneratedImage(src, prompt, style, size) {
  const resultArea = document.querySelector('.image-result-area');
  const loader = document.querySelector('.loader-overlay');
  const imageActions = document.querySelector('#imageActions');
  if (!resultArea) return;

  resultArea.classList.add('has-image');
  resultArea.innerHTML = `<img src="${src}" alt="${prompt}" id="generatedImg" style="border-radius:var(--radius)">`;
  // Re-append loader
  if (loader) { loader.classList.add('hidden'); resultArea.appendChild(loader); }

  if (imageActions) {
    imageActions.style.display = 'flex';
    document.querySelector('#downloadBtn') && (document.querySelector('#downloadBtn').onclick = () => downloadImage(src, prompt));
    document.querySelector('#copyPromptBtn') && (document.querySelector('#copyPromptBtn').onclick = () => {
      navigator.clipboard.writeText(prompt);
      showToast('Prompt copied to clipboard!', 'success');
    });
  }
  // Update info panel
  const info = document.querySelector('#imageInfo');
  if (info) {
    info.style.display = 'block';
    document.querySelector('#infoStyle') && (document.querySelector('#infoStyle').textContent = style);
    document.querySelector('#infoSize') && (document.querySelector('#infoSize').textContent = size);
    document.querySelector('#infoTime') && (document.querySelector('#infoTime').textContent = new Date().toLocaleTimeString());
  }
}

// ── DOWNLOAD ────────────────────────────────────────────────
function downloadImage(src, name = 'pixelmind-ai-image') {
  const a = document.createElement('a');
  a.href = src;
  a.download = `${(name || 'image').slice(0, 40).replace(/[^a-zA-Z0-9]/g, '-')}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('Image downloaded! ⬇️', 'success');
}

// ── LOCALSTORAGE HISTORY ────────────────────────────────────
function saveToHistory(item) {
  const history = getHistory();
  history.unshift(item);
  if (history.length > 50) history.pop();
  try { localStorage.setItem('aiImageHistory', JSON.stringify(history)); } catch (e) {
    // Storage full — remove oldest
    history.pop(); history.pop();
    localStorage.setItem('aiImageHistory', JSON.stringify(history));
  }
}
function getHistory() {
  try { return JSON.parse(localStorage.getItem('aiImageHistory') || '[]'); } catch { return []; }
}
function deleteFromHistory(index) {
  const history = getHistory();
  history.splice(index, 1);
  localStorage.setItem('aiImageHistory', JSON.stringify(history));
}

// ── DASHBOARD ───────────────────────────────────────────────
function initDashboard() {
  const grid = document.querySelector('#historyGrid');
  if (!grid) return;
  const history = getHistory();
  const emptyState = document.querySelector('#emptyState');

  // Stats
  document.querySelector('#generatedCount') && (document.querySelector('#generatedCount').textContent = history.length);
  document.querySelector('#savedCount') && (document.querySelector('#savedCount').textContent = history.length);
  document.querySelector('#downloadCount') && (document.querySelector('#downloadCount').textContent = Math.floor(history.length * 0.7));

  if (!history.length) {
    if (emptyState) emptyState.style.display = 'block';
    grid.innerHTML = '';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';

  grid.innerHTML = history.map((item, i) => `
    <div class="history-item" data-index="${i}">
      <div class="history-img">
        <img src="${item.src}" alt="${item.prompt}" loading="lazy" onerror="this.parentElement.style.background='var(--bg3)';this.remove()">
        <div class="history-actions">
          <button class="history-action-btn" title="Download" onclick="downloadImage('${item.src}','${(item.prompt||'').slice(0,20).replace(/'/g,'')}')">⬇</button>
          <button class="history-action-btn" title="Delete" onclick="deleteHistoryItem(${i})">🗑</button>
        </div>
      </div>
      <div class="history-info">
        <div class="history-prompt" title="${item.prompt}">${item.prompt || 'AI Image'}</div>
        <div class="history-date">${item.style || 'Realistic'} · ${item.size || '1024x1024'}</div>
        <div class="history-date">${new Date(item.date).toLocaleDateString()}</div>
      </div>
    </div>
  `).join('');

  // Credits
  const used = Math.min(getDailyCount(), DAILY_LIMIT);
  document.querySelector('#creditsText') && (document.querySelector('#creditsText').textContent = `${used}/${DAILY_LIMIT}`);
  document.querySelector('#creditsBar') && (document.querySelector('#creditsBar').style.width = `${(used/DAILY_LIMIT)*100}%`);
  document.querySelector('#creditsUsed') && (document.querySelector('#creditsUsed').textContent = used);
}

function deleteHistoryItem(index) {
  if (!confirm('Delete this image?')) return;
  deleteFromHistory(index);
  initDashboard();
  showToast('Image deleted.', 'info');
}

// ── GALLERY PAGE: Load user images ──────────────────────────
function initGalleryPage() {
  const userGrid = document.querySelector('#userGeneratedGrid');
  if (!userGrid) return;
  const history = getHistory();
  if (!history.length) {
    userGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted)"><div style="font-size:2.5rem;opacity:.3;margin-bottom:12px">🎨</div><p>No images yet — <a href="generate.html" style="color:var(--primary)">generate your first!</a></p></div>`;
    return;
  }
  userGrid.innerHTML = history.map((item, i) => `
    <div class="masonry-item" data-category="generated" data-src="${item.src}" data-prompt="${(item.prompt||'').replace(/"/g,'')}" style="cursor:pointer">
      <img src="${item.src}" alt="${item.prompt}" loading="lazy" onerror="this.remove()">
      <div class="masonry-overlay">
        <span style="font-weight:600;font-size:.82rem;color:#fff">${(item.prompt||'').slice(0,35)}${item.prompt?.length>35?'...':''}</span>
        <span style="font-size:.72rem;color:rgba(255,255,255,.7)">${item.style||'Realistic'} · ${new Date(item.date).toLocaleDateString()}</span>
      </div>
    </div>
  `).join('');
}

// ── PROFILE ─────────────────────────────────────────────────
function initProfileAvatar() {
  const input = document.querySelector('#avatarInput');
  const preview = document.querySelector('.profile-avatar');
  if (!input || !preview) return;
  input.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) { showToast('Select an image file', 'error'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      preview.innerHTML = `<img src="${ev.target.result}" alt="Profile">`;
      localStorage.setItem('profileAvatar', ev.target.result);
      showToast('Profile picture updated!', 'success');
    };
    reader.readAsDataURL(file);
  });
  const saved = localStorage.getItem('profileAvatar');
  if (saved) preview.innerHTML = `<img src="${saved}" alt="Profile">`;
  // Load sidebar avatar too
  const sidebarAvatar = document.querySelector('.sidebar-avatar');
  if (sidebarAvatar && saved) sidebarAvatar.innerHTML = `<img src="${saved}" alt="Profile">`;
}
function initProfileForm() {
  const form = document.querySelector('#profileForm');
  if (!form) return;
  const saved = JSON.parse(localStorage.getItem('profileData') || '{}');
  if (saved.name) form.querySelector('#profileName').value = saved.name;
  if (saved.email) form.querySelector('#profileEmail').value = saved.email;
  if (saved.bio && form.querySelector('#profileBio')) form.querySelector('#profileBio').value = saved.bio;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = { name: form.querySelector('#profileName')?.value, email: form.querySelector('#profileEmail')?.value, bio: form.querySelector('#profileBio')?.value };
    localStorage.setItem('profileData', JSON.stringify(data));
    showToast('Profile saved! ✓', 'success');
  });
}

// ── FORM VALIDATION ─────────────────────────────────────────
function initFormValidation() {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#EF4444';
          setTimeout(() => field.style.borderColor = '', 2500);
        }
      });
      const emailField = form.querySelector('input[type="email"]');
      if (emailField?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        valid = false; showToast('Invalid email address.', 'error'); return;
      }
      if (!valid) { showToast('Fill in all required fields.', 'error'); return; }
      showToast(form.dataset.success || 'Submitted! ✓', 'success');
      form.reset();
    });
  });
}

// ── NEWSLETTER ──────────────────────────────────────────────
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]')?.value?.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Enter a valid email.', 'error'); return; }
    showToast('🎉 Subscribed! Welcome to PixelMind.', 'success');
    form.reset();
  });
}

// ── PASSWORD TOGGLE ─────────────────────────────────────────
function initPasswordToggle() {
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-group-custom')?.querySelector('input');
      if (!input) return;
      input.type = input.type === 'text' ? 'password' : 'text';
      btn.textContent = input.type === 'text' ? '🙈' : '👁';
    });
  });
}

// ── SIDEBAR PROFILE LOAD ────────────────────────────────────
function loadSidebarProfile() {
  const profile = JSON.parse(localStorage.getItem('profileData') || '{}');
  const nameEl = document.querySelector('#sidebarName');
  const emailEl = document.querySelector('#sidebarEmail');
  if (nameEl && profile.name) nameEl.textContent = profile.name;
  if (emailEl && profile.email) emailEl.textContent = profile.email;
  const welcomeEl = document.querySelector('#welcomeName');
  if (welcomeEl && profile.name) welcomeEl.textContent = profile.name.split(' ')[0];
}

// ── RECENT GENERATIONS (Generate page) ─────────────────────
function loadRecentGenerations() {
  const recentGrid = document.querySelector('#recentGrid');
  const noRecent = document.querySelector('#noRecent');
  if (!recentGrid) return;
  const history = getHistory().slice(0, 6);
  if (!history.length) { if (noRecent) noRecent.style.display = 'block'; return; }
  if (noRecent) noRecent.style.display = 'none';
  recentGrid.innerHTML = history.map(item => `
    <div style="aspect-ratio:1;border-radius:10px;overflow:hidden;border:1px solid var(--glass-border);cursor:pointer;background:var(--bg3)" title="${item.prompt}" onclick="showToast('Click Generate to create a new image','info')">
      <img src="${item.src}" style="width:100%;height:100%;object-fit:cover" loading="lazy" onerror="this.style.display='none'">
    </div>
  `).join('');
}

// ── INIT ALL ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initNavbar();
  initScrollTop();
  initRipple();
  initScrollReveal();
  initSmoothScroll();
  initFAQ();
  initTestimonialSlider();
  initGalleryFilters();
  initLightbox();
  initSizeSelector();
  initPromptSuggestions();
  initCharCounter();
  initFormValidation();
  initNewsletter();
  initPasswordToggle();
  initDashboard();
  initProfileAvatar();
  initProfileForm();
  initApiKeyBox();
  updateDailyLimitUI();
  loadSidebarProfile();
  loadRecentGenerations();
  initGalleryPage();

  // Regenerate button
  document.querySelector('#regenerateBtn')?.addEventListener('click', generateImage);

  // Generate button
  document.querySelector('.generate-btn')?.addEventListener('click', generateImage);

  // Ctrl+Enter shortcut
  document.querySelector('#promptInput')?.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter') generateImage();
  });

  // Clear history button
  document.querySelector('#clearHistoryBtn')?.addEventListener('click', () => {
    if (confirm('Clear all history? This cannot be undone.')) {
      localStorage.removeItem('aiImageHistory');
      initDashboard();
      showToast('History cleared.', 'info');
    }
  });

  // Save generated image
  document.querySelector('#saveBtn')?.addEventListener('click', () => {
    showToast('Image saved to your gallery! 💾', 'success');
  });
});

