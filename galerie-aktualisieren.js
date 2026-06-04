// Dieses Skript liest alle Bilder aus dem "galerie/" Ordner
// und aktualisiert automatisch galerie.html und index.html.
// Danach wird alles auf GitHub gepusht.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;
const GALERIE_DIR = path.join(ROOT, 'galerie');
const GALERIE_HTML = path.join(ROOT, 'galerie.html');
const INDEX_HTML = path.join(ROOT, 'index.html');

// Alle JPG/PNG Dateien aus galerie/ lesen
const exts = ['.jpg', '.jpeg', '.JPG', '.JPEG', '.png', '.PNG'];
const files = fs.readdirSync(GALERIE_DIR)
  .filter(f => exts.includes(path.extname(f)))
  .sort();

console.log(`\n${files.length} Bilder gefunden im galerie/ Ordner:`);
files.forEach(f => console.log('  - ' + f));

// URL-Kodierung für Sonderzeichen
function encodeFilename(name) {
  return name.split('').map(c => {
    if (/[a-zA-Z0-9._~!$&'()*+,;=:@\-]/.test(c)) return c;
    return encodeURIComponent(c);
  }).join('');
}

// ---- galerie.html aktualisieren ----
let galHtml = fs.readFileSync(GALERIE_HTML, 'utf8');

// foto-grid Inhalt ersetzen
const fotoItems = files.map((f, i) => {
  const enc = encodeFilename(f);
  return `      <div class="foto-item" onclick="openLightbox('alle',${i})"><img src="galerie/${enc}" alt="Arbeit" loading="lazy" /></div>`;
}).join('\n');

galHtml = galHtml.replace(
  /(<div class="foto-grid">)[\s\S]*?(<\/div>)/,
  `$1\n${fotoItems}\n    $2`
);

// galleries JS-Array ersetzen
const jsArray = files.map(f => `      'galerie/${encodeFilename(f)}'`).join(',\n');
galHtml = galHtml.replace(
  /(const galleries = \{\s*alle: \[)[^]*?(\]\s*\};)/,
  `$1\n${jsArray}\n    $2`
);

fs.writeFileSync(GALERIE_HTML, galHtml, 'utf8');
console.log('\ngalerie.html aktualisiert.');

// ---- index.html "Unsere Arbeiten" Grid aktualisieren ----
let idxHtml = fs.readFileSync(INDEX_HTML, 'utf8');

const gridItems = files.map(f => {
  const enc = encodeFilename(f);
  return `      <div style="border-radius:var(--radius-md);overflow:hidden;aspect-ratio:4/3;cursor:pointer;" onclick="location.href='galerie.html'"><img src="galerie/${enc}" alt="Arbeit" loading="lazy" style="width:100%;height:100%;object-fit:cover;transition:transform .4s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" /></div>`;
}).join('\n');

idxHtml = idxHtml.replace(
  /(<div style="display:grid;grid-template-columns:repeat\(auto-fill[^"]*\)[^"]*">)\s*[\s\S]*?(\s*<\/div>\s*<\/div>\s*<\/section>\s*<!-- TEAM -->)/,
  `$1\n${gridItems}\n    $2`
);

fs.writeFileSync(INDEX_HTML, idxHtml, 'utf8');
console.log('index.html aktualisiert.');

// ---- Git commit & push ----
console.log('\nGit: Änderungen werden hochgeladen...');
try {
  execSync('git add galerie/ galerie.html index.html', { cwd: ROOT, stdio: 'inherit' });
  execSync(`git commit -m "Galerie aktualisiert: ${files.length} Bilder aus galerie/ Ordner"`, { cwd: ROOT, stdio: 'inherit' });
  execSync('git push origin master', { cwd: ROOT, stdio: 'inherit' });
  console.log('\n✓ Fertig! Die Webseite wurde aktualisiert und auf GitHub hochgeladen.');
} catch (e) {
  console.log('\nHinweis: Git-Fehler (möglicherweise keine Änderungen):', e.message);
}

console.log('\nDrücke Enter zum Beenden...');
process.stdin.once('data', () => process.exit(0));
process.stdin.resume();
