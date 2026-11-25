import { esc, eyebrow, button, pageIntro, sectionHead, verifiedContactLinks } from './layout.mjs';
import { icon } from './icons.mjs';
import { groups } from './services.mjs';

export function contact(ctx) {
  const {t,url,config}=ctx;
  const directLinks = verifiedContactLinks(config);
  function field(name, label, control, required = false, wide = false) {
    return `<div class="field${wide?' full':''}"><label for="${name}">${esc(label)}${required?' <span aria-hidden="true">*</span>':''}</label>${control}<span class="field-error" id="${name}-error"></span></div>`;
  }
  function input(name,label,type,auto,required=false,attrs='') {
    return field(name,label,`<input id="${name}" name="${name}" type="${type}" autocomplete="${auto}" aria-describedby="${name}-error" ${required?'required':''} ${attrs}>`,required);
  }
  const option=(v,label)=>`<option value="${esc(v)}">${esc(label)}</option>`;
  const select=(n,opts)=>`<select name="${n}" id="${n}" aria-describedby="${n}-error" required>${opts}</select>`;
  const serviceOpts=option('',t('Select a service','เลือกบริการ'))+groups.map(g=>`<optgroup label="${esc(t(...g.name))}">${g.services.map(([id,e,h])=>option(id,t(e,h))).join('')}</optgroup>`).join('')+option('other',t('Multiple services / please advise','หลายบริการ / ขอคำแนะนำ'));
  const budgetOpts=[
    ['','Select a budget','เลือกช่วงงบประมาณ'],['under-30000','Under ฿30,000','ต่ำกว่า 30,000 บาท'],['30000-99999','฿30,000–99,999','30,000–99,999 บาท'],['100000-299999','฿100,000–299,999','100,000–299,999 บาท'],['300000-plus','฿300,000 or more','300,000 บาทขึ้นไป'],['discuss','To be discussed','ขอปรึกษาก่อน']
  ].map(([v,e,h])=>option(v,t(e,h))).join('');
  const timelineOpts=[['','Select a timeline','เลือกกรอบเวลา'],['under-month','Within one month','ภายใน 1 เดือน'],['1-3-months','1–3 months','1–3 เดือน'],['3-6-months','3–6 months','3–6 เดือน'],['6-months-plus','More than 6 months','มากกว่า 6 เดือน'],['flexible','Flexible / to be discussed','ยืดหยุ่น / ขอปรึกษาก่อน']].map(([v,e,h])=>option(v,t(e,h))).join('');
  return pageIntro(ctx,t('Get in touch','ติดต่อเรา'),t('Contact us.','ติดต่อสตูดิโอ'),t('Tell us what you have in mind. We welcome briefs in Thai and English.','เล่าไอเดียของคุณให้เราฟัง ส่งรายละเอียดได้ทั้งภาษาไทยและภาษาอังกฤษ'))+
  `<section id="inquiry" class="section"><div class="wrap inquiry-grid"><aside><div class="inquiry-aside">${eyebrow(t('Request a quote','ขอใบเสนอราคา'))}<h2>${t('Send us your brief.','ส่งโจทย์งานให้เรา')}</h2><p>${t('Share your goals, deliverables and preferred schedule. A reference link helps us understand the style you have in mind.','บอกเป้าหมาย สิ่งที่ต้องการได้รับ และกำหนดเวลา ลิงก์อ้างอิงจะช่วยให้เราเข้าใจแนวทางที่คุณชอบ')}</p><a class="small-poster" href="${url('showreel/')}"><img src="${esc(config.showreel.poster)}" loading="lazy" alt=""><span>${icon('play')}${t('Studio showreel','ชมโชว์รีลสตูดิโอ')}</span></a>
  ${directLinks?`<div class="direct-links"><h3>${t('Direct contact','ช่องทางติดต่อโดยตรง')}</h3>${directLinks}</div>`:`<p class="contact-note">${t('The inquiry form is our published contact channel. Direct contact details are awaiting verification.','ติดต่อเราได้ผ่านแบบฟอร์มนี้ ช่องทางติดต่อโดยตรงอยู่ระหว่างการยืนยัน')}</p>`}</div></aside>
  <form class="inquiry-form" id="project-inquiry" name="project-inquiry" method="POST" action="${url('thank-you/')}" data-netlify="true" netlify-honeypot="bot-field" accept-charset="UTF-8">
  <input type="hidden" name="form-name" value="project-inquiry"><input type="hidden" name="language" value="${ctx.lang}"><p hidden><label>Leave this empty<input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
  <div class="form-title">${icon('brief')}<h2>${t('Project inquiry','แบบฟอร์มสอบถามโปรเจกต์')}</h2></div><p class="form-note">${t('Fields marked * are required. Budget ranges are in Thai baht.','กรุณากรอกช่องที่มีเครื่องหมาย * ช่วงงบประมาณใช้หน่วยบาท')}</p>
  <div class="form-grid">
  ${input('full-name',t('Full name','ชื่อและนามสกุล'),'text','name',true,'maxlength="150"')}
  ${input('company',t('Company','บริษัท / องค์กร'),'text','organization',false,'maxlength="200"')}
  ${input('email',t('Email','อีเมล'),'email','email',true,'maxlength="254"')}
  ${input('phone',t('Phone','เบอร์โทรศัพท์'),'tel','tel',false,'maxlength="40"')}
  ${input('country',t('Country','ประเทศ'),'text','country-name',true,'maxlength="100"')}
  ${field('service',t('Service type','ประเภทบริการ'),select('service',serviceOpts),true)}
  ${field('budget',t('Estimated budget','งบประมาณโดยประมาณ'),select('budget',budgetOpts),true)}
  ${field('timeline',t('Project timeline','กรอบเวลาโปรเจกต์'),select('timeline',timelineOpts),true)}
  ${field('details',t('Project details','รายละเอียดโปรเจกต์'),`<textarea name="details" id="details" rows="5" required maxlength="6000" aria-describedby="details-error" placeholder="${t('What would you like to create, and who is it for?','อยากสร้างผลงานแบบไหน และใครคือกลุ่มเป้าหมายของคุณ')}"></textarea>`,true,true)}
  ${field('reference',t('Reference URL (optional)','ลิงก์อ้างอิง (ถ้ามี)'),'<input type="url" id="reference" name="reference" maxlength="2000" placeholder="https://" pattern="https?://.+" aria-describedby="reference-error">',false,true)}
  <div class="field full consent"><label><input type="checkbox" name="consent" id="consent" value="yes" required aria-describedby="consent-error"><span>${t('I agree to the use of my information to respond to this inquiry, as described in the','ฉันยินยอมให้ใช้ข้อมูลเพื่อตอบกลับคำสอบถามนี้ตามที่ระบุใน')} <a href="${url('privacy/')}" target="_blank" rel="noopener">${t('privacy policy','นโยบายความเป็นส่วนตัว')}</a>. *</span></label><span class="field-error" id="consent-error"></span></div>
  </div><p role="alert" class="form-status" id="form-status" hidden></p><button type="submit" class="btn primary submit">${icon('mail')}${t('Send project inquiry','ส่งคำสอบถามโปรเจกต์')}</button>
  </form></div></section>
  <section class="section soft"><div class="wrap faq-width">${sectionHead(t('Before you send','ก่อนส่งคำสอบถาม'),t('Project questions.','คำถามเกี่ยวกับโปรเจกต์'))}
  ${[
    ['Can I request more than one service?','สอบถามหลายบริการพร้อมกันได้ไหม','Yes. Choose “Multiple services / please advise” and describe the combination of work you need.','ได้ เลือก “หลายบริการ / ขอคำแนะนำ” แล้วบอกประเภทงานที่ต้องการในช่องรายละเอียด'],
    ['What if the budget or dates are still open?','ยังไม่ทราบงบประมาณหรือกำหนดเวลา ต้องกรอกอย่างไร','Choose the discussion or flexible option. Mention any important dates, intended formats or budget constraints in your brief.','เลือกตัวเลือกขอปรึกษาก่อนหรือยืดหยุ่น แล้วแจ้งวันที่สำคัญ รูปแบบไฟล์ หรือข้อจำกัดด้านงบประมาณในรายละเอียด'],
    ['How should I share references?','ส่งงานอ้างอิงอย่างไร','Paste a viewable link to a mood board, shared folder or visual reference. Check that the studio can open it without requesting access.','ใส่ลิงก์มู้ดบอร์ด โฟลเดอร์ หรือภาพอ้างอิง และตรวจสอบสิทธิ์ให้สตูดิโอเปิดดูได้']
  ].map(([e,h,d,dh])=>`<details><summary>${t(e,h)}${icon('plus')}</summary><p>${t(d,dh)}</p></details>`).join('')}</div></section>`;
}

