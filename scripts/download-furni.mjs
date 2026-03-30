/**
 * download-furni.mjs
 * Usa o CDN oficial do Habbo (images.habbo.com) para baixar icones de furni.
 * Tambem tenta nitro CDN como fallback.
 * Roda via GitHub Action.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'furni');

// Furnis necessarios para o escritorio
const FURNIS = [
  { classname: 'desk_computer',     label: 'Mesa com computador'    },
  { classname: 'office_computer',   label: 'PC escritorio'          },
  { classname: 'office_chair',      label: 'Cadeira giratoria'      },
  { classname: 'conf_chair',        label: 'Cadeira reuniao'        },
  { classname: 'conf_table_wide',   label: 'Mesa reuniao'           },
  { classname: 'club_sofa',         label: 'Sofa lounge'            },
  { classname: 'club_chair',        label: 'Poltrona lounge'        },
  { classname: 'big_plant',         label: 'Planta grande'          },
  { classname: 'small_plant',       label: 'Planta pequena'         },
  { classname: 'office_whiteboard', label: 'Quadro branco'          },
  { classname: 'bookcase',          label: 'Estante'                },
  { classname: 'filing_cabinet',    label: 'Arquivo'                },
  { classname: 'water_cooler',      label: 'Bebedouro'              },
  { classname: 'printer',           label: 'Impressora'             },
  // Alternativas com classnames canonicos do Habbo
  { classname: 'habboc_chair',      label: 'HC Chair'               },
  { classname: 'habboc_desk',       label: 'HC Desk'                },
  { classname: 'habboc_sofa',       label: 'HC Sofa'                },
  { classname: 'habboc_table',      label: 'HC Table'               },
  { classname: 'habboc_plant',      label: 'HC Plant'               },
  { classname: 'floor_parquet',     label: 'Piso parquet'           },
  { classname: 'room_rug_big',      label: 'Tapete grande'          },
];

// Fontes de download em ordem de prioridade
function buildUrls(classname) {
  return [
    // Habbo CDN oficial - icon pequeno
    `https://images.habbo.com/dcr/hof_furni/icons/${classname}_icon.png`,
    // Habbo CDN sem pasta icons
    `https://images.habbo.com/dcr/hof_furni/${classname}_icon.png`,
    // Habbo assets alternativo
    `https://images.habbogroup.com/dcr/hof_furni/icons/${classname}_icon.png`,
    // Sulake CDN
    `https://images.habbo.com/dcr/hof_furni/56722/${classname}_icon.png`,
    `https://images.habbo.com/dcr/hof_furni/55872/${classname}_icon.png`,
    `https://images.habbo.com/dcr/hof_furni/54782/${classname}_icon.png`,
    `https://images.habbo.com/dcr/hof_furni/53221/${classname}_icon.png`,
    `https://images.habbo.com/dcr/hof_furni/52091/${classname}_icon.png`,
    `https://images.habbo.com/dcr/hof_furni/50012/${classname}_icon.png`,
    `https://images.habbo.com/dcr/hof_furni/48891/${classname}_icon.png`,
    `https://images.habbo.com/dcr/hof_furni/46230/${classname}_icon.png`,
    `https://images.habbo.com/dcr/hof_furni/44112/${classname}_icon.png`,
    `https://images.habbo.com/dcr/hof_furni/63976/${classname}_icon.png`,
    `https://images.habbo.com/dcr/hof_furni/63512/${classname}_icon.png`,
    `https://images.habbo.com/dcr/hof_furni/62000/${classname}_icon.png`,
    // habbofurni.com CDN
    `https://habbofurni.com/furni_assets/63976/${classname}_icon.png`,
    `https://habbofurni.com/furni_assets/63512/${classname}_icon.png`,
    `https://habbofurni.com/furni_assets/58539/${classname}_icon.png`,
    `https://habbofurni.com/furni_assets/55850/${classname}_icon.png`,
    `https://habbofurni.com/furni_assets/52091/${classname}_icon.png`,
    // Nitro imager
    `https://images.habbo.com/dcr/hof_furni/${classname}.png`,
  ];
}

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/png,image/*,*/*',
        'Referer': 'https://www.habbo.com/'
      },
      timeout: 8000
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        if (res.headers.location) return resolve(get(res.headers.location));
        return resolve({ status: res.statusCode, body: Buffer.alloc(0), headers: res.headers });
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks), headers: res.headers }));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function downloadFurni({ classname }) {
  const dest = path.join(OUTPUT_DIR, `${classname}.png`);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 100) {
    console.log(`  ✅ [CACHE] ${classname}`);
    return true;
  }

  const urls = buildUrls(classname);
  for (const url of urls) {
    try {
      const res = await get(url);
      const ct = res.headers['content-type'] || '';
      if (res.status === 200 && res.body.length > 100 && (ct.includes('image') || ct.includes('octet-stream') || res.body[0] === 137)) {
        fs.writeFileSync(dest, res.body);
        console.log(`  ✅ ${classname}  ← ${url}`);
        return true;
      }
    } catch { /* continua */ }
    await new Promise(r => setTimeout(r, 80));
  }

  console.log(`  ❌ [FALHOU] ${classname}`);
  return false;
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`\n🪑 Habbo Furni Downloader — ${FURNIS.length} móveis\n`);

  const results = { ok: [], fail: [] };
  for (const furni of FURNIS) {
    const ok = await downloadFurni(furni);
    (ok ? results.ok : results.fail).push(furni.classname);
  }

  console.log(`\n─────────────────────────────────`);
  console.log(`✅ Baixados : ${results.ok.length}`);
  console.log(`❌ Falhou   : ${results.fail.length}`);
  if (results.fail.length) console.log(`   ${results.fail.join(', ')}`);

  const manifest = results.ok.reduce((acc, c) => ({ ...acc, [c]: `/furni/${c}.png` }), {});
  fs.writeFileSync(path.join(OUTPUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('📄 manifest.json atualizado');
}

main().catch(console.error);
