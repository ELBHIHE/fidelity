const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);
const el = (t, c, ...k) => { const e = document.createElement(t); if (c) e.className = c; e.append(...k); return e; };
let pw = sessionStorage.getItem('admin') || '', clients = [], requis = 10, dest = [];
const envoyes = new Set(), JOUR = 864e5;
const wa = (t, m) => 'https://wa.me/' + (t.startsWith('0') ? '212' + t.slice(1) : t) + '?text=' + encodeURIComponent(m);
const joli = t => /^0\d{9}$/.test(t) ? t.replace(/(\d{2})(?=\d)/g, '$1 ') : (/^\d{11,}$/.test(t) ? '+' + t : t);
const date = d => d ? new Date(d).toLocaleDateString('fr-FR') : 'Jamais';
const inactif = c => (Date.now() - new Date(c.derniere_visite || c.created_at)) / JOUR > 30;
const MODELES = {
  nouveaute: 'Bonjour {prenom} ! Nouveau à la carte : [nom de la crêpe]. Venez la goûter cette semaine, on vous attend 🥞',
  promo: 'Bonjour {prenom}, cette semaine : -20% sur [produit]. À très vite à la crêperie !',
  info: 'Bonjour {prenom}, une information : [horaires, fermeture exceptionnelle…]. Merci de votre fidélité !'
};
const AUD = { offres: c => c.offres, actifs: c => c.offres && !inactif(c), inactifs: c => c.offres && inactif(c) };

$$('[data-tab]').forEach(b => b.onclick = () => {
  $$('[data-tab]').forEach(x => x.classList.toggle('on', x === b));
  $$('.panel').forEach(p => p.hidden = p.id !== 'tab-' + b.dataset.tab);
});

