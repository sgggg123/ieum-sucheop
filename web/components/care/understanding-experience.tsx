"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, BookOpen, Check, CheckCheck, ChevronDown,
  CircleHelp, ClipboardCheck, Footprints, MessageCircle, RotateCcw, ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MobileAppShell, MobileToolbarButton } from "@/components/ui/mobile-app-shell";
import { Textarea } from "@/components/ui/textarea";
import {
  compareDemoAnswer, understandingTopics,
  type DemoFeedback, type UnderstandingTopic,
} from "@/lib/understanding-demo";
import { cn } from "@/lib/utils";
import styles from "./understanding-experience.module.css";

type Phase = "welcome" | "read" | "answer" | "review" | "summary";
type Result = "confirmed" | "pending";

function Source({ topic, open = false }: { topic: UnderstandingTopic; open?: boolean }) {
  return (
    <details className={styles.source} open={open || undefined}>
      <summary>
        <span><BookOpen aria-hidden="true" />보호자가 남긴 원문</span>
        <ChevronDown aria-hidden="true" />
      </summary>
      <blockquote>“{topic.quote}”</blockquote>
      <p>{topic.category} 항목 · 마지막 확인 {topic.checkedAt}</p>
      <p className={styles.sourceNote}>보호자 확인 표시를 포함한 예시 데이터</p>
    </details>
  );
}

