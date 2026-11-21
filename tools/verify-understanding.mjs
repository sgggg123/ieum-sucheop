// 제출용 프로토타입의 실제 사용자 흐름과 미확인/만료 경계를 점검한다.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const root = fileURLToPath(new URL('..', import.meta.url));
const executablePath = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(candidate => candidate && existsSync(candidate));
if (!executablePath) throw new Error('Chrome 또는 Edge 경로를 CHROME_PATH에 지정하세요.');
const browser = await puppeteer.launch({ executablePath, headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.setDefaultTimeout(5000);
const base = pathToFileURL(path.join(root, 'prototype/app.html')).href;

async function screen(id) {
  await page.waitForFunction(value => document.querySelector('.scr.on')?.id === value, {}, id);
}
async function click(label) {
  await page.waitForFunction(text => [...document.querySelectorAll('.scr.on button, .scr.on a')].some(element => element.textContent.trim() === text), {}, label);
  const button = await page.evaluateHandle(text => [...document.querySelectorAll('.scr.on button, .scr.on a')].find(element => element.textContent.trim() === text), label);
  assert.ok(button.asElement(), `보이는 버튼 없음: ${label}`);
  await button.asElement().click();
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
async function explain(label) {
  await click('내 말로 설명하기'); await screen('B5b');
  await click(label); await click('설명 확인하기'); await screen('B5c');
}
async function counts(expected) {
  await screen('B5d');
  assert.deepEqual(await page.$$eval('#B5d .tb-stats b', items => items.map(item => Number(item.textContent))), expected);
}

try {
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(base + '?capture#/B3', { waitUntil: 'networkidle0' });
  assert.equal(await page.$$eval('#B1 a[href="#/B5"]', items => items.length), 0, '1단계에는 생활 안내 진입을 추가하지 않음');
  await page.click('#B3 .understanding-entry'); await screen('B5');
  await click('생활 안내 2개 확인하기'); await screen('B5a');
  assert.ok(await page.$eval('#B5a .tb-source', element => element.textContent.includes('11월 18일')));
  await click('내 말로 설명하기'); await screen('B5b');
  assert.equal(await page.$eval('#B5b button[type="submit"]', button => button.disabled), true);
  await click('일부만 설명'); await click('설명 확인하기'); await screen('B5c');
  assert.ok(await page.$eval('#B5c .tb-missing', element => element.textContent.includes('꼭 함께 나가 주세요')));
  await click('한 번 더 설명하기'); await screen('B5b');
  assert.equal(await page.$eval('#tb-answer', element => element.value), '현관 옆 지팡이를 챙겨 드릴게요.');
  await click('모두 설명'); await click('설명 확인하기'); await screen('B5c');
  await click('다음 안내 보기'); await screen('B5a');
  await click('내 말로 설명하기'); await screen('B5b');
  const unverified = '<img src=x onerror="window.testInjection=1"> 눈을 맞추지 않고 빠르게 이야기해요.';
  await page.type('#tb-answer', unverified); await click('설명 확인하기'); await screen('B5c');
  assert.equal(await page.$eval('#B5c .tb-answer p', element => element.textContent), unverified);
  assert.equal(await page.evaluate(() => window.testInjection), undefined, '사용자 입력은 HTML로 실행되지 않음');
  assert.equal(await page.$$eval('#B5c .tb-answer img', items => items.length), 0);
  assert.equal(await page.$eval('#B5c details', element => element.open), true);
  await click('한 번 더 설명하기'); await screen('B5b'); await click('설명 확인하기'); await screen('B5c');
  await click('확인 필요로 남기고 계속'); await counts([1, 1]);
  await click('필요한 안내 다시 확인하기'); await screen('B5a');
  assert.ok(await page.$eval('#B5a h2', element => element.textContent.includes('말을 걸 때는')));
  await explain('모두 설명'); await click('확인 마치기'); await counts([2, 0]);
  await click('처음부터 체험하기'); await screen('B5');
  await click('생활 안내 2개 확인하기'); await click('나중에 확인할게요'); await screen('B5a');
  await click('나중에 확인할게요'); await counts([0, 2]);
  await click('필요한 안내 다시 확인하기'); await click('내 말로 설명하기'); await screen('B5b');
  await page.type('#tb-answer', '임시 답변 표시');
  await page.$eval('[data-understanding-action="expire"]', button => button.click()); await screen('B5e');
  assert.equal(await page.$$eval('.understanding textarea', items => items.length), 0);
  assert.equal(await page.evaluate(() => [...document.querySelectorAll('.understanding')].some(item => /현관 옆 지팡이|임시 답변 표시/.test(item.textContent))), false);
  await page.evaluate(() => { location.hash = '#/B5b'; }); await screen('B5e');
  await click('1단계 정보로 돌아가기'); await screen('B1');
  await page.evaluate(() => { location.hash = '#/B3'; }); await screen('B3');
  await page.click('#B3 .understanding-entry'); await click('생활 안내 2개 확인하기');
  await page.setViewport({ width: 320, height: 568 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.equal(await page.$eval('.scr.on .ct', element => element.scrollWidth > element.clientWidth), false);
  await page.reload({ waitUntil: 'networkidle0' });
  await page.evaluate(() => { location.hash = '#/B5d'; }); await counts([0, 2]);
  assert.deepEqual(errors, []);
  console.log('통과: 원문 재안내, 재설명, 자유/부정 답변, 입력 이스케이프, 건너뛰기, 미확인 재개, 만료 후 제거, 새로고침 초기화, 모바일 너비');
} finally {
  await browser.close();
}
