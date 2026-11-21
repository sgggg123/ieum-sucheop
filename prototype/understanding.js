// 서버와 AI 호출 없이 동작하는 제출용 UI 체험. 입력과 결과는 메모리에만 둔다.
(() => {
  const topics = [
    {
      id: 'walk', title: '산책 준비', category: '일과',
      question: '산책을 나갈 때 어떻게 준비하시겠어요?',
      quote: '산책할 때는 현관 옆 지팡이를 챙기고, 꼭 함께 나가 주세요.',
      points: [
        { id: 'cane', label: '현관 옆 지팡이 챙기기', quote: '현관 옆 지팡이를 챙기고' },
        { id: 'together', label: '혼자 보내지 않고 함께 나가기', quote: '꼭 함께 나가 주세요' },
      ],
      examples: [
        { label: '일부만 설명', text: '현관 옆 지팡이를 챙겨 드릴게요.', covered: ['cane'] },
        { label: '모두 설명', text: '현관 옆 지팡이를 챙기고 제가 함께 나갈게요.', covered: ['cane', 'together'] },
        { label: '잘 모르겠어요', text: '어떻게 준비해야 할지 잘 모르겠어요.', covered: [] },
      ],
    },
    {
      id: 'conversation', title: '대화 시작', category: '의사소통',
      question: '말을 걸 때 어떻게 이야기하시겠어요?',
      quote: '앞에서 눈을 맞추고, 한 번에 한 문장씩 천천히 말해 주세요.',
      points: [
        { id: 'eye-contact', label: '앞에서 눈을 맞추기', quote: '앞에서 눈을 맞추고' },
        { id: 'slowly', label: '한 문장씩 천천히 말하기', quote: '한 번에 한 문장씩 천천히 말해 주세요' },
      ],
      examples: [
        { label: '일부만 설명', text: '앞에서 눈을 맞추고 이야기할게요.', covered: ['eye-contact'] },
        { label: '모두 설명', text: '앞에서 눈을 맞추고 한 문장씩 천천히 이야기할게요.', covered: ['eye-contact', 'slowly'] },
        { label: '잘 모르겠어요', text: '어떻게 말을 걸어야 할지 잘 모르겠어요.', covered: [] },
      ],
    },
  ];
  const initial = () => ({ index: 0, answer: '', attempts: 0, feedback: null, results: {}, expired: false });
  let state = initial();
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const icon = name => `<svg class="ic" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
  const normalize = text => text.normalize('NFC').replace(/[\s.,!?。！？]/g, '');
  const compare = answer => {
    const example = topics[state.index].examples.find(item => normalize(item.text) === normalize(answer));
    if (!example || !example.covered.length) return { kind: 'unverified', covered: [] };
    return { kind: example.covered.length === topics[state.index].points.length ? 'complete' : 'partial', covered: example.covered };
  };
  const source = (topic, open = false) => `<details class="tb-source" ${open ? 'open' : ''}><summary>보호자가 남긴 원문${icon('down')}</summary><blockquote>“${esc(topic.quote)}”</blockquote><p>${esc(topic.category)} 항목 / 마지막 확인 11월 18일<br>보호자 확인 표시를 포함한 예시 데이터</p></details>`;
  const context = '<p class="tb-context"><span>김순자 님의 생활 안내</span><span class="tb-tag">2단계 예시</span></p>';
  const progress = active => `<p class="tb-progress"><b>안내 ${state.index + 1} / ${topics.length}</b><span>${topics[state.index].title}</span></p><ol class="tb-steps" aria-label="안내 확인 단계">${['안내 읽기', '내 말로 설명', '함께 확인'].map((label, i) => `<li ${i === active ? 'aria-current="step"' : ''}>${i + 1}. ${label}</li>`).join('')}</ol>`;
  const action = (name, label, tone = 'p') => `<button type="button" class="btn btn-${tone} full" data-understanding-action="${name}">${label}</button>`;
  const textAction = (name, label) => `<button type="button" class="tb-link" data-understanding-action="${name}">${label}</button>`;
  function navigate(id) {
    if (state.expired && /^B5[a-d]?$/.test(id)) id = 'B5e';
    if (location.hash === '#/' + id) render(id);
    else location.hash = '#/' + id;
  }
  function openTopic(index) {
    state.index = index; state.answer = ''; state.attempts = 0; state.feedback = null;
    navigate('B5a');
  }
  function finish(result) {
    state.results[topics[state.index].id] = result;
    const next = topics.findIndex((topic, i) => i > state.index && state.results[topic.id] !== 'confirmed');
    if (next < 0) navigate('B5d'); else openTopic(next);
  }
  function render(id) {
    if (!/^B5[a-e]?$/.test(id)) return;
    if (state.expired && id !== 'B5e') { navigate('B5e'); return; }
    const screen = document.getElementById(id);
    const content = screen.querySelector('.ct');
    const footer = screen.querySelector('.bt');
    const topic = topics[state.index];
    const next = topics.findIndex((item, i) => i > state.index && state.results[item.id] !== 'confirmed');
    if (id === 'B5') {
      content.innerHTML = `${context}<span class="tb-hero">${icon('chat')}</span><p class="tb-eyebrow">돌봄을 시작하기 전에</p><h2 class="h1">읽은 내용을,<br>함께 확인해요</h2><p class="tb-copy">안내를 읽고 편하게 설명해 주세요.</p><div class="card tb-topics"><div class="tb-topic">${icon('clock')}<div><strong>산책 준비</strong><p>챙길 것과 함께할 사람을 확인해요.</p></div></div><div class="tb-topic">${icon('chat')}<div><strong>대화 시작</strong><p>편안한 대화 방법을 확인해요.</p></div></div></div><p class="tb-note">기억력을 시험하는 과정이 아니에요.<br>놓친 내용은 다시 보여드릴게요.</p><p class="tb-note">예시 데이터와 준비된 답변으로 체험해요.<br>실제 AI 분석이나 기록 저장은 하지 않아요.</p>`;
      footer.innerHTML = action('start', '생활 안내 2개 확인하기');
    } else if (id === 'B5a') {
      content.innerHTML = `${context}${progress(0)}<p class="tb-eyebrow">보호자가 꼭 전하고 싶은 내용</p><h2 class="h1">${topic.title === '산책 준비' ? '산책 전에<br>이렇게 준비해 주세요' : '말을 걸 때는<br>이렇게 이야기해 주세요'}</h2><div class="card tb-guide"><blockquote>${esc(topic.quote)}</blockquote></div>${source(topic)}<p class="tb-copy">다음에는 내 말로 설명해 볼게요.<br>원문을 그대로 외우지 않아도 괜찮아요.</p>${textAction('skip', '나중에 확인할게요')}`;
      footer.innerHTML = action('answer', '내 말로 설명하기');
    } else if (id === 'B5b') {
      content.innerHTML = `${progress(1)}<h2 class="h1">${topic.question}</h2><form id="tb-answer-form"><label class="lbl" for="tb-answer">내 설명</label><textarea id="tb-answer" rows="3" maxlength="500" placeholder="어떻게 하실지 편하게 적어 주세요." aria-describedby="tb-answer-help"></textarea><p class="tb-note" id="tb-answer-help">아래 예시만 비교하는 UI 체험이에요.<br>자유 답변은 확인 필요로 남겨요.</p></form><div class="tb-examples" role="group" aria-label="체험용 답변 넣기">${topic.examples.map((example, i) => `<button type="button" data-understanding-example="${i}" aria-pressed="${example.text === state.answer}">${example.label}</button>`).join('')}</div>${source(topic)}${textAction('skip', '잘 모르겠어요. 확인 필요로 남기기')}`;
      content.querySelector('textarea').value = state.answer;
      footer.innerHTML = `<button type="submit" form="tb-answer-form" class="btn btn-p full" ${state.answer.trim() ? '' : 'disabled'}>설명 확인하기</button>`;
    } else if (id === 'B5c') {
      // 화면 설계 보드에서 결과 화면을 바로 열어도 대표 예시를 보여 준다.
      if (!state.feedback) { state.answer = topic.examples[0].text; state.feedback = compare(state.answer); state.attempts = 1; }
      const { kind, covered } = state.feedback;
      const title = kind === 'complete' ? '좋아요, 이렇게<br>함께해 주세요' : kind === 'partial' ? '한 가지만<br>더 확인해 볼까요?' : '원문과 한 번 더<br>확인이 필요해요';
      const points = kind === 'unverified' ? '<p class="note">예시 밖의 답변은 판단하지 않아요. 원문을 다시 보거나 보호자에게 확인해 주세요.</p>' : `<ul class="tb-points">${topic.points.map(point => { const found = covered.includes(point.id); return `<li class="${found ? '' : 'tb-missing'}">${icon(found ? 'check' : 'info')}<div><strong>${point.label}</strong><small>${found ? '설명에 담겼어요' : '원문에서 다시 찾았어요'}</small>${found ? '' : `<blockquote>“${point.quote}”</blockquote>`}</div></li>`; }).join('')}</ul>`;
      content.innerHTML = `${progress(2)}<h2 class="h1 tb-feedback-title">${title}</h2><div class="tb-answer"><span class="tb-note">내가 설명한 내용</span><p>${esc(state.answer)}</p></div>${points}${source(topic, kind === 'unverified')}${kind !== 'complete' && state.attempts < 2 ? textAction('skip', '확인 필요로 남기고 계속하기') : ''}${kind !== 'complete' && state.attempts >= 2 ? '<p class="tb-note">지금 확실하지 않아도 괜찮아요.<br>보호자에게 확인할 내용으로 남겨요.</p>' : ''}`;
      footer.innerHTML = kind === 'complete' ? action('confirm', next < 0 ? '확인 마치기' : '다음 안내 보기') : state.attempts < 2 ? action('answer', '한 번 더 설명하기') : action('skip', '확인 필요로 남기고 계속');
    } else if (id === 'B5d') {
      const pending = topics.filter(item => state.results[item.id] !== 'confirmed');
      const count = topics.length - pending.length;
      content.innerHTML = `${context}<h2 class="h1">${pending.length ? '확인이 필요한 안내가<br>남아 있어요' : '생활 안내 2개를<br>함께 확인했어요'}</h2><p class="tb-copy">${pending.length ? '모르는 내용은 추측하지 않고 남겨 두었어요.' : '돌봄 중에도 원문을 다시 볼 수 있어요.'}</p><div class="tb-stats"><div><b>${count}</b><span>확인한 안내</span></div><div><b>${pending.length}</b><span>확인 필요</span></div></div><div>${topics.map((item, i) => `<button type="button" class="tb-result" data-understanding-topic="${i}">${icon(state.results[item.id] === 'confirmed' ? 'check' : 'info')}<span><b>${item.title}</b><small>${state.results[item.id] === 'confirmed' ? '내용을 함께 확인했어요' : '원문 또는 보호자 확인이 필요해요'}</small></span>${icon('next')}</button>`).join('')}</div><p class="tb-note">결과는 이 체험 안에서만 유지돼요.<br>돌봄 수행이나 자격을 판정하지 않아요.</p>${textAction('restart', '처음부터 체험하기')}`;
      footer.innerHTML = pending.length ? action('resume', '필요한 안내 다시 확인하기') : '<a class="btn btn-p full" href="#/B3">2단계 상세로 돌아가기</a>';
    } else {
      content.innerHTML = `<span class="tb-hero">${icon('lock')}</span><h2 class="h1">2단계 열람이<br>끝났어요</h2><p class="tb-copy">생활 안내와 입력한 답변을 이 화면에서 지웠어요. 다시 보려면 보호자 승인이 필요해요.</p><p class="note">이해 확인 결과로 열람 권한이 늘어나지는 않아요.</p><p class="tb-note">만료와 재승인을 보여 주는 UI 예시예요.<br>실제 서버의 접근 제어는 아직 연결하지 않았어요.</p>`;
      footer.innerHTML = '<a class="btn btn-p full" href="#/B1">1단계 정보로 돌아가기</a>';
    }
    content.scrollTop = 0;
    const heading = content.querySelector('h2');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus({ preventScroll: true });
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-understanding-action], [data-understanding-example], [data-understanding-topic]');
    if (!button) return;
    event.preventDefault();
    const command = button.dataset.understandingAction;
    if (command === 'expire') {
      // 시연용 만료. 이전 화면 DOM에서도 자유 답변과 생활 안내를 제거한다.
      state = { ...initial(), expired: true };
      document.querySelectorAll('.understanding .ct, .understanding .bt').forEach(item => item.replaceChildren());
      navigate('B5e'); return;
    }
    if (state.expired && command !== 'restart') { navigate('B5e'); return; }
    if (button.dataset.understandingExample !== undefined) {
      state.answer = topics[state.index].examples[Number(button.dataset.understandingExample)].text;
      const input = document.getElementById('tb-answer'); input.value = state.answer; input.focus();
      document.querySelector('#B5b button[type="submit"]').disabled = false;
      document.querySelectorAll('[data-understanding-example]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    } else if (button.dataset.understandingTopic !== undefined) openTopic(Number(button.dataset.understandingTopic));
    else if (command === 'start') { state = initial(); openTopic(0); }
    else if (command === 'answer') navigate('B5b');
    else if (command === 'confirm') finish('confirmed');
    else if (command === 'skip') finish('pending');
    else if (command === 'resume') openTopic(topics.findIndex(item => state.results[item.id] !== 'confirmed'));
    else if (command === 'restart') { state = initial(); navigate('B5'); }
  });
  document.addEventListener('input', event => {
    if (event.target.id !== 'tb-answer') return;
    state.answer = event.target.value;
    document.querySelector('#B5b button[type="submit"]').disabled = !state.answer.trim();
    document.querySelectorAll('[data-understanding-example]').forEach((item, i) => item.setAttribute('aria-pressed', String(topics[state.index].examples[i].text === state.answer)));
  });
  document.addEventListener('submit', event => {
    if (event.target.id !== 'tb-answer-form') return;
    event.preventDefault();
    if (state.expired) { navigate('B5e'); return; }
    if (!state.answer.trim()) return;
    state.feedback = compare(state.answer); state.attempts += 1; navigate('B5c');
  });
  // 2단계 상세를 직접 여는 것은 다른 화면과 마찬가지로 '승인 완료 예시' 진입이다.
  window.ieumUnderstanding = {
    render,
    enterApprovedExample() { if (state.expired) state = initial(); },
    capture(id) {
      state = initial();
      if (id === 'B5b') state.answer = topics[0].examples[0].text;
      if (id === 'B5c') { state.answer = topics[0].examples[0].text; state.feedback = compare(state.answer); state.attempts = 1; }
      if (id === 'B5d') state.results = { walk: 'confirmed', conversation: 'pending' };
      if (id === 'B5e') state.expired = true;
    },
  };
})();