export function UnderstandingExperience() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<DemoFeedback | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [results, setResults] = useState<Record<string, Result>>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const topic = understandingTopics[index];
  const confirmed = Object.values(results).filter((result) => result === "confirmed").length;
  const pending = understandingTopics.filter((item) => results[item.id] !== "confirmed");
  const nextIndex = understandingTopics.findIndex((item, i) => i > index && results[item.id] !== "confirmed");
  const isLast = nextIndex === -1;
  const step = phase === "read" ? 0 : phase === "answer" ? 1 : 2;
  const canRetry = attempts < 2;

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    heading.current?.closest("main")?.scrollTo({ top: 0, behavior: "instant" });
  }, [phase, index]);

  function openTopic(nextIndex: number) {
    setIndex(nextIndex);
    setAnswer("");
    setFeedback(null);
    setAttempts(0);
    setPhase("read");
  }

  function finishTopic(result: Result) {
    setResults((previous) => ({ ...previous, [topic.id]: result }));
    if (isLast) setPhase("summary");
    else openTopic(nextIndex);
  }

  function reset() {
    setResults({});
    setIndex(0);
    setAnswer("");
    setFeedback(null);
    setAttempts(0);
    setPhase("welcome");
  }

  function back() {
    if (phase === "read" || phase === "summary") setPhase("welcome");
    else if (phase === "answer") setPhase("read");
    else if (phase === "review") setPhase("answer");
  }

  const footer = (() => {
    if (phase === "welcome") return (
      <Button type="button" size="lg" className={styles.primaryAction} onClick={() => { setResults({}); openTopic(0); }}>
        생활 안내 2개 확인하기<ArrowRight aria-hidden="true" />
      </Button>
    );
    if (phase === "read") return (
      <Button type="button" size="lg" className={styles.primaryAction} onClick={(event) => { event.preventDefault(); setPhase("answer"); }}>
        내 말로 설명하기<ArrowRight aria-hidden="true" />
      </Button>
    );
    if (phase === "answer") return (
      <Button type="submit" form="understanding-answer" size="lg" className={styles.primaryAction} disabled={!answer.trim()}>
        설명 확인하기<ArrowRight aria-hidden="true" />
      </Button>
    );
    if (phase === "review" && feedback?.kind === "complete") return (
      <Button type="button" size="lg" className={styles.primaryAction} onClick={() => finishTopic("confirmed")}>
        {isLast ? "확인 마치기" : "다음 안내 보기"}<ArrowRight aria-hidden="true" />
      </Button>
    );
    if (phase === "review" && canRetry) return (
      <Button type="button" size="lg" className={styles.primaryAction} onClick={(event) => { event.preventDefault(); setPhase("answer"); }}>
        한 번 더 설명하기<RotateCcw aria-hidden="true" />
      </Button>
    );
    if (phase === "review") return (
      <Button type="button" size="lg" className={styles.primaryAction} onClick={() => finishTopic("pending")}>
        확인 필요로 남기고 계속<ArrowRight aria-hidden="true" />
      </Button>
    );
    if (pending.length > 0) return (
      <Button type="button" size="lg" className={styles.primaryAction} onClick={() => openTopic(understandingTopics.findIndex((item) => item.id === pending[0].id))}>
        필요한 안내 다시 확인하기<RotateCcw aria-hidden="true" />
      </Button>
    );
    return <Button asChild size="lg" className={styles.primaryAction}><Link href="/">보호자 홈으로<ArrowRight aria-hidden="true" /></Link></Button>;
  })();

  return (
    <MobileAppShell
      title="인수인계 함께 확인"
      leading={phase === "welcome" ? (
        <MobileToolbarButton asChild aria-label="보호자 홈으로"><Link href="/"><ArrowLeft aria-hidden="true" /></Link></MobileToolbarButton>
      ) : <MobileToolbarButton aria-label="이전 단계로" onClick={back}><ArrowLeft aria-hidden="true" /></MobileToolbarButton>}
      trailing={<span className={styles.demoBadge}>체험</span>}
      bottomAction={<div className={styles.footerSurface}>{footer}</div>}
    >
      <div id="main-content" className={styles.experience} tabIndex={-1}>
        <div className={styles.context}><ShieldCheck aria-hidden="true" /><span>김순자 님의 생활 안내</span><span className={styles.contextLevel}>2단계 예시</span></div>

        {phase === "welcome" ? (
          <div className={styles.screen} key="welcome">
            <div className={styles.heroIcon}><MessageCircle aria-hidden="true" /><span><Check aria-hidden="true" /></span></div>
            <p className={styles.eyebrow}>돌봄을 시작하기 전에</p>
            <h1 ref={heading} tabIndex={-1} className={styles.heading}>읽은 내용을,<br />함께 확인해요</h1>
            <p className={styles.lead}>보호자가 남긴 안내를 읽고<br />어떻게 하실지 편하게 설명해 주세요.</p>
            <Card className={cn(styles.welcomeCard, "ring-0")}>
              <p className={styles.cardEyebrow}>오늘 함께 볼 안내</p>
              {understandingTopics.map((item, i) => (
                <div className={styles.topicRow} key={item.id}>
                  <span className={styles.topicIcon}>{i === 0 ? <Footprints aria-hidden="true" /> : <MessageCircle aria-hidden="true" />}</span>
                  <span><strong>{item.title}</strong><small>{item.introduction}</small></span>
                </div>
              ))}
              <div className={styles.welcomeNote}><CircleHelp aria-hidden="true" /><p>기억력을 시험하는 과정이 아니에요.<br />놓친 내용은 다시 보여드릴게요.</p></div>
            </Card>
            <p className={styles.demoNote}>예시 데이터와 준비된 답변으로 체험해요.<br />실제 AI 분석이나 기록 저장은 하지 않아요.</p>
          </div>
        ) : phase === "summary" ? (
          <div className={styles.screen} key="summary">
            <div className={cn(styles.heroIcon, pending.length === 0 && styles.positiveIcon)}><ClipboardCheck aria-hidden="true" /></div>
            <p className={styles.eyebrow}>함께 확인한 내용</p>
            <h1 ref={heading} tabIndex={-1} className={styles.heading}>{pending.length === 0 ? <>생활 안내 2개를<br />함께 확인했어요</> : <>확인이 필요한 안내가<br />남아 있어요</>}</h1>
            <p className={styles.lead}>{pending.length === 0 ? "돌봄 중에도 원문을 다시 볼 수 있어요." : "모르는 내용은 추측하지 않고 남겨 두었어요."}</p>
            <Card className={cn(styles.summaryStats, "ring-0")}><span><strong>{confirmed}</strong>확인한 안내</span><span><strong>{pending.length}</strong>확인 필요</span></Card>
            <div className={styles.resultList}>
              {understandingTopics.map((item) => (
                <button key={item.id} type="button" className={styles.resultRow} onClick={() => openTopic(understandingTopics.indexOf(item))}>
                  <span className={cn(styles.resultIcon, results[item.id] === "confirmed" && styles.confirmed)}>{results[item.id] === "confirmed" ? <Check aria-hidden="true" /> : <CircleHelp aria-hidden="true" />}</span>
                  <span><strong>{item.title}</strong><small>{results[item.id] === "confirmed" ? "내용을 함께 확인했어요" : "원문을 보거나 보호자에게 확인해 주세요"}</small></span>
                  <ArrowRight aria-hidden="true" />
                </button>
              ))}
            </div>
            <p className={styles.demoNote}>이 결과는 체험 화면 안에서만 유지돼요.<br />실제 돌봄 수행 여부를 나타내지 않아요.</p>
            <Button type="button" variant="ghost" className={styles.textAction} onClick={reset}><RotateCcw aria-hidden="true" />처음부터 체험하기</Button>
            {pending.length > 0 && <Button asChild variant="link" className={styles.textAction}><Link href="/">보호자 홈으로</Link></Button>}
          </div>
        ) : (
          <div className={styles.screen} key={`${index}-${phase}`}>
            <div className={styles.progressHeading}><p>안내 {index + 1}<span> / {understandingTopics.length}</span></p><span>{topic.title}</span></div>
            <ol className={styles.steps} aria-label="안내 확인 단계">
              {["안내 읽기", "내 말로 설명", "함께 확인"].map((label, i) => (
                <li key={label} data-active={step === i} data-done={step > i} aria-current={step === i ? "step" : undefined}><span>{step > i ? <Check aria-hidden="true" /> : i + 1}</span>{label}</li>
              ))}
            </ol>

            {phase === "read" ? (
              <>
                <p className={styles.eyebrow}>보호자가 꼭 전하고 싶은 내용</p>
                <h1 ref={heading} tabIndex={-1} className={styles.heading}>{topic.title === "산책 준비" ? <>산책 전에<br />이렇게 준비해 주세요</> : <>말을 걸 때는<br />이렇게 이야기해 주세요</>}</h1>
                <Card className={cn(styles.guidanceCard, "ring-0")}>
                  <div className={styles.guidanceIcon}>{index === 0 ? <Footprints aria-hidden="true" /> : <MessageCircle aria-hidden="true" />}</div>
                  <p className={styles.quote}>{topic.quote}</p>
                  <div className={styles.sourceBadge}><ShieldCheck aria-hidden="true" />보호자 확인 예시<span>{topic.checkedAt}</span></div>
                </Card>
                <Source topic={topic} />
                <p className={styles.helper}>다음에는 어떻게 하실지 내 말로 설명해 볼게요.<br />원문을 그대로 외우지 않아도 괜찮아요.</p>
                <Button type="button" variant="ghost" className={styles.textAction} onClick={() => finishTopic("pending")}>나중에 확인할게요</Button>
              </>
            ) : phase === "answer" ? (
              <>
                <p className={styles.eyebrow}>{attempts > 0 ? "원문을 보고 다시 설명해도 괜찮아요" : "이제 내 말로 설명해 볼까요?"}</p>
                <h1 ref={heading} tabIndex={-1} className={cn(styles.heading, styles.question)}>{topic.question}</h1>
                <form id="understanding-answer" onSubmit={(event) => {
                  event.preventDefault();
                  if (!answer.trim()) return;
                  setFeedback(compareDemoAnswer(topic, answer));
                  setAttempts((count) => count + 1);
                  setPhase("review");
                }}>
                  <label className={styles.inputLabel} htmlFor="care-answer">내 설명</label>
                  <Textarea ref={input} id="care-answer" value={answer} maxLength={500} rows={4} placeholder="어떻게 하실지 편하게 적어 주세요." onChange={(event) => setAnswer(event.target.value)} aria-describedby="answer-help" className={styles.answerInput} />
                  <p id="answer-help" className={styles.inputHint}>짧게 적거나, 아래 예시 답변을 골라도 좋아요.</p>
                </form>
                <div className={styles.examples}><p>체험용 답변 넣기</p><div>{topic.examples.map((example) => (
                  <Button key={example.label} type="button" variant="outline" onClick={() => { setAnswer(example.text); input.current?.focus(); }} aria-pressed={answer === example.text}>{example.label}</Button>
                ))}</div></div>
                <Source topic={topic} />
                <p className={styles.demoNote}>준비된 예시만 비교하는 UI 체험이에요.<br />직접 쓴 답변은 확인 필요로 표시돼요.</p>
                <Button type="button" variant="ghost" className={styles.textAction} onClick={() => finishTopic("pending")}>잘 모르겠어요. 확인 필요로 남기기</Button>
              </>
            ) : feedback && (
              <>
                <div role="status" className={styles.feedbackHeader}>
                  <span className={cn(styles.feedbackIcon, feedback.kind === "complete" && styles.confirmed)}>{feedback.kind === "complete" ? <CheckCheck aria-hidden="true" /> : <BookOpen aria-hidden="true" />}</span>
                  <p className={styles.eyebrow}>{feedback.kind === "complete" ? "필요한 내용을 함께 확인했어요" : feedback.kind === "partial" ? "이 내용도 함께 기억해 주세요" : "추측하지 않고 다시 확인해요"}</p>
                  <h1 ref={heading} tabIndex={-1} className={styles.heading}>{feedback.kind === "complete" ? <>좋아요, 이렇게<br />함께해 주세요</> : feedback.kind === "partial" ? <>한 가지만<br />더 확인해 볼까요?</> : <>원문과 한 번 더<br />확인이 필요해요</>}</h1>
                </div>
                <Card className={cn(styles.myAnswer, "ring-0")}><span>내가 설명한 내용</span><p>{answer}</p></Card>
                {feedback.kind === "unverified" ? (
                  <Card className={cn(styles.followup, "ring-0")}><strong>확인되지 않은 답변이에요</strong><p>예시 밖의 답변은 이 체험에서 판단하지 않아요. 원문을 다시 보거나 보호자에게 확인해 주세요.</p></Card>
                ) : (
                  <ul className={styles.checkList}>{topic.points.map((point) => {
                    const covered = feedback.covered.includes(point.id);
                    return <li key={point.id} className={cn(!covered && styles.missing)}><span className={cn(styles.pointIcon, covered && styles.confirmed)}>{covered ? <Check aria-hidden="true" /> : <BookOpen aria-hidden="true" />}</span><div><strong>{point.label}</strong><span>{covered ? "설명에 담겼어요" : "원문에서 다시 찾았어요"}</span>{!covered && <blockquote>“{point.quote}”</blockquote>}</div></li>;
                  })}</ul>
                )}
                <Source topic={topic} open={feedback.kind === "unverified"} />
                {feedback.kind !== "complete" && <>
                  {!canRetry && <p className={styles.helper}>지금 확실하지 않아도 괜찮아요.<br />이 안내는 보호자에게 확인할 내용으로 남겨요.</p>}
                  {canRetry && <Button type="button" variant="ghost" className={styles.textAction} onClick={() => finishTopic("pending")}>확인 필요로 남기고 계속하기</Button>}
                </>}
              </>
            )}
          </div>
        )}
      </div>
    </MobileAppShell>
  );
}
