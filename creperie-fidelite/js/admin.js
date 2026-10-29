const $ = s => document.querySelector(s);
const wa = (t, msg) => 'https://wa.me/' + (t.startsWith('0') ? '212' + t.slice(1) : t) + '?text=' + encodeURIComponent(msg);
function liste(id, items, msg) {
  const ul = $(id); ul.replaceChildren();
  if (!items.length) { ul.textContent = 'Personne pour le moment.'; return; }
  items.forEach(c => {
    const li = document.createElement('li'), nom = document.createElement('span'), a = document.createElement('a');
    nom.textContent = c.prenom; a.textContent = 'WhatsApp'; a.target = '_blank'; a.rel = 'noopener';
    a.href = wa(c.telephone, msg(c.prenom));
    li.append(nom, a); ul.append(li);
  });
}
$('#load').onclick = async () => {
  $('#err').textContent = '';
  try {
    const r = await fetch('/api/stats', { headers: { 'x-admin': $('#pw').value } });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error);
    $('#k1').textContent = d.total; $('#k2').textContent = d.nouveaux;
    $('#k3').textContent = d.actifs; $('#k4').textContent = d.visites30;
    ['#stats', '#b1', '#b2'].forEach(s => $(s).hidden = false);
    liste('#anniv', d.anniv, p => `Joyeux anniversaire ${p} ! Une crêpe t’attend chez nous aujourd’hui, offerte.`);
    liste('#inactifs', d.inactifs, p => `Bonjour ${p}, on ne t’a pas vu depuis un moment. Passe cette semaine : -20% sur ta crêpe.`);
  } catch (e) { $('#err').textContent = e.message; }
};
