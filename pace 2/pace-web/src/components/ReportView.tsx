import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getMonthlyCards, type StoredCard } from '../api';

interface ReportViewProps {
  todayCard: StoredCard | null;
}

const ReportView = ({ todayCard }: ReportViewProps) => {
  const [reportTab, setReportTab] = useState<'today' | 'history'>('today');
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [monthlyCards, setMonthlyCards] = useState<StoredCard[]>([]);

  useEffect(() => {
    const cards = getMonthlyCards(currentYear, currentMonth);
    setMonthlyCards(cards);
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(y => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(y => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const cardDays = monthlyCards.map(c => new Date(c.date).getDate());
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const topCard = monthlyCards.length > 0
    ? monthlyCards.reduce<Record<string, number>>((acc, c) => {
        acc[c.name] = (acc[c.name] || 0) + 1;
        return acc;
      }, {})
    : {};
  const topLabel = Object.entries(topCard).sort((a, b) => b[1] - a[1])[0]?.[0] || '暂无数据';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col"
    >
      <div className="px-6 pb-4">
        <div className="bg-forest-soft/50 dark:bg-slate-800 p-1 rounded-xl flex">
          <button
            onClick={() => setReportTab('today')}
            className={`flex-1 py-2 text-center text-sm font-bold rounded-lg transition-all duration-200 ${
              reportTab === 'today' ? 'bg-moss text-white' : 'text-primary'
            }`}
          >
            今日报告
          </button>
          <button
            onClick={() => setReportTab('history')}
            className={`flex-1 py-2 text-center text-sm font-bold rounded-lg transition-all duration-200 ${
              reportTab === 'history' ? 'bg-moss text-white' : 'text-primary'
            }`}
          >
            历史报告
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {reportTab === 'today' ? (
          todayCard ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm mb-6">
              <div className="relative w-full aspect-square bg-primary/10 flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-4">
                  <span className="material-symbols-outlined text-primary text-8xl">forest</span>
                  <span className="text-primary/60 text-sm font-medium">{todayCard.energy} · {todayCard.emotion}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                  <span className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-1 rounded-full text-[10px] text-primary font-bold">
                    {new Date(todayCard.date).toLocaleDateString('zh-CN').replace(/\//g, '.')} · 步调 Pace
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-secondary text-[10px] font-bold tracking-widest uppercase mb-2">今日人格标签</h2>
                  <div className="inline-block px-6 py-2 bg-primary/10 rounded-full">
                    <span className="text-2xl font-bold text-primary">{todayCard.name}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed text-center">{todayCard.summary}</p>
                </div>
                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined text-lg">forest</span>
                    <h3 className="font-bold text-sm">状态解读</h3>
                  </div>
                  <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-2xl border-l-4 border-primary/30">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                      {todayCard.description}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-secondary">
                    <span className="material-symbols-outlined text-lg">nature</span>
                    <h3 className="font-bold text-sm">成长建议</h3>
                  </div>
                  <div className="bg-secondary/5 dark:bg-secondary/10 p-4 rounded-2xl border-l-4 border-secondary/30">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                      {todayCard.advice}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-primary/30 text-6xl mb-4">forest</span>
              <p className="text-slate-500 dark:text-slate-400 text-sm">今天还没有生成卡片</p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">去首页选择状态并生成吧</p>
            </div>
          )
        ) : (
          <div className="space-y-8">
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 px-2">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-forest-soft dark:hover:bg-primary/20 rounded-full transition-colors">
                  <span className="material-symbols-outlined text-primary">arrow_back_ios</span>
                </button>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{currentYear}年{currentMonth + 1}月</h2>
                <button onClick={handleNextMonth} className="p-2 hover:bg-forest-soft dark:hover:bg-primary/20 rounded-full transition-colors">
                  <span className="material-symbols-outlined text-primary">arrow_forward_ios</span>
                </button>
              </div>
              <div className="grid grid-cols-7 gap-y-2 mb-4 text-center">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                  <div key={day} className="text-[10px] font-bold uppercase tracking-widest text-primary/60 py-2">{day}</div>
                ))}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const hasCard = cardDays.includes(day);
                  const isToday = day === new Date().getDate()
                    && currentMonth === new Date().getMonth()
                    && currentYear === new Date().getFullYear();
                  return (
                    <button key={day} className={`h-10 flex flex-col items-center justify-center relative ${isToday ? 'text-primary font-bold' : ''}`}>
                      {isToday && <div className="absolute inset-1 border-2 border-primary/30 rounded-lg"></div>}
                      <span className="text-sm font-medium">{day}</span>
                      {hasCard && (
                        <div className={`size-1 rounded-full mt-0.5 ${isToday ? 'bg-primary' : 'bg-primary/40'}`}></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-secondary uppercase tracking-widest">月度总结报告</h3>
                <span className="text-[10px] text-primary/60 font-medium">基于 {monthlyCards.length} 天记录</span>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-primary/5 space-y-6">
                <div className="flex items-center gap-5">
                  <div className="size-16 rounded-2xl overflow-hidden bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                    <span className="material-symbols-outlined text-primary text-3xl">forest</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">主要状态标签</p>
                    <span className="text-2xl font-bold text-primary">{topLabel}</span>
                  </div>
                </div>
                {monthlyCards.length > 0 ? (
                  <div className="bg-forest-soft/30 dark:bg-primary/5 rounded-2xl p-4 space-y-5">
                    <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">月度概览</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-[10px] font-bold text-slate-500">记录天数</span>
                        <span className="text-[10px] text-primary font-medium">{monthlyCards.length} 天</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${Math.min((monthlyCards.length / daysInMonth) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm text-center py-4">本月暂无记录</p>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReportView;
