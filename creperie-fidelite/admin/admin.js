const $ = s => document.querySelector(s);
let pw = sessionStorage.getItem('admin') || '';
const wa = (t, msg) => 'https://wa.me/' + (t.startsWith('0') ? '212' + t.slice(1) : t) + '?text=' + encodeURIComponent(msg);
function liste(id, items, msg) {
  const ul = $(id); ul.replaceChildren();
  if (!items.length) { ul.innerHTML = '<li class="vide">Personne pour le moment.</li>'; return; }
  items.forEach(c => {
    const li = document.createElement('li'), n = document.createElement('span'), a = document.createElement('a');
    n.textContent = c.prenom; a.textContent = 'Écrire sur WhatsApp'; a.target = '_blank'; a.rel = 'noopener';
    a.href = wa(c.telephone, msg(c.prenom)); li.append(n, a); ul.append(li);
  });
}
async function charger() {
  $('#err').textContent = '';
  try {
    const r = await fetch('/api/stats', { headers: { 'x-admin': pw } }), d = await r.json();
    if (!r.ok) throw new Error(d.error);
    sessionStorage.setItem('admin', pw);
    $('#login').hidden = true; $('#dash').hidden = false; $('#out').hidden = false;
    $('#k1').textContent = d.total; $('#k2').textContent = d.nouveaux;
    $('#k3').textContent = d.actifs; $('#k4').textContent = d.visites30;
    liste('#anniv', d.anniv, p => `Joyeux anniversaire ${p} ! Une crêpe vous attend chez nous aujourd’hui, offerte.`);
    liste('#inactifs', d.inactifs, p => `Bonjour ${p}, on ne vous a pas vu depuis un moment. Passez cette semaine : -20% sur votre crêpe.`);
  } catch (e) { sessionStorage.removeItem('admin'); $('#err').textContent = e.message; }
}
$('#load').onclick = () => { pw = $('#pw').value; charger(); };
$('#out').onclick = () => { sessionStorage.removeItem('admin'); location.reload(); };
if (pw) charger();
