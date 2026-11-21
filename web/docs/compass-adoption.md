# COMPASS 도입 기록

| 항목 | 값 |
|---|---|
| 설치 버전 | COMPASS Design System 1.0.17 (레지스트리 `meta.version` 1.0.17) |
| 레지스트리 주소 | https://compass.designcompass.org |
| 기본 토큰 | https://compass.designcompass.org/r/1.0.17/foundations.json |
| 컴포넌트 묶음 | https://compass.designcompass.org/r/1.0.17/compass.json |
| 설치 일자 | 2026-11-21 |
| 설치 도구 | shadcn CLI 4.23.0 (`npx shadcn@latest`), npm 11.19.0, Node 26.7.0 |

## 프로젝트 환경

- 프레임워크: Next.js 16.4.6 (App Router, Turbopack), React 19.2.8, TypeScript 5
    - 레지스트리 고정값은 `next@16.4.1`이지만 보안 권고 7건(GHSA-7qx7-33qx-rqx2 등)을 해결하는 같은 마이너의 패치 버전 16.4.6으로 올렸다(2026-11-21, `eslint-config-next`도 16.4.6). 그 밖의 레지스트리 의존성 버전은 그대로다.
- 스타일: Tailwind CSS v4 (`@tailwindcss/turbopack` 로더), 설정 파일 없이 `app/globals.css` 사용
- shadcn: `components.json`, style `radix-nova`, baseColor `neutral`, CSS 변수 사용, 아이콘 `lucide`
- 경로 별칭: `@/*` → `web/*` (`@/components`, `@/components/ui`, `@/lib`, `@/hooks`)
- 패키지 관리자: npm (저장소의 `tools/`와 동일)

## 설치 명령

```sh
cd web
npx shadcn@latest init -t next -b radix -p nova --no-monorepo --no-rtl
npx shadcn@latest add https://compass.designcompass.org/r/1.0.17/foundations.json https://compass.designcompass.org/r/1.0.17/compass.json
```

`--overwrite`는 쓰지 않았다. init이 만든 `components/ui/button.tsx`는 생성 직후 수정이 없는 shadcn 기본 파일이어서 지운 뒤 COMPASS 버전을 설치했다. `lib/utils.ts`는 COMPASS와 내용이 같아 CLI가 건너뛰었다.

## 설치 항목

- 토큰: `app/globals.css`에 foundations와 compass의 `cssVars`(theme 58개, light 67개, dark 46개)와 base 스타일, 키프레임을 병합했다. 값은 레지스트리와 모두 일치한다. `@import "tailwindcss"`는 1회만 있다.
- 글꼴: COMPASS는 `pretendard`(Pretendard Variable)를 설치하지만, 이 프로젝트는 디지털 정부서비스 UI/UX 가이드라인 표준 서체인 Pretendard GOV로 바꿨다(2026-11-21). `pretendard-gov` 1.3.9의 `dist/web/variable/pretendardvariable-gov-dynamic-subset.css`를 `globals.css`에서 1회 불러오고, `--font-sans`와 `--font-heading`은 파일 끝의 `@theme inline` 보정 블록에서 `"Pretendard GOV Variable"`로 다시 정의한다. 레지스트리가 설치한 `pretendard` 패키지는 남아 있지만 불러오지 않는다. create-next-app의 Geist 글꼴은 제거했다.
- 문서: `docs/compass.md`
- 공통: `components/theme-provider.tsx`, `components/overlay-style.tsx`, `lib/utils.ts`
- UI 컴포넌트(`components/ui`): accordion, action-morph, alert-dialog, avatar, badge, button, calendar, card, chart, checkbox, clap-button, compact-bar-chart, data-flow, data-table, date-picker, date-range-picker, dialog, dot-pagination, element-motion, fade-overflow, glass-tabbar, image-gallery, inline-icon-cycling, input, like-button, media-timeline, mobile-app-shell, morph-nav, pagination, playback-pagination, progress, progressive-blur, radio-group, search-field, segmented-progress, select, separator, sheet, sidebar, skeleton, slider, slosh-slider, stamp-stickers, success-mark, switch, table, table-of-contents, table-pagination, tabs, text-motion, textarea, time-picker, toast, toggle, toggle-group, tooltip (CSS Module 13개, `iphone-outline.svg` 포함)
- 의존성(레지스트리 고정값): `@ncdai/react-wheel-picker` 1.2.3, `@number-flow/react` 0.6.2, `class-variance-authority` 0.7.1, `cn` 0.4.0, `lucide-react` 1.52.0, `motion` 14.1.0, `next-themes` 0.4.6, `pretendard` 1.3.9, `radix-ui` 1.6.7, `react-day-picker` 10.0.2, `recharts` 3.10.1, `shadcn` 4.22.1, `tw-animate-css` 1.4.0

레지스트리의 `compass.json` 파일 73개와 설치 결과를 대조해 내용이 같음을 확인했다.

