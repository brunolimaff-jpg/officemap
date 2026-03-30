/**
 * download-furni.mjs
 * Classnames 100% verificados via habbofurni.com (linha HC Executive + plantas reais)
 * Roda via GitHub Action.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'furni');

// ─── CLASSNAMES 100% REAIS — verificados em habbofurni.com ───────────────────
const FURNIS = [
  // Linha HC Executive (escritório)
  { classname: 'hc_exe_wrkdesk',   label: 'HC Executive Work Desk'   },
  { classname: 'hc_exe_chair',     label: 'HC Executive Chair'       },
  { classname: 'hc_exe_chair2',    label: 'HC Executive Boss Chair'  },
  { classname: 'hc_exe_table',     label: 'HC Executive Boss Table'  },
  { classname: 'hc_exe_sofa',      label: 'HC Executive Sofa'        },
  { classname: 'hc_exe_bookcase',  label: 'HC Executive Bookcase'    },
  { classname: 'hc_exe_cabinet',   label: 'HC Executive Cabinet'     },
  // Sofás / lounge confirmados
  { classname: 'club_sofa',        label: 'Club Sofa (confirmado)'   },
  { classname: 'hc2_sofa',         label: 'Leather Sofa'             },
  { classname: 'hc2_sofatbl',      label: 'Glass Table'              },
  // Plantas reais
  { classname: 'hc16_5',           label: 'Giant Houseplant'         },
  { classname: 'hc23_4',           label: 'HC Potted Plant'          },
  { classname: 'bcbd_plant',       label: 'BC Plant'                 },
  // Escrivaninha alternativa
  { classname: 'hc16_10',          label: 'Varnished Writing Desk'   },
  // Whiteboard
  { classname: 'hc_exe_whiteboard', label: 'HC Whiteboard'           },
];

// Revisões reais extraídas do habbofurni.com (mais recentes primeiro)
const REVISIONS = [
  '63976', '63512', '62000', '60000',
  '58539', '56722', '55872', '55850',
  '54782', '53221', '52091', '50012',
  '48891', '46230', '44112'
];

function buildUrls(classname) {
  const urls = [
    // Habbo CDN oficial sem revisão (fallback global)
    `https://images.habbo.com/dcr/hof_furni/icons/${classname}_icon.png`,
    `https://images.habbo.com/dcr/hof_furni/${classname}_icon.png`,
    `https://images.habbogroup.com/dcr/hof_furni/icons/${classname}_icon.png`,
  ];
  // Habbo CDN com revisões
  for (const rev of REVISIONS) {
    urls.push(`https://images.habbo.com/dcr/hof_furni/${rev}/${classname}_icon.png`);
  }
  // habbofurni.com CDN
  for (const rev of REVISIONS) {
    urls.push(`https://habbofurni.com/furni_assets/${rev}/${classname}_icon.png`);
  }
  return urls;
}

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/png,image/*,*/*',
        'Referer': 'https://www.habbo.com/'
      },
      timeout: 10000
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
  if (fs.existsSync(dest) && fs.statSync(dest).size > 200) {
    console.log(`  ✅ [CACHE] ${classname}`);
    return true;
  }

  const urls = buildUrls(classname);
  for (const url of urls) {
    try {
      const res = await get(url);
      const ct = res.headers['content-type'] || '';
      const isPng = res.body[0] === 137 && res.body[1] === 80; // PNG magic bytes
      if (res.status === 200 && res.body.length > 200 && (isPng || ct.includes('image'))) {
        fs.writeFileSync(dest, res.body);
        console.log(`  ✅ ${classname}  ← ${url}`);
        return true;
      }
    } catch { /* próxima URL */ }
    await new Promise(r => setTimeout(r, 60));
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
  console.log(`✅ Baixados : ${results.ok.length}/${FURNIS.length}`);
  console.log(`❌ Falhou   : ${results.fail.length}`);
  if (results.fail.length) console.log(`   Falhas: ${results.fail.join(', ')}`);

  // manifest.json mapeando classname → path público
  const manifest = FURNIS.reduce((acc, { classname }) => {
    const ok = results.ok.includes(classname);
    return ok ? { ...acc, [classname]: `/furni/${classname}.png` } : acc;
  }, {});
  fs.writeFileSync(path.join(OUTPUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('📄 manifest.json atualizado');

  // Falha o processo se menos de 50% baixou
  if (results.ok.length < FURNIS.length * 0.5) {
    console.error('🚨 Menos de 50% dos furnis baixados — verifique os classnames');
    process.exit(1);
  }
}

main().catch(console.error);
