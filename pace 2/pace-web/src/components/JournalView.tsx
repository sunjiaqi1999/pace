import { useState } from 'react';
import { motion } from 'motion/react';
import { getAdvice } from '../api';

const JournalView = () => {
  const [mood, setMood] = useState('Sprouting');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const moods = [
    { id: 'Rooted', icon: 'psychology_alt' },
    { id: 'Sprouting', icon: 'eco' },
    { id: 'Blooming', icon: 'local_florist' },
    { id: 'Wilting', icon: 'energy_savings_leaf' },
    { id: 'Seed', icon: 'grain' },
  ];

  const moodToEnergy: Record<string, 'high' | 'medium' | 'low'> = {
    Blooming: 'high',
    Sprouting: 'medium',
    Rooted: 'medium',
    Seed: 'low',
    Wilting: 'low',
  };

  const handleSave = async () => {
    if (saving || !content.trim()) return;
    setSaving(true);
    try {
      const result = await getAdvice({
        energy: moodToEnergy[mood] || 'medium',
        emotion: mood,
        inclination: content.trim(),
        context: content.trim(),
      });
      setAdvice(result);
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex-1 flex flex-col px-6 pt-2 pb-10"
    >
      <div className="px-0 py-6">
        <h4 className="text-moss dark:text-sage text-sm font-semibold leading-normal tracking-wide text-center mb-6">How is your spirit today?</h4>
        <div className="flex justify-between items-start gap-2">
          {moods.map(m => (
            <div key={m.id} className="flex flex-col items-center gap-3 group" onClick={() => setMood(m.id)}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                mood === m.id ? 'bg-primary/20 border-primary' : 'bg-moss/10 dark:bg-sage/10 border-transparent'
              }`}>
                <span className={`material-symbols-outlined text-3xl ${mood === m.id ? 'text-primary' : 'text-moss dark:text-sage'}`}>{m.icon}</span>
              </div>
              <p className={`text-xs font-medium ${mood === m.id ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-400'}`}>{m.id}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 relative w-full min-h-[400px] bg-white dark:bg-background-dark/50 rounded-xl p-6 shadow-sm border border-primary/5">
        <h3 className="text-moss dark:text-sage tracking-tight text-2xl font-bold leading-tight mb-4">Dear Forest,</h3>
        <textarea
          className="w-full h-[calc(100%-4rem)] bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-300 text-lg leading-relaxed resize-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
          placeholder="Let your thoughts flow like a quiet stream..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="absolute bottom-6 right-6 opacity-20 pointer-events-none">
          <span className="material-symbols-outlined text-6xl text-moss">park</span>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleSave}
          disabled={saving || !content.trim()}
          className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
              正在保存...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">save</span>
              Save
            </>
          )}
        </button>
      </div>

      {advice && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-secondary/5 dark:bg-secondary/10 p-4 rounded-2xl border-l-4 border-secondary/30"
        >
          <div className="flex items-center gap-2 text-secondary mb-2">
            <span className="material-symbols-outlined text-lg">nature</span>
            <h3 className="font-bold text-sm">Forest Wisdom</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{advice}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default JournalView;
