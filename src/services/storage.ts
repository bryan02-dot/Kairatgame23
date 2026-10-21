import { Achievement, GameSaveData, LevelInfo, MemeQuote, Skin } from '../types/game';

const STORAGE_KEY = 'kairat_legend_save_v1';

export const INITIAL_LEVELS: LevelInfo[] = [
  {
    id: 1,
    title: 'Уровень 1: Найди Кайрата',
    subtitle: 'Район не спит, а Кайрат прячется',
    description: 'Кайрат замечен на районе! Он прячется в шаурмичной, за гаражами и в падике. Найди его, пока он не свалил!',
    icon: '🕵️‍♂️',
    targetScore: 500,
    unlocked: true,
    stars: 0,
    bestScore: 0,
    bgGradient: 'from-zinc-900 via-neutral-900 to-red-950',
  },
  {
    id: 2,
    title: 'Уровень 2: Ответит через 4 часа',
    subtitle: 'Шквал звонков и смс',
    description: 'На тебя летит спам: "Ты где?!", 100 звонков и голосовые. Уворачивайся от уведомлений, собирай авиарежим!',
    icon: '📵',
    targetScore: 400,
    unlocked: false,
    stars: 0,
    bestScore: 0,
    bgGradient: 'from-zinc-950 via-slate-950 to-red-950',
  },
  {
    id: 3,
    title: 'Уровень 3: Король отмазок',
    subtitle: 'Битва легендарных оправданий',
    description: 'Кайрат объясняет, почему не пришёл. Выбирай самые гениальные отмазки и симулируй плохую связь!',
    icon: '👑',
    targetScore: 450,
    unlocked: false,
    stars: 0,
    bestScore: 0,
    bgGradient: 'from-neutral-950 via-stone-900 to-amber-950',
  },
  {
    id: 4,
    title: 'Уровень 4: Секретная миссия',
    subtitle: 'Ночная спецоперация на районе',
    description: 'Кайрат крадётся в ларёк. Не попадись под фонари бдительных соседей и избегай назойливых знакомых!',
    icon: '🕶️',
    targetScore: 500,
    unlocked: false,
    stars: 0,
    bestScore: 0,
    bgGradient: 'from-zinc-950 via-gray-900 to-blue-950',
  },
  {
    id: 5,
    title: 'Уровень 5: Газовая атака',
    subtitle: 'Опасный шашлык и доширак с перцем',
    description: 'Комичные ядовито-зелёные облака атакуют район! Прыгай, уворачивайся и собирай освежители воздуха!',
    icon: '💨',
    targetScore: 550,
    unlocked: false,
    stars: 0,
    bestScore: 0,
    bgGradient: 'from-zinc-950 via-emerald-950 to-neutral-950',
  },
  {
    id: 6,
    title: 'ФИНАЛ: Босс Кайрат',
    subtitle: 'Эпическая битва с Главным Боссом Района',
    description: 'Гигантский Кайрат вошёл в боевой режим игнора! Уклоняйся от "Я УЖЕ ВЫХОЖУ" и сломай щит отмазок!',
    icon: '⚡',
    targetScore: 1000,
    unlocked: false,
    stars: 0,
    bestScore: 0,
    bgGradient: 'from-red-950 via-zinc-950 to-black',
  },
];

