import { icon } from './icons.mjs';
import { esc, eyebrow, button, sectionHead, invite, pageIntro } from './layout.mjs';
import { groups, stages } from './services.mjs';

export function picture(project, frame = 0) {
  return '/assets/projects/' + project.slug + '/' + project.gallery[frame].file;
}
function card(ctx, project) {
  const {get,url,config}=ctx;
  return `<article class="work-card" data-category="${esc(project.category)}"><a href="${url('portfolio/'+project.slug+'/')}">
    <div class="work-image"><img loading="lazy" width="640" height="400" src="${esc(picture(project))}" alt="${esc(get(project.gallery[0].alt))}"></div><div class="work-caption"><p>${esc(get(config.categories[project.category]))}</p><h3>${esc(get(project.title))}</h3></div></a></article>`;
}
function reelLink(ctx) {
  return `<a href="${ctx.url('showreel/#player')}" class="reel-poster" aria-label="${ctx.t('Watch the studio showreel','ชมโชว์รีลของสตูดิโอ')}"><img src="${esc(ctx.config.showreel.poster)}" alt="" loading="lazy" width="960" height="540"><span class="play-circle">${icon('play')}</span></a>`;
}
export function home(ctx) {
  const {t,url,config}=ctx;
  const services = groups.map(g=>`<a class="group-card" href="${url('services/#'+g.id)}">${icon(g.icon)}<h3>${t(...g.name)}</h3><p>${t(...g.short)}</p></a>`).join('');
  const featured = [config.projects[0],config.projects.find(p=>p.category==='spatial'),config.projects.find(p=>p.category==='digital')].filter((p,i,a)=>p && a.indexOf(p)===i);
  return `<section class="home-hero"><img class="hero-art" src="/assets/images/hero.webp" width="1084" height="578" alt="" fetchpriority="high"><div class="hero-shade"></div>
  <div class="wrap hero-content">${eyebrow(t('Multidisciplinary creative studio','สตูดิโอสร้างสรรค์หลากหลายสาขา'))}
  <h1>${t('Turning<br>Imagination<br>Into <em>Reality.</em>','เปลี่ยน<br>จินตนาการ<br><em>ให้เป็นจริง</em>')}</h1>
  <p class="hero-desc">${t('Design, animation and visual storytelling for Thai and international projects.','ออกแบบ สร้างแอนิเมชัน และเล่าเรื่องผ่านภาพ สำหรับโปรเจกต์ในไทยและต่างประเทศ')}</p>
  <div class="hero-actions">${button(url('showreel/#player'),t('View showreel','ชมโชว์รีล'),'primary','play')}${button('#services',t('Our services','บริการของเรา'),'outline')}</div></div></section>
  <div class="hero-strip"><div class="wrap"><span>${icon('globe')}${t('Thai & international projects','โครงการในไทยและต่างประเทศ')}</span><span>${icon('layers')}${t('End-to-end creative production','ผลิตงานสร้างสรรค์ครบวงจร')}</span><span>${icon('cube')}${t('2D, 3D & moving image','ภาพ 2 มิติ 3 มิติ และภาพเคลื่อนไหว')}</span></div></div>
  <section id="services" class="section services-preview"><div class="wrap">${sectionHead(t('Our services','บริการของเรา'),t('Multidisciplinary creative solutions.','งานสร้างสรรค์ครบทุกมิติ'),button(url('services/'),t('All services','บริการทั้งหมด'),'stroke'))}
  <div class="group-grid">${services}</div></div></section>
  <section class="section work-preview"><div class="wrap">${sectionHead(t('Portfolio','ผลงาน'),t('Selected artwork.','ผลงานคัดสรร'),button(url('portfolio/'),t('View portfolio','ชมผลงาน'),'stroke'))}
  <div class="work-grid">${featured.map(p=>card(ctx,p)).join('')}</div></div></section>
  <section class="section dark"><div class="wrap split feature-reel">${reelLink(ctx)}<div>${eyebrow(t('Showreel','โชว์รีล'))}<h2>${t('The studio in motion.','ภาพของสตูดิโอ ในจังหวะใหม่')}</h2><p>${esc(ctx.get(config.showreel.description))}</p>${button(url('showreel/'),t('Watch showreel','ชมโชว์รีล'),'primary','play')}</div></div></section>
  <section class="section"><div class="wrap">${sectionHead(t('Our process','ขั้นตอนการทำงาน'),t('From idea to delivery.','จากแนวคิดสู่การส่งมอบ'),button(url('process/'),t('Explore the process','ดูขั้นตอนการทำงาน'),'stroke'))}<ol class="stage-strip">${stages.map(([s,en,th])=>`<li>${icon(s)}<strong>${t(en,th)}</strong></li>`).join('')}</ol></div></section>${invite(ctx)}`;
}
export function services(ctx) {
  const {t,url}=ctx;
  return pageIntro(ctx,t('Creative services','บริการสร้างสรรค์'),t('Creative services.','บริการสร้างสรรค์'),t('From the first storyboard to the final render, find the right discipline for your brief.','ตั้งแต่สตอรีบอร์ดแรกจนถึงภาพเรนเดอร์สุดท้าย เลือกบริการที่เหมาะกับโจทย์ของคุณ'))+
    `<div class="wrap"><nav class="jump-nav" aria-label="${t('Service groups','หมวดบริการ')}">${groups.map(g=>`<a href="#${g.id}">${icon(g.icon)}${t(...g.name)}</a>`).join('')}</nav>
    ${groups.map(g=>`<section id="${g.id}" class="service-section"><div class="service-heading"><span class="big-icon">${icon(g.icon)}</span><h2>${t(...g.name)}</h2><p>${t(...g.intro)}</p></div><div class="service-list">${g.services.map(([key,e,h,ed,hd])=>`<article><h3>${t(e,h)}</h3><p>${t(ed,hd)}</p><a class="text-link" href="${url('contact/?service='+key+'#inquiry')}">${t('Request a quote','ขอใบเสนอราคา')}<span class="sr-only"> — ${t(e,h)}</span></a></article>`).join('')}</div></section>`).join('')}</div>${invite(ctx)}`;
}
export function portfolio(ctx) {
  const {t,config,get}=ctx;
  const filters = [['all',t('All work','ทั้งหมด')],...Object.entries(config.categories).map(([k,v])=>[k,get(v)])];
  return pageIntro(ctx,t('Studio portfolio','พอร์ตโฟลิโอ'),t('Portfolio & selected works.','ผลงานคัดสรรของสตูดิโอ'),t('Explore the studio’s visual range through details from our creative showcase banners.','สำรวจรูปแบบงานของสตูดิโอผ่านรายละเอียดที่คัดสรรจากแบนเนอร์แนะนำผลงาน'))+
    `<section class="section"><div class="wrap">${sectionHead(t('The collection','คอลเลกชัน'),t('Browse the artwork.','สำรวจผลงาน'))}<div class="filters" data-filters hidden role="group" aria-label="${t('Filter artwork by category','เลือกหมวดผลงาน')}">${filters.map(([k,v],i)=>`<button type="button" data-filter="${esc(k)}" aria-pressed="${i===0}">${esc(v)}</button>`).join('')}</div><p class="sr-only" aria-live="polite" id="filter-status"></p><div class="work-grid collection">${config.projects.map(p=>card(ctx,p)).join('')}</div></div></section>${invite(ctx)}`;
}
export function projectPage(ctx,p) {
  const {t,url,config,get}=ctx;
  const gallery = p.gallery.map((img,i)=>`<figure><a class="gallery-item" href="${esc(picture(p,i))}" data-gallery><img src="${esc(picture(p,i))}" alt="${esc(get(img.alt))}" loading="lazy"><span class="enlarge">${icon('expand')}</span></a><figcaption>${esc(get(img.alt))}</figcaption></figure>`).join('');
  return `<article class="section project-page"><div class="wrap"><nav class="crumb" aria-label="${t('Breadcrumb','เส้นทางนำทาง')}"><a href="${url('portfolio/')}">${t('Portfolio','ผลงาน')}</a><span>/</span>${esc(get(config.categories[p.category]))}</nav>
    <div class="project-intro"><div>${eyebrow(get(p.credit))}<h1>${esc(get(p.title))}</h1><p class="lead">${esc(get(p.subtitle))}</p></div><p>${esc(get(p.description))}</p></div>
    <div class="gallery">${gallery}</div><div class="project-back">${button(url('portfolio/'),t('All artwork','ผลงานทั้งหมด'),'stroke','grid')}${button(url('contact/#inquiry'),t('Discuss a project','ปรึกษาเรื่องโปรเจกต์'),'primary','mail')}</div></div></article>
    <dialog class="lightbox" aria-label="${t('Artwork gallery','แกลเลอรีผลงาน')}"><div class="lightbox-inner"><button class="lb-close" data-lb-close type="button" aria-label="${t('Close gallery','ปิดแกลเลอรี')}">${icon('close')}</button><figure><img data-lb-image alt=""><figcaption aria-live="polite" data-lb-caption></figcaption></figure><div class="lb-controls"><button type="button" data-lb-prev aria-label="${t('Previous image','ภาพก่อนหน้า')}">${icon('previous')}</button><span data-lb-count></span><button type="button" data-lb-next aria-label="${t('Next image','ภาพถัดไป')}">${icon('next')}</button></div></div></dialog>`;
}
export function about(ctx) {
  const {t,url}=ctx;
  return pageIntro(ctx,t('About us','เกี่ยวกับเรา'),t('About the studio.','เกี่ยวกับสตูดิโอ'),t('Your Vision. Our Creativity. Endless Possibilities.','วิสัยทัศน์ของคุณ ความคิดสร้างสรรค์ของเรา ความเป็นไปได้ไม่รู้จบ'))+
  `<section class="section"><div class="wrap split about-story"><div>${eyebrow(t('SAITHONG STUDIO','SAITHONG STUDIO'))}<h2>${t('A studio for visual storytelling.','สตูดิโอที่เล่าเรื่องผ่านภาพ')}</h2><p>${t('SAITHONG STUDIO brings illustration, moving image, digital worlds and spatial design into one creative practice. We work with Thai and international briefs across screen, print and physical environments.','SAITHONG STUDIO เชื่อมภาพประกอบ ภาพเคลื่อนไหว โลกดิจิทัล และการออกแบบพื้นที่ไว้ด้วยกัน เรารับโจทย์จากทั้งในไทยและต่างประเทศ ครอบคลุมสื่อหน้าจอ สิ่งพิมพ์ และพื้นที่จริง')}</p><p>${t('A project can start with a single character, a product sketch or an idea for a scene. We help translate that starting point into a visual direction and a practical production plan.','โปรเจกต์อาจเริ่มจากตัวละครหนึ่งตัว ภาพร่างสินค้า หรือไอเดียสำหรับฉาก เราช่วยพัฒนาจุดเริ่มต้นนั้นให้เป็นแนวทางภาพและแผนผลิตที่นำไปใช้ได้จริง')}</p>${button(url('portfolio/'),t('Explore our work','ชมผลงานของเรา'),'stroke')}</div><figure class="about-art"><img src="/assets/images/reel.webp" alt="${t('Character illustration across three visual styles','ภาพตัวละครในสามรูปแบบงานภาพ')}" loading="lazy"><figcaption>${t('Character artwork from the studio showcase','ภาพตัวละครจากแบนเนอร์แนะนำสตูดิโอ')}</figcaption></figure></div></section>
  <section class="section soft"><div class="wrap">${sectionHead(t('Our approach','แนวทางของเรา'),t('One brief, connected disciplines.','หนึ่งโจทย์ หลายความเชี่ยวชาญ'))}<div class="principles">${[
  ['search','Start with the story','เริ่มจากเรื่องราว','Understand who the work is for, where it will appear and what it needs to communicate.','ทำความเข้าใจผู้ชม ช่องทางใช้งาน และสิ่งที่ผลงานต้องการสื่อ'],
  ['layers','Build a shared direction','กำหนดทิศทางร่วมกัน','Use references, sketches and early explorations to make creative decisions together.','ใช้ภาพอ้างอิง ภาพร่าง และการทดลองเพื่อร่วมกันตัดสินใจ'],
  ['box','Design for delivery','ออกแบบให้พร้อมใช้งาน','Plan the formats and production details around the way the work will be used.','วางแผนรูปแบบไฟล์และรายละเอียดการผลิตให้เหมาะกับการใช้งานจริง']
  ].map(([i,e,h,d,dh])=>`<article>${icon(i)}<h3>${t(e,h)}</h3><p>${t(d,dh)}</p></article>`).join('')}</div></div></section>${invite(ctx)}`;
}
export function processPage(ctx) {
  const {t}=ctx;
  return pageIntro(ctx,t('Our process','ขั้นตอนการทำงาน'),t('From idea to delivery.','จากแนวคิดสู่การส่งมอบ'),t('A shared path through discovery, design, review and handover.','ทำงานร่วมกันตั้งแต่ทำความเข้าใจโจทย์ ออกแบบ ตรวจงาน จนถึงวันส่งมอบ'))+
  `<section class="section"><div class="wrap process-layout"><div><div class="sticky-heading">${eyebrow(t('Production workflow','กระบวนการผลิต'))}<h2>${t('How we work.','เราทำงานอย่างไร')}</h2><p>${t('The scope, review rounds and outputs are agreed for each brief.','เราตกลงขอบเขต รอบการตรวจ และสิ่งที่จะส่งมอบให้เหมาะกับแต่ละโจทย์')}</p></div></div><ol class="process-list">${stages.map(([i,e,h,d,dh])=>`<li>${icon(i)}<div><h3>${t(e,h)}</h3><p>${t(d,dh)}</p></div></li>`).join('')}</ol></div></section>${invite(ctx)}`;
}
export function showreel(ctx) {
  const {t,url,config,get}=ctx;
  return pageIntro(ctx,t('Motion showcase','ผลงานภาพเคลื่อนไหว'),t('Studio showreel.','โชว์รีลของสตูดิโอ'),get(config.showreel.description))+
  `<section class="section reel-section" id="player"><div class="wrap"><figure class="video-frame"><video controls playsinline preload="metadata" poster="${esc(config.showreel.poster)}" aria-label="${t('SAITHONG STUDIO silent artwork reel','วิดีโอรวมภาพผลงานของ SAITHONG STUDIO ไม่มีเสียง')}" aria-describedby="reel-caption"><source src="${esc(config.showreel.file)}" type="${config.showreel.file.endsWith('.webm')?'video/webm':'video/mp4'}"><a href="${esc(config.showreel.file)}">${t('Open the video file','เปิดไฟล์วิดีโอ')}</a></video><figcaption id="reel-caption"><strong>SAITHONG STUDIO</strong><span>${t('Studio artwork montage · Silent film','วิดีโอเรียงภาพผลงานสตูดิโอ · ไม่มีเสียง')}</span></figcaption></figure>
  ${config.showreel.scenes?.length ? `<details class="reel-guide"><summary>${t('Visual description of the reel','คำบรรยายภาพในโชว์รีล')}${icon('plus')}</summary><ol>${config.showreel.scenes.map(scene => `<li><strong>${esc(scene.time)}</strong><span>${esc(get(scene))}</span></li>`).join('')}</ol></details>` : ''}
  <div class="reel-notes"><div>${eyebrow(t('Inside the reel','ภายในโชว์รีล'))}<h2>${t('A closer look.','ชมรายละเอียด')}</h2></div><div><p>${t('The edit brings colour, line and form from the studio banners into motion. Explore the still artwork in the portfolio gallery.','งานตัดต่อชิ้นนี้นำสี เส้น และรูปทรงจากแบนเนอร์สตูดิโอมาสร้างจังหวะการเคลื่อนไหว ชมรายละเอียดภาพนิ่งได้ในแกลเลอรีผลงาน')}</p>${button(url('portfolio/'),t('View portfolio','ชมผลงาน'),'stroke')}</div></div></div></section>${invite(ctx)}`;
}

