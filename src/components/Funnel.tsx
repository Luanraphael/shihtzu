"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AudioLines,
  Baby,
  Bed,
  Bone,
  Briefcase,
  CalendarClock,
  CloudRain,
  Dog,
  Droplets,
  Eye,
  Footprints,
  Hand,
  HandHeart,
  Heart,
  HeartPulse,
  House,
  Layers,
  Leaf,
  MapPinHouse,
  Mars,
  Megaphone,
  Moon,
  Plane,
  Smile,
  Sofa,
  Sparkles,
  Star,
  Trash2,
  Trees,
  UserCheck,
  Users,
  Venus,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import s from "./Funnel.module.css";
import { Header, PawIcon } from "./ui";
import { MultiChoice, SingleChoice, SingleConfirm, type Opt } from "./steps/Choice";
import { Start } from "./steps/Start";
import { NameStep, DateStep } from "./steps/Inputs";
import { InfoCoat, InfoSummary, LoadingBehavior } from "./steps/Info";
import { Statement } from "./steps/Statement";
import { Predict } from "./steps/Predict";
import { Creating } from "./steps/Creating";
import { EmailStep, PlanReady, COAT_LABEL } from "./steps/Final";
import { Cards } from "./steps/Cards";
import { useFunnel } from "@/lib/store";
import { cleanName, couponCode, g, pron, REASON_DATE_TITLE } from "@/lib/personalize";
import { withTracking } from "@/lib/utm";
import { OFFER } from "@/config/offer";
import type {
  ActivityLevel,
  AgeRange,
  CoatColor,
  Command,
  DailyTime,
  Gender,
  Health,
  HomeIssue,
  PottyGoal,
  PottyIssue,
  PreviousTraining,
  Reason,
  WalkingIssue,
} from "@/lib/types";

const ic = (I: LucideIcon) => <I size={20} strokeWidth={1.6} />;

const COATS: CoatColor[] = ["dourado-branco", "preto-branco", "tricolor", "marrom-branco", "preto", "branco"];

