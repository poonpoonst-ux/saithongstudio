// Build both languages with Node.js alone. All visitor-facing content is static.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { context, page, esc } from '../src/layout.mjs';
import { home, about, services, portfolio, projectPage, processPage, showreel, picture } from '../src/pages.mjs';
import { contact, privacy, messagePage } from '../src/contact.mjs';

const root = fileURLToPath(new URL('../',import.meta.url));
const out = path.join(root,'public');
const config = JSON.parse(fs.readFileSync(path.join(root,'studio.config.json'),'utf8'));
const preview = !process.env.SITE_URL && !config.siteUrl && !process.env.URL;
const configuredOrigin = new URL(process.env.SITE_URL || config.siteUrl || process.env.URL || 'http://localhost:4173');
if (!['http:','https:'].includes(configuredOrigin.protocol) || configuredOrigin.pathname !== '/' || configuredOrigin.search || configuredOrigin.hash || configuredOrigin.username || configuredOrigin.password) {
  throw Error('siteUrl must be a full origin such as an https:// domain without a subdirectory.');
}
config.siteUrl = configuredOrigin.origin;

for (const [network, value] of Object.entries(config.verifiedContacts)) {
  if (!value) continue;
  if (network === 'email' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) continue;
  if (network === 'phone' && /^\+?[\d\s().-]{5,30}$/.test(value)) continue;
  if (!['email','phone'].includes(network) && new URL(value).protocol === 'https:') continue;
  throw Error('Check verifiedContacts.'+network);
}
function checkAsset(asset) {
  if (!asset.startsWith('/assets/') || asset.includes('..') || asset.includes('\\') || !fs.existsSync(path.join(out,asset))) throw Error('Missing or invalid asset: '+asset);
}
for (const asset of [config.showreel.file,config.showreel.poster,'/assets/images/hero.webp','/assets/images/share.webp','/assets/images/logo.webp','/assets/images/favicon.png']) checkAsset(asset);

