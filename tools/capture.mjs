// 프로토타입·유저 플로우·파이프라인을 PNG로 캡처하고 기획서 PDF를 만듭니다.
// 사용: cd tools && npm install && node capture.mjs        (설치된 Chrome 또는 Edge 사용)
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = path.join(root, 'captures');
const screenArgument = process.argv.find(arg => arg.startsWith('--screens='));
const selectedScreens = screenArgument ? new Set(screenArgument.slice('--screens='.length).split(',')) : null;
mkdirSync(out, { recursive: true });
const chrome = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
].find(p => p && existsSync(p));
if (!chrome) throw new Error('Chrome을 찾지 못했습니다. CHROME_PATH 환경 변수로 경로를 지정하세요.');

const file = f => pathToFileURL(path.join(root, f)).href;
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--hide-scrollbars'] });
const page = await browser.newPage();
page.on('pageerror', e => console.error('페이지 오류:', e.message));
const settle = async () => {  // 글꼴은 화면에 나온 글자만큼 나중에 받으므로 다 받을 때까지 기다림
  await page.evaluate(() => document.fonts.ready);
  await page.waitForNetworkIdle({ idleTime: 300 });
};
const open = async (url, width, height, scale = 2) => {
  await page.setViewport({ width, height, deviceScaleFactor: scale });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await settle();
};
const go = async hash => {
  await page.evaluate(h => new Promise(r => {
    const id = h.replace(/^#\/?/, '');
    window.ieumUnderstanding?.capture(id);
    if (location.hash === h) window.ieumUnderstanding?.render(id);
    else location.hash = h;
    requestAnimationFrame(() => requestAnimationFrame(r));
  }), hash);
  await settle();
};
const shot = name => path.join(out, `${name}.png`);
let overflow = 0;

try {
// 1) 모바일 화면 (375×812, 2배). 내용이 화면보다 길면 캡처에서 잘리므로 알려 줌
await open(file('prototype/app.html') + '?capture', 375, 812);
const screenIds = await page.$$eval('.scr', s => s.map(e => e.id));
if (selectedScreens) for (const id of selectedScreens) {
  if (id !== 'A1-hc' && !screenIds.includes(id)) throw new Error(`없는 화면: ${id}`);
}
for (const id of screenIds.filter(id => !selectedScreens || selectedScreens.has(id))) {
  await go('#/' + id);
  const over = await page.$eval(`#${id} .ct`, c => c.scrollHeight - c.clientHeight).catch(() => 0);
  if (over > 0) { overflow++; console.warn(`${id}: 내용이 ${over}px 넘칩니다`); }
  await page.screenshot({ path: shot(id) });
}
if (!selectedScreens || selectedScreens.has('A1-hc')) {
  await open(file('prototype/app.html') + '?capture&hc#/A1', 375, 812);
  await page.screenshot({ path: shot('A1-hc') });
}

// 2) 담당자 콘솔 (1440 너비, 2배). 콘솔은 삭제되었으므로 파일이 있을 때만 캡처
if (existsSync(path.join(root, 'prototype/console.html'))) {
  await open(file('prototype/console.html'), 1440, 900);
  for (const id of await page.$$eval('.page', s => s.map(e => e.id))) {
    await go('#/' + id);
    await page.screenshot({ path: shot(id), fullPage: true });
  }
}

// 3) 유저 플로우: 전체 그림, 그리고 기획서용 ③ 구간(레인 이름 포함)
await open(file('ieum-userflow.html') + '?embed=1', 3740, 852);
await (await page.$('#canvas')).screenshot({ path: shot('userflow') });
await open(file('ieum-userflow.html'), 1400, 1200);
const box = await page.evaluate(() => {
  const b = document.getElementById('board');
  // shortcut: ③ 구간 좌표(1250·1270·510)를 고정값으로 씀, 유저 플로우 배치를 바꾸면 함께 고칠 것
  b.scrollLeft = 1250;  // ③ 시작(1370) - 레인 이름 칸(120)
  const r = b.getBoundingClientRect();
  return { x: r.left + 1, y: r.top + scrollY + 1 };
});
await page.screenshot({ path: shot('userflow-key'), clip: { x: box.x, y: box.y + 64, width: 1270, height: 510 } });

// 4) 파이프라인 (README.md의 Mermaid 그림)
const code = readFileSync(path.join(root, 'README.md'), 'utf8').match(/```mermaid\r?\n([\s\S]*?)```/)?.[1];
if (code) {
  // 기존 유저 플로우의 탐색/요청 상태와 분리하고, 네트워크 유휴 대신 렌더 완료를 기다린다.
  const pipelinePage = await browser.newPage();
  pipelinePage.on('pageerror', e => console.error('파이프라인 오류:', e.message));
  await pipelinePage.setViewport({ width: 2400, height: 1200, deviceScaleFactor: 2 });
  await pipelinePage.setContent(`<!doctype html><meta charset="utf-8">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-gov-dynamic-subset.min.css">
    <body style="margin:0;background:#fff"><div id="g" style="display:inline-block;padding:24px"></div>
    <script type="module">
      try {
      const { default: mermaid } = await import('https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs');
      mermaid.initialize({ startOnLoad: false });
      await document.fonts.load('15px "Pretendard GOV Variable"', '가나다라');
      await document.fonts.load('bold 15px "Pretendard GOV Variable"', '가나다라');
      const { svg } = await mermaid.render('pipeline', ${JSON.stringify(code)});
      document.getElementById('g').innerHTML = svg;
      const el = document.querySelector('#g svg');  // Mermaid는 너비를 화면에 맞춰 줄이므로 원래 크기로 되돌림
      el.style.maxWidth = 'none';
      el.setAttribute('width', el.viewBox.baseVal.width);
      el.setAttribute('height', el.viewBox.baseVal.height);
      await document.fonts.ready;
      window.done = true;
      } catch (error) { window.renderError = String(error); }
    </script>`, { waitUntil: 'domcontentloaded' });
  await pipelinePage.waitForFunction('window.done === true || window.renderError', { timeout: 30000 });
  const renderError = await pipelinePage.evaluate(() => window.renderError);
  if (renderError) throw new Error(`파이프라인 렌더링 실패: ${renderError}`);
  await (await pipelinePage.$('#g')).screenshot({ path: shot('pipeline') });
  await pipelinePage.close();
}

// 5) 기획서 PDF
if (existsSync(path.join(root, 'ieum-proposal.html'))) {
  const pdf = path.join(root, '이음수첩_기획서.pdf');
  await open(file('ieum-proposal.html'), 1280, 720, 1);
  await page.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true });
  console.log(`기획서 PDF: ${(statSync(pdf).size / 1024 / 1024).toFixed(1)}MB`);
}

console.log(overflow ? `완료 (넘치는 화면 ${overflow}개 확인 필요): ${out}` : `완료: ${out}`);
} finally {
  await browser.close();
}
