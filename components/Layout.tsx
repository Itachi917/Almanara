import React, { useState, useContext, useEffect } from 'react';
import { 
  Menu, X, Sun, Moon, Languages, GraduationCap, 
  LayoutDashboard, BookOpen, Users, Award, LogOut 
} from 'lucide-react';
import { AppContext } from '../App';
import { TRANSLATIONS } from '../constants';
import ChatWidget from './ChatWidget';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { language, setLanguage, theme, toggleTheme, user, logout } = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const t = TRANSLATIONS[language];

  // Close sidebar on route change on mobile
  const handleNav = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => handleNav(id)}
      className={`flex items-center w-full px-4 py-3 mb-2 rounded-lg transition-colors ${
        activeTab === id 
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100 font-medium' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <Icon className={`w-5 h-5 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className={`min-h-screen flex flex-col ${language === 'ar' ? 'font-sans' : ''}`}>
      {/* Top Navbar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-30 h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setSidebarOpen(!sidebarOpen)}
               className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-200"
             >
               <Menu className="w-6 h-6" />
             </button>
             <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-xl">
               <GraduationCap className="w-8 h-8" />
               <span className="hidden sm:inline text-gray-800 dark:text-white">Al-Manara</span>
             </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* XP Pill - Only for students usually, but we show for all */}
            {user && (
              <div className="hidden sm:flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-700">
                 <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">⚡ {user.xp} {t.xp}</span>
              </div>
            )}

            {/* Language Toggle */}
            <button 
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600"
            >
              <Languages className="w-4 h-4" />
              <span>{t.switchLang}</span>
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Logout (Mobile hidden/or icon) & User Avatar */}
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm select-none">
                  {user.name.charAt(0)}
                </div>
                
                <button 
                  onClick={logout}
                  className="hidden sm:flex p-2 text-gray-500 hover:text-red-500 transition-colors"
                  title={t.logout}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 start-0 z-50 w-64 bg-white dark:bg-gray-800 border-e border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : (language === 'ar' ? 'translate-x-full' : '-translate-x-full')}
          lg:translate-x-0
        `}>
          <div className="p-4 flex flex-col h-full">
            <div className="lg:hidden flex justify-end mb-4">
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {user && (
              <div className="mb-6 px-2">
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">{t.welcome}</p>
                 <p className="font-bold text-gray-800 dark:text-white truncate">{user.name}</p>
                 <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === 'staff' ? 'bg-secondary-100 text-secondary-700' : 'bg-primary-100 text-primary-700'}`}>
                   {user.role === 'staff' ? t.staff : t.student}
                 </span>
              </div>
            )}

            <nav className="flex-1">
              <NavItem id="dashboard" icon={LayoutDashboard} label={t.dashboard} />
              <NavItem id="courses" icon={BookOpen} label={t.courses} />
              <NavItem id="leaderboard" icon={Users} label={t.leaderboard} />
              
              {/* Only show Instructor tab if user is staff */}
              {user?.role === 'staff' && (
                <>
                  <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
                  <NavItem id="instructor" icon={Award} label={t.instructor} />
                </>
              )}
            </nav>
            
            <div className="mt-auto">
               <button 
                 onClick={logout}
                 className="lg:hidden flex items-center w-full px-4 py-3 mb-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 transition-colors"
               >
                 <LogOut className={`w-5 h-5 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                 <span>{t.logout}</span>
               </button>

               {user && (
                <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                  <p className="text-xs text-primary-600 dark:text-primary-300 font-semibold mb-1">{t.streak}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">🔥 {user.streak}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{language === 'ar' ? 'أيام' : 'days'}</span>
                  </div>
                </div>
               )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 relative">
          <div className="max-w-6xl mx-auto pb-20">
            {children}
          </div>
          {/* AI Chatbot Widget */}
          <ChatWidget />
        </main>
      </div>
    </div>
  );
};

export default Layout;