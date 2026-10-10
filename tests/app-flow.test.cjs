const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

// This double tests screen state and learning flows, not browser layout.
function createApp(savedProgress = null, savedEntries = []) {
  const nodes = new Map();
  const handlers = {};
  const storage = new Map([...savedEntries, ...(savedProgress ? [['le-defi-francais-progress', savedProgress]] : [])]);
  function element(tagName = 'div') {
    const listeners = {};
    return {
      tagName: tagName.toUpperCase(), children: [], dataset: {}, hidden: false,
      disabled: false, value: '', textContent: '', className: '', open: false,
      classList: { add() {} }, focus() {}, setAttribute(name, value) { this[name] = value; },
      addEventListener(type, callback) { (listeners[type] ??= []).push(callback); },
      fire(type) { for (const callback of listeners[type] || []) callback(); },
      click() { if (!this.disabled) for (const callback of listeners.click || []) callback(); },
      append(...children) { this.children.push(...children); },
      replaceChildren(...children) { this.children = children; },
    };
  }
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  for (const match of html.matchAll(/<([a-z]+)[^>]*\bid="([^"]+)"/g)) nodes.set(match[2], element(match[1]));
  const document = {
    documentElement: element('html'),
    querySelectorAll() { return []; },
    getElementById(id) { assert.ok(nodes.has(id), `Missing HTML element: ${id}`); return nodes.get(id); },
    createElement: element,
    addEventListener(type, callback) { handlers[type] = callback; },
  };
  const context = { document, localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) } };
  context.window = context;
  context.scrollTo = () => {};
  context.confirm = () => true;
  vm.createContext(context);
  for (const file of ['quiz-engine.js', 'questions.js', 'lessons.js', 'advanced-lessons.js', 'situations.js', 'tense-course.js', 'reading-situations.js', 'journey-extra.js', 'tense-transfer.js', 'writing-data.js', 'tcf-data.js', 'app.js', 'learning-paths.js', 'course-ui.js', 'writing-ui.js', 'tcf-ui.js', 'levels-ui.js', 'journey-ui.js', 'theme.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
  }
  return { nodes, context, storage, handlers };
}
test('one journey starts at level 1, unlocks level 2 after passing, and restores progress', () => {
  const app = createApp();
  assert.equal(app.nodes.get('journey-list').children.length, 24);
  assert.equal(app.nodes.get('journey-list').children[0].children.at(-1).disabled, false);
  assert.equal(app.nodes.get('journey-list').children[1].children.at(-1).disabled, true);
  assert.equal(app.nodes.get('journey-heading').textContent, 'Parler d’aujourd’hui');
  assert.match(app.nodes.get('journey-progress-ring').style, /0deg/);
  app.nodes.get('journey-list').children[0].children.at(-1).click();
  assert.equal(app.nodes.get('home-page').hidden, false, 'map selection should not launch a quiz');
  app.nodes.get('journey-continue').click();
  assert.equal(app.nodes.get('question-number').textContent, '1 / 12');
  for (let index = 0; index < 12; index += 1) { choose(app, true); app.nodes.get('next').click(); }
  assert.match(app.nodes.get('result-message').textContent, /niveau 2/i);
  app.nodes.get('result-level-next').click();
  assert.equal(app.nodes.get('journey-list').children[1].children.at(-1).disabled, false);
  assert.match(app.nodes.get('journey-progress-ring').style, /15deg/);
  const restored = createApp(app.storage.get('le-defi-francais-progress'));
  assert.equal(restored.nodes.get('journey-list').children[1].children.at(-1).disabled, false);
  assert.equal(restored.nodes.get('journey-heading').textContent, 'Raconter hier et demain');
});
test('only the selected mission exposes teaching text and completed levels can be revisited', () => {
  const app = createApp();
  assert.equal(app.nodes.get('journey-teach').textContent.length > 30, true);
  for (const card of app.nodes.get('journey-list').children) {
    assert.equal(card.children.some((child) => child.className === 'journey-teach'), false);
  }
  app.nodes.get('journey-continue').click();
  for (let index = 0; index < 12; index += 1) { choose(app, true); app.nodes.get('next').click(); }
  app.nodes.get('result-level-next').click();
  app.nodes.get('journey-list').children[0].children.at(-1).click();
  assert.equal(app.nodes.get('journey-heading').textContent, 'Parler d’aujourd’hui');
  app.nodes.get('journey-continue').click();
  assert.equal(app.nodes.get('practice-topic').textContent, 'Les bases · Niveau 1');
});
test('the journey has six chapters, six mixed bosses, and only existing questions', () => {
  const app = createApp();
  const stages = vm.runInContext('journeyStages', app.context);
  assert.equal(stages.length, 24);
  assert.equal(stages.filter((stage) => stage.boss).length, 6);
  assert.equal(new Set(stages.map((stage) => stage.chapter)).size, 6);
  for (const [index, stage] of stages.entries()) {
    assert.equal(stage.ids.length, stage.boss ? index === 23 ? 20 : 16 : 12, `level ${index + 1}`);
    assert.equal(stage.ids.filter((id) => id.startsWith('deep-')).length, 4, `new material in level ${index + 1}`);
    assert.equal(new Set(stage.ids).size, stage.ids.length, `no repeated question within level ${index + 1}`);
    for (const id of stage.ids) assert.ok(app.context.FRENCH_CARDS.some((card) => card.id === id), id);
  }
  for (let chapter = 0; chapter < 6; chapter += 1) {
    const start = chapter * 4;
    const final = stages[start + 3];
    for (const taught of stages.slice(start, start + 3)) {
      assert.ok(final.ids.filter((id) => taught.ids.includes(id)).length >= 4, `${final.title} should revisit each taught level`);
    }
  }
  assert.equal(app.nodes.get('journey-tcf-final').disabled, true);
});
test('a section final requires mastery and unlocks the next chapter', () => {
  const app = createApp(JSON.stringify({ streak: 0, mistakes: [], answered: 0, correct: 0, levels: {}, journey: { 1: true, 2: true, 3: true } }));
  app.nodes.get('journey-list').children[3].children.at(-1).click();
  app.nodes.get('journey-continue').click();
  assert.equal(app.nodes.get('session-progress').max, 16);
  for (let index = 0; index < 16; index += 1) { choose(app, index < 12); app.nodes.get('next').click(); }
  assert.match(app.nodes.get('result-message').textContent, /13/);
  app.nodes.get('result-level-next').click();
  assert.equal(app.nodes.get('journey-list').children[4].children.at(-1).disabled, true);
  app.nodes.get('journey-list').children[3].children.at(-1).click();
  app.nodes.get('journey-continue').click();
  for (let index = 0; index < 16; index += 1) { choose(app, index < 13); app.nodes.get('next').click(); }
  app.nodes.get('result-level-next').click();
  assert.equal(app.nodes.get('journey-list').children[4].children.at(-1).disabled, false);
});
test('the TCF mock exam is the map destination after all six finals', () => {
  const journey = Object.fromEntries(Array.from({ length: 24 }, (_, index) => [index + 1, true]));
  const app = createApp(JSON.stringify({ streak: 0, mistakes: [], answered: 0, correct: 0, levels: {}, journey }));
  assert.equal(app.nodes.get('journey-tcf-final').disabled, false);
  assert.match(fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8'), /id="journey-tcf-final"[^>]*>.*Épreuve blanche TCF/);
});
test('previous sixteen-level progress continues at level 17 and later passes survive reopening', () => {
  const journey = Object.fromEntries(Array.from({ length: 16 }, (_, index) => [index + 1, true]));
  const app = createApp(JSON.stringify({ streak: 0, mistakes: [], answered: 0, correct: 0, levels: {}, journey }));
  assert.match(app.nodes.get('journey-level-label').textContent, /17 \/ 24/);
  assert.equal(app.nodes.get('journey-list').children[16].children.at(-1).disabled, false);
  assert.equal(app.nodes.get('journey-tcf-final').disabled, true);
  app.nodes.get('journey-continue').click();
  for (let index = 0; index < 12; index += 1) { choose(app, true); app.nodes.get('next').click(); }
  const restored = createApp(app.storage.get('le-defi-francais-progress'));
  assert.equal(restored.nodes.get('journey-list').children[17].children.at(-1).disabled, false);
});
test('the grand final needs 17 of 20 answers before the TCF destination unlocks', () => {
  const journey = Object.fromEntries(Array.from({ length: 23 }, (_, index) => [index + 1, true]));
  const app = createApp(JSON.stringify({ streak: 0, mistakes: [], answered: 0, correct: 0, levels: {}, journey }));
  app.nodes.get('journey-continue').click();
  assert.equal(app.nodes.get('session-progress').max, 20);
  for (let index = 0; index < 20; index += 1) { choose(app, index < 16); app.nodes.get('next').click(); }
  assert.match(app.nodes.get('result-message').textContent, /17/);
  app.nodes.get('result-level-next').click();
  assert.equal(app.nodes.get('journey-tcf-final').disabled, true);
  app.nodes.get('journey-continue').click();
  for (let index = 0; index < 20; index += 1) { choose(app, index < 17); app.nodes.get('next').click(); }
  assert.match(app.nodes.get('result-level-next').textContent, /TCF/);
  app.nodes.get('result-home').click();
  assert.equal(app.nodes.get('journey-tcf-final').disabled, false);
});
function currentCard(app) { return app.context.FRENCH_CARDS.find((card) => card.prompt === app.nodes.get('prompt').textContent); }
function choose(app, correct) {
  const card = currentCard(app);
  app.nodes.get('choices').children.find((button) => (button.dataset.choice === card.answer) === correct).click();
}
function assertOnlyScreen(app, page) {
  for (const name of ['home', 'levels', 'practice', 'notebook', 'progress', 'results', 'course', 'lesson', 'writing', 'writer', 'paths', 'tcf']) assert.equal(app.nodes.get(`${name}-page`).hidden, name !== page, name);
}

test('each topic teaches three unlockable levels followed by a boss', () => {
  for (const [button, topic] of [['start-grammar', 'Grammaire'], ['start-tense', 'Conjugaison'], ['start-words', 'Vocabulaire']]) {
    const app = createApp();
    app.nodes.get(button).click();
    assertOnlyScreen(app, 'levels');
    assert.equal(app.nodes.get('levels-title').textContent, topic);
    const stages = app.nodes.get('levels-list').children;
    assert.equal(stages.length, 4);
    assert.equal(stages[0].children.at(-1).disabled, false);
    assert.equal(stages[1].children.at(-1).disabled, true);
    assert.equal(stages[3].children.at(-1).disabled, true);
    assert.ok(stages[0].children[2].textContent.length > 40, 'a level must teach before testing');
  }
});

test('level questions belong to their section and bosses reuse taught material', () => {
  const app = createApp();
  const sections = vm.runInContext('levelSections', app.context);
  for (const section of Object.values(sections)) {
    const taught = section.stages.flatMap((stage) => stage.ids);
    assert.equal(new Set(taught).size, 12);
    assert.equal(section.boss.length, 6);
    for (const id of [...taught, ...section.boss]) {
      const card = app.context.FRENCH_CARDS.find((entry) => entry.id === id);
      assert.ok(card, id);
      assert.equal(card.topic, section.title);
      assert.ok(card.explanation.length > 25);
    }
    assert.ok(section.boss.every((id) => taught.includes(id)));
  }
});

test('passing unlocks the next level, failure does not, and progress survives reopening', () => {
  const app = createApp();
  app.nodes.get('start-grammar').click();
  app.nodes.get('levels-list').children[0].children.at(-1).click();
  assertOnlyScreen(app, 'practice');
  assert.equal(app.nodes.get('session-progress').max, 4);
  for (let index = 0; index < 4; index += 1) { choose(app, index !== 0); app.nodes.get('next').click(); }
  assertOnlyScreen(app, 'results');
  assert.match(app.nodes.get('result-message').textContent, /niveau 2 débloqué/i);
  app.nodes.get('result-level-next').click();
  assertOnlyScreen(app, 'levels');
  assert.equal(app.nodes.get('levels-list').children[1].children.at(-1).disabled, false);
  app.nodes.get('levels-list').children[1].children.at(-1).click();
  for (let index = 0; index < 4; index += 1) { choose(app, false); app.nodes.get('next').click(); }
  assert.match(app.nodes.get('result-message').textContent, /réessayez/i);
  app.nodes.get('result-level-next').click();
  assert.equal(app.nodes.get('levels-list').children[2].children.at(-1).disabled, true);
  const restored = createApp(app.storage.get('le-defi-francais-progress'));
  restored.nodes.get('start-grammar').click();
  assert.equal(restored.nodes.get('levels-list').children[1].children.at(-1).disabled, false);
  assert.equal(restored.nodes.get('levels-list').children[2].children.at(-1).disabled, true);
});

test('the section boss unlocks only after three passed levels and awards completion', () => {
  const app = createApp();
  app.nodes.get('start-words').click();
  for (let level = 0; level < 3; level += 1) {
    app.nodes.get('levels-list').children[level].children.at(-1).click();
    for (let index = 0; index < 4; index += 1) { choose(app, true); app.nodes.get('next').click(); }
    app.nodes.get('result-level-next').click();
  }
  assert.equal(app.nodes.get('levels-list').children[3].children.at(-1).disabled, false);
  app.nodes.get('levels-list').children[3].children.at(-1).click();
  assert.equal(app.nodes.get('session-progress').max, 6);
  for (let index = 0; index < 6; index += 1) { choose(app, index < 4); app.nodes.get('next').click(); }
  assert.match(app.nodes.get('result-message').textContent, /réessayez/i);
  app.nodes.get('result-level-next').click();
  assert.match(app.nodes.get('levels-progress').textContent, /3 \/ 4/);
  app.nodes.get('levels-list').children[3].children.at(-1).click();
  for (let index = 0; index < 6; index += 1) { choose(app, true); app.nodes.get('next').click(); }
  assert.match(app.nodes.get('result-message').textContent, /section terminée/i);
  app.nodes.get('result-level-next').click();
  assert.match(app.nodes.get('levels-progress').textContent, /4 \/ 4/);
  const restored = createApp(app.storage.get('le-defi-francais-progress'));
  restored.nodes.get('start-words').click();
  assert.match(restored.nodes.get('levels-progress').textContent, /4 \/ 4/);
  restored.nodes.get('nav-progress').click();
  restored.nodes.get('reset').click();
  restored.nodes.get('nav-home').click();
  restored.nodes.get('start-words').click();
  assert.match(restored.nodes.get('levels-progress').textContent, /0 \/ 4/);
});

test('TCF B2 modules reveal contextual feedback and save missed questions for review', () => {
  const app = createApp();
  app.nodes.get('nav-tcf').click();
  assertOnlyScreen(app, 'tcf');
  app.nodes.get('tcf-start-reading').click();
  assert.equal(app.nodes.get('tcf-exercise').hidden, false);
  assert.equal(app.nodes.get('tcf-hero').hidden, true);
  assert.equal(app.nodes.get('tcf-dashboard').hidden, true);
  assert.equal(app.nodes.get('tcf-options').children.length, 4);
  const question = app.context.TCF_B2_QUESTIONS.find((entry) => entry.id === app.nodes.get('tcf-exercise').dataset.questionId);
  app.nodes.get('tcf-options').children.find((button) => button.dataset.choice !== question.answer).click();
  assert.equal(app.nodes.get('tcf-feedback').hidden, false);
  assert.match(app.nodes.get('tcf-feedback').textContent, /Indice/);
  assert.equal(app.nodes.get('tcf-next').hidden, false);
  assert.deepEqual(JSON.parse(app.storage.get('le-defi-francais-tcf-b2')).mistakes, [question.id]);
  app.nodes.get('nav-home').click();
  app.nodes.get('nav-tcf').click();
  assert.equal(app.nodes.get('tcf-review-count').textContent, '1');
  app.nodes.get('tcf-review').click();
  assert.equal(app.nodes.get('tcf-exercise').dataset.questionId, question.id);
  app.nodes.get('tcf-options').children.find((button) => button.dataset.choice === question.answer).click();
  assert.deepEqual(JSON.parse(app.storage.get('le-defi-francais-tcf-b2')).mistakes, []);
});

test('TCF B2 questions cover reading, listening and language structures without duplicate IDs', () => {
  const app = createApp();
  const questions = app.context.TCF_B2_QUESTIONS;
  assert.ok(questions.length >= 12);
  assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);
  for (const kind of ['reading', 'listening', 'structures']) assert.ok(questions.filter((question) => question.kind === kind).length >= 4);
  for (const question of questions) {
    assert.equal(question.choices.length, 4);
    assert.equal(new Set(question.choices).size, 4);
    assert.ok(question.choices.includes(question.answer));
    assert.ok(question.explanation.length > 35);
    assert.ok(question.clue.length > 10);
  }
});

