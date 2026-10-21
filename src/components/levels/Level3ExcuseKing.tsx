import React, { useState } from 'react';
import { CheckCircle2, MessageSquare, ShieldAlert, Sparkles, Zap } from 'lucide-react';
import { sound } from '../../services/sound';

interface Level3Props {
  onComplete: (score: number, stars: number) => void;
  onFail: (score: number) => void;
}

interface QuestionRound {
  question: string;
  sender: string;
  senderAvatar: string;
  options: {
    text: string;
    score: number;
    excuseGrade: 'ГЕНИАЛЬНО' | 'ЛЕГЕНДАРНО' | 'СЛАБО';
    reaction: string;
    isFail?: boolean;
  }[];
}

const ROUNDS: QuestionRound[] = [
  {
    question: 'Кайрат, ты обещал прийти на шашлыки 3 часа назад! Где ты?!',
    sender: 'Арман (Друг с района)',
    senderAvatar: '🍖',
    options: [
      {
        text: '«Я уже выхожу, лифт застрял на 34 этаже!» (В нашей пятиэтажке)',
        score: 120,
        excuseGrade: 'ЛЕГЕНДАРНО',
        reaction: '«Кайрат, у нас же пятиэтажка без лифта... Но звучит убедительно!»',
      },
      {
        text: '«*Отправляет голосовое с шумом пылесоса*: Брат, у нас тут торнадо!»',
        score: 160,
        excuseGrade: 'ГЕНИАЛЬНО',
        reaction: '«Ого, держись там! Не выходи на улицу!»',
      },
      {
        text: '«Извините, проспал, сейчас оденусь...»',
        score: 20,
        excuseGrade: 'СЛАБО',
        reaction: '«Ты серьезно?! Все злятся!»',
        isFail: true,
      },
    ],
  },
  {
    question: 'Мы стоим под твоими окнами, у тебя в комнате свет горит!',
    sender: 'Берик (Пацаны с падика)',
    senderAvatar: '👀',
    options: [
      {
        text: '«Это не я, это кот случайно включил торшер и смотрит телевизор!»',
        score: 150,
        excuseGrade: 'ГЕНИАЛЬНО',
        reaction: '«А, ну коту привет, не отвлекай его.»',
      },
      {
        text: '«Это северное сияние отражается в стеклопакете!»',
        score: 130,
        excuseGrade: 'ЛЕГЕНДАРНО',
        reaction: '«В июле в Алматы северное сияние? Красиво жить не запретишь!»',
      },
      {
        text: '«Ой, спалили, ладно сейчас спущусь...»',
        score: 30,
        excuseGrade: 'СЛАБО',
        reaction: '«Слишком просто сдался, не по-кайратовски!»',
        isFail: true,
      },
    ],
  },
  {
    question: 'Почему в Телеграме статус «Был в сети 1 минуту назад»?!',
    sender: 'Мама',
    senderAvatar: '👵',
    options: [
      {
        text: '«Мам, это хакеры из Китая взломали мой роутер и заходят!»',
        score: 150,
        excuseGrade: 'ЛЕГЕНДАРНО',
        reaction: '«Ой сынок, отключи интернет, чтобы вирусы не залетели!»',
      },
      {
        text: '«Я телефон случайно попой нажал пока спал во сне!»',
        score: 170,
        excuseGrade: 'ГЕНИАЛЬНО',
        reaction: '«Ну спи тогда, не замерзни там.»',
      },
      {
        text: '«Да я просто ленту листал...»',
        score: 20,
        excuseGrade: 'СЛАБО',
        reaction: '«А уроки/уборку кто делать будет?!»',
        isFail: true,
      },
    ],
  },
  {
    question: 'Брат, мы вызвали и оплатили тебе комфорт-такси, машина у подъезда!',
    sender: 'Султан (Братишка)',
    senderAvatar: '🚕',
    options: [
      {
        text: '«У меня оба шнурка завязались в морской узел викингов, МЧС вызываю!»',
        score: 180,
        excuseGrade: 'ГЕНИАЛЬНО',
        reaction: '«Держись братан, мы высылаем ножницы!»',
      },
      {
        text: '«Водитель подозрительно похож на тайного агента, я не рискую!»',
        score: 140,
        excuseGrade: 'ЛЕГЕНДАРНО',
        reaction: '«Безопасность прежде всего, отменяем заказ!»',
      },
      {
        text: '«Спасибо, уже спускаюсь в такси»',
        score: 30,
        excuseGrade: 'СЛАБО',
        reaction: '«Настоящий Кайрат так быстро не выходит!»',
        isFail: true,
      },
    ],
  },
];