export function privacy(ctx) {
  const {t,url}=ctx;
  return pageIntro(ctx,t('Website information','ข้อมูลเว็บไซต์'),t('Privacy policy.','นโยบายความเป็นส่วนตัว'),t('How this website handles your project inquiry and language preference.','การจัดการข้อมูลที่คุณส่งผ่านแบบฟอร์มและการตั้งค่าภาษาของเว็บไซต์'))+
  `<article class="section"><div class="wrap reading">${[
    ['Information you share','ข้อมูลที่คุณส่ง','The project form collects your name, email, country, service, budget range, timeline, project description and consent. You can also share a company name, phone number and reference link. Please send only information relevant to the project.','แบบฟอร์มเก็บชื่อ อีเมล ประเทศ บริการที่สนใจ ช่วงงบประมาณ กรอบเวลา รายละเอียดโปรเจกต์ และการยินยอม คุณสามารถระบุบริษัท เบอร์โทรศัพท์ และลิงก์อ้างอิงเพิ่มเติมได้ กรุณาส่งเฉพาะข้อมูลที่เกี่ยวข้องกับงาน'],
    ['How the studio uses it','การใช้ข้อมูล','SAITHONG STUDIO uses inquiry details to understand the brief, discuss scope and timing, prepare a quotation and follow up on your request.','SAITHONG STUDIO ใช้ข้อมูลเพื่อทำความเข้าใจโจทย์ หารือขอบเขตและกำหนดเวลา จัดทำใบเสนอราคา และติดต่อกลับเกี่ยวกับคำขอของคุณ'],
    ['Form processing and email','ระบบรับข้อมูลและอีเมล','On the live Netlify site, Netlify Forms processes and stores submissions. When email notifications are enabled, inquiry details are also delivered to the studio’s designated inbox. Hosting and email providers process the information needed to deliver these services.','บนเว็บไซต์จริงที่โฮสต์กับ Netlify ระบบ Netlify Forms ประมวลผลและจัดเก็บคำสอบถาม เมื่อเปิดการแจ้งเตือนทางอีเมล รายละเอียดจะถูกส่งไปยังกล่องจดหมายที่สตูดิโอกำหนด ผู้ให้บริการโฮสต์และอีเมลประมวลผลข้อมูลที่จำเป็นต่อการให้บริการ'],
    ['Language preference','การจดจำภาษา','When you change the language, the site saves your choice in your browser’s local storage under saithong-language. You can remove this preference by clearing this site’s browser data.','เมื่อคุณเปลี่ยนภาษา เว็บไซต์จะบันทึกภาษาที่เลือกในพื้นที่จัดเก็บของเบราว์เซอร์ด้วยชื่อ saithong-language คุณสามารถลบการตั้งค่านี้โดยล้างข้อมูลเว็บไซต์ในเบราว์เซอร์'],
    ['Questions about your data','สอบถามเกี่ยวกับข้อมูลส่วนบุคคล','Use the project inquiry form to ask about access, correction or deletion of information you submitted. Include the email address used for your inquiry so the studio can locate the record and verify your request.','คุณสามารถใช้แบบฟอร์มสอบถามเพื่อขอเข้าถึง แก้ไข หรือลบข้อมูลที่เคยส่ง กรุณาระบุอีเมลที่ใช้ส่งคำสอบถามเพื่อให้สตูดิโอค้นหารายการและยืนยันคำขอของคุณ']
  ].map(([e,h,d,dh])=>`<section><h2>${t(e,h)}</h2><p>${t(d,dh)}</p></section>`).join('')}${button(url('contact/#inquiry'),t('Contact the studio','ติดต่อสตูดิโอ'),'stroke')}</div></article>`;
}
export function messagePage(ctx,missing) {
  const {t,url}=ctx;
  return `<section class="message-page"><div class="wrap">${eyebrow(missing ? '404' : 'SAITHONG STUDIO')}<h1>${missing?t('Page not found.','ไม่พบหน้าที่ต้องการ'):t('Thank you.','ขอบคุณที่สนใจร่วมงานกับเรา')}</h1><p>${missing?t('This page may have moved. Explore the portfolio or return to the studio homepage.','หน้านี้อาจถูกย้าย คุณสามารถชมผลงานหรือกลับไปยังหน้าแรกของสตูดิโอ'):t('We appreciate your interest in SAITHONG STUDIO. Explore our artwork while you plan your project.','ขอบคุณที่ให้ความสนใจ SAITHONG STUDIO ระหว่างวางแผนโปรเจกต์ คุณสามารถชมตัวอย่างผลงานของเราได้')}</p><div class="hero-actions">${button(url(),t('Back to home','กลับหน้าแรก'),'primary')}${button(url('portfolio/'),t('View portfolio','ชมผลงาน'),'outline')}</div></div></section>`;
}