test('offline TCF exam stays local while publisher links remain external', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  assert.match(html, /<button id="tcf-real-exam"/);
  assert.match(html, /id="tcf-offline-exam"/);
  const links = ['tcf-real-audio', 'tcf-real-series', 'tcf-official-samples'];
  for (const id of links) {
    const anchor = html.match(new RegExp(`<a[^>]*id="${id}"[^>]*>`))?.[0];
    assert.ok(anchor, id);
    assert.match(anchor, /href="https:\/\//);
    assert.match(anchor, /target="_blank"/);
    assert.match(anchor, /rel="noopener noreferrer"/);
  }
  assert.match(html, /tcf-real-audio"[^>]*href="https:\/\/apprendre\.tv5monde\.com\/fr\/tcf\/test-dentrainement-au-tcf\?competence=CO&amp;tcf_lot_id=58"/);
  assert.match(html, /tcf-official-samples"[^>]*href="https:\/\/www\.france-education-international\.fr\/test\/exemples-epreuves-tcf"/);
});

test('all 17 TV5MONDE practice sets expose their official booklet and recorded audio', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const sets = [...html.matchAll(/<li data-tcf-set="(\d+)"[\s\S]*?<\/li>/g)];
  const localMediaPresent = [...sets].some(([markup]) => [...markup.matchAll(/href="tcf-offline\/([^"]+)"/g)]
    .some(([, filename]) => fs.existsSync(path.join(__dirname, '../tcf-offline', filename))));
  assert.equal(sets.length, 17);
  for (const [index, set] of sets.entries()) {
    assert.equal(Number(set[1]), index + 1);
    assert.match(set[0], /href="tcf-offline\/tcf[^\"]+\.pdf"/);
    assert.match(set[0], new RegExp(`href="tcf-offline/tcf${index + 1}-podcast\\.mp3"`));
    assert.equal((set[0].match(/target="_blank" rel="noopener noreferrer"/g) || []).length, 2);
    for (const [, filename] of set[0].matchAll(/href="tcf-offline\/([^"]+)"/g)) {
      if (!localMediaPresent) continue;
      const file = path.join(__dirname, '../tcf-offline', filename);
      assert.ok(fs.statSync(file).size > 1000, `${filename} is incomplete`);
      const header = Buffer.alloc(4);
      const descriptor = fs.openSync(file, 'r');
      fs.readSync(descriptor, header, 0, 4, 0);
      fs.closeSync(descriptor);
      assert.ok(filename.endsWith('.pdf') ? header.toString() === '%PDF' : header.toString().startsWith('ID3') || header[0] === 0xff, `${filename} is not the expected media type`);
    }
  }
});

