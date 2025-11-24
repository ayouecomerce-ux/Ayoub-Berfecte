import React, { useState, useEffect, useCallback } from 'react';
import { generateRiddle, validateAnswer } from '../services/geminiService';
import { Riddle } from '../types';

interface GameScreenProps {
  level: number;
  onLevelComplete: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ level, onLevelComplete }) => {
  const [riddle, setRiddle] = useState<Riddle | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'neutral', text: string } | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [hintVisible, setHintVisible] = useState(false);

  const fetchRiddle = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    setHintVisible(false);
    setUserAnswer('');
    
    // We use the history to avoid repeating questions in short term
    const newRiddle = await generateRiddle(level, history);
    
    setRiddle(newRiddle);
    setHistory(prev => [...prev, newRiddle.question]);
    setLoading(false);
  }, [level, history]);

  useEffect(() => {
    fetchRiddle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only fetch on mount, subsequent fetches handled by onLevelComplete logic flow if component remounts

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || !riddle) return;

    setSubmitting(true);
    setFeedback({ type: 'neutral', text: 'جاري التحقق من إجابتك...' });

    const result = await validateAnswer(riddle.question, userAnswer);

    if (result.correct) {
      setFeedback({ type: 'success', text: result.message || 'إجابة صحيحة! أحسنت.' });
      // Play sound effect logic could go here
      setTimeout(() => {
        onLevelComplete();
      }, 2000);
    } else {
      setFeedback({ type: 'error', text: result.message || 'للأسف إجابة خاطئة. حاول مرة أخرى.' });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-purple-300 animate-pulse">جاري تحضير اللغز القادم...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-4">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>البداية</span>
          <span>المستوى {level} من 100</span>
          <span>النهاية</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden border border-gray-700">
          <div 
            className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${(level / 100) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Riddle Card */}
      <div className="glass p-8 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 blur-2xl rounded-full -mr-10 -mt-10"></div>
        
        <span className="inline-block px-3 py-1 bg-purple-900/50 border border-purple-500/30 rounded-full text-xs text-purple-300 mb-4">
          لغز رقم #{level}
        </span>

        <h2 className="text-2xl md:text-3xl font-amiri leading-loose text-white mb-8 text-center drop-shadow-lg min-h-[120px] flex items-center justify-center">
          {riddle?.question}
        </h2>

        <form onSubmit={handleCheck} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={submitting || (feedback?.type === 'success')}
              placeholder="اكتب إجابتك هنا..."
              className="w-full bg-black/50 border-2 border-gray-700 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-center text-lg disabled:opacity-50"
            />
          </div>

          <div className="flex gap-3">
             <button
              type="button"
              onClick={() => setHintVisible(true)}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3 px-6 rounded-xl transition-all border border-gray-600"
              disabled={submitting || hintVisible}
            >
              {hintVisible ? '💡 ' + riddle?.hint : '💡 تلميح'}
            </button>
            
            <button
              type="submit"
              disabled={submitting || !userAnswer.trim()}
              className="flex-[2] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'جاري التحقق...' : 'تحقق من الإجابة'}
            </button>
          </div>
        </form>

        {/* Feedback Message */}
        {feedback && (
          <div className={`mt-6 p-4 rounded-xl border ${
            feedback.type === 'success' ? 'bg-green-900/30 border-green-500/50 text-green-200' :
            feedback.type === 'error' ? 'bg-red-900/30 border-red-500/50 text-red-200' :
            'bg-blue-900/30 border-blue-500/50 text-blue-200'
          } animate-fade-in text-center font-bold`}>
            {feedback.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;