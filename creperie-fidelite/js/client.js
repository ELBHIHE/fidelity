const $ = s => document.querySelector(s);
async function api(url, opts) {
  const r = await fetch(url, opts), d = await r.json();
  if (!r.ok) throw new Error(d.error || 'Erreur');
  return d;
}
function afficher(c) {
  $('#form').hidden = true; $('#carte').hidden = false;
  $('#nom').textContent = 'Bonjour ' + c.prenom;
  $('#stamps').innerHTML = Array.from({ length: 10 }, (_, i) =>
    `<span class="s ${i < c.tampons ? 'on' : ''}">${i + 1}</span>`).join('');
  $('#rec').textContent = c.recompenses_dispo
    ? `${c.recompenses_dispo} crêpe(s) offerte(s) à récupérer en caisse`
    : `Encore ${10 - c.tampons} crêpe(s) avant la crêpe offerte`;
}
async function charger() {
  const t = localStorage.getItem('tel');
  if (!t) return;
  try { afficher(await api('/api/carte?telephone=' + encodeURIComponent(t))); } catch { localStorage.removeItem('tel'); }
}
$('#go').onclick = async () => {
  $('#err').textContent = '';
  try {
    const c = await api('/api/inscription', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prenom: $('#prenom').value, telephone: $('#tel').value,
        naissance: $('#naiss').value, consent: $('#consent').checked })
    });
    localStorage.setItem('tel', c.telephone);
    afficher(c);
  } catch (e) { $('#err').textContent = e.message; }
};
$('#maj').onclick = charger;
charger();
