import React, { useEffect, useState } from 'react';
import {
  GameSaveData,
  GameScreen,
} from './types/game';
import {
  INITIAL_LEVELS,
  loadGameData,
  saveGameData,
} from './services/storage';
import { sound } from './services/sound';

import { MainMenu } from './components/MainMenu';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { LevelSelectModal } from './components/LevelSelectModal';
import { SkinsModal } from './components/SkinsModal';
import { MemesSoundboardModal } from './components/MemesSoundboardModal';
import { AchievementsModal } from './components/AchievementsModal';
import { SettingsModal } from './components/SettingsModal';
import { InstallModal } from './components/InstallModal';
import { IconPreviewModal } from './components/IconPreviewModal';
import { VictoryModal } from './components/VictoryModal';

import { Level1FindKairat } from './components/levels/Level1FindKairat';
import { Level2DodgeCalls } from './components/levels/Level2DodgeCalls';
import { Level3ExcuseKing } from './components/levels/Level3ExcuseKing';
import { Level4SecretMission } from './components/levels/Level4SecretMission';
import { Level5GasAttack } from './components/levels/Level5GasAttack';
import { Level6BossKairat } from './components/levels/Level6BossKairat';

export default function App() {
  const [saveData, setSaveData] = useState<GameSaveData>(() => loadGameData());
  const [screen, setScreen] = useState<GameScreen>('splash');
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [activeModal, setActiveModal] = useState<
    | null
    | 'level_select'
    | 'skins'
    | 'memes'
    | 'achievements'
    | 'settings'
    | 'install'
    | 'icon_preview'
  >(null);

  // Victory / Result state
  const [victoryState, setVictoryState] = useState<{
    isOpen: boolean;
    isBoss: boolean;
    score: number;
    stars: number;
    rewardCoins: number;
  }>({
    isOpen: false,
    isBoss: false,
    score: 0,
    stars: 0,
    rewardCoins: 0,
  });

  // Save changes to localStorage
  const updateSave = (updater: (prev: GameSaveData) => GameSaveData) => {
    setSaveData((prev) => {
      const next = updater(prev);
      saveGameData(next);
      return next;
    });
  };

  // Sync sound engine settings on boot
  useEffect(() => {
    sound.setSettings(
      saveData.settings.soundEnabled,
      saveData.settings.musicEnabled,
      saveData.settings.sfxVolume,
      saveData.settings.musicVolume
    );
  }, []);

  const handleStartGame = () => {
    // Find highest unlocked level
    let startLvl = 1;
    for (let i = 6; i >= 1; i--) {
      if (saveData.levels[i]?.unlocked) {
        startLvl = i;
        break;
      }
    }
    setCurrentLevelId(startLvl);
    setScreen('playing');
    if (saveData.settings.musicEnabled) {
      sound.startMusic();
    }
  };

  const handleSelectLevel = (levelId: number) => {
    setCurrentLevelId(levelId);
    setActiveModal(null);
    setScreen('playing');
    if (saveData.settings.musicEnabled) {
      sound.startMusic();
    }
  };

  const handleLevelComplete = (score: number, stars: number) => {
    const isBoss = currentLevelId === 6;
    const baseReward = currentLevelId * 100 + stars * 50;

    // Update level progress & unlock next level
    updateSave((prev) => {
      const nextLvlId = Math.min(6, currentLevelId + 1);
      const existing = prev.levels[currentLevelId] || {
        unlocked: true,
        stars: 0,
        bestScore: 0,
      };

      const updatedLevels = {
        ...prev.levels,
        [currentLevelId]: {
          unlocked: true,
          stars: Math.max(existing.stars, stars),
          bestScore: Math.max(existing.bestScore, score),
        },
        [nextLvlId]: {
          ...(prev.levels[nextLvlId] || { stars: 0, bestScore: 0 }),
          unlocked: true,
        },
      };

      // Progress achievements
      const updatedAch = { ...prev.achievements };
      if (currentLevelId === 3 && stars === 3) {
        updatedAch.excuse_king = { unlocked: true, progress: 1 };
      }
      if (currentLevelId === 4) {
        updatedAch.last_online = { unlocked: true, progress: 1 };
      }
      if (isBoss) {
        updatedAch.boss_slayer = { unlocked: true, progress: 1 };
      }

      return {
        ...prev,
        coins: prev.coins + baseReward,
        levels: updatedLevels,
        achievements: updatedAch,
      };
    });

    setVictoryState({
      isOpen: true,
      isBoss,
      score,
      stars,
      rewardCoins: baseReward,
    });
  };

  const handleLevelFail = (score: number) => {
    sound.playGameOver();
    alert(`Ой! Кайрат ускользнул или связь пропала!\nТы набрал: ${score} очков.\nПопробуй ещё раз!`);
  };

  const handleNextLevel = () => {
    setVictoryState((v) => ({ ...v, isOpen: false }));
    if (currentLevelId < 6) {
      setCurrentLevelId((prev) => prev + 1);
      setScreen('playing');
    } else {
      setScreen('menu');
    }
  };

  const handleRestartLevel = () => {
    setVictoryState((v) => ({ ...v, isOpen: false }));
    // Force rerender level
    setScreen('menu');
    setTimeout(() => {
      setScreen('playing');
    }, 50);
  };

  const handleClaimAchievementReward = (achId: string, reward: number) => {
    updateSave((prev) => ({
      ...prev,
      coins: prev.coins + reward,
      achievements: {
        ...prev.achievements,
        [achId]: {
          ...(prev.achievements[achId] || { progress: 1 }),
          unlocked: true,
        },
      },
    }));
  };

  const handleResetProgress = () => {
    localStorage.removeItem('kairat_legend_save_v1');
    const fresh = loadGameData();
    setSaveData(fresh);
    sound.playClick();
  };

  const handleToggleSound = () => {
    const nextVal = !saveData.settings.soundEnabled;
    updateSave((prev) => ({
      ...prev,
      settings: { ...prev.settings, soundEnabled: nextVal },
    }));
    sound.setSettings(
      nextVal,
      saveData.settings.musicEnabled,
      saveData.settings.sfxVolume,
      saveData.settings.musicVolume
    );
  };

  const currentLevelInfo =
    INITIAL_LEVELS.find((l) => l.id === currentLevelId) || INITIAL_LEVELS[0];

  return (
    <div className="min-h-[100dvh] w-full bg-black flex items-center justify-center">
      {/* Mobile Device Frame for responsive smartphone view */}
      <div className="mobile-device-frame relative flex flex-col overflow-hidden">
        {screen === 'splash' ? (
          <SplashScreen onEnter={() => setScreen('menu')} />
        ) : screen === 'menu' ? (
          <MainMenu
            saveData={saveData}
            onStartGame={handleStartGame}
            onOpenLevelSelect={() => setActiveModal('level_select')}
            onOpenMemes={() => setActiveModal('memes')}
            onOpenSkins={() => setActiveModal('skins')}
            onOpenAchievements={() => setActiveModal('achievements')}
            onOpenSettings={() => setActiveModal('settings')}
            onOpenInstall={() => setActiveModal('install')}
            onOpenIconPreview={() => setActiveModal('icon_preview')}
            onToggleSound={handleToggleSound}
          />
        ) : (
          <div className="relative w-full h-[100dvh] flex flex-col bg-zinc-950">
            <Navbar
              title={currentLevelInfo.title}
              coins={saveData.coins}
              onBack={() => {
                sound.stopMusic();
                setScreen('menu');
              }}
              onRestart={handleRestartLevel}
              soundEnabled={saveData.settings.soundEnabled}
              onToggleSound={handleToggleSound}
            />

            {/* Level render based on currentLevelId */}
            {currentLevelId === 1 && (
              <Level1FindKairat
                onComplete={handleLevelComplete}
                onFail={handleLevelFail}
              />
            )}
            {currentLevelId === 2 && (
              <Level2DodgeCalls
                onComplete={handleLevelComplete}
                onFail={handleLevelFail}
              />
            )}
            {currentLevelId === 3 && (
              <Level3ExcuseKing
                onComplete={handleLevelComplete}
                onFail={handleLevelFail}
              />
            )}
            {currentLevelId === 4 && (
              <Level4SecretMission
                onComplete={handleLevelComplete}
                onFail={handleLevelFail}
              />
            )}
            {currentLevelId === 5 && (
              <Level5GasAttack
                onComplete={handleLevelComplete}
                onFail={handleLevelFail}
              />
            )}
            {currentLevelId === 6 && (
              <Level6BossKairat
                onComplete={handleLevelComplete}
                onFail={handleLevelFail}
              />
            )}
          </div>
        )}

        {/* Modals */}
        <LevelSelectModal
          isOpen={activeModal === 'level_select'}
          onClose={() => setActiveModal(null)}
          saveData={saveData}
          onSelectLevel={handleSelectLevel}
        />

        <SkinsModal
          isOpen={activeModal === 'skins'}
          onClose={() => setActiveModal(null)}
          saveData={saveData}
          onUpdateSave={updateSave}
        />

        <MemesSoundboardModal
          isOpen={activeModal === 'memes'}
          onClose={() => setActiveModal(null)}
        />

        <AchievementsModal
          isOpen={activeModal === 'achievements'}
          onClose={() => setActiveModal(null)}
          saveData={saveData}
          onClaimReward={handleClaimAchievementReward}
        />

        <SettingsModal
          isOpen={activeModal === 'settings'}
          onClose={() => setActiveModal(null)}
          saveData={saveData}
          onUpdateSave={updateSave}
          onResetProgress={handleResetProgress}
        />

        <InstallModal
          isOpen={activeModal === 'install'}
          onClose={() => setActiveModal(null)}
        />

        <IconPreviewModal
          isOpen={activeModal === 'icon_preview'}
          onClose={() => setActiveModal(null)}
        />

        <VictoryModal
          isOpen={victoryState.isOpen}
          isBossLevel={victoryState.isBoss}
          score={victoryState.score}
          stars={victoryState.stars}
          rewardCoins={victoryState.rewardCoins}
          onNextLevel={currentLevelId < 6 ? handleNextLevel : undefined}
          onRestart={handleRestartLevel}
          onCloseToMenu={() => {
            setVictoryState((v) => ({ ...v, isOpen: false }));
            setScreen('menu');
          }}
        />
      </div>
    </div>
  );
}
