import React, { useContext } from 'react';
import { AppContext } from '../App';
import { TRANSLATIONS } from '../constants';

const MOCK_LEADERS = [
  { id: '1', name: 'Sara Ahmed', xp: 2400, avatar: 'S' },
  { id: '2', name: 'Omar Khaled', xp: 2150, avatar: 'O' },
  { id: 'u1', name: 'You', xp: 1250, avatar: 'Y' }, // Current User match
  { id: '3', name: 'Layla M.', xp: 900, avatar: 'L' },
];

const Leaderboard = () => {
  const { language, user } = useContext(AppContext);
  const t = TRANSLATIONS[language];

  // Sort leaders (mock sort in real app)
  const sorted = [...MOCK_LEADERS].sort((a,b) => b.xp - a.xp);

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{t.leaderboard}</h2>
        <p className="text-gray-500">
          {language === 'ar' 
            ? 'تنافس مع أصدقائك واكسب المزيد من نقاط الخبرة!' 
            : 'Compete with friends and earn more XP!'}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {sorted.map((leader, index) => {
          const isMe = leader.id === user.id;
          return (
            <div 
              key={leader.id}
              className={`flex items-center p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 ${isMe ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}`}
            >
              <div className="w-8 font-bold text-gray-400 text-lg flex justify-center">
                {index + 1}
              </div>
              <div className="mx-4 w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-sm">
                {leader.avatar}
              </div>
              <div className="flex-1">
                <h4 className={`font-bold ${isMe ? 'text-primary-700 dark:text-primary-400' : 'text-gray-800 dark:text-white'}`}>
                  {isMe ? `${leader.name} (${language === 'ar' ? 'أنت' : 'You'})` : leader.name}
                </h4>
              </div>
              <div className="font-bold text-gray-600 dark:text-gray-300">
                {leader.xp} {t.xp}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