export const Level3ExcuseKing: React.FC<Level3Props> = ({ onComplete, onFail }) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [respectMeter, setRespectMeter] = useState(70); // 0 to 100
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [showReaction, setShowReaction] = useState(false);
  const [isSimulatingStatic, setIsSimulatingStatic] = useState(false);
  const [staticClicks, setStaticClicks] = useState(0);

  const round = ROUNDS[currentRoundIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedOptionIdx !== null) return;
    const opt = round.options[idx];
    setSelectedOptionIdx(idx);

    sound.playClick();
    if (opt.isFail) {
      sound.playHit();
      setRespectMeter((prev) => Math.max(0, prev - 30));
    } else {
      sound.playCoin();
      sound.playPowerup();
      setTotalScore((prev) => prev + opt.score);
      setRespectMeter((prev) => Math.min(100, prev + 15));
    }

    setShowReaction(true);

    // Speak comedic excuse
    sound.speakQuote(opt.text);

    setTimeout(() => {
      setShowReaction(false);
      setSelectedOptionIdx(null);

      if (currentRoundIdx + 1 < ROUNDS.length) {
        setCurrentRoundIdx((prev) => prev + 1);
      } else {
        // Trigger final QTE: Static connection simulation
        setIsSimulatingStatic(true);
      }
    }, 2800);
  };

  const handleTapStatic = () => {
    sound.playHit();
    sound.triggerVibration(40);
    const nextClicks = staticClicks + 1;
    setStaticClicks(nextClicks);

    if (nextClicks >= 8) {
      sound.playVictoryFanfare();
      const finalScore = totalScore + 150;
      const stars = finalScore >= 550 ? 3 : finalScore >= 450 ? 2 : 1;
      onComplete(finalScore, stars);
    }
  };

  return (
    <div className="relative w-full h-[calc(100dvh-54px)] flex flex-col bg-zinc-950 overflow-hidden select-none">
      {/* Top HUD */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 z-20">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold uppercase block">
            Уважение пацанов
          </span>
          <div className="w-28 h-2.5 rounded-full bg-zinc-800 overflow-hidden mt-0.5">
            <div
              className={`h-full transition-all duration-300 ${
                respectMeter > 50 ? 'bg-emerald-500' : 'bg-red-500'
              }`}
              style={{ width: `${respectMeter}%` }}
            />
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-zinc-400 font-bold uppercase block">
            Очки отмазок
          </span>
          <span className="text-sm font-game text-amber-400 font-mono">
            {totalScore}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto">
        {!isSimulatingStatic ? (
          <>
            {/* Incoming Message Card */}
            <div className="p-4 rounded-3xl bg-zinc-900 border-2 border-red-500/40 shadow-xl glow-red-sm animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl p-2 rounded-2xl bg-zinc-800 border border-zinc-700">
                  {round.senderAvatar}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white font-game">
                    {round.sender}
                  </h4>
                  <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Требует немедленного ответа!
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 mt-2">
                <p className="text-sm font-medium text-zinc-100 leading-snug">
                  {round.question}
                </p>
              </div>

              {showReaction && selectedOptionIdx !== null && (
                <div className="mt-3 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-semibold animate-bounce">
                  {round.options[selectedOptionIdx].reaction}
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5 my-3">
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block text-center">
                Выбери коронную отмазку Кайрата:
              </span>

              {round.options.map((opt, idx) => {
                const isSelected = selectedOptionIdx === idx;
                return (
                  <button
                    key={idx}
                    disabled={selectedOptionIdx !== null}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3.5 rounded-2xl text-left border transition-all text-xs font-medium relative active:scale-98 ${
                      isSelected
                        ? opt.isFail
                          ? 'bg-red-950 border-red-500 text-white'
                          : 'bg-emerald-950 border-emerald-400 text-white glow-amber'
                        : 'bg-zinc-900/90 hover:bg-zinc-800/90 border-zinc-700/80 text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-game px-2 py-0.5 rounded-full bg-zinc-800 text-amber-400 font-bold">
                        {opt.excuseGrade}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400">
                        +{opt.score} очков
                      </span>
                    </div>
                    <p className="font-semibold text-xs leading-snug">{opt.text}</p>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          /* QTE Static simulation mini-game */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-4xl animate-pulse glow-red mb-4">
              📻
            </div>
            <h3 className="text-lg font-game text-white tracking-wide">
              СИМУЛЯЦИЯ ПОМЕХ!
            </h3>
            <p className="text-xs text-zinc-400 mt-1 mb-6">
              Быстро тапай по кнопке «КХХ-ПШШШ», чтобы сделать вид, что связь оборвалась!
            </p>

            <div className="w-full max-w-xs h-3 rounded-full bg-zinc-800 overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-150"
                style={{ width: `${(staticClicks / 8) * 100}%` }}
              />
            </div>

            <button
              onClick={handleTapStatic}
              className="w-32 h-32 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white font-game text-base border-4 border-red-300 shadow-2xl glow-red active:scale-90 transition-transform flex flex-col items-center justify-center"
            >
              <Zap className="w-8 h-8 mb-1" />
              <span>КХХ-ПШШ!</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
