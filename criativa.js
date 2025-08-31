// Ano no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// Menu mobile
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('show');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

// ========= KATALO G =========
// Coloque imagens em /media/images/ e vídeos em /media/videos/
const ITEMS = [
  { id:'tasche1', type:'image',  src:'media/images/bolsa_patchwork.jpg',
    title:'Patchwork-Tasche „Frühling“', tags:['Taschen','Patchwork','Geschenk'], info:'100% Baumwolle, verstärkte Henkel.' },

  { id:'schuerze1', type:'image', src:'media/images/avental_personalizado.jpg',
    title:'Personalisierte Schürze', tags:['Schürzen','Personalisierung'], info:'Namensstickerei + Doppeltasche.' },

  { id:'etui1', type:'image',    src:'media/images/naehetui.jpg',
    title:'Näh-Etui', tags:['Accessoires','Organisation'], info:'Reissverschluss, wasserabweisender Stoff.' },

  { id:'video_local1', type:'video', src:'media/videos/time_lapse_costura.mp4',
    title:'Time-Lapse — Taschennäherei', tags:['Video','Prozess'], info:'Entstehung & Finish.' },

  { id:'yt1', type:'youtube', src:'https://www.youtube.com/embed/VIDEO_ID_AQUI',
    title:'Kollektion 2025 — Überblick', tags:['YouTube','Präsentation'], info:'Highlights & Bestseller.' },
];

// ===== Tags e busca =====
const ALL_TAGS = Array.from(new Set(ITEMS.flatMap(i=>i.tags))).sort();
const filtersEl = document.getElementById('filters');
const galleryEl = document.getElementById('gallery');
const searchEl  = document.getElementById('search');

let activeTag = 'Alle';
let currentIndex = -1; // para navegação no lightbox

function chip(name){
  const b = document.createElement('button');
  b.className = 'filter-chip';
  b.type = 'button';
  b.setAttribute('role','tab');
  b.textContent = name;
  b.addEventListener('click', ()=>{ activeTag = name; setActiveChip(); renderGallery(); });
  return b;
}
function setActiveChip(){
  [...filtersEl.children].forEach(el=>{
    el.classList.toggle('active', el.textContent === activeTag);
    el.setAttribute('aria-selected', el.textContent === activeTag ? 'true' : 'false');
  });
}
function renderChips(){
  filtersEl.innerHTML = '';
  filtersEl.appendChild(chip('Alle'));
  ALL_TAGS.forEach(t => filtersEl.appendChild(chip(t)));
  setActiveChip();
}

function filterItems(){
  const q = (searchEl.value||'').toLowerCase().trim();
  return ITEMS.filter(i=>{
    const byTag  = (activeTag==='Alle') || i.tags.includes(activeTag);
    const byText = !q || (i.title.toLowerCase().includes(q)
               || (i.info||'').toLowerCase().includes(q)
               || i.tags.join(' ').toLowerCase().includes(q));
    return byTag && byText;
  });
}

function ytThumb(url){
  const m = url.match(/embed\/([^?]+)/);
  const id = m ? m[1] : '';
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

function renderGallery(){
  const items = filterItems();
  galleryEl.setAttribute('aria-busy','true');
  galleryEl.innerHTML = '';

  items.forEach((i, idx)=>{
    const card = document.createElement('article');
    card.className = 'card-item';

    const media = document.createElement('div');
    media.className = 'card-media';
    media.tabIndex = 0;
    media.setAttribute('aria-label', `Ansehen: ${i.title}`);
    media.addEventListener('click', ()=> openLightboxByFilteredIndex(idx));
    media.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openLightboxByFilteredIndex(idx); }});

    if(i.type==='image'){
      const img = new Image(); img.loading = 'lazy'; img.src = i.src; img.alt = i.title;
      media.appendChild(img);
    }else if(i.type==='video'){
      const v = document.createElement('video');
      v.src = i.src; v.preload='metadata'; v.muted=true; v.playsInline=true;
      media.appendChild(v);
    }else if(i.type==='youtube'){
      const img = new Image(); img.loading='lazy'; img.alt=i.title;
      img.src = ytThumb(i.src);
      media.appendChild(img);
    }

    const body = document.createElement('div');
    body.className = 'card-body';
    body.innerHTML = `
      <h3 class="card-title">${i.title}</h3>
      <div class="card-tags">${i.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      ${i.info?`<div class="small" style="margin-top:6px;color:#6b7280">${i.info}</div>`:''}
      <div class="card-cta">
        <a href="#!" class="primary">Ansehen</a>
        <a href="index.html">Angebot anfragen</a>
      </div>`;
    body.querySelector('.primary').addEventListener('click', (e)=>{ e.preventDefault(); openLightboxByFilteredIndex(idx); });

    card.appendChild(media); card.appendChild(body);
    galleryEl.appendChild(card);
  });

  if(items.length===0){
    const empty = document.createElement('p');
    empty.className='small';
    empty.textContent = 'Keine Treffer. Bitte Filter oder Suchbegriff ändern.';
    galleryEl.appendChild(empty);
  }
  galleryEl.setAttribute('aria-busy','false');
}

searchEl.addEventListener('input', renderGallery);

// ===== Lightbox =====
const lb        = document.getElementById('lightbox');
const lbContent = document.getElementById('lbContent');
const lbCaption = document.getElementById('lbCaption');
const lbClose   = document.getElementById('lbClose');

lbClose.addEventListener('click', closeLightbox);
lb.addEventListener('click', e=>{ if(e.target===lb) closeLightbox(); });
document.addEventListener('keydown', e=>{
  if(lb.getAttribute('aria-hidden')==='false'){
    if(e.key==='Escape') closeLightbox();
    if(e.key==='ArrowRight') nextItem();
    if(e.key==='ArrowLeft') prevItem();
  }
});

function openLightbox(item){
  lbContent.innerHTML = '';
  if(item.type==='image'){
    const img = new Image(); img.src = item.src; img.alt = item.title;
    lbContent.appendChild(img);
  }else if(item.type==='video'){
    const v = document.createElement('video');
    v.src = item.src; v.controls = true; v.autoplay = true; v.playsInline = true;
    lbContent.appendChild(v);
  }else if(item.type==='youtube'){
    const iframe = document.createElement('iframe');
    iframe.width = 960; iframe.height = 540; iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.src = item.src + (item.src.includes('?') ? '&' : '?') + 'rel=0&modestbranding=1&autoplay=1';
    iframe.title = item.title; iframe.frameBorder = '0'; iframe.allowFullscreen = true;
    lbContent.appendChild(iframe);
  }
  lbCaption.textContent = item.title + (item.info? ' — ' + item.info : '');
  lb.setAttribute('aria-hidden','false');
  lbClose.focus();
}

function closeLightbox(){
  lb.setAttribute('aria-hidden','true');
  lbContent.innerHTML = '';
  currentIndex = -1;
}

function filteredItems(){
  return filterItems();
}

function openLightboxByFilteredIndex(idx){
  const items = filteredItems();
  currentIndex = idx;
  openLightbox(items[currentIndex]);
}

function nextItem(){
  const items = filteredItems();
  if(!items.length) return;
  currentIndex = (currentIndex + 1) % items.length;
  openLightbox(items[currentIndex]);
}
function prevItem(){
  const items = filteredItems();
  if(!items.length) return;
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  openLightbox(items[currentIndex]);
}

// Inicialização
renderChips();
renderGallery();
