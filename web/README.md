This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 인수인계 이해 확인 체험

`/care/understanding` 또는 홈의 **인수인계 함께 확인** 카드에서 엽니다. 안내 읽기, 내 말로 설명, 원문 재안내, 결과 확인의 흐름을 제공합니다. 산책 준비와 대화 시작의 가상 원문을 사용하며 실제 AI 분석과 서버 저장은 연결하지 않았습니다.

- 준비된 예시만 비교합니다. 자유 답변은 확인 불가로 표시합니다.
- 재설명은 1회이며 건너뛴 안내는 확인 필요로 남깁니다. 미확인 안내만 다시 열 수 있습니다.
- 결과는 현재 화면의 메모리에만 유지하며, 돌봄 수행이나 자격, 열람 권한을 판정하지 않습니다.
- 제출용 HTML 프로토타입의 같은 흐름은 `../prototype/app.html#/B5`에 있습니다. B5~B5e 화면 ID와 운영 연동 경계는 루트 README를 참고합니다.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
