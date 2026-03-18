import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import HomeView from './components/HomeView';
import ReportView from './components/ReportView';
import JournalView from './components/JournalView';
import ProfileView from './components/ProfileView';
import {
  generateCard,
  saveCardLocally,
  getTodayCard,
  type CardData,
  type PersonalityCard,
  type StoredCard,
} from './api';

type Tab = 'home' | 'report' | 'journal' | 'profile';

const energyMap: Record<string, CardData['energy']> = {
  '活力满满': 'high',
  '平稳安宁': 'medium',
  '略显疲惫': 'low',
  '极度紧绷': 'medium',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const [energy, setEnergy] = useState('活力满满');
  const [mood, setMood] = useState('平静温和');
  const [tendency, setTendency] = useState('彻底放松');

  const [loading, setLoading] = useState(false);
  const [todayCard, setTodayCard] = useState<StoredCard | null>(null);

  useEffect(() => {
    const card = getTodayCard();
    if (card) setTodayCard(card);
  }, []);

  const handleGenerate = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const cardData: CardData = {
        energy: energyMap[energy] || 'medium',
        emotion: mood,
        inclination: tendency,
      };
      const result: PersonalityCard = await generateCard(cardData);
      const stored = saveCardLocally(result, energy, mood, tendency);
      setTodayCard(stored);
      setActiveTab('report');
    } catch (error) {
      console.error('生成卡片失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

    switch (activeTab) {
      case 'home':
        return (
          <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-primary/10">
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-primary">close</span>
            </button>
            <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">今日状态 · {dateStr}</h1>
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
            </button>
          </header>
        );
      case 'report':
        return (
          <header className="bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center justify-between p-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm cursor-pointer">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">chevron_left</span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">报告</h1>
              <div className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm cursor-pointer">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">share</span>
              </div>
            </div>
          </header>
        );
      case 'journal':
        return (
          <header className="flex items-center bg-transparent p-4 pb-2 justify-between">
            <div className="text-moss dark:text-sage flex size-12 shrink-0 items-center justify-start">
              <span className="material-symbols-outlined cursor-pointer">close</span>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">
                {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>
              <span className="text-[10px] uppercase tracking-[0.2em] text-moss/60 dark:text-sage/60 font-semibold">
                {today.toLocaleDateString('en-US', { weekday: 'long' })} {today.getHours() < 12 ? 'Morning' : today.getHours() < 18 ? 'Afternoon' : 'Evening'}
              </span>
            </div>
            <div className="flex w-12 items-center justify-end" />
          </header>
        );
      case 'profile':
        return (
          <header className="flex items-center p-4 pb-2 justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10 border-b border-primary/5">
            <div className="text-primary flex size-12 shrink-0 items-center cursor-pointer">
              <span className="material-symbols-outlined">arrow_back</span>
            </div>
            <h2 className="text-slate-800 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">My Page</h2>
            <div className="flex w-12 items-center justify-end">
              <button className="flex size-10 items-center justify-center rounded-full bg-primary/5 dark:bg-primary/20 text-primary">
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
          </header>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl relative overflow-hidden">
      {renderHeader()}

      <main className="flex-1 flex flex-col overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <HomeView
              key="home"
              energy={energy}
              mood={mood}
              tendency={tendency}
              onEnergyChange={setEnergy}
              onMoodChange={setMood}
              onTendencyChange={setTendency}
            />
          )}
          {activeTab === 'report' && <ReportView key="report" todayCard={todayCard} />}
          {activeTab === 'journal' && <JournalView key="journal" />}
          {activeTab === 'profile' && <ProfileView key="profile" />}
        </AnimatePresence>
      </main>

      {activeTab === 'home' && (
        <div className="px-4 pt-4 pb-2 bg-background-light dark:bg-background-dark">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full h-14 bg-primary text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                正在生成...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">auto_awesome</span>
                生成心情卡片
              </>
            )}
          </button>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="px-4 pb-24 bg-background-light dark:bg-background-dark">
          <button className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 text-sm">
            <span className="material-symbols-outlined">download</span>
            保存为图片分享
          </button>
        </div>
      )}

      <nav className="sticky bottom-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-primary/10 flex gap-1 px-4 pb-6 pt-2">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-1 flex-col items-center justify-end gap-1 transition-colors ${activeTab === 'home' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <div className="flex h-8 items-center justify-center">
            <span className={`material-symbols-outlined ${activeTab === 'home' ? 'fill-1' : ''}`}>home</span>
          </div>
          <p className="text-[10px] font-bold leading-normal tracking-wide">首页</p>
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`flex flex-1 flex-col items-center justify-end gap-1 transition-colors ${activeTab === 'report' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <div className="flex h-8 items-center justify-center">
            <span className={`material-symbols-outlined ${activeTab === 'report' ? 'fill-1' : ''}`}>analytics</span>
          </div>
          <p className="text-[10px] font-bold leading-normal tracking-wide">报告</p>
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex flex-1 flex-col items-center justify-end gap-1 transition-colors ${activeTab === 'journal' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <div className="flex h-8 items-center justify-center">
            <span className={`material-symbols-outlined ${activeTab === 'journal' ? 'fill-1' : ''}`}>auto_stories</span>
          </div>
          <p className="text-[10px] font-bold leading-normal tracking-wide">日记</p>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-1 flex-col items-center justify-end gap-1 transition-colors ${activeTab === 'profile' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <div className="flex h-8 items-center justify-center">
            <span className={`material-symbols-outlined ${activeTab === 'profile' ? 'fill-1' : ''}`}>person</span>
          </div>
          <p className="text-[10px] font-bold leading-normal tracking-wide">我的</p>
        </button>
      </nav>
    </div>
  );
}
