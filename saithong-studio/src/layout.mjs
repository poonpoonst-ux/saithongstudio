import { icon } from './icons.mjs';

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
}
export function context(config, lang, path) {
  const th = lang === 'th';
  const t = (en, thai) => th ? thai : en;
  const url = (route = '', target = lang) => (target === 'th' ? '/th/' : '/') + route;
  return {config, lang, path, th, t, url, get: obj => obj[lang]};
}
const navigation = [
  ['', 'Home', 'หน้าแรก'], ['about/', 'About', 'สตูดิโอ'], ['services/', 'Services', 'บริการ'],
  ['portfolio/', 'Portfolio', 'ผลงาน'], ['showreel/', 'Showreel', 'โชว์รีล'], ['process/', 'Process', 'ขั้นตอน']
];
export function button(href, text, variant = 'primary', symbol = '') {
  return `<a class="btn ${variant}" href="${esc(href)}">${symbol ? icon(symbol) : ''}${esc(text)}</a>`;
}
export function eyebrow(text) { return `<p class="eyebrow"><i aria-hidden="true"></i>${esc(text)}</p>`; }
export function sectionHead(tag, title, side = '') {
  return `<div class="section-head"><div>${eyebrow(tag)}<h2>${esc(title)}</h2></div>${side}</div>`;
}
function header(ctx) {
  const {t,url,path,lang} = ctx;
  const nav = navigation.map(([route,en,th]) => {
    const active = path === route || (route && path.startsWith(route));
    return `<a href="${url(route)}"${active ? ' aria-current="page"' : ''}>${t(en,th)}</a>`;
  }).join('');
  const langLink = target => `<a data-lang="${target}" lang="${target}" hreflang="${target}" aria-label="${target === 'en' ? 'English' : 'ภาษาไทย'}" ${lang === target ? 'aria-current="true"' : ''} href="${url(path,target)}">${target === 'en' ? 'EN' : 'TH'}</a>`;
  return `<a class="skip" href="#main">${t('Skip to content','ข้ามไปเนื้อหา')}</a>
<header class="site-header"><div class="wrap nav-inner">
  <a href="${url()}" class="brand" aria-label="SAITHONG STUDIO — ${t('Home','หน้าแรก')}"><img src="/assets/images/logo.webp" alt="SAITHONG STUDIO" width="150" height="44"></a>
  <nav class="main-nav" id="primary-nav" aria-label="${t('Main navigation','เมนูหลัก')}">${nav}<a class="mobile-contact" href="${url('contact/')}">${t('Contact','ติดต่อ')}</a></nav>
  <div class="nav-actions"><div class="languages" aria-label="${t('Language','ภาษา')}">${icon('globe')}${langLink('en')}<span aria-hidden="true">/</span>${langLink('th')}</div>
  <a class="nav-contact" href="${url('contact/')}">${icon('mail')}${t('Contact us','ติดต่อเรา')}</a>
  <button class="menu-button" type="button" aria-controls="primary-nav" aria-expanded="false" aria-label="${t('Navigation menu','เมนูนำทาง')}">${icon('menu')}${icon('close')}</button></div>
</div></header>`;
}
export function verifiedContactLinks(config) {
  return Object.entries(config.verifiedContacts).filter(([,v])=>v).map(([key,v]) => {
    let target = v;
    if(key === 'email') target='mailto:'+v;
    if(key === 'phone') target='tel:'+v.replace(/[^+\d]/g,'');
    const label = ({facebook:'Facebook',line:'LINE',instagram:'Instagram',youtube:'YouTube',tiktok:'TikTok'})[key] || v;
    return `<a href="${esc(target)}">${esc(label)}</a>`;
  }).join('');
}
function footer(ctx) {
  const {t,url,config}=ctx;
  const items = verifiedContactLinks(config);
  return `<footer><div class="wrap footer-grid"><div class="footer-brand"><a href="${url()}"><img src="/assets/images/logo.webp" alt="SAITHONG STUDIO" width="150" height="44" loading="lazy"></a><p>${t('Your Vision. Our Creativity. Endless Possibilities.','วิสัยทัศน์ของคุณ ความคิดสร้างสรรค์ของเรา ความเป็นไปได้ไม่รู้จบ')}</p></div>
  <div class="footer-links"><h2>${t('Explore','สำรวจ')}</h2>${navigation.slice(1).map(([r,e,h])=>`<a href="${url(r)}">${t(e,h)}</a>`).join('')}</div>
  <div class="footer-links"><h2>${t('Get in touch','ติดต่อสตูดิโอ')}</h2><a href="${url('contact/')}">${t('Project inquiry','สอบถามโปรเจกต์')}</a><a href="${url('contact/#inquiry')}">${t('Request a quote','ขอใบเสนอราคา')}</a>${items}</div></div>
  <div class="wrap footer-base"><span>© SAITHONG STUDIO</span><a href="${url('privacy/')}">${t('Privacy policy','นโยบายความเป็นส่วนตัว')}</a></div></footer>`;
}
export function invite({t,url}) {
  return `<section class="invite"><div class="wrap"><div>${eyebrow(t('Work with us','ร่วมงานกับเรา'))}<h2>${t('Start your project.','เริ่มต้นโปรเจกต์ของคุณ')}</h2><p>${t('Open for Thai & International Projects.','พร้อมร่วมงานทั้งในไทยและต่างประเทศ')}</p></div>${button(url('contact/#inquiry'),t('Request a quote','ขอใบเสนอราคา'),'light','mail')}</div></section>`;
}
export function pageIntro(ctx, tag, title, desc) {
  const section = ctx.path.split('/')[0];
  const art = ['about','services','portfolio','showreel','contact'].includes(section)
    ? '/assets/images/'+section+'-hero.webp' : '/assets/images/hero.webp';
  return `<section class="page-intro"><img src="${esc(art)}" alt="" class="intro-art" fetchpriority="high"><div class="intro-shade"></div><div class="wrap intro-inner">${eyebrow(tag)}<h1>${esc(title)}</h1><p class="intro-desc">${esc(desc)}</p></div></section>`;
}
export function page(ctx, meta, body) {
  const {t,url,path,lang,config} = ctx;
  const base = config.siteUrl;
  const canon = base ? base + url(path) : '';
  const metaUrl = canon ? `<link rel="canonical" href="${esc(canon)}"><meta property="og:url" content="${esc(canon)}">` : '';
  const alternatives = ['en','th','x-default'].map(l=>`<link rel="alternate" hreflang="${l}" href="${esc(base+url(path,l==='th'?'th':'en'))}">`).join('');
  const fullTitle = path ? meta.title+' | SAITHONG STUDIO' : 'SAITHONG STUDIO | '+meta.title;
  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(fullTitle)}</title><meta name="description" content="${esc(meta.description)}"><meta name="theme-color" content="#19191c">
${meta.noindex ? '<meta name="robots" content="noindex,follow">' : ''}${metaUrl}${alternatives}
<meta property="og:type" content="website"><meta property="og:site_name" content="SAITHONG STUDIO"><meta property="og:locale" content="${t('en_US','th_TH')}"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(meta.description)}"><meta property="og:image" content="${esc(base+(meta.image || '/assets/images/share.webp'))}"><meta property="og:image:alt" content="${esc(meta.imageAlt || 'SAITHONG STUDIO')}"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="/assets/images/favicon.png"><link rel="stylesheet" href="/assets/styles/site.css">
<script src="/assets/scripts/site.js" defer></script></head><body>${header(ctx)}
<main id="main" tabindex="-1">${body}</main>${footer(ctx)}</body></html>`;
}