test('desktop opens approved online links and local TCF files only', () => {
  let openHandler;
  let ready;
  const opened = [];
  const localOpened = [];
  const electron = {
    app: { whenReady: () => ({ then(callback) { ready = callback; } }), on() {} },
    BrowserWindow: class {
      webContents = { setWindowOpenHandler(handler) { openHandler = handler; } };
      loadFile() {}
      maximize() {}
    },
    shell: { openExternal(url) { opened.push(url); return Promise.resolve(); }, openPath(file) { localOpened.push(file); return Promise.resolve(''); } },
  };
  const source = fs.readFileSync(path.join(__dirname, '../main.cjs'), 'utf8');
  vm.runInNewContext(source, {
    require: (name) => name === 'electron' ? electron : require(name),
    __dirname: path.join(__dirname, '..'),
    setImmediate: (callback) => callback(),
    console,
    process,
    URL,
  });
  ready();
  const allowed = 'https://apprendre.tv5monde.com/fr/tcf/simulation-du-tcf';
  assert.equal(openHandler({ url: allowed }).action, 'deny');
  assert.equal(openHandler({ url: 'https://example.com/other' }).action, 'deny');
  assert.deepEqual(opened, [allowed]);
  const offlineFile = path.join(__dirname, '../tcf-offline/tcf17-podcast.mp3');
  assert.equal(openHandler({ url: `file://${offlineFile}` }).action, 'deny');
  assert.equal(openHandler({ url: 'file://bad-host/not-an-exam.mp3' }).action, 'deny');
  assert.deepEqual(localOpened, [offlineFile]);
});