export const SKINS: Skin[] = [
  {
    id: 'default',
    name: 'Кайрат с Района',
    description: 'Классическая черная кепка, стильный худи и телефон на беззвучном.',
    cost: 0,
    unlocked: true,
    emoji: '🧢',
    badge: 'Базовый',
    perk: '+10% к скорости игнорирования',
    colors: {
      hoodie: '#18181b',
      cap: '#09090b',
      glow: '#ef4444',
    },
  },
  {
    id: 'stealth',
    name: 'Режим Невидимки',
    description: 'Камуфляж и очки ночного видения. Даже мама не найдет.',
    cost: 300,
    unlocked: false,
    emoji: '🥷',
    badge: 'Скрытный',
    perk: 'Зона видимости Кайрата на 20% меньше',
    colors: {
      hoodie: '#1c1917',
      cap: '#292524',
      glow: '#10b981',
    },
  },
  {
    id: 'airplane',
    name: 'Авиарежим ✈️',
    description: 'Белый парадный костюм пилота. Полная недосягаемость для звонков.',
    cost: 600,
    unlocked: false,
    emoji: '✈️',
    badge: 'Элитный',
    perk: 'Бонус Авиарежима длится в 1.5 раза дольше',
    colors: {
      hoodie: '#0284c7',
      cap: '#0369a1',
      glow: '#38bdf8',
    },
  },
  {
    id: 'businessman',
    name: 'Серьезный Бизнесмен',
    description: 'Пиджак поверх спортивки. Всегда "на важной встрече".',
    cost: 1000,
    unlocked: false,
    emoji: '💼',
    badge: 'Босс',
    perk: '+25% Кайрат-коинов за прохождение',
    colors: {
      hoodie: '#312e81',
      cap: '#1e1b4b',
      glow: '#a855f7',
    },
  },
  {
    id: 'cyber',
    name: 'Кибер-Кайрат 2077',
    description: 'Голографический визор с таймером "Отвечу в 2088 году".',
    cost: 1800,
    unlocked: false,
    emoji: '🤖',
    badge: 'Легендарный',
    perk: 'Лазерные щиты от спама',
    colors: {
      hoodie: '#e11d48',
      cap: '#881337',
      glow: '#f43f5e',
    },
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'master_ignore',
    title: 'Мастер игнора',
    description: 'Увернись от 40 летящих звонков и уведомлений',
    icon: '📵',
    unlocked: false,
    progress: 0,
    maxProgress: 40,
    rewardCoins: 150,
  },
  {
    id: 'excuse_king',
    title: 'Король отмазок',
    description: 'Пройди уровень 3 на 3 звезды без единой ошибки',
    icon: '👑',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardCoins: 200,
  },
  {
    id: 'offline_man',
    title: 'Человек вне сети',
    description: 'Собери 10 бонусов Авиарежима за всю игру',
    icon: '📴',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    rewardCoins: 250,
  },
  {
    id: 'last_online',
    title: 'Был в сети вчера в 03:14',
    description: 'Пройди 4-й уровень ночной миссии',
    icon: '🌙',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardCoins: 300,
  },
  {
    id: 'boss_slayer',
    title: 'Победитель Легенды',
    description: 'Одолей финального Босса Кайрата',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardCoins: 500,
  },
];

export const MEME_QUOTES: MemeQuote[] = [
  {
    id: '1',
    text: '«Брат, я уже выхожу, обуваюсь!»',
    context: 'Сказано, лёжа на диване в трусах и листая тиктоки.',
    audioKey: 'leaving',
    likes: 849,
  },
  {
    id: '2',
    text: '«Да связь пропадает, тут туннель... кх-кх!»',
    context: 'Сидит на лавочке у подъезда, поедая мороженое.',
    audioKey: 'disconnect',
    likes: 1204,
  },
  {
    id: '3',
    text: '«У меня 1% зарядки остался, перезвоню!»',
    context: 'Телефон подключён к пауэрбанку на 20000 mAh.',
    audioKey: 'offline',
    likes: 955,
  },
  {
    id: '4',
    text: '«Потом отвечу, сейчас дела на районе решаю.»',
    context: 'Ищет второй носок уже 40 минут.',
    audioKey: 'later',
    likes: 730,
  },
  {
    id: '5',
    text: '«Да я спал, звук выключен был!»',
    context: 'Смотрел сторис всех друзей 3 минуты назад.',
    audioKey: 'excuse',
    likes: 1540,
  },
  {
    id: '6',
    text: '«Ты меня победил... Но я всё равно не отвечу!»',
    context: 'Коронная фраза финального босса.',
    audioKey: 'boss_voice',
    likes: 2410,
  },
];

export function loadGameData(): GameSaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load save data:', e);
  }

  // Default initial save
  return {
    coins: 100, // Starter coins
    selectedSkin: 'default',
    unlockedSkins: ['default'],
    levels: {
      1: { unlocked: true, stars: 0, bestScore: 0 },
      2: { unlocked: false, stars: 0, bestScore: 0 },
      3: { unlocked: false, stars: 0, bestScore: 0 },
      4: { unlocked: false, stars: 0, bestScore: 0 },
      5: { unlocked: false, stars: 0, bestScore: 0 },
      6: { unlocked: false, stars: 0, bestScore: 0 },
    },
    achievements: {
      master_ignore: { unlocked: false, progress: 0 },
      excuse_king: { unlocked: false, progress: 0 },
      offline_man: { unlocked: false, progress: 0 },
      last_online: { unlocked: false, progress: 0 },
      boss_slayer: { unlocked: false, progress: 0 },
    },
    settings: {
      soundEnabled: true,
      musicEnabled: true,
      vibrationEnabled: true,
      sfxVolume: 0.8,
      musicVolume: 0.35,
    },
  };
}

export function saveGameData(data: GameSaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save game data:', e);
  }
}
