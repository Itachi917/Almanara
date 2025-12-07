import { Course, User, Badge } from './types';

export const TRANSLATIONS = {
  ar: {
    dashboard: "لوحة القيادة",
    courses: "الدورات",
    community: "المجتمع",
    instructor: "المعلم",
    search: "بحث عن دورة...",
    continueLearning: "تابع التعلم",
    recommended: "موصى به لك",
    leaderboard: "لوحة المتصدرين",
    level: "المستوى",
    xp: "نقطة خبرة",
    streak: "يوم تتابع",
    chapters: "الفصول",
    startLesson: "ابدأ الدرس",
    completed: "مكتمل",
    summary: "ملخص الدرس",
    quiz: "اختبار سريع",
    discussion: "نقاش",
    askAI: "اسأل المعلم الذكي",
    generateQuiz: "إنشاء اختبار (AI)",
    generateSummary: "تلخيص المحتوى (AI)",
    submit: "إرسال",
    correct: "إجابة صحيحة!",
    incorrect: "حاول مرة أخرى",
    next: "التالي",
    createCourse: "إنشاء دورة جديدة",
    analytics: "تحليلات الطلاب",
    loading: "جاري التحميل...",
    switchLang: "English",
    darkMode: "الوضع الليلي",
    lightMode: "الوضع النهاري",
    points: "نقطة",
    chatAssistant: "المساعد الذكي",
    typeMessage: "اكتب رسالتك هنا...",
    videoAnalysis: "تحليل الفيديو",
    uploadVideo: "رفع فيديو للتحليل",
    analyzeVideo: "تحليل الفيديو",
    videoAnalysisResult: "نتائج التحليل",
    analyzing: "جاري التحليل...",
    uploadPrompt: "قم برفع ملف فيديو لاستخراج النقاط الرئيسية والمفاهيم.",
    chatWelcome: "مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم في دروسك؟",
    send: "إرسال",
    // Auth
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    name: "الاسم الكامل",
    role: "الدور",
    student: "طالب",
    staff: "معلم / مشرف",
    haveAccount: "لديك حساب بالفعل؟",
    noAccount: "ليس لديك حساب؟",
    loginSuccess: "تم تسجيل الدخول بنجاح",
    logout: "تسجيل خروج",
    welcome: "مرحباً",
    accessRestricted: "وصول مقيد للمعلمين فقط",
  },
  en: {
    dashboard: "Dashboard",
    courses: "Courses",
    community: "Community",
    instructor: "Instructor",
    search: "Search for a course...",
    continueLearning: "Continue Learning",
    recommended: "Recommended for You",
    leaderboard: "Leaderboard",
    level: "Level",
    xp: "XP",
    streak: "Day Streak",
    chapters: "Chapters",
    startLesson: "Start Lesson",
    completed: "Completed",
    summary: "Lesson Summary",
    quiz: "Quick Quiz",
    discussion: "Discussion",
    askAI: "Ask AI Tutor",
    generateQuiz: "Generate Quiz (AI)",
    generateSummary: "Summarize Content (AI)",
    submit: "Submit",
    correct: "Correct Answer!",
    incorrect: "Try Again",
    next: "Next",
    createCourse: "Create New Course",
    analytics: "Student Analytics",
    loading: "Loading...",
    switchLang: "العربية",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    points: "Pts",
    chatAssistant: "AI Assistant",
    typeMessage: "Type your message...",
    videoAnalysis: "Video Analysis",
    uploadVideo: "Upload Video for Analysis",
    analyzeVideo: "Analyze Video",
    videoAnalysisResult: "Analysis Results",
    analyzing: "Analyzing...",
    uploadPrompt: "Upload a video file to extract key points and concepts.",
    chatWelcome: "Hello! I am your AI assistant. How can I help you with your studies today?",
    send: "Send",
    // Auth
    login: "Login",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    name: "Full Name",
    role: "Role",
    student: "Student",
    staff: "Instructor / Staff",
    haveAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    loginSuccess: "Logged in successfully",
    logout: "Log Out",
    welcome: "Welcome",
    accessRestricted: "Restricted to instructors only",
  }
};

export const MOCK_USER: User = {
  id: 'u1',
  name: 'أحمد محمد',
  email: 'student@almanara.com',
  role: 'student',
  xp: 1250,
  levelTitle: 'باحث مبتدئ', // Novice Researcher
  streak: 5,
  completedLessons: ['l1-1', 'l1-2'],
  badges: [
    { id: 'b1', icon: '🔥', name: { ar: 'بداية قوية', en: 'Strong Start' }, description: { ar: 'أكملت 5 دروس في يوم واحد', en: 'Completed 5 lessons in one day' } }
  ]
};

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: { ar: 'مقدمة في الفيزياء الفلكية', en: 'Introduction to Astrophysics' },
    description: { ar: 'رحلة ممتعة لاستكشاف النجوم والمجرات.', en: 'A fun journey exploring stars and galaxies.' },
    thumbnail: 'https://picsum.photos/400/250?random=1',
    instructor: 'د. سارة',
    totalChapters: 4,
    chapters: [
      {
        id: 'ch1',
        title: { ar: 'المجموعة الشمسية', en: 'The Solar System' },
        lessons: [
          {
            id: 'l1-1',
            title: { ar: 'الشمس: نجمنا الأم', en: 'The Sun: Our Mother Star' },
            videoUrl: 'placeholder',
            duration: '5:30',
            content: { 
              ar: 'الشمس هي نجم يقع في مركز نظامنا الشمسي. تتكون بشكل أساسي من الهيدروجين والهيليوم.',
              en: 'The Sun is the star at the center of the Solar System. It is nearly perfect sphere of hot plasma.'
            }
          },
          {
            id: 'l1-2',
            title: { ar: 'الكواكب الصخرية', en: 'Rocky Planets' },
            videoUrl: 'placeholder',
            duration: '6:15',
            content: {
              ar: 'عطارد والزهرة والأرض والمريخ هي الكواكب الصخرية الداخلية.',
              en: 'Mercury, Venus, Earth, and Mars are the inner rocky planets.'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'c2',
    title: { ar: 'أساسيات البرمجة باستخدام بايثون', en: 'Python Programming Basics' },
    description: { ar: 'تعلم لغة العصر من الصفر.', en: 'Learn the language of the era from scratch.' },
    thumbnail: 'https://picsum.photos/400/250?random=2',
    instructor: 'أ. خالد',
    totalChapters: 3,
    chapters: []
  },
  {
    id: 'c3',
    title: { ar: 'تاريخ الحضارات القديمة', en: 'History of Ancient Civilizations' },
    description: { ar: 'استكشاف الحضارات التي شكلت عالمنا.', en: 'Exploring civilizations that shaped our world.' },
    thumbnail: 'https://picsum.photos/400/250?random=3',
    instructor: 'أ. ليلى',
    totalChapters: 5,
    chapters: []
  }
];