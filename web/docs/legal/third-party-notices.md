# 이음수첩 외부 구성요소 고지 초안

확인 기준일: 2026년 11월 21일  
문의: gsmtc01@gmail.com

이음수첩은 다음 외부 소프트웨어와 자료를 사용하거나 설치하고 있습니다. 각 구성요소의 권리는 원저작자에게 있으며 각 라이선스의 조건을 따릅니다. 이음수첩의 이용약관과 저작권 고지는 외부 라이선스가 허용하는 이용을 제한하지 않습니다.

## 1. 직접 의존성

현재 로컬에 설치된 버전을 기준으로 확인했습니다. 설치 목록은 최종 브라우저 번들에 모두 포함된다는 뜻은 아닙니다. Lucide에 포함된 Feather 유래 아이콘의 MIT 고지처럼 추가 조건은 메타데이터 요약보다 원문을 우선합니다.

| 구성요소 | 설치 버전 | 메타데이터의 라이선스 | 원문 사본 |
| --- | --- | --- | --- |
| @ncdai/react-wheel-picker | 1.2.3 | MIT | [ncdai-react-wheel-picker-LICENSE](licenses/ncdai-react-wheel-picker-LICENSE) |
| @number-flow/react | 0.6.2 | MIT | [number-flow-react-LICENSE.md](licenses/number-flow-react-LICENSE.md) |
| class-variance-authority | 0.7.1 | Apache-2.0 | [class-variance-authority-LICENSE](licenses/class-variance-authority-LICENSE) |
| cn | 0.4.0 | MIT | [cn-LICENSE](licenses/cn-LICENSE) |
| lucide-react | 1.52.0 | ISC | [lucide-react-LICENSE](licenses/lucide-react-LICENSE) |
| motion | 14.1.0 | MIT | [motion-LICENSE.md](licenses/motion-LICENSE.md) |
| next | 16.4.6 | MIT | [next-license.md](licenses/next-license.md) |
| next-themes | 0.4.6 | MIT | [next-themes-license.md](licenses/next-themes-license.md) |
| pretendard | 1.3.9 | OFL-1.1 | [pretendard-LICENSE.txt](licenses/pretendard-LICENSE.txt) |
| pretendard-gov | 1.3.9 | OFL-1.1 | [pretendard-gov-LICENSE.txt](licenses/pretendard-gov-LICENSE.txt) |
| radix-ui | 1.6.7 | MIT | [radix-ui-LICENSE](licenses/radix-ui-LICENSE) |
| react | 19.2.8 | MIT | [react-LICENSE](licenses/react-LICENSE) |
| react-day-picker | 10.0.2 | MIT | [react-day-picker-LICENSE](licenses/react-day-picker-LICENSE) |
| react-dom | 19.2.8 | MIT | [react-dom-LICENSE](licenses/react-dom-LICENSE) |
| recharts | 3.10.1 | MIT | [recharts-LICENSE](licenses/recharts-LICENSE) |
| shadcn | 4.22.1 | MIT | [shadcn-LICENSE.md](licenses/shadcn-LICENSE.md) |
| tw-animate-css | 1.4.0 | MIT | [tw-animate-css-LICENSE](licenses/tw-animate-css-LICENSE) |

## 2. 개발 및 빌드 도구

아래 항목은 개발 또는 빌드에 설치된 직접 의존성입니다. 생성된 CSS 등에 기여할 수 있으므로 개발 도구라는 이유만으로 표시 의무가 없다고 단정하지 않습니다.