export function Funnel() {
  const f = useFunnel();
  const router = useRouter();
  const { answers: a, step, advance, set, back } = f;

  useEffect(() => {
    f.onFinish(() => router.push(withTracking("/oferta")));
  }, [f, router]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  if (!f.ready) return <div className={s.blank} />;

  const content = (() => {
    switch (step) {
      case "start":
        return <Start />;

      case "gender":
        return (
          <SingleChoice<Gender>
            title="Seu Shih Tzu é"
            value={a.gender}
            onPick={(v) => advance({ gender: v })}
            options={[
              { value: "female", label: "Fêmea", icon: ic(Venus) },
              { value: "male", label: "Macho", icon: ic(Mars) },
            ]}
          />
        );

      case "name":
        return <NameStep initial={a.petName} onDone={(n) => advance({ petName: cleanName(n) }, 0)} />;

      case "age":
        return (
          <SingleChoice<AgeRange>
            title={a.petName ? `Quantos anos ${g(a, "o", "a")} ${a.petName} tem?` : "Quantos anos seu Shih Tzu tem?"}
            value={a.ageRange}
            onPick={(v) => advance({ ageRange: v })}
            options={[
              { value: "0-6m", label: "0 a 6 meses" },
              { value: "7-12m", label: "7 a 12 meses" },
              { value: "1-2y", label: "1 a 2 anos" },
              { value: "2-7y", label: "2 a 7 anos" },
              { value: "7y+", label: "Mais de 7 anos" },
            ]}
          />
        );

      case "coat":
        return (
          <SingleChoice<CoatColor>
            title="Qual dessas opções mais se parece com o seu Shih Tzu?"
            subtitle="Selecione a aparência mais próxima."
            value={a.coatColor}
            largeIcons
            onPick={(v) => advance({ coatColor: v })}
            options={[
              ...COATS.map((c) => ({
                value: c,
                label: COAT_LABEL[c],
                // eslint-disable-next-line @next/next/no-img-element
                icon: <img src={`/img/coat-${c}.webp`} alt="" width={48} height={48} />,
              })),
              {
                value: "outra" as const,
                label: "Outra cor / Não sei",
                icon: (
                  <span className={s.coatOther}>
                    <PawIcon size={24} color="#7b766f" />
                  </span>
                ),
              },
            ]}
          />
        );

      case "health":
        return (
          <MultiChoice<Health>
            title="Seu Shih Tzu tem algum problema de saúde nestas áreas?"
            values={a.health}
            exclusive={["healthy"]}
            onChange={(v) => set({ health: v })}
            onContinue={() => advance()}
            onSkip={() => advance({ health: [] })}
            options={[
              { value: "healthy", label: "Meu Shih Tzu é saudável", icon: ic(HeartPulse) },
              { value: "vision", label: "Visão", icon: ic(Eye) },
              { value: "hearing", label: "Audição", icon: ic(AudioLines) },
              { value: "joints", label: "Articulações", icon: ic(Bone) },
              { value: "teeth", label: "Dentes", icon: ic(Smile) },
            ]}
          />
        );

      case "info_coat":
        return <InfoCoat onContinue={() => advance()} />;

      case "loading_behavior":
        return <LoadingBehavior a={a} onDone={() => advance(undefined, 0)} />;

      case "potty":
        return (
          <MultiChoice<PottyIssue>
            title="Seu Shih Tzu já faz xixi e cocô no lugar certo?"
            values={a.pottyIssues}
            exclusive={["ok"]}
            onChange={(v) => set({ pottyIssues: v })}
            onContinue={() => advance()}
            onSkip={() => advance({ pottyIssues: [] })}
            options={[
              { value: "everywhere", label: "Ainda faz xixi ou cocô em vários lugares da casa", icon: ic(Droplets) },
              { value: "night", label: "Faz xixi fora do lugar durante a noite", icon: ic(Moon) },
              { value: "alone", label: "Faz xixi ou cocô fora do lugar quando fica sozinho", icon: ic(House) },
              { value: "ok", label: "Sim, já faz tudo no lugar certo! 🐶", icon: ic(Sparkles) },
            ]}
          />
        );

      case "potty_goal":
        return (
          <SingleChoice<PottyGoal>
            title="Onde você quer que seu Shih Tzu faça xixi e cocô?"
            value={a.pottyGoal}
            onPick={(v) => advance({ pottyGoal: v })}
            options={[
              { value: "street", label: "Direto na rua, desde o começo", icon: ic(Trees) },
              { value: "pad-then-street", label: "Primeiro no tapetinho higiênico, depois na rua", icon: ic(Footprints) },
              { value: "pad", label: "Sempre no tapetinho higiênico, em casa", icon: ic(Layers) },
              { value: "both", label: "No tapetinho em casa e também na rua", icon: ic(MapPinHouse) },
              { value: "already", label: "Ele já faz no lugar certo! Não preciso ensinar", icon: ic(Hand) },
            ]}
          />
        );

      case "issues":
        return (
          <MultiChoice<HomeIssue>
            title="Quais desses problemas você tem com seu Shih Tzu em casa?"
            values={a.homeIssues}
            onChange={(v) => set({ homeIssues: v })}
            onContinue={() => advance()}
            onSkip={() => advance({ homeIssues: [] })}
            options={[
              { value: "biting", label: "Fica mordendo as mãos e os pés", icon: ic(Hand) },
              { value: "barking", label: "Late sem parar", icon: ic(Megaphone) },
              { value: "chewing", label: "Morde e destrói móveis e objetos", icon: ic(Sofa) },
              { value: "anxiety", label: "Chora ou fica muito ansioso quando está sozinho", icon: ic(CloudRain) },
            ]}
          />
        );

      case "st_irritation":
        return (
          <Statement
            statement="Muitas vezes, fico irritado quando meu Shih Tzu faz xixi ou cocô fora do lugar ou destrói alguma coisa em casa."
            question="Você também se sente assim?"
            img="/img/statement-irritacao.webp"
            imgAlt="Shih Tzu mordendo um chinelo azul rasgado"
            imgW={702}
            imgH={431}
            value={a.irritationScore}
            onAnswer={(v) => advance({ irritationScore: v })}
          />
        );

      case "walking":
        return (
          <MultiChoice<WalkingIssue>
            title="Seu Shih Tzu tem algum desses problemas quando sai para passear?"
            values={a.walkingIssues}
            onChange={(v) => set({ walkingIssues: v })}
            onContinue={() => advance()}
            onSkip={() => advance({ walkingIssues: [] })}
            options={[
              { value: "no-walks", label: "Meu Shih Tzu ainda não passeia na rua", icon: ic(House) },
              { value: "pulling", label: "Puxa muito a coleira", icon: ic(Footprints) },
              { value: "eating-trash", label: "Tenta comer lixo ou sujeira da rua", icon: ic(Trash2) },
              { value: "barks-dogs", label: "Late para outros cachorros", icon: ic(Dog) },
              { value: "barks-people", label: "Late para as pessoas", icon: ic(Users) },
            ]}
          />
        );

      case "activity":
        return (
          <SingleChoice<ActivityLevel>
            title="Seu Shih Tzu é mais agitado ou tranquilo durante o dia?"
            value={a.activityLevel}
            onPick={(v) => advance({ activityLevel: v })}
            options={[
              { value: "high", label: "Cheio de energia, não para quieto", icon: ic(Zap) },
              { value: "medium", label: "Brinca bastante, mas também descansa", icon: ic(Leaf) },
              { value: "low", label: "Mais quietinho, passa boa parte do dia deitado ou dormindo", icon: ic(Bed) },
            ]}
          />
        );

      case "info_summary":
        return <InfoSummary a={a} onContinue={() => advance()} />;

      case "commands":
        return (
          <MultiChoice<Command>
            chips
            title="O que seu Shih Tzu já sabe fazer? 🐶"
            subtitle={`Marque todas as opções que ${pron(a)} já consegue fazer quando você pede.`}
            values={a.knownCommands}
            onChange={(v) => set({ knownCommands: v })}
            onContinue={() => advance()}
            onSkip={() => advance({ knownCommands: [] })}
            options={COMMAND_OPTIONS}
          />
        );

      case "st_ignore":
        return (
          <Statement
            statement="Muitas vezes, meu Shih Tzu me ignora e não faz o que eu peço."
            question="Isso também acontece com você?"
            img="/img/statement-ignora.webp"
            imgAlt="Shih Tzu tentando alcançar a tigela de comida em cima da mesa"
            imgW={681}
            imgH={512}
            value={a.obedienceScore}
            onAnswer={(v) => advance({ obedienceScore: v })}
          />
        );

      case "reason":
        return (
          <SingleConfirm<Reason>
            title="Tem algum motivo especial para você querer ensinar seu Shih Tzu agora?"
            value={a.trainingReason}
            onSelect={(v) => set({ trainingReason: v })}
            onContinue={() =>
              // a different reason invalidates a date given for the previous one
              advance(a.eventType && a.eventType !== a.trainingReason ? { eventType: null, eventStatus: null, eventDate: null } : undefined)
            }
            skipLabel="Nenhuma dessas opções"
            onSkip={() => advance({ trainingReason: null, eventType: null, eventStatus: null, eventDate: null })}
            options={REASON_OPTIONS}
          />
        );

      case "date": {
        const r = a.trainingReason as Exclude<Reason, "well-behaved">;
        return (
          <DateStep
            key={r}
            title={REASON_DATE_TITLE[r]}
            initial={a.eventType === r && a.eventStatus === "scheduled" ? a.eventDate : null}
            onDate={(iso) => advance({ eventType: r, eventStatus: "scheduled", eventDate: iso })}
            onPast={() => advance({ eventType: r, eventStatus: "past", eventDate: null })}
            onSkip={() => advance({ eventType: r, eventStatus: null, eventDate: null })}
          />
        );
      }

      case "predict":
        return <Predict a={a} onBack={back} onContinue={() => advance()} />;

      case "training_time":
        return (
          <SingleChoice<DailyTime>
            title="Quanto tempo por dia você consegue dedicar ao treino do seu Shih Tzu?"
            value={a.dailyTime}
            onPick={(v) => advance({ dailyTime: v })}
            options={[
              { value: "10-15", label: "10 a 15 minutos" },
              { value: "15-20", label: "15 a 20 minutos" },
              { value: "20-30", label: "20 a 30 minutos" },
              { value: "30+", label: "Mais de 30 minutos" },
            ]}
          />
        );

      case "training":
        return (
          <SingleChoice<PreviousTraining>
            title="Você já tentou adestrar seu Shih Tzu? 🐶"
            value={a.previousTraining}
            onPick={(v) => advance({ previousTraining: v })}
            options={[
              { value: "trainer", label: "Sim, com a ajuda de um adestrador", icon: ic(UserCheck) },
              { value: "self", label: "Sim, tentei ensinar por conta própria", icon: ic(HandHeart) },
              { value: "not-yet", label: "Ainda não, mas quero começar", icon: ic(CalendarClock) },
            ]}
          />
        );

      case "st_bond":
        return (
          <Statement
            statement="Quero ter um laço ainda mais forte com meu Shih Tzu e aproveitar cada momento ao lado dele. ❤️"
            question="Você também quer isso?"
            img="/img/statement-vinculo.webp"
            imgAlt="Shih Tzu feliz brincando com um frisbee azul"
            imgW={447}
            imgH={430}
            value={a.bondScore}
            onAnswer={(v) => advance({ bondScore: v })}
          />
        );

      case "creating":
        return <Creating a={a} onDone={() => advance(undefined, 0)} />;

      case "plan":
        return <PlanReady a={a} onContinue={() => advance()} />;

      case "email":
        return <EmailStep initial={a.email} onDone={(email) => advance({ email })} />;

      case "cards":
        return (
          <Cards
            alreadyRevealed={!!f.state.coupon}
            code={f.state.coupon?.code ?? couponCode(a)}
            onReveal={() =>
              f.setCoupon({ code: couponCode(a), percent: OFFER.coupon.percent, revealedAt: Date.now(), expiresAt: null })
            }
            onContinue={() => advance(undefined, 0)}
          />
        );
    }
  })();

  return (
    <main className={s.app}>
      <Header />
      <div key={step} className={s.stepWrapper}>
        {content}
      </div>
    </main>
  );
}

const COMMAND_OPTIONS: Opt<Command>[] = [
  { value: "name", label: "Atende pelo nome" },
  { value: "come", label: "Vem quando chamo" },
  { value: "no", label: "Para com “Não!”" },
  { value: "food-lure", label: "Segue o petisco" },
  { value: "paw", label: "Dá a patinha" },
  { value: "touch", label: "Encosta o focinho" },
  { value: "look", label: "Olha para mim" },
  { value: "stand", label: "Fica em pé" },
  { value: "place", label: "Vai para a caminha" },
  { value: "down", label: "Deita" },
  { value: "drop-it", label: "Solta o que pegou" },
];

const REASON_OPTIONS: Opt<Reason>[] = [
  { value: "adoption", label: "Adotei ou vou adotar um Shih Tzu", icon: ic(Dog) },
  { value: "baby", label: "Um bebê está chegando na família", icon: ic(Baby) },
  { value: "moving", label: "Me mudei ou vou me mudar de casa", icon: ic(House) },
  { value: "marriage", label: "Vou casar ou alguém novo vai morar comigo", icon: ic(Heart) },
  { value: "work", label: "Meu horário de trabalho mudou ou vai mudar", icon: ic(Briefcase) },
  { value: "travel", label: "Tenho uma viagem planejada", icon: ic(Plane) },
  { value: "guests", label: "Vou receber visitas em casa", icon: ic(Users) },
  { value: "well-behaved", label: "Só quero que meu Shih Tzu seja mais comportado! 🐶", icon: ic(Star) },
];
