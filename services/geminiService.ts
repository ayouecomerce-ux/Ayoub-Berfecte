import { GoogleGenAI, Type } from "@google/genai";
import { Riddle } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = 'gemini-2.5-flash';

/**
 * Generates a unique, difficult riddle in Arabic.
 * We include a random seed/topic concept to ensure variety across sessions.
 */
export const generateRiddle = async (level: number, history: string[]): Promise<Riddle> => {
  const historyContext = history.slice(-10).join(" | "); // Pass last 10 riddles to avoid immediate repeats
  
  const prompt = `
    أنت سيد الألغاز الذكي. مهمتك هي إنشاء لغز باللغة العربية.
    
    القواعد:
    1. اللغز يجب أن يكون صعباً، ممتعاً، وشعرياً أو غامضاً.
    2. المستوى الحالي هو ${level} من 100. كلما زاد الرقم، زادت الصعوبة.
    3. تجنب هذه الألغاز السابقة: [${historyContext}].
    4. اللغز يجب أن يكون فريداً وغير تقليدي.
    
    قم بالرد بصيغة JSON فقط:
    {
      "question": "نص اللغز هنا",
      "hint": "تلميح صغير وغامض"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            hint: { type: Type.STRING },
          },
          required: ["question", "hint"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as Riddle;
  } catch (error) {
    console.error("Error generating riddle:", error);
    // Fallback riddle in case of API failure
    return {
      question: "شيء كلما أخذت منه كبر، وكلما وضعت فيه صغر؟",
      hint: "تراه في الأرض ولكن ليس في السماء"
    };
  }
};

/**
 * Validates the user's answer using Gemini to allow for flexible matching.
 */
export const validateAnswer = async (riddle: string, userAnswer: string): Promise<{ correct: boolean; message: string }> => {
  const prompt = `
    اللغز: "${riddle}"
    إجابة المستخدم: "${userAnswer}"
    
    هل إجابة المستخدم صحيحة لهذا اللغز؟ 
    خذ في الاعتبار المرادفات، والأخطاء الإملائية البسيطة، واختلاف اللهجات.
    يجب أن تكون الإجابة دقيقة ولكن عادلة.
    
    رد بصيغة JSON فقط:
    {
      "correct": boolean, // true if correct, false if wrong
      "message": "رسالة قصيرة تشرح لماذا (اذا كان خطأ) أو تهنئة (اذا كان صح) - باللغة العربية"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                correct: { type: Type.BOOLEAN },
                message: { type: Type.STRING }
            }
        }
      }
    });

    const text = response.text;
    if (!text) return { correct: false, message: "حدث خطأ في التحقق، حاول مرة أخرى." };
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error validating answer:", error);
    // Fallback logic for error
    return { correct: false, message: "حدث خطأ في الاتصال بالخادم." };
  }
};