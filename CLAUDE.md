# 이음수첩 프로젝트 규칙

## 저장소 구성

- 루트의 `*.html`, `prototype/`, `captures/`, `이음수첩_기획서.pdf`, `ieum-erd.dbml`, `README.md`는 공모전 제출물이다. GitHub Pages로 공개되므로 프론트엔드 작업 중에 수정하지 않는다.
- 프론트엔드 앱은 `web/`에 있다. Next.js 16.4.6(App Router), React 19.2.8, Tailwind CSS v4, shadcn(radix-nova), npm을 쓴다. 명령은 `web/`에서 실행한다.
- Next.js 관련 규칙: @web/AGENTS.md

## 디자인 시스템 (COMPASS)

사용자가 '디자인 시스템 써', 'COMPASS 써', 'use the design system'라고 하면 COMPASS Design System 1.0.17을 적용한다. docs/compass.md(이 저장소에서는 `web/docs/compass.md`)를 읽고 설치된 컴포넌트와 토큰을 재사용한다. 프레임워크를 유지하고 누락된 컴포넌트만 https://compass.designcompass.org/r/1.0.17/에서 추가한다. COMPASS를 자동 업그레이드하거나 프로젝트의 수정 내용을 덮어쓰지 않는다. 모바일 웹은 제품의 사용 흐름에 맞춰 레이아웃을 정하고, 카드 등 화면에 필요한 요소는 등록된 Compass 컴포넌트를 사용한다. 앱형 탐색과 휴대폰 미리보기가 필요한 경우 https://compass.designcompass.org/compass-mobile-web.md를 따른다.

- 설치 기록, 로컬 수정 내역, 남은 제한: `web/docs/compass-adoption.md`
- 컴포넌트는 `web/components/ui`, 토큰은 `web/app/globals.css`에 있다. 비슷한 모양을 새로 만들지 말고 설치된 컴포넌트를 쓴다.
- 레지스트리 항목을 추가할 때는 `npx shadcn@latest add https://compass.designcompass.org/r/1.0.17/<항목>.json`을 쓰고 `--overwrite`는 쓰지 않는다. 기존 파일과 다르면 먼저 사용자에게 확인한다.
- 로컬 수정 파일(`app/globals.css`의 접근성 보정 블록, `components/theme-provider.tsx`, `components/ui/button.tsx`, `next.config.ts`, `eslint.config.mjs`)은 레지스트리 재설치로 되돌리지 않는다.

## 디지털 정부서비스 UI/UX 가이드라인

UI와 UX는 「디지털 정부서비스 UI/UX 가이드라인(2025.08)」(KRDS)을 참고한다. 원본과 검색용 텍스트, KRDS v1.0.0 디자인 리소스(Sketch, XD)는 `references/`에 있다(공개 저장소에 올리지 않으므로 git 제외).

- 서체는 가이드라인 표준형 스타일의 Pretendard GOV(`pretendard-gov` 1.3.9, 가변 다이나믹 서브셋)를 `web/app/globals.css`에서 1회만 불러온다. COMPASS 기본 Pretendard Variable은 불러오지 않는다. 기본 본문 크기 17px, 글자 두께 400/500/700 권고는 아직 적용하지 않았다.
- 명도 대비는 이 가이드라인을 기준으로 한다 (기본 모드).

    | 대상 | 기준 |
    |---|---|
    | 본문 텍스트 | 7:1 이상 |
    | 헤딩, 레이블(버튼, 탭, 입력 레이블 등) | 4.5:1 이상 |
    | 아이콘, 시각 보조, 초점 링, 입력 필드와 선택 컨트롤의 경계 | 3:1 이상 |

- 선명한 화면 모드(고대비)를 만들 때는 본문 15:1, 헤딩과 레이블 7:1, 아이콘과 시각 보조 4.5:1을 따른다.
- 호버, 초점, 선택 상태에서도 같은 기준을 지킨다. 비활성 상태만 예외다.
- 색을 조정할 때는 가이드라인의 매직넘버 방식처럼 색상과 채도를 두고 명도만 바꾼다. 프로젝트 보정 토큰은 `web/app/globals.css` 맨 끝의 "이음수첩 접근성 보정" 블록에 둔다.

## 접근성 (KWCAG 2.2)

모든 화면은 한국형 웹 콘텐츠 접근성 지침 2.2(https://a11ykr.github.io/kwcag22/)를 지킨다. COMPASS 규칙과 충돌하면 접근성을 우선하고 사용자에게 알린다.

- 5.1.1 의미 있는 이미지에는 대체 텍스트를, 장식 아이콘에는 `aria-hidden`을 준다.
- 5.4.3 텍스트 명도 대비는 위 디지털 정부서비스 UI/UX 가이드라인 기준(본문 7:1, 레이블 4.5:1)을 따른다. KWCAG의 3:1 완화 조항은 쓰지 않는다.
- 6.1.1, 6.1.2 모든 기능은 키보드로 쓸 수 있어야 하고 초점 표시를 지우지 않는다.
- 6.1.3 컨트롤은 대각선 6mm(약 23px) 이상으로 만든다.
- 6.1.4 끌 수 없는 단일 문자 단축키를 만들지 않는다. COMPASS의 `d` 테마 단축키는 `enableHotkey={false}`로 꺼 두었다.
- 6.4.1 페이지 맨 앞의 "본문 바로가기"는 `web/app/layout.tsx`에 있다. 새 화면은 본문 시작 요소에 `id="main-content"`와 `tabIndex={-1}`을 둔다.
- 6.4.2 페이지마다 서로 다른 `title`을 metadata로 준다. 7.1.1 `lang="ko"`를 유지한다.
- 7.3.1, 7.3.2 입력 항목에는 보이는 레이블과 오류 정정 방법을 준다. 7.3.3 인증에 기억력 테스트만 요구하지 않는다.

## 검증

`web/`에서 `npm run lint`, `npx tsc --noEmit`, `npm run build`를 실행하고, 바뀐 화면을 라이트와 다크 모드, 402×874 모바일과 데스크톱 미리보기에서 확인한다. 명도 대비는 실제 렌더링된 색으로 위 기준에 맞춰 측정한다.
