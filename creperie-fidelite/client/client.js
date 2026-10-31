const $ = s => document.querySelector(s);
async function api(url, opts) {
  const r = await fetch(url, opts), d = await r.json();
  if (!r.ok) throw new Error(d.error || 'Erreur');
  return d;
}
function afficher(c) {
  $('#form').hidden = true; $('#carte').hidden = false;
  $('#nom').textContent = 'Bonjour ' + c.prenom;
  $('#rec').textContent = c.tampons + ' tampon(s) sur ' + c.requis;
  $('#stamps').style.setProperty('--cols', Math.min(c.requis, 5));
  $('#stamps').innerHTML = Array.from({ length: c.requis }, (_, i) =>
    i === c.requis - 1 ? '<span class="s last">Offerte</span>' : `<span class="s ${i < c.tampons ? 'on' : ''}">${i + 1}</span>`).join('');
  const t = localStorage.getItem('tel');
  if (t && window.qrcode) { const q = qrcode(0, 'M'); q.addData('cf:' + t); q.make(); $('#qr').innerHTML = q.createSvgTag({ scalable: true, margin: 0 }); }
  const lien = location.origin + '/?ref=' + c.code_parrain;
  $('#lien').value = lien;
  $('#partage').href = 'https://wa.me/?text=' + encodeURIComponent('Rejoins La Crêperie et cumule des tampons pour gagner une crêpe offerte : ' + lien);
  $('#avis').hidden = !c.avis_url; if (c.avis_url) $('#avisLien').href = c.avis_url;
  const g = $('#cadeau');
  g.hidden = !c.recompenses_dispo;
  g.textContent = `${c.recompenses_dispo} crêpe(s) offerte(s) à récupérer en caisse`;
}
async function charger() {
  const t = localStorage.getItem('tel');
  if (!t) return;
  try { afficher(await api('/api/carte?telephone=' + encodeURIComponent(t))); }
  catch { localStorage.removeItem('tel'); }
}
$('#go').onclick = async () => {
  $('#err').textContent = '';
  try {
    const c = await api('/api/inscription', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prenom: $('#prenom').value, telephone: $('#tel').value,
        naissance: $('#naiss').value, consent: $('#consent').checked, ref: new URLSearchParams(location.search).get('ref') }) });
    localStorage.setItem('tel', c.telephone); await charger();
  } catch (e) { $('#err').textContent = e.message; }
};
$('#maj').onclick = charger;
$('#change').onclick = () => { localStorage.removeItem('tel'); location.reload(); };
charger();
$('#copier').onclick = async () => {
  try { await navigator.clipboard.writeText($('#lien').value); $('#copier').textContent = 'Lien copié'; }
  catch { $('#lien').select(); }
};