## 연결 내용

- `app/layout.tsx`: `ThemeProvider`를 앱 최상위에 연결했다. `attribute="class"`, `defaultTheme="system"`, `enableSystem`으로 시스템 설정을 따르고 라이트와 다크를 모두 지원한다. `<html lang="ko" suppressHydrationWarning>`.
- 색상: COMPASS 기본 Primary와 Accent(라이트 `#007AFF`, 다크 `#3390FF`)는 디지털 정부서비스 UI/UX 가이드라인의 명도 대비 기준에 못 미쳐, 같은 색상(H 211.2°)과 채도(S 100%)에서 명도만 조정했다. 아래 "명도 대비 보정" 참고.
- 아이콘: `lucide-react` 직접 import, 선 두께 2(기본값).
- 둥글기: 중첩 둥근 사각형은 `rounded-container`가 `min(--container-radius, --nested-radius + --nested-gap)`으로 계산한다. Card, Dialog, AlertDialog에 이미 들어 있어 별도 구현하지 않았다. pill과 원형은 `rounded-full`, `[data-corner="round"]`로 원래 곡선을 유지한다.
- 첫 화면 `app/page.tsx`: `MobileAppShell`, `GlassTabBar`(홈, 인수인계서, QR, 설정), `MobileScreenHeading`, `Card`, `Badge`, `Progress`, `MobileListCard`, `Button`만 사용했다.

## 로컬 수정 내역 (재설치로 덮어쓰지 않는다)

| 파일 | 수정 | 이유 |
|---|---|---|
| `components/theme-provider.tsx` | `enableHotkey` 속성 추가(기본 true) | KWCAG 2.2 6.1.4. 원본은 끌 수 없는 단일 문자 `d` 단축키로 테마를 바꾼다. 앱에서는 `false`로 끈다. |
| `components/ui/slosh-slider.module.css` | 첫 줄 MIT 라이선스 주석 복원 | shadcn CLI가 설치 중 주석을 지웠다. 레지스트리 원문과 같게 맞췄다. |
| `next.config.ts` | `*.css` Tailwind 로더 규칙에서 `*.module.css` 제외 | create-next-app 16.4.1 기본 규칙(`as: "*.css"`)이 CSS Module까지 일반 CSS로 바꿔 MobileAppShell, GlassTabBar 등의 클래스가 사라졌다. COMPASS 모듈 CSS는 Tailwind 문법을 쓰지 않는다. |
| `eslint.config.mjs` | `components/ui/**`에서 `react-hooks/set-state-in-effect`를 경고로 | 레지스트리 원본(sidebar, date-range-picker)에 걸리는 규칙. 원본을 고치지 않고 앱 코드에는 오류 수준을 유지한다. |
| `package.json` | `react`, `react-dom`을 19.2.8로 고정 | create-next-app은 react 19.3.0을, 레지스트리는 react-dom 19.2.8을 설치해 버전이 어긋났다. 레지스트리 고정값에 맞췄다. |
| `app/layout.tsx` | 본문 바로가기 링크 | KWCAG 2.2 6.4.1. 설치된 Button을 재사용한다. |
| `app/globals.css` 맨 끝 | "이음수첩 접근성 보정" 블록 추가 | 명도 대비 기준 충족, Pretendard GOV 글꼴 스택. COMPASS가 병합한 블록은 그대로 두고 뒤에서 덮어쓴다. |
| `app/globals.css` 4~5행 | Pretendard Variable import를 Pretendard GOV import로 교체 | 가이드라인 표준형 스타일의 기본 서체 |
| `package.json` | `pretendard-gov` 1.3.9 추가 | 위 서체 |
| `components/ui/button.tsx` | secondary, link 변형의 호버 시 글자 80% 투명 효과 제거 | 호버 상태에서 레이블 대비가 3.2~3.5:1로 떨어졌다. |
| `package.json` | `next`, `eslint-config-next` 16.4.6 | 보안 패치 |

## 명도 대비 보정

기준은 「디지털 정부서비스 UI/UX 가이드라인(2025.08)」 기본 모드다. 본문 텍스트 7:1, 헤딩과 레이블 4.5:1, 아이콘과 시각 보조(초점 링 포함) 3:1. 가이드라인의 매직넘버 방식처럼 색상과 채도는 유지하고 명도만 기준을 넘는 최소값으로 조정했다.

