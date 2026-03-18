import { motion } from 'motion/react';

interface HomeViewProps {
  energy: string;
  mood: string;
  tendency: string;
  onEnergyChange: (value: string) => void;
  onMoodChange: (value: string) => void;
  onTendencyChange: (value: string) => void;
}

const energyOptions = ['活力满满', '平稳安宁', '略显疲惫', '极度紧绷'];
const moodOptions = ['喜悦开心', '平静温和', '忧郁低沉', '焦虑不安', '充满好奇'];
const tendencyOptions = ['渴望社交', '想要独处', '专注创造', '彻底放松'];

const HomeView = ({
  energy,
  mood,
  tendency,
  onEnergyChange,
  onMoodChange,
  onTendencyChange,
}: HomeViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 py-6 space-y-8 max-w-lg mx-auto w-full"
    >
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">bolt</span>
          <h2 className="text-lg font-bold">能量状态</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {energyOptions.map(opt => (
            <button
              key={opt}
              onClick={() => onEnergyChange(opt)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                energy === opt
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary/90 border-primary/20'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">psychology</span>
          <h2 className="text-lg font-bold">情绪基调</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {moodOptions.map(opt => (
            <button
              key={opt}
              onClick={() => onMoodChange(opt)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                mood === opt
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary/90 border-primary/20'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">potted_plant</span>
          <h2 className="text-lg font-bold">身心倾向</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {tendencyOptions.map(opt => (
            <button
              key={opt}
              onClick={() => onTendencyChange(opt)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                tendency === opt
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary/90 border-primary/20'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-col items-center justify-center pt-8 opacity-90">
        <div className="relative w-48 h-32 bg-secondary/5 dark:bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
          <img
            className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-overlay grayscale contrast-75 brightness-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp-JaeZmXvkpb0dbwtUxUhLmU6vFSj4LyWop61KWkPuX_Et42NfpapIQ13HwylrFxYDnnYNKAK_BOGRYHqM7vSYupzpL-3kwmgI32kQtVPuLJ4e2zcSp3gHn3fQpXFxShHK1-MPvDg5brbdwKGnYMACLZNBXn5Jy3cRlVqalPEtFfP1HFo1jFerKLWT1-JkCVAZpszkxw40aq94HerVUqWgKfTjN4T12kWy6c3Yh7Lpj12qeMgPiCu-aurQWvDzS_f6rOyww7wtbEM"
            alt="Sleeping cat"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary/30 text-6xl">forest</span>
          </div>
        </div>
        <p className="mt-4 text-sm italic text-slate-500 dark:text-slate-400">"此时此刻，正是休息的好时候。"</p>
      </div>
    </motion.div>
  );
};

export default HomeView;
