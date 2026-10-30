const $ = s => document.querySelector(s);
let pin = sessionStorage.getItem('pin') || '', flux = null, actif = false;
const vue = () => { $('#lock').hidden = !!pin; $('#work').hidden = !pin; $('#verrou').hidden = !pin; };
$('#ouvrir').onclick = () => {
  pin = $('#pin').value.trim(); $('#pin').value = ''; $('#perr').textContent = '';
  if (pin) sessionStorage.setItem('pin', pin);
  vue();
};
$('#verrou').onclick = () => { arreter(); pin = ''; sessionStorage.removeItem('pin'); vue(); };

function montrer(d) {
  $('#nom').textContent = d.prenom;
  $('#score').textContent = d.tampons + ' / ' + d.requis + ' tampons' +
    (d.recompenses_dispo ? ` – ${d.recompenses_dispo} crêpe(s) offerte(s) à donner` : '');
  $('#dots').replaceChildren(...Array.from({ length: d.requis }, (_, i) => {
    const s = document.createElement('span'); if (i < d.tampons) s.className = 'on'; return s; }));
  $('#res').hidden = false;
}
async function envoyer(url, succes) {
  const m = $('#msg'); m.className = 'msg'; m.textContent = '';
  try {
    const r = await fetch(url, { method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-pin': pin },
      body: JSON.stringify({ telephone: $('#tel').value }) });
    const d = await r.json();
    if (r.status === 401) { $('#verrou').click(); $('#perr').textContent = 'Code incorrect'; return; }
    if (!r.ok) throw new Error(d.error);
    m.classList.add('ok'); m.textContent = succes;
    montrer(d); $('#tel').value = ''; $('#tel').focus();
  } catch (e) { $('#res').hidden = true; m.classList.add('err'); m.textContent = e.message; }
}
$('#tampon').onclick = () => envoyer('/api/tampon', 'Tampon ajouté');
$('#reward').onclick = () => envoyer('/api/recompense', 'Crêpe offerte validée');

function arreter() {
  actif = false;
  if (flux) { flux.getTracks().forEach(t => t.stop()); flux = null; }
  $('#cam').hidden = true; $('#scan').hidden = false;
}
async function apresScan(t) {
  const m = $('#msg'); m.className = 'msg'; $('#tel').value = t;
  try {
    const r = await fetch('/api/carte?telephone=' + encodeURIComponent(t)), d = await r.json();
    if (!r.ok) throw new Error(d.error);
    montrer(d); m.classList.add('ok');
    m.textContent = d.recompenses_dispo ? 'Récompense disponible : validez la crêpe offerte.' : 'Carte lue. Choisissez une action.';
  } catch (e) { $('#res').hidden = true; m.classList.add('err'); m.textContent = e.message; }
}
async function scanner() {
  const m = $('#msg'); m.className = 'msg'; m.textContent = '';
  try { flux = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); }
  catch { m.classList.add('err'); m.textContent = 'Caméra inaccessible : autorisez-la dans le navigateur (connexion HTTPS requise).'; return; }
  const v = $('#video'); v.srcObject = flux; await v.play();
  $('#cam').hidden = false; $('#scan').hidden = true; actif = true;
  const c = document.createElement('canvas'), x = c.getContext('2d', { willReadFrequently: true });
  const boucle = () => {
    if (!actif) return;
    if (v.videoWidth) {
      c.width = Math.min(640, v.videoWidth); c.height = Math.round(v.videoHeight * c.width / v.videoWidth);
      x.drawImage(v, 0, 0, c.width, c.height);
      const r = jsQR(x.getImageData(0, 0, c.width, c.height).data, c.width, c.height);
      if (r && r.data.startsWith('cf:')) { arreter(); apresScan(r.data.slice(3)); return; }
    }
    requestAnimationFrame(boucle);
  };
  boucle();
}
$('#scan').onclick = scanner; $('#stopscan').onclick = arreter;
vue();
