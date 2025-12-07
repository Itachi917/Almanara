import React, { useContext } from 'react';
import { AppContext } from '../App';
import { TRANSLATIONS, MOCK_COURSES } from '../constants';
import { PlayCircle, Clock, Star, TrendingUp } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onSelectCourse: (c: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelectCourse }) => {
  const { language } = useContext(AppContext);
  const t = TRANSLATIONS[language];

  return (
    <div 
      onClick={() => onSelectCourse(course)}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title[language]} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="absolute bottom-3 start-3">
          <span className="bg-white/90 dark:bg-black/80 text-xs font-bold px-2 py-1 rounded backdrop-blur-sm text-gray-800 dark:text-white">
            {course.chapters.length} {t.chapters}
          </span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
          {course.title[language]}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
          {course.description[language]}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
           <span className="flex items-center gap-1">
             <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
             4.8
           </span>
           <span>{course.instructor}</span>
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = ({ onSelectCourse }: { onSelectCourse: (c: Course) => void }) => {
  const { language, user } = useContext(AppContext);
  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-8 fade-in">
      {/* Welcome & Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {language === 'ar' ? `مرحباً بك، ${user.name}` : `Welcome back, ${user.name}`}
            </h1>
            <p className="opacity-90 mb-6">
              {language === 'ar' ? 'أنت تحرز تقدماً رائعاً! استمر في التعلم.' : 'You are making great progress! Keep learning.'}
            </p>
            <button className="bg-white text-primary-700 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition shadow-sm">
              {t.continueLearning}
            </button>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 end-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
          <div className="absolute bottom-0 start-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8" />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-gray-800 dark:text-white">{t.xp}</h3>
             <TrendingUp className="w-5 h-5 text-green-500" />
           </div>
           <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.xp}</div>
           <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
           </div>
           <p className="text-xs text-gray-500 mt-2">
             {user.levelTitle} &bull; {language === 'ar' ? 'المستوى 5' : 'Level 5'}
           </p>
        </div>
      </section>

      {/* Continue Watching (Mock) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
             <Clock className="w-5 h-5 text-primary-500" />
             {t.continueLearning}
          </h2>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
           <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
             <img src="https://picsum.photos/200/200" className="w-full h-full object-cover" alt="thumb" />
           </div>
           <div className="flex-1">
             <h4 className="font-bold text-gray-800 dark:text-white text-sm sm:text-base">
               {MOCK_COURSES[0].title[language]}
             </h4>
             <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
               {MOCK_COURSES[0].chapters[0].title[language]}
             </p>
             <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
               <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
             </div>
           </div>
           <button 
             onClick={() => onSelectCourse(MOCK_COURSES[0])}
             className="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 p-2 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/50"
           >
             <PlayCircle className="w-6 h-6" />
           </button>
        </div>
      </section>

      {/* Course List */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t.courses}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_COURSES.map(course => (
            <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;