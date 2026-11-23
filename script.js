const $ = (id) => document.getElementById(id);
const question = $('pergunta');
const tribute = $('homenagem');
const questionTitle = $('titulo');
const yes = $('sim');
const no = $('nao');
const audio = $('musica');
const form = $('formulario');
const fields = ['mae', 'de', 'msg'].map((name) => form.elements.namedItem(name));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const defaultTitle = $('titulo-carta').textContent;
const defaultMessage = $('dedicatoria').textContent;

function renderLetter({ mae, de, msg }, title, message, signature) {
  title.textContent = mae ? 'Para você, ' + mae : defaultTitle;
  message.textContent = msg || defaultMessage;
  signature.textContent = de ? 'Com amor, ' + de : '';
  signature.hidden = !de;
}

function readFields() {
  return Object.fromEntries(fields.map((field) => [field.name, field.value.trim()]));
}

function renderPreview() {
  renderLetter(readFields(), $('previa-titulo'), $('previa-texto'), $('previa-assinatura'));
  $('aviso-link').textContent = '';
  $('link-manual').hidden = true;
}

const params = new URLSearchParams(window.location.search);
for (const field of fields) {
  field.value = (params.get(field.name) || '').slice(0, field.maxLength).trim();
}

const dedication = readFields();
if (dedication.mae) {
  questionTitle.textContent = dedication.mae + ' é a melhor mãe do mundo?';
}
renderLetter(dedication, $('titulo-carta'), $('dedicatoria'), $('assinatura'));
renderPreview();

const noLabels = ['Tem certeza?', 'Pensa bem…', 'Certeza mesmo?'];
let noAttempts = 0;
no.addEventListener('click', (event) => {
  const attempt = noAttempts++;
  no.textContent = noLabels[attempt % noLabels.length];
  if (!event.detail || reducedMotion.matches || attempt >= noLabels.length) {
    no.style.transform = '';
    return;
  }

  const space = (no.parentElement.clientHeight - no.offsetHeight) / 2;
  const distance = Math.max(0, Math.min(26, space));
  const direction = attempt % 2 === 0 ? -1 : 1;
  no.style.transform = 'translateY(' + (direction * distance) + 'px)';
});

reducedMotion.addEventListener('change', () => {
  no.style.transform = '';
});

function celebrate() {
  if (reducedMotion.matches) return;

  const hearts = $('coracoes');
  for (let index = 0; index < 14; index++) {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = '♥';
    heart.style.setProperty('--left', (4 + index * 7) + '%');
    heart.style.setProperty('--delay', (index % 5) * 90 + 'ms');
    hearts.append(heart);
  }
  window.setTimeout(() => hearts.replaceChildren(), 2000);
}

yes.addEventListener('click', () => {
  question.hidden = true;
  tribute.hidden = false;
  $('titulo-carta').focus();
  celebrate();

  audio.src = 'assets/musica.mp3';
  audio.play().catch(() => {
    if (!audio.error) $('aviso-musica').textContent = 'Toque no player para ouvir a música.';
  });
}, { once: true });

audio.addEventListener('playing', () => { $('aviso-musica').textContent = ''; });
audio.addEventListener('error', () => {
  $('aviso-musica').textContent = 'Não foi possível carregar a música.';
});

form.addEventListener('input', renderPreview);
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  for (const [name, value] of Object.entries(readFields())) {
    if (value) url.searchParams.set(name, value);
  }

  const manualLink = $('link-manual');
  const status = $('aviso-link');
  const linkInput = $('link');
  manualLink.hidden = true;
  status.textContent = '';

  try {
    await navigator.clipboard.writeText(url.href);
    status.textContent = 'Link copiado.';
  } catch {
    linkInput.value = url.href;
    manualLink.hidden = false;
    status.textContent = 'Selecione e copie o link.';
    linkInput.focus();
    linkInput.select();
  }
});