function liste(id, items, msg) {
  const ul = $(id); ul.replaceChildren();
  if (!items.length) { ul.append(el('li', 'vide', 'Personne pour le moment.')); return; }
  items.forEach(c => {
    const a = el('a', 'wa', 'WhatsApp'); a.target = '_blank'; a.rel = 'noopener'; a.href = wa(c.telephone, msg(c.prenom));
    ul.append(el('li', '', el('span', '', c.prenom), a));
  });
}
function rendreApercu(s) {
  $('#k1').textContent = s.total; $('#k2').textContent = s.nouveaux; $('#k3').textContent = s.actifs; $('#k4').textContent = s.visites30;
  $('#k5').textContent = clients.reduce((n, c) => n + c.recompenses_dispo, 0);
  liste('#anniv', s.anniv, p => `Joyeux anniversaire ${p} ! Une crêpe vous attend chez nous aujourd’hui, offerte.`);
  liste('#inactifs', s.inactifs, p => `Bonjour ${p}, on ne vous a pas vu depuis un moment. Passez cette semaine : -20% sur votre crêpe.`);
}
function rendreClients() {
  const q = $('#q').value.trim().toLowerCase(), f = $('#filtre').value;
  const l = clients.filter(c => (!q || c.prenom.toLowerCase().includes(q) || c.telephone.includes(q.replace(/\s/g, ''))) &&
    (f === 'tous' || (f === 'offres' && c.offres) || (f === 'recompense' && c.recompenses_dispo > 0) || (f === 'inactifs' && inactif(c))));
  $('#nb').textContent = l.length + ' client(s) sur ' + clients.length;
  const tb = $('#lignes'); tb.replaceChildren();
  if (!l.length) { const td = el('td', 'vide', 'Aucun client trouvé.'); td.colSpan = 7; tb.append(el('tr', '', td)); return; }
  l.forEach(c => {
    const tel = el('a', '', joli(c.telephone)); tel.href = 'tel:+' + (c.telephone.startsWith('0') ? '212' + c.telephone.slice(1) : c.telephone);
    let act = el('span', 'vide', '');
    if (c.offres) { act = el('a', 'wa', 'WhatsApp'); act.href = wa(c.telephone, `Bonjour ${c.prenom}, `); act.target = '_blank'; act.rel = 'noopener'; }
    tb.append(el('tr', '',
      el('td', '', el('div', 'nom', el('span', 'av', (c.prenom.trim()[0] || '?').toUpperCase()), c.prenom)),
      el('td', '', tel),
      el('td', '', c.tampons + ' / ' + requis),
      el('td', '', c.recompenses_dispo ? el('span', 'chip rec', c.recompenses_dispo + ' à donner') : '—'),
      el('td', '', date(c.derniere_visite)),
      el('td', '', el('span', 'chip ' + (c.offres ? 'oui' : 'non'), c.offres ? 'Acceptées' : 'Refusées')),
      el('td', '', act)));
  });
}
function majProg() {
  const n = dest.filter(c => envoyes.has(c.telephone)).length;
  $('#prog').textContent = dest.length ? `${n} message(s) envoyé(s) sur ${dest.length}` : 'Aucun client ne correspond à ce choix.';
}
function envoyer(c, btn) {
  const m = $('#texte').value.trim(), e = $('#merr'); e.textContent = '';
  if (!m) { e.textContent = 'Écrivez d’abord un message.'; return; }
  if (/\[[^\]]*\]/.test(m)) { e.textContent = 'Remplacez le texte entre crochets avant l’envoi.'; return; }
  window.open(wa(c.telephone, m.replaceAll('{prenom}', c.prenom)), '_blank', 'noopener');
  envoyes.add(c.telephone); btn.textContent = 'Envoyé'; btn.classList.add('fait'); majProg();
}
function apercu() { $('#apercu').textContent = $('#texte').value.replaceAll('{prenom}', dest[0]?.prenom || 'Sara'); }
function rendreDest() {
  dest = clients.filter(AUD[$('#aud').value]);
  const ul = $('#dest'); ul.replaceChildren();
  dest.forEach(c => {
    const b = el('button', 'mini' + (envoyes.has(c.telephone) ? ' fait' : ''), envoyes.has(c.telephone) ? 'Envoyé' : 'Envoyer');
    b.type = 'button'; b.onclick = () => envoyer(c, b);
    ul.append(el('li', '', el('span', '', c.prenom + ' · ' + joli(c.telephone)), b));
  });
  majProg(); apercu();
}
$('#q').oninput = $('#filtre').onchange = rendreClients;
$('#aud').onchange = rendreDest;
$('#texte').oninput = apercu;
$$('[data-m]').forEach(b => b.onclick = () => { $('#texte').value = MODELES[b.dataset.m]; apercu(); });
$('#copier').onclick = async () => {
  try { await navigator.clipboard.writeText($('#texte').value); $('#merr').className = 'msg ok'; $('#merr').textContent = 'Message copié.'; }
  catch { $('#merr').className = 'msg err'; $('#merr').textContent = 'Copie impossible sur ce navigateur.'; }
};

async function charger() {
  $('#err').textContent = ''; $('#load').disabled = true;
  try {
    const h = { 'x-admin': pw };
    const [a, b] = await Promise.all([fetch('/api/stats', { headers: h }), fetch('/api/clients', { headers: h })]);
    const [s, c] = await Promise.all([a.json(), b.json()]);
    if (!a.ok) throw new Error(s.error); if (!b.ok) throw new Error(c.error);
    sessionStorage.setItem('admin', pw);
    clients = c.clients; requis = c.requis;
    $('#login').hidden = true; $('.app').hidden = false; $('#dash').hidden = false; $('#side').hidden = false;
    $('#texte').value = $('#texte').value || MODELES.nouveaute;
    rendreApercu(s); rendreClients(); rendreDest();
  } catch (e) { sessionStorage.removeItem('admin'); $('#err').textContent = e.message === 'Code incorrect' ? 'Mot de passe incorrect.' : e.message; }
  finally { $('#load').disabled = false; }
}
$('#f').onsubmit = e => { e.preventDefault(); pw = $('#pw').value; charger(); };
$('#voir').onclick = () => { const p = $('#pw'), v = p.type === 'password'; p.type = v ? 'text' : 'password'; $('#voir').textContent = v ? 'Masquer' : 'Afficher'; };
$('#out').onclick = () => { sessionStorage.removeItem('admin'); location.reload(); };
if (pw) charger();
