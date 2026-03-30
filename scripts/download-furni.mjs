/**
 * download-furni.mjs
 * Roda com: node scripts/download-furni.mjs
 *
 * 1. Busca a Revision de cada furni via habboapi.site
 * 2. Baixa o PNG sprite isométrico via habbofurni.com/furni_assets
 * 3. Salva em /public/furni/{classname}.png
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'furni');

// ─── LISTA DE FURNIS DO ESCRITÓRIO ───────────────────────────────────────────
const FURNIS = [
  // Mesas de trabalho
  { classname: 'desk_computer',         label: 'Mesa c/ computador'      },
  { classname: 'office_computer',       label: 'Computador de escritório' },

  // Cadeiras
  { classname: 'office_chair',          label: 'Cadeira giratória'       },
  { classname: 'conf_chair',            label: 'Cadeira de reunião'       },

  // Mesa de reunião
  { classname: 'conf_table_wide',       label: 'Mesa de reunião larga'    },

  // Lounge
  { classname: 'club_sofa',             label: 'Sofá lounge'             },
  { classname: 'club_chair',            label: 'Poltrona lounge'         },

  // Decoração
  { classname: 'big_plant',             label: 'Planta grande'           },
  { classname: 'small_plant',           label: 'Planta pequena'          },
  { classname: 'office_whiteboard',     label: 'Quadro branco'           },

  // Recepção
  { classname: 'reception_counter',     label: 'Balcão recepção'         },

  // Chão
  { classname: 'floor_parquet',         label: 'Piso de madeira'         },
  { classname: 'office_rug',            label: 'Tapete escritório'        },

  // Outros
  { classname: 'bookcase',              label: 'Estante'                 },
  { classname: 'filing_cabinet',        label: 'Arquivo'                 },
  { classname: 'office_lamp',           label: 'Luminária'               },
  { classname: 'water_cooler',          label: 'Bebedouro'               },
  { classname: 'printer',              label: 'Impressora'              },
  { classname: 'whiteboard',            label: 'Quadro branco alt'       },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────
function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return resolve(get(res.headers.location));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks), headers: res.headers }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function getRevision(classname) {
  try {
    const res = await get(`https://habboapi.site/api/market/history?classname=${classname}&hotel=com&days=1`);
    if (res.status !== 200) return null;
    const json = JSON.parse(res.body.toString());
    if (!json || !json[0]) return null;
    return json[0].Revision || null;
  } catch { return null; }
}

async function downloadPng(url, dest) {
  const res = await get(url);
  if (res.status === 200 && res.headers['content-type']?.includes('image')) {
    fs.writeFileSync(dest, res.body);
    return true;
  }
  return false;
}

// ─── FALLBACK: tenta múltiplas URLs ─────────────────────────────────────────
const FALLBACK_REVISIONS = [63976, 63512, 58539, 55850, 53000, 49500, 45512, 40000, 36000];

async function downloadFurni(classname) {
  const dest = path.join(OUTPUT_DIR, `${classname}.png`);
  if (fs.existsSync(dest)) {
    console.log(`  ✅ [CACHE] ${classname}`);
    return true;
  }

  // Tenta via API primeiro
  const revision = await getRevision(classname);
  if (revision) {
    const url = `https://habbofurni.com/furni_assets/${revision}/${classname}_icon.png`;
    const ok = await downloadPng(url, dest);
    if (ok) { console.log(`  ✅ [API rev=${revision}] ${classname}`); return true; }
  }

  // Fallback: tenta revisões conhecidas
  for (const rev of FALLBACK_REVISIONS) {
    const url = `https://habbofurni.com/furni_assets/${rev}/${classname}_icon.png`;
    const ok = await downloadPng(url, dest);
    if (ok) { console.log(`  ✅ [FALLBACK rev=${rev}] ${classname}`); return true; }
  }

  console.log(`  ❌ [FALHOU] ${classname}`);
  return false;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`\n🪑 Habbo Furni Downloader — ${FURNIS.length} móveis\n`);

  const results = { ok: [], fail: [] };

  for (const furni of FURNIS) {
    process.stdout.write(`  ⬇️  ${furni.label} (${furni.classname})... `);
    const ok = await downloadFurni(furni.classname);
    (ok ? results.ok : results.fail).push(furni.classname);
    await new Promise(r => setTimeout(r, 200)); // rate limit gentil
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`✅ Baixados: ${results.ok.length}`);
  console.log(`❌ Falhou:   ${results.fail.length}`);
  if (results.fail.length) {
    console.log(`   Classnames com falha:\n   ${results.fail.join(', ')}`);
    console.log(`   → Tente rodar novamente ou adicione manualmente em /public/furni/`);
  }
  console.log(`\n📁 PNGs salvos em: public/furni/\n`);

  // Gera manifest.json com o que foi baixado
  const manifest = results.ok.reduce((acc, c) => ({ ...acc, [c]: `/furni/${c}.png` }), {});
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('📄 manifest.json gerado em public/furni/manifest.json');
}

main().catch(console.error);
