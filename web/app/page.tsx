"use client";

import { useState, type CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Camera,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Hand,
  House,
  LogOut,
  Mic,
  Music,
  Phone,
  Pill,
  QrCode,
  Settings,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileAppShell, MobileListCard } from "@/components/ui/mobile-app-shell";
import { cn } from "@/lib/utils";
import styles from "./home-motion.module.css";

// 프로토타입 A1(보호자 홈) 기준. 데이터는 아직 서버 없이 화면 확인용 고정값이다.
const tabs = [
  { value: "home", label: "홈", icon: <House aria-hidden="true" /> },
  { value: "handover", label: "인수인계서", icon: <FileText aria-hidden="true" /> },
  { value: "qr", label: "QR", icon: <QrCode aria-hidden="true" /> },
  { value: "settings", label: "설정", icon: <Settings aria-hidden="true" /> },
];

const sections: { label: string; icon: LucideIcon; done: boolean }[] = [
  { label: "복약", icon: Pill, done: true },
  { label: "건강·병력", icon: ShieldCheck, done: true },
  { label: "식사·알레르기", icon: Hand, done: true },
  { label: "의사소통", icon: Music, done: true },
  { label: "위험행동과 진정법", icon: TriangleAlert, done: true },
  { label: "일과", icon: Clock, done: false },
  { label: "비상연락처", icon: Phone, done: false },
];
const doneCount = sections.filter((s) => s.done).length;

const quickActions = [
  { href: "/record/photo", icon: Camera, title: ["복약안내문", "찍기"], note: "약이 바뀐 날 한 장만", tone: "bg-primary" },
  { href: "/record/voice", icon: Mic, title: ["말로", "기록"], note: "AI가 정리해요", tone: "bg-primary-hover" },
];

export default function Home() {
  const [tab, setTab] = useState("home");

  return (
    <MobileAppShell
      navigation={{
        items: tabs,
        value: tab,
        onValueChange: setTab,
        className: styles.navigation,
        "aria-label": "하단 메뉴",
      }}
    >
      <div id="main-content" tabIndex={-1} className={cn("flex flex-col gap-4 break-keep outline-none", styles.home)}>
        <header className="flex items-center justify-between gap-3">
          <h1 className="text-xl">
            <Logo />
          </h1>
          <Button variant="ghost" size="sm" aria-haspopup="menu">
            김순자 님
            <ChevronDown data-icon="inline-end" aria-hidden="true" />
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>인수인계서</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div
              role="img"
              aria-label={`${sections.length}개 항목 중 ${doneCount}개를 채웠어요`}
              className="grid grid-cols-7 gap-1.5"
            >
              {sections.map(({ label, icon: Icon, done }, index) => (
                <span
                  key={label}
                  data-complete={done}
                  style={{ "--step-delay": `${Math.min(index, 6) * 24}ms` } as CSSProperties}
                  className={cn(
                    "grid aspect-square place-items-center rounded-lg",
                    styles.step,
                    done
                      ? "bg-primary text-primary-foreground"
                      : "border-2 border-dashed border-muted-foreground text-muted-foreground",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              ))}
            </div>
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold">빠진 항목이 있어요</p>
                <Button asChild variant="link" size="sm" className="px-0">
                  <a href="/record/voice">
                    채우기
                    <ChevronRight data-icon="inline-end" aria-hidden="true" />
                  </a>
                </Button>
              </div>
              <p className="mt-1 text-muted-foreground">
                일과, 밤에 잠을 못 주무실 때
                <br />
                비상연락처 1명 더
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ href, icon: Icon, title, note, tone }) => (
            <a key={href} href={href} className={cn("block rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", styles.action)}>
              <Card className={cn("h-full gap-2 text-primary-foreground ring-0", tone, styles.actionSurface)}>
                <CardContent className="flex flex-col gap-2">
                  <Icon className="size-8" aria-hidden="true" />
                  <span className="text-lg leading-snug font-bold">
                    {title[0]}
                    <br />
                    {title[1]}
                  </span>
                  <span>{note}</span>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        <MobileListCard href="/handover" className={styles.listAction}>
          <span className="flex flex-col">
            <span className="font-bold">인수인계서 확인</span>
            <span className="text-muted-foreground">최근 저장 11월 18일</span>
          </span>
        </MobileListCard>

        <MobileListCard href="/care/understanding" className={styles.listAction}>
          <span className="flex items-start gap-3">
            <ClipboardCheck className="mt-1 size-6 shrink-0 text-primary" aria-hidden="true" />
            <span className="flex flex-col gap-1">
              <span className="font-bold">인수인계 함께 확인</span>
              <span className="text-sm text-muted-foreground">임시 보호자 화면 체험</span>
            </span>
          </span>
        </MobileListCard>

        <Button variant="outline" size="lg" className="w-full">
          <LogOut data-icon="inline-start" aria-hidden="true" />
          자리비움
        </Button>
      </div>
    </MobileAppShell>
  );
}
