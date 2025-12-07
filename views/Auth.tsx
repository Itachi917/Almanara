import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { TRANSLATIONS } from '../constants';
import { UserRole } from '../types';
import { GraduationCap, Mail, Lock, User as UserIcon, CheckCircle } from 'lucide-react';

const Auth = () => {
  const { language, login } = useContext(AppContext);
  const t = TRANSLATIONS[language];
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Mock login logic
      const userData = {
        id: 'u-' + Date.now(),
        name: isLogin ? (email.includes('admin') ? 'Admin User' : 'Student User') : name,
        email: email,
        role: isLogin ? (email.includes('admin') ? 'staff' : 'student') : role,
        xp: 0,
        levelTitle: language === 'ar' ? 'مستكشف جديد' : 'New Explorer',
        streak: 0,
        completedLessons: [],
        badges: []
      };
      
      login(userData);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-8">
          <div className="flex justify-center mb-6">
             <div className="bg-primary-500 rounded-full p-3 text-white">
               <GraduationCap className="w-10 h-10" />
             </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
            Al-Manara Learning
          </h2>
          <p className="text-center text-gray-500 mb-8">
            {isLogin ? t.login : t.signup}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <UserIcon className="absolute top-3.5 left-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute top-3.5 left-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder={t.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute top-3.5 left-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder={t.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                required
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">{t.role}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                      role === 'student' 
                        ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-400' 
                        : 'border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {t.student}
                    {role === 'student' && <CheckCircle className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('staff')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                      role === 'staff' 
                        ? 'bg-secondary-50 dark:bg-secondary-900/30 border-secondary-500 text-secondary-700 dark:text-secondary-400' 
                        : 'border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {t.staff}
                    {role === 'staff' && <CheckCircle className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-500/30 transition-all active:scale-95 disabled:opacity-70 flex justify-center"
            >
              {loading ? <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full" /> : (isLogin ? t.login : t.signup)}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
            >
              {isLogin ? t.noAccount : t.haveAccount} <span className="font-bold underline">{isLogin ? t.signup : t.login}</span>
            </button>
          </div>
          
          {/* Quick Demo Hint */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-xs text-gray-400 text-center">
            <p>Demo Hint: Use "admin@almanara.com" to login as Staff.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;