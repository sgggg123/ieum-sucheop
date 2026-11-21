"use client";

import { useState } from "react";
import { FileText, House, QrCode, Settings } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MobileAppShell,
  MobileListCard,
  MobileScreenHeading,
} from "@/components/ui/mobile-app-shell";
import { Progress } from "@/components/ui/progress";

const tabs = [
  { value: "home", label: "홈", icon: <House aria-hidden="true" /> },
  { value: "handover", label: "인수인계서", icon: <FileText aria-hidden="true" /> },
  { value: "qr", label: "QR", icon: <QrCode aria-hidden="true" /> },
  { value: "settings", label: "설정", icon: <Settings aria-hidden="true" /> },
];

const completion = { done: 5, total: 7 };
const percent = Math.round((completion.done / completion.total) * 100);

export default function Home() {
  const [tab, setTab] = useState("home");

  return (
    <MobileAppShell
      navigation={{
        items: tabs,
        value: tab,
        onValueChange: setTab,
        "aria-label": "하단 메뉴",
      }}
    >
      <div id="main-content" tabIndex={-1} className="outline-none">
        <MobileScreenHeading>이음수첩</MobileScreenHeading>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>인수인계서 완성도</CardTitle>
              <CardAction>
                <Badge variant="secondary">{percent}%</Badge>
              </CardAction>
              <CardDescription>
                {completion.total}개 항목 중 {completion.done}개 완료
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Progress value={percent} aria-label={`완성도 ${percent}%`} />
              <p className="text-muted-foreground">
                빠진 항목: 밤에 잠을 못 주무실 때, 비상연락처 1명 더
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full">
                빠진 항목 채우기
              </Button>
            </CardFooter>
          </Card>

          <div className="flex flex-col gap-3">
            <MobileListCard href="/record/photo">복약안내문 찍기</MobileListCard>
            <MobileListCard href="/record/voice">말로 기록</MobileListCard>
            <MobileListCard href="/handover">인수인계서 보기</MobileListCard>
          </div>

          <Button variant="outline" size="lg" className="w-full">
            자리비움
          </Button>
        </div>
      </div>
    </MobileAppShell>
  );
}
