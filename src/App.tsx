import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Building2, Users, Flame, Briefcase, PlusCircle, CheckCircle2, 
  HelpCircle, Sparkles, FileDown, ShieldAlert, HeartHandshake,
  BookOpen, Landmark, Info
} from 'lucide-react';
import { Scene, VideoSettings, QAItem } from './types';
import { INITIAL_SCENES, AUDIO_CHORD_PRESETS } from './data';
import { VideoPlayer } from './components/VideoPlayer';
import { TimelineControl } from './components/TimelineControl';
import { ScriptEditor } from './components/ScriptEditor';
import { ExportModal } from './components/ExportModal';
import { bgmEngine } from './components/AudioEngine';

export default function App() {
  const [scenes, setScenes] = useState<Scene[]>(INITIAL_SCENES);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Custom video aspect and voice synthesis configurations
  const [settings, setSettings] = useState<VideoSettings>({
    aspectRatio: '16:9',
    useNarratorTTS: false,
    useSFXChords: true,
    autoPlay: false,
    playbackSpeed: 1.0,
    bgColorPreset: 'corporate'
  });

  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [lastSpeechSceneId, setLastSpeechSceneId] = useState<number>(-1);
  const [activeQAIndex, setActiveQAIndex] = useState<number | null>(null);

  // Reference for the timing clock ticker
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const totalDuration = 60; // Max timeline duration

  // Computed: Find the exact scene matching the current chronological time
  const activeScene = useMemo(() => {
    const scene = scenes.find(s => currentTime >= s.start && currentTime <= s.end);
    return scene || scenes[0];
  }, [scenes, currentTime]);

  // Jump to specific scene keyframe
  const handleJumpToScene = (sceneId: number) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (scene) {
      setCurrentTime(scene.start);
      bgmEngine.playTick();
      
      // Trigger voice narration if active
      if (settings.useNarratorTTS) {
        speakVoiceOver(scene.voiceOver);
        setLastSpeechSceneId(scene.id);
      }
    }
  };

  // Restore developer's initial pristine Viet Trade Union script default values
  const handleRestoreDefaults = () => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục kịch bản mẫu gốc ban đầu của Ban Giám đốc?")) {
      setScenes(JSON.parse(JSON.stringify(INITIAL_SCENES)));
      setCurrentTime(0);
      setIsPlaying(false);
      bgmEngine.playTick();
    }
  };

  // Web Speech synthesis speak helper in Vietnamese
  const speakVoiceOver = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Clears queue
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = (settings.playbackSpeed || 1.0) * 0.95; // Slightly slower to sound natural
      
      // Try to bind Vietnamese voice if exists in user browser
      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find(v => v.lang.startsWith('vi') || v.name.includes('vietnamese'));
      if (viVoice) {
         utterance.voice = viVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech Synthesis failed", e);
    }
  };

  // Stop current voice speech on Pause
  useEffect(() => {
    if (!isPlaying && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [isPlaying]);

  // Handle chord synthesiser transition on scene changes
  useEffect(() => {
    if (settings.useSFXChords && isPlaying) {
      const chordIndex = (activeScene.id - 1) % AUDIO_CHORD_PRESETS.length;
      const currentChord = AUDIO_CHORD_PRESETS[chordIndex];
      // Play brief ambient synth pad
      bgmEngine.playChord(currentChord.freq, (activeScene.end - activeScene.start) / settings.playbackSpeed);
    }
  }, [activeScene.id, isPlaying, settings.useSFXChords]);

  // Trigger Speech Translation when slide transition occurs
  useEffect(() => {
    if (settings.useNarratorTTS && isPlaying && activeScene.id !== lastSpeechSceneId) {
      speakVoiceOver(activeScene.voiceOver);
      setLastSpeechSceneId(activeScene.id);
    }
  }, [activeScene.id, isPlaying, settings.useNarratorTTS, lastSpeechSceneId]);

  // Ticker animation frame clock loop for rendering smoothness
  useEffect(() => {
    const tick = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const nextVal = prev + delta * settings.playbackSpeed;
          if (nextVal >= totalDuration) {
            setIsPlaying(false);
            return 0; // reset loop
          }
          return nextVal;
        });
      }
      
      rafRef.current = requestAnimationFrame(tick);
    };

    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      lastTimeRef.current = null;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying, settings.playbackSpeed]);

  const updateSettings = (newSettings: Partial<VideoSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Structured information QA list to test interaction
  const manualQAItems: QAItem[] = [
    {
      question: "Không gia nhập Công đoàn có chịu kỷ luật hay ảnh hưởng công việc?",
      answer: "Hoàn toàn KHÔNG. Luật lao động và Điều lệ Công đoàn Việt Nam quy định việc gia nhập Công đoàn cơ sở là nguyên tắc tự nguyện tuyệt đối của người lao động. Sự tôn trọng của Công ty là bình đẳng.",
      icon: "ShieldAlert"
    },
    {
      question: "Mức đóng góp Đoàn phí 0.5% được sử dụng để làm gì?",
      answer: "95% nguồn thu của Công đoàn được phân bổ trực tiếp cho các sự kiện của chính Công nhân viên lao động (Thăm ốm, hiếu hỷ, sinh hoạt tập thể, quà sinh nhật, tết thiếu nhi, v.v.). Chỉ 5% nộp về cấp trên để duy trì cơ quan.",
      icon: "CircleDollarSign"
    },
    {
      question: "Ban Giám đốc (BOD) Công ty có cắt giảm bớt phúc lợi riêng không?",
      answer: "BOD khẳng định: Cam kết duy trì 100% tài chính và nguồn năng năng để đảm bảo chất lượng đãi ngộ vượt cấp như hiện hữu.",
      icon: "HeartHandshake"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none pb-20">
      
      {/* Decorative subtle header background */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-rose-950/15 via-slate-900/0 to-slate-950/0 pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 w-full relative z-10 flex-1 space-y-8">
        
        {/* BRAND HEADER BAR */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3">
            {/* National Vietnamese Trade Union Crest Graphic Styling */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/10">
              <Landmark className="w-6 h-6 text-slate-900 fill-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-500/10 uppercase tracking-widest">
                  VIETNAM TRADE UNION
                </span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  KỊCH BẢN TRUYỀN THÔNG 2026
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                Kịch Bản Video Truyền Thông Nội Bộ Công Đoàn
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold rounded-xl text-xs transition duration-200 cursor-pointer shadow-lg shadow-rose-600/15 border border-rose-500/20 active:scale-95"
            >
              <FileDown className="w-4 h-4" />
              <span>Kết xuất Video & Tài liệu (.md)</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE LAYOUT GRID */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: PLAYER AND DETAILS (COLSPAN 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* High-Fidelity Multimedia Player */}
            <VideoPlayer 
              currentScene={activeScene}
              currentTime={currentTime}
              settings={settings}
            />

            {/* Comprehensive Playback Timeline and Controls */}
            <TimelineControl 
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
              totalTime={totalDuration}
              scenes={scenes}
              settings={settings}
              updateSettings={updateSettings}
              onJumpToScene={handleJumpToScene}
            />

            {/* Quick Interactive Tooltip guide for managers */}
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 flex gap-3.5 items-start">
              <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 text-xs">
                <h5 className="font-semibold text-slate-200">Mẹo Nhỏ Biên Tập Cho HR & Admin</h5>
                <p className="text-slate-400 leading-relaxed">
                  Để ghi kích giọng thuyết minh hoàn hảo hoặc xuất ra video, hãy cài đặt thuộc tính <b>Thuyết minh (TTS)</b> bật lên. Khi chuyển đổi phân cảnh, ứng dụng sẽ giả lập giọng thuyết minh Tiếng Việt tương khớp với mốc giây. Bạn có thể sử dụng nút <b>Kịch Bản Gốc</b> ở thanh bên phải bất kỳ lúc nào để cài đặt cấu hình về mặc định.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: INTERACTIVE EDITOR PANEL (COLSPAN 5) */}
          <div className="lg:col-span-5 h-full">
            <ScriptEditor 
              scenes={scenes}
              setScenes={setScenes}
              onRestoreDefaults={handleRestoreDefaults}
              onJumpToScene={handleJumpToScene}
              activeSceneId={activeScene.id}
            />
          </div>

        </main>

        {/* BOTTOM ACCORDIONS & RESOURCES: INTUITIVE HR COMPANION VIEW */}
        <section className="border-t border-slate-850 pt-8 mt-4 space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-white text-lg">Cẩm Nang Truyền Thông & Sổ Tay Hỏi Đáp Trực Quan</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {manualQAItems.map((item, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  activeQAIndex === idx
                    ? 'bg-slate-900 border-yellow-500/50 shadow-md ring-1 ring-yellow-500/20'
                    : 'bg-slate-900/30 border-slate-800/50 hover:border-slate-800/90'
                }`}
                onClick={() => setActiveQAIndex(activeQAIndex === idx ? null : idx)}
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 bg-yellow-500/10 text-yellow-400 rounded flex items-center justify-center text-xs font-bold font-mono mt-0.5 shrink-0">
                    Q
                  </span>
                  <div className="space-y-2">
                    <h5 className="text-sm font-semibold text-slate-100 leading-snug">
                      {item.question}
                    </h5>
                    {activeQAIndex === idx ? (
                      <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800 whitespace-pre-wrap animate-fadeIn">
                        {item.answer}
                      </p>
                    ) : (
                      <span className="inline-block text-[10px] text-amber-400 hover:underline">
                        Nhấp để xem câu trả lời tư vấn của Luật sư &rarr;
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Legal Reference Section */}
          <div className="bg-gradient-to-r from-red-950/20 via-slate-900 to-amber-950/10 p-4 rounded-2xl border border-rose-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Landmark className="w-10 h-10 text-rose-500 shrink-0" />
              <div>
                <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
                  QUY CHẾ PHÁP CHẾ DOANH NGHIỆP TRUNG ƯƠNG
                </p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Hiểu rõ về công đoàn chính quy giúp người lao động và doanh nghiệp đồng hành bền vững, bảo trợ tối đa luật an sinh xã hội Việt Nam năm 2026.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-amber-400 whitespace-nowrap bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Điều lệ Công đoàn Việt Nam khóa XIII
              </span>
            </div>
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-900 mt-16 py-6 bg-slate-950/60 z-30 relative justify-center text-center">
        <p className="text-xs text-slate-500 leading-relaxed max-w-xl mx-auto">
          Ứng dụng thiết kế và phân phối video mẫu chính thức. Được cung cấp bởi <b>Google AI Studio Build</b>.<br />
          Sở hữu trí tuệ bản quyền thuộc về Ban Truyền Thông Nội Bộ & Công Đoàn Doanh Nghiệp Việt Nam © 2026.
        </p>
      </footer>

      {/* Export Modal UI */}
      <ExportModal 
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        scenes={scenes}
        settings={settings}
      />

    </div>
  );
}