test('quick TCF practice moves to new questions and production drafts survive reopening', () => {
  const app = createApp();
  app.nodes.get('nav-tcf').click();
  app.nodes.get('tcf-quick').click();
  const first = app.nodes.get('tcf-exercise').dataset.questionId;
  app.nodes.get('tcf-options').children[0].click();
  app.nodes.get('nav-tcf').click();
  app.nodes.get('tcf-quick').click();
  assert.notEqual(app.nodes.get('tcf-exercise').dataset.questionId, first);
  app.nodes.get('nav-tcf').click();
  app.nodes.get('tcf-start-production').click();
  app.nodes.get('tcf-draft').value = 'À mon avis, il faut améliorer les transports publics.';
  app.nodes.get('tcf-draft').fire('input');
  const reopened = createApp(null, [['le-defi-francais-tcf-b2', app.storage.get('le-defi-francais-tcf-b2')]]);
  reopened.nodes.get('nav-tcf').click();
  reopened.nodes.get('tcf-start-production').click();
  assert.equal(reopened.nodes.get('tcf-draft').value, 'À mon avis, il faut améliorer les transports publics.');
});

test('TCF listening offers a transcript when speech synthesis is unavailable', () => {
  const app = createApp();
  app.nodes.get('nav-tcf').click();
  app.nodes.get('tcf-start-listening').click();
  assert.equal(app.nodes.get('tcf-context').hidden, true);
  assert.equal(app.nodes.get('tcf-transcript').open, false);
  app.nodes.get('tcf-play').click();
  assert.equal(app.nodes.get('tcf-transcript').open, true);
});

