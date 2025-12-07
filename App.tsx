import React, { useState, useEffect, createContext } from 'react';
import Layout from './components/Layout';
import StudentDashboard from './views/StudentDashboard';
import CoursePlayer from './views/CoursePlayer';
import InstructorDashboard from './views/InstructorDashboard';
import Leaderboard from './views/Leaderboard';
import Auth from './views/Auth';
import { Language, User, Course } from './types';
import { MOCK_USER } from './constants';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: User | null;
  addXp: (amount: number) => void;
  login: (userData: User) => void;
  logout: () => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

const App = () => {
  const [language, setLanguage] = useState<Language>('ar');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Handle Global Styles for RTL/LTR and Theme
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const addXp = (amount: number) => {
    if (user) {
      setUser(prev => prev ? ({ ...prev, xp: prev.xp + amount }) : null);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    setActiveTab('dashboard'); // Reset tab on login
  };

  const logout = () => {
    setUser(null);
    setSelectedCourse(null);
    setActiveTab('dashboard');
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const renderContent = () => {
    if (selectedCourse) {
      return (
        <CoursePlayer 
          course={selectedCourse} 
          onBack={() => setSelectedCourse(null)} 
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
      case 'courses': 
        return <StudentDashboard onSelectCourse={handleCourseSelect} />;
      case 'instructor':
        // Protected Route logic in render
        if (user?.role === 'staff') {
          return <InstructorDashboard />;
        }
        return <StudentDashboard onSelectCourse={handleCourseSelect} />;
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return <StudentDashboard onSelectCourse={handleCourseSelect} />;
    }
  };

  // If not authenticated, show Auth screen
  if (!user) {
    return (
      <AppContext.Provider value={{ language, setLanguage, theme, toggleTheme, user, addXp, login, logout }}>
        <Auth />
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, toggleTheme, user, addXp, login, logout }}>
      <Layout activeTab={activeTab} setActiveTab={(t) => {
         setActiveTab(t);
         setSelectedCourse(null);
      }}>
        {renderContent()}
      </Layout>
    </AppContext.Provider>
  );
};

export default App;