| 구성요소 | 설치 버전 | 메타데이터의 라이선스 | 원문 사본 |
| --- | --- | --- | --- |
| @tailwindcss/turbopack | 4.3.5 | MIT | [tailwindcss-turbopack-LICENSE](licenses/tailwindcss-turbopack-LICENSE) |
| @types/node | 20.19.43 | MIT | [types-node-LICENSE](licenses/types-node-LICENSE) |
| @types/react | 19.3.0 | MIT | [types-react-LICENSE](licenses/types-react-LICENSE) |
| @types/react-dom | 19.3.0 | MIT | [types-react-dom-LICENSE](licenses/types-react-dom-LICENSE) |
| eslint | 9.39.5 | MIT | [eslint-LICENSE](licenses/eslint-LICENSE) |
| eslint-config-next | 16.4.6 | MIT | 원문 파일 추가 확인 필요 |
| tailwindcss | 4.3.5 | MIT | [tailwindcss-LICENSE](licenses/tailwindcss-LICENSE) |
| typescript | 5.9.3 | Apache-2.0 | [typescript-LICENSE.txt](licenses/typescript-LICENSE.txt) |

## 3. 글꼴과 아이콘

Pretendard 및 Pretendard GOV는 Kil Hyung-jin과 각 원권리자의 고지 및 SIL Open Font License 1.1을 따릅니다. 글꼴을 배포할 때에는 포함된 저작권과 라이선스 원문을 유지합니다. 글꼴로 작성된 일반 문서에 글꼴 라이선스를 일괄 적용하지 않습니다.

Lucide 패키지는 ISC License와 Feather 유래 아이콘의 MIT License 고지를 함께 포함합니다. 일부 문장만 발췌하지 않고 제공된 원문 전체를 보관했습니다.

## 4. 복사된 UI 코드와 외부 자료

| 자료 | 확인한 내용 | 필요한 표시와 후속 조치 |
| --- | --- | --- |
| Slosh slider | `components/ui/slosh-slider.tsx`에 Bencho 유래 및 Copyright (c) 2026 Lorenzo Cabra, MIT 표기 | [원문 고지](licenses/slosh-slider-MIT.txt)와 소스 주석 유지 |
| COMPASS 1.0.17 기반 UI | 설치 가이드에 MIT 코드와 별도 조건의 자료를 구별하는 내용이 있음 | 실제 취득 경로와 자료별 라이선스 확인. 모든 자료에 MIT를 일괄 적용하지 않음 |
| affectUI text reveal | `components/ui/text-motion.tsx`가 `/licenses/affectui-text-reveal.txt`를 참조하나 해당 공개 파일을 현재 찾지 못함 | 원문 고지와 이용 조건 확보. 확보 전 라이선스를 임의로 작성하지 않음 |
| KRDS 참고 자료 | 공공 UI 가이드 및 디자인 자료 참고 | 자료별 권리와 이용 조건 확인. 공공기관의 서비스 인증이나 후원으로 표시하지 않음 |
| 식약처 의약품 정보 | 현재 실제 API 연동 전 설계 및 예시 | 실제 도입한 데이터의 출처, 이용 조건과 갱신 기준을 확정한 뒤 표시 |

## 5. 원문 보존과 배포

`licenses/`의 문서는 설치된 패키지 또는 소스에 포함된 원문을 복사한 것입니다. 한국어 설명은 편의를 위한 것이며 원문 라이선스를 대체하지 않습니다. [직접 의존성 확인 목록](dependency-license-inventory.json)에는 원본 경로와 사본의 SHA-256 값을 기록했습니다.

이 목록은 직접 의존성 확인 결과입니다. 전이 의존성, 최종 배포 번들, 별도 구매 자료와 모든 정적 자산에 대한 감사를 완료한 목록은 아닙니다. 배포 시 실제 포함되는 구성요소의 저작권, 라이선스 및 NOTICE 요구사항을 확인하여 추가해야 합니다.

현재 원문 링크는 이 문서 폴더를 기준으로 합니다. 이용자 화면에 게시할 때에는 원문 파일도 접근 가능한 경로에 함께 제공하고 링크를 해당 경로로 바꿔야 합니다.

서비스 고유 자료와 이용자 기록에 관한 권리는 [저작권 고지](copyright.md)를 확인해 주세요.