test('malformed TCF save is recovered without losing access to practice', () => {
  const app = createApp(null, [['le-defi-francais-tcf-b2', '{invalid']]);
  assert.equal(app.nodes.get('storage-notice').hidden, false);
  app.nodes.get('nav-tcf').click();
  app.nodes.get('tcf-start-structures').click();
  assert.equal(app.nodes.get('tcf-options').children.length, 4);
});

test('dark mode toggles and persists independently from quiz progress', () => {
  const app = createApp();
  assert.equal(app.nodes.get('theme-toggle')['aria-pressed'], 'false');
  app.nodes.get('theme-toggle').click();
  assert.equal(app.nodes.get('theme-toggle')['aria-pressed'], 'true');
  assert.equal(app.context.document.documentElement.dataset.theme, 'dark');
  assert.equal(app.nodes.get('browser-theme-color').content, '#0b0b0d');
  assert.equal(app.storage.get('le-defi-francais-theme'), 'dark');
  assert.equal(app.storage.has('le-defi-francais-progress'), false);
  const restored = createApp(null, [['le-defi-francais-theme', 'dark']]);
  assert.equal(restored.nodes.get('theme-toggle')['aria-pressed'], 'true');
  restored.nodes.get('theme-toggle').click();
  assert.equal(restored.nodes.get('browser-theme-color').content, '#f7f7f2');
});

