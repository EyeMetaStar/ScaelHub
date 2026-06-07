const q = document.getElementById('q');
const go = document.getElementById('go');
const results = document.getElementById('results');
const gaeilge = document.getElementById('gaeilge');
const media = document.getElementById('media');

go.onclick = search;
q.onkeydown = e => { if(e.key === 'Enter') search(); };

async function search() {
  const term = q.value.trim();
  if(!term) return;
  results.innerHTML = '<p>Searching...</p>';

  let wikiLang = gaeilge.checked ? 'ga' : 'en';
  let url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;
  if(wikiLang === 'ga') url = `https://ga.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    
    let html = '';
    if(data.extract && data.extract !== '' && data.type !== 'disambiguation') {
      html += card(data.title, data.extract, data.content_urls?.desktop?.page);
    }

    // Add TV/Audio links if filter allows - this is the original TV part
    if(media.value === 'all' || media.value === 'tv') {
      html += tvCard(term);
    }

    results.innerHTML = html || '<p>No results yet. Try "1916", "An Gorta Mór", "Cork", "Maths timeline".</p>';
  } catch {
    results.innerHTML = '<p>Couldn’t fetch. Check spelling or try another term.</p>';
  }
}

function card(title, text, link) {
  return `<div class="card">
    <h3>${title}</h3>
    <p>${text}</p>
    ${link ? `<a href="${link}" target="_blank">Read full article →</a>` : ''}
  </div>`;
}

function tvCard(term) {
  const rte = `https://www.rte.ie/archives/collections/search/?q=${encodeURIComponent(term)}`;
  const tg4 = `https://www.tg4.ie/ga/search/?q=${encodeURIComponent(term)}`;
  return `<div class="card">
    <h3>TV + Audio Archives</h3>
    <p>Watch real clips + interviews. Free to watch, no login needed.</p>
    <a class="tv-link" href="${rte}" target="_blank">RTÉ Archives →</a>
    <a class="tv-link" href="${tg4}" target="_blank">TG4 Player →</a>
  </div>`;
} 
