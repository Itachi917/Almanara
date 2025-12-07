import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { TRANSLATIONS } from '../constants';
import { geminiService } from '../services/geminiService';
import { Course, Chapter, Lesson, QuizQuestion } from '../types';
import { 
  Play, CheckCircle, Lock, MessageSquare, FileText, 
  HelpCircle, ChevronDown, ChevronUp, BrainCircuit, Sparkles, Send, Video, UploadCloud 
} from 'lucide-react';

interface CoursePlayerProps {
  course: Course;
  onBack: () => void;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({ course, onBack }) => {
  const { language, addXp } = useContext(AppContext);
  const t = TRANSLATIONS[language];
  
  // State
  const [activeLesson, setActiveLesson] = useState<Lesson>(course.chapters[0].lessons[0]);
  const [activeTab, setActiveTab] = useState<'summary' | 'quiz' | 'discuss' | 'video_analysis'>('summary');
  const [expandedChapter, setExpandedChapter] = useState<string>(course.chapters[0].id);
  
  // AI State
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion[] | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorResponse, setTutorResponse] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);

  // Video Analysis State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoAnalysis, setVideoAnalysis] = useState<string>('');
  const [analyzingVideo, setAnalyzingVideo] = useState(false);

  // Handlers
  const handleLessonChange = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setGeneratedQuiz(null);
    setQuizScore(null);
    setTutorResponse('');
    setVideoFile(null);
    setVideoAnalysis('');
    setActiveTab('summary');
  };

  const generateAIQuiz = async () => {
    setQuizLoading(true);
    const questions = await geminiService.generateQuiz(activeLesson.content[language], language);
    setGeneratedQuiz(questions);
    setQuizLoading(false);
  };

  const handleAskTutor = async () => {
    if (!tutorQuery.trim()) return;
    setTutorLoading(true);
    const resp = await geminiService.askTutor(tutorQuery, activeLesson.content[language], language);
    setTutorResponse(resp);
    setTutorLoading(false);
  };

  const handleQuizSubmit = (answers: number[]) => {
    if (!generatedQuiz) return;
    let score = 0;
    answers.forEach((ans, idx) => {
      if (ans === generatedQuiz[idx].correctIndex) score++;
    });
    setQuizScore(score);
    if (score === generatedQuiz.length) {
      addXp(50); // Bonus XP
    } else {
      addXp(10);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
      setVideoAnalysis('');
    }
  };

  const handleAnalyzeVideo = async () => {
    if (!videoFile) return;
    setAnalyzingVideo(true);
    const result = await geminiService.analyzeVideo(videoFile, language);
    setVideoAnalysis(result);
    setAnalyzingVideo(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
      {/* Left Column: Player & Content */}
      <div className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto pr-1 pb-10">
        
        {/* Breadcrumb / Back */}
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-primary-600 self-start">
          &larr; {t.courses} / {course.title[language]}
        </button>

        {/* Video Player Placeholder */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative group">
           {/* In a real app, <video> or <iframe> here */}
           <div className="absolute inset-0 flex items-center justify-center">
             <Play className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer" />
           </div>
           <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
             <h2 className="text-white font-bold">{activeLesson.title[language]}</h2>
           </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col flex-1">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('summary')}
              className={`flex-1 min-w-[100px] py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'summary' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
            >
              <FileText className="w-4 h-4" /> {t.summary}
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 min-w-[100px] py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'quiz' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
            >
              <HelpCircle className="w-4 h-4" /> {t.quiz}
            </button>
            <button 
              onClick={() => setActiveTab('video_analysis')}
              className={`flex-1 min-w-[120px] py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'video_analysis' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
            >
              <Video className="w-4 h-4" /> {t.videoAnalysis}
            </button>
            <button 
              onClick={() => setActiveTab('discuss')}
              className={`flex-1 min-w-[100px] py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'discuss' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
            >
              <MessageSquare className="w-4 h-4" /> {t.discussion}
            </button>
          </div>

          <div className="p-6 flex-1">
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2 dark:text-white">{activeLesson.title[language]}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {activeLesson.content[language]}
                  </p>
                </div>

                {/* AI Tutor Section */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-300">{t.askAI}</h4>
                  </div>
                  
                  {tutorResponse ? (
                     <div className="bg-white dark:bg-gray-800 p-3 rounded-lg mb-3 text-sm text-gray-700 dark:text-gray-200 shadow-sm animate-in fade-in">
                       {tutorResponse}
                       <button onClick={() => setTutorResponse('')} className="block mt-2 text-xs text-indigo-500 hover:underline">Clear</button>
                     </div>
                  ) : null}

                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={tutorQuery}
                      onChange={(e) => setTutorQuery(e.target.value)}
                      placeholder={language === 'ar' ? "لم أفهم هذا الجزء، اشرح لي..." : "I didn't understand this part, explain..."}
                      className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      onKeyDown={(e) => e.key === 'Enter' && handleAskTutor()}
                    />
                    <button 
                      onClick={handleAskTutor}
                      disabled={tutorLoading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg disabled:opacity-50"
                    >
                      {tutorLoading ? <BrainCircuit className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                {!generatedQuiz && !quizLoading && (
                  <div className="text-center">
                    <BrainCircuit className="w-12 h-12 text-primary-200 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">{language === 'ar' ? 'قم بإنشاء اختبار سريع لاختبار فهمك لهذا الدرس.' : 'Generate a quick quiz to test your understanding of this lesson.'}</p>
                    <button 
                      onClick={generateAIQuiz}
                      className="bg-primary-600 text-white px-6 py-2 rounded-full font-medium hover:bg-primary-700 transition"
                    >
                      {t.generateQuiz}
                    </button>
                  </div>
                )}
                {quizLoading && <div className="text-primary-600 flex items-center gap-2"><Sparkles className="animate-spin w-4 h-4"/> {t.loading}</div>}
                
                {generatedQuiz && (
                  <QuizView 
                    questions={generatedQuiz} 
                    onSubmit={handleQuizSubmit} 
                    score={quizScore}
                    t={t}
                  />
                )}
              </div>
            )}

            {activeTab === 'video_analysis' && (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                   <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                     <Video className="w-5 h-5" /> {t.videoAnalysis}
                   </h4>
                   <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                     {t.uploadPrompt}
                   </p>
                   
                   <div className="flex flex-col sm:flex-row gap-4 items-center">
                     <label className="flex-1 w-full flex items-center justify-center px-4 py-2 border border-dashed border-blue-300 dark:border-blue-700 rounded-lg cursor-pointer hover:bg-white/50 dark:hover:bg-black/20 transition">
                       <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                       <UploadCloud className="w-5 h-5 mr-2 text-blue-500" />
                       <span className="text-sm text-blue-700 dark:text-blue-300 truncate max-w-[200px]">
                         {videoFile ? videoFile.name : t.uploadVideo}
                       </span>
                     </label>
                     <button
                       onClick={handleAnalyzeVideo}
                       disabled={!videoFile || analyzingVideo}
                       className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                     >
                        {analyzingVideo ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        {analyzingVideo ? t.analyzing : t.analyzeVideo}
                     </button>
                   </div>
                </div>

                {videoAnalysis && (
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl shadow-sm animate-in slide-in-from-bottom-2">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                      {t.videoAnalysisResult}
                    </h4>
                    <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {videoAnalysis}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'discuss' && (
              <div className="text-center text-gray-500 py-10">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>{language === 'ar' ? 'لا توجد تعليقات بعد. كن الأول!' : 'No comments yet. Be the first!'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Curriculum */}
      <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <h3 className="font-bold text-gray-800 dark:text-white">{t.chapters}</h3>
          <div className="text-xs text-gray-500 mt-1">
             {course.chapters.length} {t.chapters} &bull; 100% {t.completed}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {course.chapters.map(chapter => (
            <div key={chapter.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
              <button 
                onClick={() => setExpandedChapter(expandedChapter === chapter.id ? '' : chapter.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="font-medium text-sm text-gray-800 dark:text-gray-200 text-start">{chapter.title[language]}</span>
                {expandedChapter === chapter.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              
              {expandedChapter === chapter.id && (
                <div className="bg-gray-50 dark:bg-gray-900/30">
                  {chapter.lessons.map(lesson => (
                    <button 
                      key={lesson.id}
                      onClick={() => handleLessonChange(lesson)}
                      className={`w-full flex items-center gap-3 p-3 pl-6 pr-4 text-sm transition-colors ${activeLesson.id === lesson.id ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                      <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-500 flex items-center justify-center flex-shrink-0">
                        {activeLesson.id === lesson.id ? <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" /> : null}
                      </div>
                      <div className="text-start flex-1 line-clamp-1">{lesson.title[language]}</div>
                      <span className="text-xs opacity-70">{lesson.duration}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sub-component for Quiz Logic
const QuizView = ({ questions, onSubmit, score, t }: { questions: QuizQuestion[], onSubmit: (a: number[]) => void, score: number | null, t: any }) => {
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[qIdx] = optIdx;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit(answers);
  };

  return (
    <div className="w-full space-y-6">
       {score !== null && (
         <div className={`p-4 rounded-lg text-center ${score === questions.length ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
           <span className="font-bold">{t.completed}! </span>
           {score} / {questions.length} {t.correct}
         </div>
       )}
       
       {questions.map((q, idx) => (
         <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
           <p className="font-medium text-gray-800 dark:text-gray-200 mb-3">{idx + 1}. {q.question}</p>
           <div className="space-y-2">
             {q.options.map((opt, optIdx) => {
               let bgClass = "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600";
               if (submitted) {
                 if (optIdx === q.correctIndex) bgClass = "bg-green-100 border-green-500 text-green-900";
                 else if (answers[idx] === optIdx && optIdx !== q.correctIndex) bgClass = "bg-red-100 border-red-500 text-red-900";
               } else if (answers[idx] === optIdx) {
                 bgClass = "bg-primary-50 border-primary-500 ring-1 ring-primary-500";
               }

               return (
                 <button 
                   key={optIdx}
                   onClick={() => handleSelect(idx, optIdx)}
                   className={`w-full text-start p-3 rounded border text-sm transition-all ${bgClass}`}
                 >
                   {opt}
                 </button>
               );
             })}
           </div>
           {submitted && (
             <p className="mt-2 text-xs text-gray-500 italic">{q.explanation}</p>
           )}
         </div>
       ))}

       {!submitted && (
         <button 
           onClick={handleSubmit} 
           disabled={answers.includes(-1)}
           className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 disabled:opacity-50"
         >
           {t.submit}
         </button>
       )}
    </div>
  );
};

export default CoursePlayer;