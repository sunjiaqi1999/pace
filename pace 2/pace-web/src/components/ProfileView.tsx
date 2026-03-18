import React from 'react';
import { motion } from 'motion/react';

const ProfileView = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col"
    >
      <div className="flex p-6 flex-col items-center gap-6">
        <div className="relative">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-primary/20" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDtvdiQ9zg1bRBMhF2eZQ9u2EDI1wYhRDlezRbrIG8t1gR7G8HKeMkzZDAtANz96qfaJr3qKqmzhAfAUXp422ES-MjpWCSj6uD9L4lYj9v7uASB8MNP5MFKzMWfXte9Yo8cvC0cZ4wGmz8rGPg4bvawzO_Y1e2ze_u_U3fGOVC6DakYoCkKMhn2U0BcfxQhq1y8nKJ_5eH6w7UCp2mXjttuGareXr86XzYXTKPOqHfjdwopSDAfant1-E9IhGSlLrhzNBPy0yRTRz-v")' }}
          ></div>
          <div className="absolute bottom-1 right-1 bg-primary text-white p-1.5 rounded-full border-2 border-background-light dark:border-background-dark">
            <span className="material-symbols-outlined text-sm block">potted_plant</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-slate-800 dark:text-white text-2xl font-bold leading-tight tracking-tight text-center">Alex Chen</p>
          <p className="text-primary font-bold text-sm tracking-wide uppercase mt-1">Forest Guardian Level 5</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Joined January 2024</p>
        </div>
        <button className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-11 px-6 bg-primary/5 dark:bg-primary/20 text-primary text-sm font-bold border border-primary/20 transition-all active:scale-95">
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="px-4 py-2">
        <div className="flex flex-col overflow-hidden rounded-2xl shadow-sm bg-white dark:bg-background-dark/50 border border-primary/10">
          <div 
            className="w-full bg-center bg-no-repeat aspect-[21/9] bg-cover opacity-90" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCIHqK5r0EdXn29InkoGtaAQM23vsABiZPBYMf5YF4wv-znmld1QLWzisZCW_YhPT8b1kmQpn0jSMYcZtIu7Dv_fDKakWqNkXX_14VaHcS6xcNU_2xd4pS_482Pe51WtLHDwJFwQH-9G5ay-uz0J_8J1KkP2DzQjKpTEr5qIc0C9LLpzFSTHq7pUOLUMRqaQX1VuUWHW_qdy2Mrfw3IYUBWzFezmehD594X-KxiaLAgT_Fx6H8cgCHM1kX5-dBdPlpSwfbOVD1D9I5s")' }}
          ></div>
          <div className="flex w-full flex-col gap-3 p-5">
            <div>
              <p className="text-slate-800 dark:text-white text-lg font-bold">Become a Member</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-1">Unlock exclusive forest sounds and premium meditation paths.</p>
            </div>
            <button className="flex w-full cursor-pointer items-center justify-center rounded-xl h-11 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 pb-10 flex flex-col gap-2">
        <h3 className="text-primary dark:text-primary/70 text-xs font-bold uppercase tracking-widest px-2 pb-2">Preferences</h3>
        <div className="flex items-center justify-between p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">dark_mode</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100">Dark Mode</span>
          </div>
          <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
            <div className="size-4 bg-white rounded-full absolute right-1"></div>
          </div>
        </div>
        <button className="mt-8 flex items-center justify-center gap-2 w-full p-4 rounded-xl border border-secondary/20 dark:border-secondary/40 text-secondary font-bold hover:bg-secondary/5 transition-colors">
          <span className="material-symbols-outlined">logout</span>
          Sign Out
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileView;
