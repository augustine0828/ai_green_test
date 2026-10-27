// 데이터.js 의 전역 배열 `보도자료`를 사용 (fetch 없이 동작 — 로컬 더블클릭·GitHub Pages 모두 가능)
const data = 보도자료;
const q = document.getElementById('q');
const list = document.getElementById('list');
const count = document.getElementById('count');

// HTML 특수문자 이스케이프 (본문이 그대로 화면에 들어가므로 안전 처리)
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// 본문 정리: 맨 앞 "# 제목" 줄(카드 제목과 중복)과 끝의 구분선(---) 제거
const cleanBody = s => s.replace(/^#\s.*\n+/, '').replace(/\n*-{3,}\s*$/, '').trim();

// 검색어 강조 + **굵게** 표시 + 문단 나누기
function format(text, kw) {
  let h = esc(text);
  if (kw) h = h.replace(new RegExp(escRe(esc(kw)), 'gi'), m => `<mark>${m}</mark>`);
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  return h.split(/\n{2,}/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
}

function render(arr, kw) {
  count.textContent = `결과 ${arr.length}건 / 전체 ${data.length}건`;
  if (!arr.length) {
    list.innerHTML = `<p class="empty">'${esc(kw)}'이(가) 포함된 보도자료가 없습니다.</p>`;
    return;
  }
  list.innerHTML = arr.map(a => `
    <article class="card">
      <div class="meta"><span class="label">${format(a.부처, kw).replace(/<\/?p>/g, '')}</span><span>보도자료 ${esc(a.번호)}</span></div>
      <h2 class="title">${format(a.제목, kw).replace(/<\/?p>/g, '')}</h2>
      <div class="body">${format(cleanBody(a.본문), kw)}</div>
    </article>`).join('');
}

// 키워드가 본문·제목·부처 중 하나에 포함되면 표시 (영문 대소문자 무시)
q.addEventListener('input', () => {
  const kw = q.value.trim();
  const k = kw.toLowerCase();
  const filtered = kw
    ? data.filter(a => [a.본문, a.제목, a.부처].some(t => t.toLowerCase().includes(k)))
    : data;
  render(filtered, kw);
});

render(data, '');
