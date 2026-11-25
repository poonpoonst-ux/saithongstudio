'use strict';
document.documentElement.classList.add('js');
const thai = document.documentElement.lang === 'th';
const translate = (en, th) => thai ? th : en;
const fromDisk = location.protocol === 'file:';
if (!fromDisk) {
  for (const link of document.querySelectorAll('a[href]')) {
    const href = link.getAttribute('href');
    if (/^(?:#|\/|[a-z][\w+.-]*:)/i.test(href)) continue;
    const target = new URL(link.href);
    link.setAttribute('href',target.pathname.replace(/\/index\.html$/, '/') + target.search + target.hash);
  }
}

// Locale links are ordinary crawlable pages. Carry the current filter, service
// and section across when a visitor switches. Only the default homepage
// redirects a returning visitor; deep links keep their explicit language.
const storageKey = 'saithong-language';
try {
  if (location.pathname === '/' && localStorage.getItem(storageKey) === 'th') {
    location.replace('/th/' + location.search + location.hash);
  }
} catch { /* Private browsing may disable storage. */ }
function syncLanguageLinks() {
  for (const link of document.querySelectorAll('[data-lang]')) {
    const target = new URL(link.href);
    target.search = location.search;
    target.hash = location.hash;
    link.href = target.href;
  }
}
syncLanguageLinks();
window.addEventListener('hashchange', syncLanguageLinks);
document.querySelectorAll('[data-lang]').forEach(link => {
  link.addEventListener('click', () => {
    try { localStorage.setItem(storageKey, link.dataset.lang); } catch { /* Links still work. */ }
  });
});

const menu = document.querySelector('.menu-button');
const nav = document.querySelector('#primary-nav');
function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) setMenu(false);
});
nav.addEventListener('click', () => setMenu(false));
matchMedia('(min-width:901px)').addEventListener('change', () => setMenu(false));

const filters = document.querySelector('[data-filters]');
if (filters) {
  filters.hidden = false;
  const controls = [...filters.querySelectorAll('button')];
  const cards = [...document.querySelectorAll('[data-category]')];
  function filterWork() {
    const value = new URL(location.href).searchParams.get('category') || 'all';
    const active = controls.some(b => b.dataset.filter === value) ? value : 'all';
    controls.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === active)));
    cards.forEach(c => { c.hidden = active !== 'all' && c.dataset.category !== active; });
    const count = cards.filter(c => !c.hidden).length;
    document.querySelector('#filter-status').textContent = translate(
      count + (count === 1 ? ' artwork shown' : ' artworks shown'), 'แสดงผลงาน ' + count + ' รายการ'
    );
    syncLanguageLinks();
  }
  filters.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.getAttribute('aria-pressed') === 'true') return;
    const target = new URL(location.href);
    if (button.dataset.filter === 'all') target.searchParams.delete('category');
    else target.searchParams.set('category', button.dataset.filter);
    if (fromDisk) {
      location.assign(target.href);
      return;
    }
    history.pushState(null, '', target);
    filterWork();
  });
  window.addEventListener('popstate', filterWork);
  filterWork();
}

const gallery = [...document.querySelectorAll('[data-gallery]')];
const dialog = document.querySelector('.lightbox');
if (dialog && typeof dialog.showModal === 'function') {
  let current = 0;
  let opener;
  const image = dialog.querySelector('[data-lb-image]');
  const closeButton = dialog.querySelector('[data-lb-close]');
  function display(index) {
    current = (index + gallery.length) % gallery.length;
    image.src = gallery[current].href;
    image.alt = gallery[current].querySelector('img').alt;
    dialog.querySelector('[data-lb-caption]').textContent = image.alt;
    dialog.querySelector('[data-lb-count]').textContent = (current + 1) + ' / ' + gallery.length;
  }
  gallery.forEach((link,index) => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    display(index);
    dialog.showModal();
    closeButton.focus();
  }));
  closeButton.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-lb-next]').addEventListener('click', () => display(current + 1));
  dialog.querySelector('[data-lb-prev]').addEventListener('click', () => display(current - 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      display(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('close', () => opener?.focus());
}

const form = document.querySelector('#project-inquiry');
if (form) {
  const service = form.elements.namedItem('service');
  const choice = new URL(location.href).searchParams.get('service');
  if ([...service.options].some(option => option.value === choice)) service.value = choice;
  const fields = [...form.querySelectorAll('[aria-describedby$="-error"]')];
  const status = form.querySelector('#form-status');
  function fieldMessage(field) {
    if (field.validity.valueMissing || (field.required && !field.value.trim())) {
      if (field.type === 'checkbox') return translate('Please confirm your consent.','กรุณายืนยันความยินยอม');
      return translate('Please complete this field.','กรุณากรอกหรือเลือกข้อมูลในช่องนี้');
    }
    if (field.type === 'email' && field.validity.typeMismatch) return translate('Enter a valid email address.','กรุณากรอกอีเมลที่ถูกต้อง');
    if (field.type === 'url' && !field.validity.valid) return translate('Use a full http:// or https:// link.','กรุณาใส่ลิงก์ที่ขึ้นต้นด้วย http:// หรือ https://');
    return field.validity.valid ? '' : translate('Please check this value.','กรุณาตรวจสอบข้อมูลในช่องนี้');
  }
  function validate(field) {
    const message = fieldMessage(field);
    const error = document.getElementById(field.id + '-error');
    error.textContent = message;
    if (message) field.setAttribute('aria-invalid','true');
    else field.removeAttribute('aria-invalid');
    return !message;
  }
  fields.forEach(field => {
    field.addEventListener('input', () => {
      if (field.hasAttribute('aria-invalid')) validate(field);
    });
  });
  form.noValidate = true;
  form.addEventListener('submit', event => {
    const invalid = fields.filter(field => !validate(field));
    if (invalid.length) {
      event.preventDefault();
      status.hidden = false;
      status.textContent = translate('Review the highlighted fields before sending.','กรุณาตรวจสอบช่องที่มีข้อความแจ้งเตือนก่อนส่ง');
      invalid[0].focus();
      return;
    }
    if (document.querySelector('meta[name="studio-local-preview"]') || location.protocol === 'file:') {
      event.preventDefault();
      status.hidden = false;
      status.textContent = translate('Local preview: your inquiry has not been sent. The deployed Netlify form accepts submissions.','นี่คือการแสดงตัวอย่างบนเครื่อง ยังไม่มีการส่งข้อมูล กรุณาใช้แบบฟอร์มบนเว็บไซต์ Netlify ที่เผยแพร่แล้ว');
      return;
    }
    // Leave the valid native POST and the response entirely to Netlify.
    status.hidden = true;
  });
}

