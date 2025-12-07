import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, Language } from "../types";

// Initialize with process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const geminiService = {
  /**
   * Generates a short quiz based on the provided text content.
   */
  generateQuiz: async (content: string, language: Language): Promise<QuizQuestion[]> => {
    if (!process.env.API_KEY) {
      console.warn("No API Key provided");
      return [];
    }

    const modelName = 'gemini-2.5-flash';
    const prompt = `
      Create a quiz with 3 multiple choice questions based on the following content.
      The output must be in ${language === 'ar' ? 'Arabic' : 'English'}.
      Content: "${content.substring(0, 1000)}..."
    `;

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctIndex", "explanation"]
            }
          }
        }
      });

      if (response.text) {
        return JSON.parse(response.text) as QuizQuestion[];
      }
      return [];
    } catch (error) {
      console.error("Gemini Quiz Error:", error);
      return [];
    }
  },

  /**
   * Acts as an AI Tutor to explain concepts within a lesson context.
   */
  askTutor: async (query: string, context: string, language: Language): Promise<string> => {
    if (!process.env.API_KEY) return language === 'ar' ? "يرجى تكوين مفتاح API." : "Please configure API Key.";

    // Use 3-pro-preview for better reasoning on specific questions
    const modelName = 'gemini-3-pro-preview';
    const systemInstruction = language === 'ar' 
      ? "أنت معلم مساعد ذكي ودود. اشرح المفاهيم بوضوح وبساطة للطلاب."
      : "You are a friendly and smart teaching assistant. Explain concepts clearly and simply to students.";

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Context: ${context}\n\nStudent Question: ${query}`,
        config: {
          systemInstruction: systemInstruction,
          maxOutputTokens: 500,
        }
      });
      return response.text || "";
    } catch (error) {
      console.error("Gemini Tutor Error:", error);
      return language === 'ar' ? "حدث خطأ أثناء الاتصال بالمعلم الذكي." : "Error connecting to AI Tutor.";
    }
  },

  /**
   * Summarizes raw text for instructors creating courses.
   */
  summarizeContent: async (rawText: string, language: Language): Promise<string> => {
    if (!process.env.API_KEY) return "API Key missing.";
    
    const modelName = 'gemini-2.5-flash';
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Summarize the following educational content into a concise paragraph suitable for a student lesson description. Language: ${language === 'ar' ? 'Arabic' : 'English'}.\n\nText: ${rawText}`,
      });
      return response.text || "";
    } catch (error) {
      console.error("Gemini Summary Error:", error);
      return "Failed to generate summary.";
    }
  },

  /**
   * Chat with AI Assistant (General purpose).
   */
  chat: async (message: string, history: any[], language: Language) => {
    if (!process.env.API_KEY) return language === 'ar' ? "API Key غير موجود" : "API Key missing";

    const modelName = 'gemini-3-pro-preview';
    const systemInstruction = language === 'ar'
      ? "أنت مساعد تعليمي ذكي في منصة 'المنارة'. ساعد الطلاب في الإجابة على استفساراتهم وتوجيههم."
      : "You are an AI educational assistant on 'Al-Manara' platform. Help students by answering their queries and guiding them.";

    try {
      const chatSession = ai.chats.create({
        model: modelName,
        config: {
          systemInstruction,
        },
        history: history
      });

      const result = await chatSession.sendMessage({ message });
      return result.text;
    } catch (error) {
      console.error("Chat Error:", error);
      return language === 'ar' ? "عذراً، حدث خطأ." : "Sorry, an error occurred.";
    }
  },

  /**
   * Analyze video content for key educational information.
   */
  analyzeVideo: async (videoFile: File, language: Language): Promise<string> => {
    if (!process.env.API_KEY) return language === 'ar' ? "API Key غير موجود" : "API Key missing";
    
    // Using gemini-3-pro-preview as requested for video understanding
    const modelName = 'gemini-3-pro-preview';
    
    try {
      const base64Data = await fileToBase64(videoFile);
      
      const prompt = language === 'ar'
        ? "قم بتحليل هذا الفيديو واستخراج النقاط التعليمية الرئيسية، والمفاهيم المشروحة، وأي مصطلحات مهمة. قدم ملخصاً منظماً."
        : "Analyze this video and extract key educational points, explained concepts, and important terminology. Provide a structured summary.";

      const response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: videoFile.type,
                data: base64Data
              }
            },
            { text: prompt }
          ]
        }
      });
      
      return response.text || "";
    } catch (error) {
      console.error("Video Analysis Error:", error);
      return language === 'ar' ? "فشل تحليل الفيديو. يرجى التأكد من أن الملف مدعوم وحجمه مناسب." : "Failed to analyze video. Please ensure the file is supported and size is appropriate.";
    }
  }
};