test('dark theme is compiled from Tailwind utilities', () => {
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
  const source = fs.readFileSync(path.join(__dirname, '../theme.tailwind.css'), 'utf8');
  assert.match(config.scripts['build:css'], /tailwindcss -i/);
  assert.ok(config.devDependencies.tailwindcss && config.devDependencies['@tailwindcss/cli']);
  assert.match(source, /@apply/);
  assert.match(source, /@custom-variant dark/);
});
test('release builds a Windows installer and keeps third-party media out of the public repo', () => {
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
  const ignore = fs.readFileSync(path.join(__dirname, '../.gitignore'), 'utf8');
  assert.equal(config.build.win.target[0], 'nsis');
  assert.match(config.build.nsis.artifactName, /Setup.*\.exe/);
  assert.match(ignore, /tcf-offline\/\*\.pdf/);
  assert.match(ignore, /tcf-offline\/\*\.mp3/);
  assert.match(ignore, /dist\//);
  assert.match(ignore, /node_modules\//);
  assert.ok(config.build.files.includes('!tcf-offline/*.pdf'));
  assert.ok(config.build.files.includes('!tcf-offline/*.mp3'));
});

test('home opens without a question; practice collapses the menu and hides other pages', () => {
  const app = createApp();
  assertOnlyScreen(app, 'home');
  assert.equal(app.nodes.get('choices').children.length, 0);
  app.nodes.get('start-mixed').click();
  assertOnlyScreen(app, 'practice');
  assert.equal(app.nodes.get('navigation').hidden, false);
  assert.equal(app.nodes.get('navigation-links').hidden, true);
  assert.equal(app.nodes.get('navigation-toggle').hidden, false);
  assert.equal(app.nodes.get('choices').children.length, 4);
  assert.equal(app.nodes.get('answer-area').hidden, true);
});

test('300 questions retain four answers and explanations across complete ten-question sessions', () => {
  const app = createApp();
  app.nodes.get('start-mixed').click();
  const prompts = new Set();
  for (let index = 0; index < 300; index += 1) {
    const card = currentCard(app);
    assert.ok(!prompts.has(card.prompt), card.id);
    prompts.add(card.prompt);
    assert.equal(app.nodes.get('choices').children.length, 4);
    choose(app, true);
    assert.equal(app.nodes.get('feedback').children[2].textContent, card.explanation);
    assert.equal(app.nodes.get('answer-area').hidden, false);
    assertOnlyScreen(app, 'practice');
    app.nodes.get('next').click();
    if ((index + 1) % 10 === 0) {
      assertOnlyScreen(app, 'results');
      assert.equal(app.nodes.get('result-score').textContent, '10 / 10');
      app.nodes.get('result-repeat').click();
    }
  }
  app.nodes.get('leave-practice').click();
  app.nodes.get('nav-progress').click();
  assert.equal(app.nodes.get('accuracy').textContent, '100 %');
});

test('pause preserves an answered question; notebook and home keyboard input cannot change it', () => {
  const app = createApp();
  app.nodes.get('start-grammar').click();
  app.nodes.get('levels-list').children[0].children.at(-1).click();
  assert.equal(currentCard(app).topic, 'Grammaire');
  choose(app, false);
  const prompt = app.nodes.get('prompt').textContent;
  const saved = app.storage.get('le-defi-francais-progress');
  app.nodes.get('leave-practice').click();
  assert.equal(app.nodes.get('resume-session').hidden, false);
  app.nodes.get('nav-notebook').click();
  assertOnlyScreen(app, 'notebook');
  assert.equal(app.nodes.get('notebook-list').children.length, 1);
  app.handlers.keydown({ key: '1', target: { tagName: 'BODY' }, preventDefault() {} });
  assert.equal(app.storage.get('le-defi-francais-progress'), saved);
  app.nodes.get('nav-home').click();
  app.nodes.get('resume-session').click();
  assertOnlyScreen(app, 'practice');
  assert.equal(app.nodes.get('prompt').textContent, prompt);
  assert.equal(app.nodes.get('answer-area').hidden, false);
  choose(app, true);
  assert.equal(app.storage.get('le-defi-francais-progress'), saved);
});

test('a saved single mistake creates a one-question review, then an empty notebook', () => {
  const app = createApp();
  app.nodes.get('start-mixed').click();
  const card = currentCard(app);
  choose(app, false);
  const restored = createApp(app.storage.get('le-defi-francais-progress'));
  restored.nodes.get('nav-notebook').click();
  restored.nodes.get('start-review').click();
  assert.equal(currentCard(restored).id, card.id);
  assert.equal(restored.nodes.get('question-number').textContent, '1 / 1');
  choose(restored, true);
  restored.nodes.get('next').click();
  assertOnlyScreen(restored, 'results');
  restored.nodes.get('nav-notebook').click();
  assert.equal(restored.nodes.get('notebook-empty').hidden, false);
  assert.equal(restored.nodes.get('start-review').hidden, true);
});

test('keyboard selection, malformed-save recovery and reset remain available', () => {
  const app = createApp('{broken');
  assert.equal(app.nodes.get('storage-notice').hidden, false);
  app.nodes.get('start-words').click();
  app.nodes.get('levels-list').children[0].children.at(-1).click();
  assert.equal(currentCard(app).topic, 'Vocabulaire');
  app.handlers.keydown({ key: '1', target: { tagName: 'H1' }, preventDefault() {} });
  assert.equal(app.nodes.get('answer-area').hidden, false);
  app.handlers.keydown({ key: 'Enter', target: { tagName: 'BODY' }, preventDefault() {} });
  assert.equal(app.nodes.get('question-number').textContent, '2 / 4');
  app.nodes.get('leave-practice').click();
  app.nodes.get('nav-progress').click();
  app.nodes.get('reset').click();
  assert.equal(app.nodes.get('total-answered').textContent, 0);
  app.nodes.get('nav-home').click();
  assert.equal(app.nodes.get('resume-session').hidden, true);
});

test('all 15 tense lessons reveal one step at a time and start their own two-question practice', () => {
  const app = createApp();
  for (const lesson of app.context.TENSE_COURSE) {
    app.nodes.get('nav-course').click();
    assertOnlyScreen(app, 'course');
    const buttons = app.nodes.get('course-library').children.flatMap((group) => group.children[1].children);
    assert.equal(buttons.length, 15);
    buttons.find((button) => button.dataset.lessonId === lesson.id).click();
    assertOnlyScreen(app, 'lesson');
    assert.equal(app.nodes.get('lesson-title').textContent, lesson.title);
    assert.equal(app.nodes.get('lesson-previous').disabled, true);
    assert.equal(app.nodes.get('lesson-content').children[1].children[1].textContent, lesson.meaning);
    app.nodes.get('lesson-next').click();
    assert.equal(app.nodes.get('lesson-step-1')['aria-pressed'], 'true');
    assert.equal(app.nodes.get('lesson-content').children[0].children[2].children.length, lesson.forms.length);
    app.nodes.get('lesson-next').click();
    assert.equal(app.nodes.get('lesson-step-2')['aria-pressed'], 'true');
    app.nodes.get('lesson-next').click();
    assert.equal(app.nodes.get('lesson-step-3')['aria-pressed'], 'true');
    app.nodes.get('lesson-next').click();
    assertOnlyScreen(app, 'practice');
    assert.equal(currentCard(app).id, `course-${lesson.id}-0`);
    choose(app, false);
    assert.equal(app.nodes.get('answer-area').hidden, false);
    app.nodes.get('next').click();
    assert.equal(currentCard(app).id, `course-${lesson.id}-1`);
    choose(app, true);
    app.nodes.get('next').click();
    assertOnlyScreen(app, 'results');
    assert.equal(app.nodes.get('result-score').textContent, '1 / 2');
    assert.equal(app.nodes.get('result-lesson').hidden, false);
    app.nodes.get('result-lesson').click();
    assertOnlyScreen(app, 'lesson');
    assert.equal(app.nodes.get('lesson-title').textContent, lesson.title);
  }
});

test('lesson navigation does not alter quiz progress and retries stay on the same tense', () => {
  const app = createApp();
  app.nodes.get('home-course').click();
  app.nodes.get('course-library').children[0].children[1].children[0].click();
  app.nodes.get('lesson-step-2').click();
  app.nodes.get('lesson-previous').click();
  assert.equal(app.nodes.get('lesson-step-1')['aria-pressed'], 'true');
  assert.equal(app.storage.has('le-defi-francais-progress'), false);
  app.nodes.get('lesson-step-2').click();
  app.nodes.get('lesson-next').click();
  app.nodes.get('lesson-next').click();
  const courseId = currentCard(app).courseId;
  for (let index = 0; index < 2; index += 1) { choose(app, true); app.nodes.get('next').click(); }
  app.nodes.get('result-repeat').click();
  assert.equal(currentCard(app).courseId, courseId);
  assert.equal(app.nodes.get('question-number').textContent, '1 / 2');
});

test('conjugation lessons distinguish the subject, stem, ending, auxiliary and participle', () => {
  const app = createApp();
  app.nodes.get('home-course').click();
  const lessons = app.context.TENSE_COURSE;
  for (const lesson of lessons) {
    app.context.openLesson(lesson.id);
    app.nodes.get('lesson-next').click();
    const forms = app.nodes.get('lesson-content').children[0].children[2].children;
    assert.equal(forms.length, lesson.forms.length, lesson.id);
    for (const form of forms) {
      const parts = form.children;
      assert.equal(parts.length, 3, lesson.id);
      const names = parts.map((part) => part.className);
      assert.equal(names[0], 'form-subject');
      if (lesson.forms[0].endsWith(' parlé')) assert.deepEqual(names, ['form-subject', 'form-auxiliary', 'form-participle'], lesson.id);
      else assert.deepEqual(names, ['form-subject', 'form-stem', 'form-ending'], lesson.id);
    }
    assert.equal(app.nodes.get('lesson-position').textContent, 'Étape 2 sur 4 · Construire');
  }
});

test('writing workshops save plans, independent drafts, and an immutable first version', () => {
  const app = createApp();
  app.nodes.get('nav-writing').click();
  assertOnlyScreen(app, 'writing');
  assert.equal(app.nodes.get('writing-library').children.length, 4);
  app.nodes.get('writing-library').children[0].click();
  assertOnlyScreen(app, 'writer');
  app.nodes.get('plan-0').value = 'Au service client, commande 123.';
  app.nodes.get('plan-0').fire('input');
  app.nodes.get('writer-next').click();
  app.nodes.get('writing-text').value = 'Madame, Monsieur, je vous contacte au sujet de ma commande.';
  app.nodes.get('writing-text').fire('input');
  app.nodes.get('writer-next').click();
  const original = app.nodes.get('writing-text').value;
  assert.equal(app.nodes.get('writing-original').textContent, original);
  const checkbox = app.nodes.get('writing-checks').children[0].children[0];
  checkbox.checked = true;
  checkbox.fire('change');
  app.nodes.get('writing-text').value = `${original}\n\nPourriez-vous envoyer le cahier manquant ?`;
  app.nodes.get('writing-text').fire('input');
  assert.equal(app.nodes.get('writing-checks').children[0].children[0].checked, false);
  const revised = app.nodes.get('writing-text').value;
  app.nodes.get('writer-back').click();
  app.nodes.get('writing-library').children[1].click();
  assert.equal(app.nodes.get('writing-text').value, '');
  const restored = createApp(null, [...app.storage]);
  restored.nodes.get('nav-writing').click();
  restored.nodes.get('writing-library').children[0].click();
  assert.equal(restored.nodes.get('plan-0').value, 'Au service client, commande 123.');
  assert.equal(restored.nodes.get('writing-text').value, revised);
  restored.nodes.get('writing-step-2').click();
  assert.equal(restored.nodes.get('writing-original').textContent, original);
  assert.equal(restored.nodes.get('writing-model-details').open, false);
  assert.equal(app.storage.has('le-defi-francais-progress'), false);
});

test('writing models satisfy their length targets and have annotated paragraphs', () => {
  const { context } = createApp();
  for (const workshop of context.WRITING_WORKSHOPS) {
    assert.equal(workshop.plan.length, 3);
    assert.equal(workshop.checklist.length, 5);
    const model = workshop.model.map(([paragraph]) => paragraph).join('\n\n');
    const signals = context.WritingTools.inspect(model, workshop);
    assert.equal(signals.length, 'target', `${workshop.id}: ${signals.words} words`);
    assert.ok(workshop.model.every(([paragraph, note]) => paragraph.length > 50 && note.length > 40));
  }
  assert.equal(context.WritingTools.wordCount('L’été, j’ai rendez-vous à 14 heures.'), 6);
  assert.equal(context.WritingTools.inspect('', context.WRITING_WORKSHOPS[0]).paragraphs, 0);
});

test('writing survives storage failure in memory and restores malformed drafts safely', () => {
  const app = createApp(null, [['le-defi-francais-writing-courriel', '{bad']]);
  app.nodes.get('nav-writing').click();
  app.nodes.get('writing-library').children[0].click();
  assert.equal(app.nodes.get('storage-notice').hidden, false);
  app.context.localStorage.setItem = () => { const error = new Error('Full'); error.name = 'QuotaExceededError'; throw error; };
  app.nodes.get('writing-step-1').click();
  app.nodes.get('writing-text').value = 'Ne perdez pas mon brouillon.';
  app.nodes.get('writing-text').fire('input');
  assert.match(app.nodes.get('writing-save').textContent, /impossible/);
  app.nodes.get('writer-back').click();
  app.nodes.get('writing-library').children[0].click();
  assert.equal(app.nodes.get('writing-text').value, 'Ne perdez pas mon brouillon.');
});

test('tense transfer keeps the learner sentence when revisiting lesson steps', () => {
  const app = createApp();
  app.nodes.get('nav-course').click();
  app.nodes.get('course-library').children[0].children[1].children[0].click();
  app.nodes.get('lesson-step-3').click();
  const input = app.nodes.get('lesson-content').children[0].children[2].children[0];
  input.value = 'Chaque jour, nous préparons le dîner.';
  input.fire('input');
  app.nodes.get('lesson-step-1').click();
  app.nodes.get('lesson-step-3').click();
  assert.equal(app.nodes.get('lesson-content').children[0].children[2].children[0].value, input.value);
  assert.equal(app.nodes.get('lesson-content').children[1].open, false);
});

test('a guided path links three lessons and their results to the narrative workshop', () => {
  const app = createApp();
  app.nodes.get('home-paths').click();
  assertOnlyScreen(app, 'paths');
  assert.equal(app.nodes.get('paths-list').children.length, 4);
  const stages = app.nodes.get('paths-list').children[0].children[3];
  assert.equal(stages.children.length, 4);
  stages.children[0].children[0].click();
  for (const id of ['imparfait', 'passe-compose', 'plus-que-parfait']) {
    assertOnlyScreen(app, 'lesson');
    app.nodes.get('lesson-step-3').click();
    app.nodes.get('lesson-next').click();
    assert.equal(currentCard(app).courseId, id);
    for (let index = 0; index < 2; index += 1) { choose(app, true); app.nodes.get('next').click(); }
    assert.equal(app.nodes.get('result-path').hidden, false);
    app.nodes.get('result-path').click();
  }
  assertOnlyScreen(app, 'writer');
  assert.match(app.nodes.get('writer-title').textContent, /imprévu/);
  const saved = JSON.parse(app.storage.get('le-defi-francais-learning'));
  assert.equal(saved.results.imparfait, 2);
  assert.equal(saved.pathId, 'raconter');
});

test('resume restores the precise lesson step and saved sentence after reopening', () => {
  const app = createApp();
  app.nodes.get('nav-course').click();
  app.nodes.get('course-library').children[0].children[1].children[0].click();
  app.nodes.get('lesson-step-3').click();
  const input = app.nodes.get('lesson-content').children[0].children[2].children[0];
  input.value = 'Nous apprenons ensemble chaque samedi.';
  input.fire('input');
  const restored = createApp(null, [...app.storage]);
  assert.equal(restored.nodes.get('resume-work').hidden, false);
  restored.nodes.get('resume-work').click();
  assertOnlyScreen(restored, 'lesson');
  assert.equal(restored.nodes.get('lesson-step-3')['aria-pressed'], 'true');
  assert.equal(restored.nodes.get('lesson-content').children[0].children[2].children[0].value, input.value);
});

test('resume reopens writing revision without losing the original draft', () => {
  const app = createApp();
  app.nodes.get('nav-writing').click();
  app.nodes.get('writing-library').children[0].click();
  app.nodes.get('writing-step-1').click();
  app.nodes.get('writing-text').value = 'Je vous contacte au sujet de ma commande.';
  app.nodes.get('writing-text').fire('input');
  app.nodes.get('writing-step-2').click();
  const restored = createApp(null, [...app.storage]);
  restored.nodes.get('resume-work').click();
  assertOnlyScreen(restored, 'writer');
  assert.equal(restored.nodes.get('writing-step-2')['aria-pressed'], 'true');
  assert.equal(restored.nodes.get('writing-original').textContent, 'Je vous contacte au sujet de ma commande.');
});

test('invalid resume targets cannot break the home screen', () => {
  const app = createApp(null, [['le-defi-francais-learning', JSON.stringify({ activity: { type: 'lesson', id: 'missing', step: 99 }, results: { present: -1 } })]]);
  assertOnlyScreen(app, 'home');
  assert.equal(app.nodes.get('resume-work').hidden, true);
});

test('sections and nested breadcrumbs identify the current location', () => {
  const app = createApp();
  for (const name of ['paths', 'course', 'writing', 'notebook', 'progress', 'home']) {
    app.nodes.get(`nav-${name}`).click();
    assertOnlyScreen(app, name);
    for (const link of ['paths', 'course', 'writing', 'notebook', 'progress', 'home']) {
      assert.equal(app.nodes.get(`nav-${link}`)['aria-current'], link === name ? 'page' : 'false');
    }
  }
  app.nodes.get('nav-course').click();
  app.nodes.get('course-library').children[0].children[1].children[0].click();
  assert.equal(app.nodes.get('nav-course')['aria-current'], 'page');
  assert.equal(app.nodes.get('location-parent').textContent, 'Les temps');
  assert.equal(app.nodes.get('location-current').textContent, app.nodes.get('lesson-title').textContent);
  app.nodes.get('location-parent').click();
  assertOnlyScreen(app, 'course');
  app.nodes.get('nav-writing').click();
  app.nodes.get('writing-library').children[0].click();
  assert.equal(app.nodes.get('navigation-links').hidden, false);
  assert.equal(app.nodes.get('nav-writing')['aria-current'], 'page');
  assert.equal(app.nodes.get('location-parent').textContent, 'Écrire');
  app.nodes.get('location-home').click();
  assertOnlyScreen(app, 'home');
});

test('quiz menu does not submit answers or lose the current question', () => {
  const app = createApp();
  app.nodes.get('start-mixed').click();
  const prompt = app.nodes.get('prompt').textContent;
  app.nodes.get('navigation-toggle').click();
  assert.equal(app.nodes.get('navigation-links').hidden, false);
  assert.equal(app.nodes.get('navigation-toggle')['aria-expanded'], 'true');
  app.handlers.keydown({ key: '1', target: { tagName: 'BUTTON' }, preventDefault() {} });
  assert.equal(app.nodes.get('answer-area').hidden, true);
  app.handlers.keydown({ key: 'Escape', target: { tagName: 'BUTTON' }, preventDefault() {} });
  assert.equal(app.nodes.get('navigation-links').hidden, true);
  app.nodes.get('navigation-toggle').click();
  app.nodes.get('nav-home').click();
  app.nodes.get('resume-session').click();
  assert.equal(app.nodes.get('prompt').textContent, prompt);
  assert.equal(app.nodes.get('navigation-toggle')['aria-expanded'], 'false');
});
