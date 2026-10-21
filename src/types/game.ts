export type GameScreen = 
  | 'menu' 
  | 'playing' 
  | 'level_select' 
  | 'skins' 
  | 'memes' 
  | 'achievements' 
  | 'settings';

export interface LevelInfo {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  targetScore: number;
  unlocked: boolean;
  stars: number; // 0 to 3
  bestScore: number;
  bgGradient: string;
}

export interface Skin {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  emoji: string;
  badge: string;
  perk: string;
  colors: {
    hoodie: string;
    cap: string;
    glow: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rewardCoins: number;
}

export interface MemeQuote {
  id: string;
  text: string;
  context: string;
  audioKey: 'ringtone' | 'later' | 'leaving' | 'excuse' | 'offline' | 'boss_voice' | 'disconnect';
  likes: number;
}

export interface GameSaveData {
  coins: number;
  selectedSkin: string;
  unlockedSkins: string[];
  levels: {
    [levelId: number]: {
      unlocked: boolean;
      stars: number;
      bestScore: number;
    };
  };
  achievements: {
    [achId: string]: {
      unlocked: boolean;
      progress: number;
    };
  };
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    vibrationEnabled: boolean;
    sfxVolume: number;
    musicVolume: number;
  };
}
