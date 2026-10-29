const $ = s => document.querySelector(s);
async function envoyer(url, texte) {
  const m = $('#msg'); m.className = 'msg';
  try {
    const r = await fetch(url, { method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-pin': $('#pin').value },
      body: JSON.stringify({ telephone: $('#tel').value }) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error);
    m.classList.add('ok');
    m.textContent = texte(d);
    $('#tel').value = '';
  } catch (e) { m.classList.add('err'); m.textContent = e.message; }
}
$('#tampon').onclick = () => envoyer('/api/tampon', d =>
  `${d.prenom} : ${d.tampons}/10` + (d.recompenses_dispo ? ` – ${d.recompenses_dispo} crêpe(s) offerte(s) disponible(s)` : ''));
$('#reward').onclick = () => envoyer('/api/recompense', d => `Crêpe offerte validée pour ${d.prenom}`);
