import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { TRANSLATIONS } from '../constants';
import { geminiService } from '../services/geminiService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { PlusCircle, Sparkles, FileText, Upload } from 'lucide-react';

const data = [
  { name: 'Week 1', active: 400, completed: 240 },
  { name: 'Week 2', active: 300, completed: 139 },
  { name: 'Week 3', active: 200, completed: 980 },
  { name: 'Week 4', active: 278, completed: 390 },
  { name: 'Week 5', active: 189, completed: 480 },
];

const InstructorDashboard = () => {
  const { language } = useContext(AppContext);
  const t = TRANSLATIONS[language];
  const [createMode, setCreateMode] = useState(false);
  const [rawText, setRawText] = useState('');
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSummary = async () => {
    if (!rawText) return;
    setIsGenerating(true);
    const summary = await geminiService.summarizeContent(rawText, language);
    setGeneratedSummary(summary);
    setIsGenerating(false);
  };

  if (createMode) {
    return (
      <div className="space-y-6 fade-in">
        <button onClick={() => setCreateMode(false)} className="text-gray-500 hover:text-primary-600">
          &larr; Back to Dashboard
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <Sparkles className="text-primary-500" /> 
          {t.createCourse} (AI Assisted)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <h3 className="font-bold mb-4 dark:text-white">1. {language === 'ar' ? 'أدخل المحتوى الخام' : 'Input Raw Content'}</h3>
             <textarea 
               className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
               placeholder={language === 'ar' ? 'الصق نص الدرس هنا...' : 'Paste lesson text here...'}
               value={rawText}
               onChange={(e) => setRawText(e.target.value)}
             ></textarea>
             <button 
               onClick={handleGenerateSummary}
               disabled={isGenerating || !rawText}
               className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 font-medium disabled:opacity-50"
             >
               {isGenerating ? <Sparkles className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
               {t.generateSummary}
             </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <h3 className="font-bold mb-4 dark:text-white">2. {language === 'ar' ? 'المعاينة والتحرير' : 'Preview & Edit'}</h3>
             <div className="w-full h-64 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
               {generatedSummary ? (
                 <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{generatedSummary}</p>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-gray-400">
                   <FileText className="w-8 h-8 mb-2" />
                   <span className="text-sm">{language === 'ar' ? 'سيظهر الملخص هنا' : 'Summary will appear here'}</span>
                 </div>
               )}
             </div>
             <button className="mt-4 w-full border border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 py-2 rounded-lg font-medium">
               {language === 'ar' ? 'حفظ المسودة' : 'Save Draft'}
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t.analytics}</h2>
        <button 
          onClick={() => setCreateMode(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-sm transition-transform active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          {t.createCourse}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
            { label: 'Total Students', val: '1,240', color: 'bg-blue-500' },
            { label: 'Avg. Completion', val: '68%', color: 'bg-green-500' },
            { label: 'Engagement Rate', val: '85%', color: 'bg-purple-500' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.val}</h3>
            <div className={`mt-4 h-1 w-full rounded-full ${stat.color} opacity-20`}>
              <div className={`h-full rounded-full ${stat.color}`} style={{ width: '70%' }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-80">
           <h3 className="font-bold mb-4 text-gray-800 dark:text-white">Activity Overview</h3>
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={data}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
               <XAxis dataKey="name" fontSize={12} stroke="#9CA3AF" />
               <YAxis fontSize={12} stroke="#9CA3AF" />
               <Tooltip 
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
               />
               <Bar dataKey="active" fill="#0d9488" radius={[4, 4, 0, 0]} />
               <Bar dataKey="completed" fill="#d946ef" radius={[4, 4, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-80">
           <h3 className="font-bold mb-4 text-gray-800 dark:text-white">Retention Rate</h3>
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={data}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
               <XAxis dataKey="name" fontSize={12} stroke="#9CA3AF" />
               <YAxis fontSize={12} stroke="#9CA3AF" />
               <Tooltip 
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
               />
               <Line type="monotone" dataKey="active" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
             </LineChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
