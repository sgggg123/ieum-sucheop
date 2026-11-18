# 이음수첩 데이터 처리 파이프라인

이음수첩은 말과 사진으로 쌓고, 붙여 둔 2단계 QR로 넘기고, 보호자가 돌아오면 기록을 되돌려받는 AI 돌봄 인수인계서입니다. 아래 그림은 해커톤 MVP의 데이터 처리 흐름을 기록 · 열람 · 시연(모의) 세 레인으로 나눈 것입니다.

```mermaid
%%{init: {"theme": "base", "flowchart": {"wrappingWidth": 400}, "themeVariables": {"fontFamily": "Pretendard GOV Variable, Pretendard GOV, Pretendard, Malgun Gothic, sans-serif", "fontSize": "15px", "primaryColor": "#FFFFFF", "primaryBorderColor": "#1E2124", "primaryTextColor": "#1E2124", "lineColor": "#8A949E", "clusterBkg": "#F7F8F9", "clusterBorder": "#CDD1D5", "edgeLabelBackground": "#FFFFFF"}}}%%
flowchart LR
  subgraph REC["기록"]
    V["음성 (1회 3분까지)"] --> STT["Whisper API<br/>음성 인식"]
    V -.->|"음성 인식 실패 시"| TXT["글로 쓰기"]
    STT --> PSE["이름·연락처 가명 처리"]
    TXT --> PSE
    PSE --> HAI["Claude Haiku 5.5<br/>tool use + strict JSON 스키마<br/>항목별 구조화"]
    HAI --> CHK{"원문 인용 위치가<br/>원문에 실제로 있나?"}
    CHK -->|없음| DROP["항목 버림<br/>(지어낸 항목 차단)"]
    CHK -->|있음| GAP["체크리스트와 비교<br/>빠진 항목 되묻기"]
    GAP -->|"보호자 답변"| V
    IMG["복약안내문 사진<br/>보호자가 이름 가림"] --> OPUS["Claude Opus 5.5<br/>이미지 인식"]
    OPUS --> MFDS["식약처 의약품<br/>제품 허가정보 대조"]
    MFDS --> FLAG["애매한 칸 표시"]
    GAP --> CONF["보호자 확인"]
    FLAG --> CONF
    CONF --> SAVE["인수인계서 갱신<br/>'꼭 알아야 해요'·1단계 항목은<br/>보호자가 고름"]
    HAI -.->|"실패 시 1회 재시도 후"| MANUAL["보호자 직접 입력"]
    MANUAL --> CONF
  end

  subgraph VIEW["열람<br/>서버가 토큰·동의 범위 판정"]
    QR["QR 스캔"] --> S1["1단계<br/>알레르기·주의 약 종류<br/>번호 가린 전화"]
    S1 --> REQ{"전체 보기 요청"}
    REQ -->|"돌봄SOS 1회용 코드<br/>구급대원 업무용 번호"| FULL["2단계 전체<br/>(만료 링크)"]
    REQ -->|"문자 인증 + 사유"| APR["승인자 알림"]
    APR -->|승인| FULL
    APR -->|"10분 무응답"| SUM["긴급 요약만"]
    APR -->|거절| STOP["종료"]
    FULL --> LOG["열람 로그"]
    SUM --> LOG
  end

  subgraph DEMO["시연 · 모의 처리"]
    M1["식약처 대조 대신<br/>미리 받은 약 목록 (약 10종)"]
    M2["모의 기관 코드"]
    M3["문자 인증 모의"]
    M4["승인 모의"]
    M5["'시간 경과' 버튼<br/>10분 대기 즉시 처리"]
  end

  SAVE --> QR
  M1 -.-> MFDS
  M2 -.-> REQ
  M3 -.-> REQ
  M4 -.-> APR
  M5 -.-> SUM

  classDef ext fill:#E6E8EA,stroke:#6D7882,color:#1E2124
  classDef mock fill:#FFFFFF,stroke:#6D7882,stroke-dasharray:6 4,color:#1E2124
  classDef drop fill:#FDEEEC,stroke:#C8281E,color:#8F1D15
  classDef guard fill:#ECF2FE,stroke:#256EF4,color:#0B3D99
  class STT,HAI,OPUS,MFDS ext
  class M1,M2,M3,M4,M5 mock
  class DROP drop
  class CONF,SAVE guard
```

- AI는 정리만 하고 의료 판단은 하지 않습니다. 원문 인용 위치가 없는 항목은 저장하지 않습니다.
- 발화 정리·되묻기는 Claude Haiku 5.5, 복약안내문 인식은 Claude Opus 5.5를 씁니다.
- 비로그인 열람은 서버가 토큰과 동의 범위를 판정하고, 모든 열람을 기록합니다.
- 시연에서는 문자 인증·승인·기관 인증을 모의 처리하고 10분 대기는 '시간 경과' 버튼으로 넘깁니다.
- 음성(OpenAI)과 이름·연락처를 가린 글, 이름을 가린 사진(Anthropic)은 한국 밖에서 처리되므로 국외 이전 동의를 받습니다. 두 API 모두 입력을 학습에 쓰지 않고, 무보존(ZDR)을 신청합니다. 이음수첩 DB·파일은 서울 리전에 둡니다.

| 표시 | 뜻 |
|---|---|
| 회색 상자 | 외부 서비스 (Whisper API·Claude API는 한국 밖에서 처리, 식약처 의약품 제품 허가정보 API) |
| 파란 상자 | 보호자가 확인·선택하는 단계 |
| 점선 상자·점선 화살표 | 시연에서 모의 처리하거나 실패 시 대체하는 경로 |
| 빨간 상자 | 원문 근거가 없어 버리는 항목 |

## 이 저장소의 제출물

| 지원서 칸 | 파일 | 내용 |
|---|---|---|
| 06 기획서 | `이음수첩_기획서.pdf` | 9쪽 기획서 (원본 `ieum-proposal.html`) |
| 07 UI/UX | `ieum-wireframes.html`, `prototype/` | 화면 설계 보드, 눌러 볼 수 있는 프로토타입, 담당자 콘솔 |
| 08 유저 플로우 | `ieum-userflow.html` | 레인 5개 × 단계 5개 스윔레인 |
| 09 ERD | `ieum-erd.dbml` | MVP ERD ([dbdiagram.io에서 보기](https://dbdiagram.io/d/6afd7f0b4e0bad6598f68100)) |
| 10 파이프라인 | `README.md` | 이 문서 |

캡처 이미지(`captures/`)와 기획서 PDF는 `tools/capture.mjs`로 다시 만들 수 있습니다. (`cd tools && npm install && node capture.mjs`, Chrome 필요)