| 토큰 | 모드 | COMPASS 값 | 보정 값 | 근거 (보정 후 대비) |
|---|---|---|---|---|
| `--primary`, `--accent` | 라이트 | `#007AFF` (L 50%) | `hsl(211.2 100% 39%)` = `#005FC7` | 흰 글자 6.07:1, secondary 버튼 글자 5.09:1, 호버 4.53:1 |
| `--primary`, `--accent` | 다크 | `#3390FF` | `hsl(211.2 100% 66%)` = `#52A5FF` | 어두운 배경 글자 7.18:1, secondary 버튼 5.02:1 |
| `--primary-foreground`, `--accent-foreground` | 다크 | 흰색 | `oklch(0.19 0 0)` | 흰 글자와 어두운 배경 글자를 모두 4.5:1로 만족하는 파랑이 없다. 기본 버튼 글자 7.18:1, 호버 5.14:1 |
| `--button-secondary-hover` | 다크 | primary 32% 혼합 | primary 28% 혼합 | 호버 배경 위 글자 4.66:1 |
| `--muted-foreground` | 라이트 | `oklch(0.556 0 0)` (4.74:1) | `oklch(0.44 0 0)` | 본문 7.81:1 |
| `--muted-foreground` | 다크 | `oklch(0.708 0 0)` (카드 6.94:1) | `oklch(0.74 0 0)` | 카드 위 본문 7.81:1 |
| `--ring`, `--sidebar-ring` | 라이트 | `oklch(0.708 0 0)` (50% 합성 1.54:1) | `oklch(0.145 0 0)` | 초점 링 3.74:1 |
| `--ring`, `--sidebar-ring` | 다크 | `oklch(0.556 0 0)` (50% 합성 1.86:1) | `oklch(0.85 0 0)` | 초점 링 3.77:1 |

## 검증 결과 (2026-11-21)

- `npm run lint`: 오류 0, 경고 5(모두 `components/ui` 원본)
- `npx tsc --noEmit`: 통과
- `npm run build`: 통과 (16.4.6 이후 보안 권고 안내 없음)
- 브라우저(Microsoft Edge headless): 라이트와 다크 × 데스크톱 1280×900과 모바일 402×874, 렌더링된 실제 색으로 측정
    - 텍스트 14개 전부 기준 충족: 본문 최소 7.81:1(기준 7), 레이블 최소 5.02:1(기준 4.5). 활성 탭은 렌즈 배경을 합성해 측정
    - secondary 버튼 호버 4.53:1(라이트), 4.66:1(다크)
    - 진행 막대 채움과 트랙 5.56:1 이상, Lucide 아이콘 최소 6.07:1
    - 초점 표시 10개 요소 전부 3:1 이상: 버튼 링 3.74~3.77:1, 링크와 탭 외곽선 2px 11.71~19.8:1
    - axe-core(WCAG 2.2 AA, best-practice) 위반 0건
    - 테마 클래스, Pretendard GOV Variable 로드(글꼴 1종, 빌드 CSS에 일반 Pretendard 없음), Lucide 선 두께 2, 콘솔 오류 없음, 컨트롤 최소 대각선 101px
    - 첫 Tab에 "본문 바로가기" 표시, Enter로 본문 이동, `d` 키를 눌러도 테마가 바뀌지 않음

## 남은 제한

1. 측정은 현재 첫 화면에 쓰인 컴포넌트만 대상으로 했다. tertiary, destructive 버튼, Checkbox, Radio, Input, Select, Switch 등은 화면에 쓸 때 가이드라인 기준(레이블 4.5:1, 컨트롤 경계 3:1)으로 다시 측정한다. 특히 Input 테두리(`--input`, `oklch(0.922 0 0)`)는 흰 배경과 약 1.3:1로 가이드라인 권장 기준(3:1)에 못 미친다. 입력 화면을 만들 때 보정한다.
2. 다크 모드의 Primary 배경 위 글자는 COMPASS 원칙(흰색)과 달리 어두운 색이다. 명도 대비 기준을 우선한 결과다.
3. 선명한 화면 모드(가이드라인의 고대비 모드: 본문 15:1, 레이블 7:1, 아이콘 4.5:1)는 아직 없다.
4. `npm audit` 중간 수준 4건: shadcn CLI가 쓰는 `minimatch`(ts-morph 경유)의 서비스 거부 취약점이다. 제시된 해결책이 shadcn 1.0.0으로의 하위 버전 변경이라 적용하지 않았다. 브라우저 번들에는 포함되지 않는다.
5. `ThemeProvider`가 next-themes 초기 스크립트를 `type="application/json"`으로 바꿔 실행하지 않는다(COMPASS 원본). 시스템 다크 모드에서 첫 화면이 잠깐 라이트로 보일 수 있다.
6. 첫 화면의 `/record/photo`, `/record/voice`, `/handover`와 하단 탭 대상 화면은 아직 없다.
7. 가이드라인은 Pretendard GOV가 작게 보여 기본 본문 17px, 글자 두께 400/500/700을 권한다. COMPASS는 16px과 600, 720 두께를 쓰며, 전체 컴포넌트에 영향이 있어 아직 바꾸지 않았다.
8. `image-gallery`는 `next/image`를 사용하므로 외부 이미지 주소를 쓰려면 `next.config.ts`에 `images.remotePatterns`가 필요하다.