const entries = [
  ['',home, ['Creative design & digital production studio','สตูดิโอออกแบบและผลิตสื่อสร้างสรรค์'],['Design, animation, game art and digital production by SAITHONG STUDIO. Explore creative services and studio artwork for Thai and international projects.','SAITHONG STUDIO รับออกแบบ แอนิเมชัน เกมอาร์ต และผลิตสื่อดิจิทัล สำรวจบริการสร้างสรรค์และผลงานสำหรับโปรเจกต์ในไทยและต่างประเทศ']],
  ['about/',about,['About us','เกี่ยวกับเรา'],['Meet SAITHONG STUDIO and discover our approach to illustration, moving image, digital worlds and spatial design.','ทำความรู้จัก SAITHONG STUDIO และแนวทางสร้างภาพประกอบ ภาพเคลื่อนไหว โลกดิจิทัล และพื้นที่จัดแสดง']],
  ['services/',services,['Creative services','บริการสร้างสรรค์'],['Explore our storyboard, character, animation, video, 3D, game, exhibition, product and packaging design services.','ค้นหาบริการสตอรีบอร์ด ออกแบบตัวละคร แอนิเมชัน วิดีโอ 3 มิติ เกม นิทรรศการ ผลิตภัณฑ์ และบรรจุภัณฑ์']],
  ['portfolio/',portfolio,['Portfolio & selected artwork','ผลงานคัดสรร'],['Browse SAITHONG STUDIO showcase artwork by discipline, from character studies to exhibition spaces and packaging.','ชมภาพผลงานจากแบนเนอร์สตูดิโอ แยกตามสาขา ตั้งแต่ตัวละครไปจนถึงพื้นที่จัดแสดงและบรรจุภัณฑ์']],
  ['showreel/',showreel,['Showreel','โชว์รีล'],[config.showreel.description.en,config.showreel.description.th]],
  ['process/',processPage,['Our process','ขั้นตอนการทำงาน'],['Follow the studio workflow from discovery and concept through design, review and final file delivery.','ดูขั้นตอนของสตูดิโอตั้งแต่รับโจทย์ พัฒนาแนวคิด ออกแบบ ตรวจแก้ จนถึงส่งมอบไฟล์']],
  ['contact/',contact,['Contact us & request a quote','ติดต่อเราและขอใบเสนอราคา'],['Send a project inquiry in Thai or English. Share your goals, required creative services, budget and timeline with SAITHONG STUDIO.','ส่งคำสอบถามหรือขอใบเสนอราคาเป็นภาษาไทยหรืออังกฤษ แจ้งเป้าหมาย บริการที่ต้องการ งบประมาณ และกรอบเวลากับ SAITHONG STUDIO']],
  ['privacy/',privacy,['Privacy policy','นโยบายความเป็นส่วนตัว'],['Learn how this studio website uses inquiry data, Netlify Forms and your saved language preference.','อ่านวิธีที่เว็บไซต์ใช้ข้อมูลคำสอบถาม ระบบ Netlify Forms และการจดจำภาษาที่เลือก']],
  ['thank-you/',ctx=>messagePage(ctx,false),['Thank you','ขอบคุณ'],['Thank you for your interest in SAITHONG STUDIO.','ขอบคุณที่สนใจร่วมงานกับ SAITHONG STUDIO'],true],
  ['404.html',ctx=>messagePage(ctx,true),['Page not found','ไม่พบหน้า'],['Find your way back to the studio homepage or portfolio.','กลับไปยังหน้าแรกหรือชมผลงานของสตูดิโอ'],true]
];
const slugs = new Set();
for (const p of config.projects) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) || slugs.has(p.slug)) throw Error('Each project needs a unique URL slug: '+p.slug);
  slugs.add(p.slug);
  if (!config.categories[p.category] || !p.gallery.length) throw Error('Check the category and gallery for '+p.slug);
  p.gallery.forEach((frame,i)=>{
    if (!frame.alt.en || !frame.alt.th || !/^[\w.-]+\.webp$/.test(frame.file)) throw Error('Check gallery alt text or filename for '+p.slug);
    checkAsset(picture(p,i));
  });
  entries.push(['portfolio/'+p.slug+'/',ctx=>projectPage(ctx,p),[p.title.en,p.title.th],[p.description.en,p.description.th],false,p]);
}
const files = new Set();
// Relative resource URLs and explicit index files work from a web server
// and when the owner opens the extracted folder directly in a browser.
function portableHtml(html, filename) {
  const folder = path.posix.dirname(filename);
  return html.replace(/\b(href|src|poster)="(\/(?!\/)[^"]*)"/g, (_, attribute, address) => {
    const [, pathname, suffix] = /^([^?#]*)(.*)$/.exec(address);
    const target = pathname.slice(1) + (pathname.endsWith('/') ? 'index.html' : '');
    const relative = path.posix.relative(folder, target);
    return attribute + '="' + relative + suffix + '"';
  });
}
function write(relative,content) {
  const dest = path.join(out,relative);
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.writeFileSync(dest,content.trimEnd()+'\n','utf8');
  files.add(relative);
}
const sitemap = [];
for (const lang of ['en','th']) {
  for (const [route,render,titles,descriptions,noindex=false,project] of entries) {
    const ctx = context(config,lang,route);
    const href = ctx.url(route);
    const filename = href.slice(1) + (href.endsWith('/') ? 'index.html' : '');
    const html = page(ctx,{
      title:ctx.t(...titles),description:ctx.t(...descriptions),noindex,
      image: project ? picture(project) : undefined,
      imageAlt:project ? ctx.get(project.gallery[0].alt) : undefined
    },render(ctx));
    write(filename,portableHtml(html,filename));
    // A server may show a 404 at an arbitrary depth. Those responses need
    // root-relative URLs, while the directly opened 404 file needs local ones.
    if (route === '404.html') write('errors/'+lang+'.html',html);
    if (!noindex) {
      const alternates=['en','th','x-default'].map(code=>`    <xhtml:link rel="alternate" hreflang="${code}" href="${esc(config.siteUrl+ctx.url(route,code==='th'?'th':'en'))}"/>`);
      sitemap.push(['  <url>',`    <loc>${esc(config.siteUrl+href)}</loc>`,...alternates,'  </url>'].join('\n'));
    }
  }
}
write('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemap.join('\n')}\n</urlset>`);
write('robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${config.siteUrl}/sitemap.xml`);
// Remove only obsolete pages previously emitted by this generator.
const manifest = path.join(root,'scripts/generated-pages.json');
if (fs.existsSync(manifest)) {
  for (const old of JSON.parse(fs.readFileSync(manifest,'utf8'))) {
    if (/^(?:th\/)?portfolio\/[a-z0-9-]+\/index\.html$/.test(old) && !files.has(old)) fs.rmSync(path.join(out,old),{force:true});
  }
}
fs.writeFileSync(manifest,JSON.stringify([...files].filter(f=>f.endsWith('.html') && !f.startsWith('errors/')),null,2)+'\n');
console.log(`Built ${entries.length*2} pages for ${config.siteUrl}.${preview?' Local preview origin. Netlify supplies its production URL on deploy.':''}`);

