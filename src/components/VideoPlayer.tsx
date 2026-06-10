import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Gift, ShieldAlert, Award, Activity, Heart,
  Briefcase, Calendar, Coffee, Dumbbell, Music, Flame,
  TrendingUp, CircleDollarSign, CheckCircle2, AlertCircle,
  HelpCircle, Sparkles, Building2, ChevronRight, Info
} from 'lucide-react';
import { Scene, VideoSettings } from '../types';
import { IMAGE_MAP } from '../data';

interface VideoPlayerProps {
  currentScene: Scene;
  currentTime: number;
  settings: VideoSettings;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  currentScene, 
  currentTime, 
  settings 
}) => {
  const { aspectRatio } = settings;

  // Calculate current progress relative to the scene's duration
  const sceneDuration = currentScene.end - currentScene.start;
  const currentSceneTime = currentTime - currentScene.start;
  const sceneProgressPercent = Math.min((currentSceneTime / sceneDuration) * 100, 100);

  // Helper inside Scenes to check if bullet items should stagger-in based on time
  const visibleBulletsCount = useMemo(() => {
    const ratio = currentSceneTime / sceneDuration;
    const bulletsCount = currentScene.bullets.length;
    // Stagger bullet appearance across the scene duration
    const count = Math.ceil(ratio * (bulletsCount + 1));
    return Math.min(Math.max(count, 1), bulletsCount);
  }, [currentSceneTime, sceneDuration, currentScene.bullets.length]);

  // Determine which visual asset to render based on illustrationType
  const activeImage = IMAGE_MAP[currentScene.illustrationType as keyof typeof IMAGE_MAP] || IMAGE_MAP.activities;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Player Frame Container */}
      <div 
        id="video-canvas-container"
        className={`relative overflow-hidden bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl transition-all duration-500 ease-in-out ${
          aspectRatio === '16:9' 
            ? 'w-full aspect-video' 
            : 'w-[360px] aspect-[9/16] max-w-full'
        }`}
      >
        {/* Cinematic Backdrop Accent */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/20 z-0 pointer-events-none" />

        {/* Dynamic Theme Color Accent Ring in Corner */}
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none z-0" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none z-0" />

        {/* Visual Frame Render Area */}
        <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 z-10 select-none">
          
          {/* Header Bar (Watermark and Scene Tracker) */}
          <div className="flex items-center justify-between w-full border-b border-slate-800/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <p className="text-xs font-mono tracking-widest text-slate-400 font-semibold uppercase">
                TUYÊN TRUYỀN NỘI BỘ
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400 border border-cyan-500/20">
              <span>CẢNH {currentScene.id}/7</span>
              <span className="text-slate-600">|</span>
              <span>{currentTime.toFixed(1)}s</span>
            </div>
          </div>

          {/* Main Visual Slide Content */}
          <div className="flex-1 my-4 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full h-full flex flex-col justify-center"
              >
                {/* Condition: Landscape Layout vs Portrait Layout */}
                {aspectRatio === '16:9' ? (
                  // LANDSCAPE (16:9) MULTI-COLUMN LAYOUT
                  <div className="grid grid-cols-12 gap-6 items-center h-full">
                    {/* Left Column: Text & Bullets */}
                    <div className="col-span-7 flex flex-col justify-center pr-2">
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-1 text-xs font-medium text-amber-400 flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Chuyên Đề Công Đoàn Cơ Sở Co-Working</span>
                      </motion.div>
                      
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-4">
                        {currentScene.title}
                      </h2>

                      {/* Display Bullet List */}
                      <div className="space-y-2 max-h-[220px] overflow-y-auto">
                        {currentScene.bullets.map((bullet, idx) => {
                          const isQA = currentScene.illustrationType === 'qa';
                          const isVisible = idx < visibleBulletsCount;
                          
                          return (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -15 }}
                              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0.15 }}
                              className={`flex items-start gap-2 text-sm text-slate-300 p-2 rounded-lg transition-all duration-300 ${
                                isVisible ? 'bg-slate-900/40 border border-slate-800/40' : 'bg-transparent border-transparent'
                              }`}
                            >
                              {isQA ? (
                                bullet.startsWith("Q:") ? (
                                  <span className="font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded text-xs mt-0.5 shrink-0">HỎI</span>
                                ) : (
                                  <span className="font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs mt-0.5 shrink-0">ĐÁP</span>
                                )
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              )}
                              
                              <span className="leading-relaxed whitespace-pre-line">{bullet}</span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Column: Illustration Graphics / Dynamic Infographics */}
                    <div className="col-span-5 h-full flex items-center justify-center relative">
                      {currentScene.id === 5 ? (
                        /* Scene 5 custom Interactive Financial Donut/Bar Diagram */
                        <div className="w-full bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
                          <p className="text-xs font-mono text-slate-400 text-center uppercase tracking-wider mb-1">
                            Bản đồ tài chính công đoàn
                          </p>
                          
                          <div className="space-y-3">
                            {/* Doanh nghiệp 2% */}
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="font-semibold text-rose-400">🏢 Doanh nghiệp (Kinh phí)</span>
                                <span className="font-bold text-rose-400">2.0% quỹ lương</span>
                              </div>
                              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-rose-500/20">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: '80%' }}
                                  transition={{ duration: 1 }}
                                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500"
                                />
                              </div>
                            </div>

                            {/* Người lao động 0.5% */}
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="font-semibold text-cyan-400">👤 Đoàn viên (Đoàn phí)</span>
                                <span className="font-bold text-cyan-400">0.5% lương</span>
                              </div>
                              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-cyan-500/20">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: '25%' }}
                                  transition={{ duration: 1 }}
                                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mt-2 p-2 bg-emerald-500/10 rounded border border-emerald-500/20 flex gap-2 items-center text-[11px] text-emerald-300">
                            <Info className="w-4 h-4 shrink-0 text-emerald-400" />
                            <span>BOD cam kết bổ sung thêm ngân sách duy trì 100% phúc lợi bền vững!</span>
                          </div>
                        </div>
                      ) : (
                        /* Standard visual illustration with image asset or icon placeholder */
                        <div className="relative group w-full aspect-square max-h-[220px] rounded-xl overflow-hidden border border-slate-800 shadow-lg bg-slate-900/40">
                          {activeImage ? (
                            <img 
                              src={activeImage} 
                              alt={currentScene.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-4 text-center">
                              <Building2 className="w-12 h-12 text-rose-500 mb-2" />
                              <span className="text-xs text-slate-400">Đồng Hành Phát Triển</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // PORTRAIT (9:16) ADAPTIVE STACKED LAYOUT
                  <div className="flex flex-col h-full justify-between gap-4 py-2">
                    
                    {/* Top: Visual illustration or custom block to fit vertical screen */}
                    <div className="w-full flex justify-center items-center">
                      {currentScene.id === 5 ? (
                        <div className="w-full bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                          <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-800/80 pb-1">
                            <span>TÀI CHÍNH CÔNG ĐOÀN</span>
                            <span className="text-emerald-400 font-bold">2.0% + 0.5%</span>
                          </div>
                          <div className="space-y-2 mt-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium text-rose-400">🏢 Cty đóng:</span>
                              <span className="font-bold">2.0% quỹ lương</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="font-medium text-cyan-400">👤 NLĐ đóng:</span>
                              <span className="font-bold">0.5% đoàn phí</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative group w-full aspect-[16/10] rounded-xl overflow-hidden border border-slate-800 shadow-md bg-slate-900/40">
                          {activeImage ? (
                            <img 
                              src={activeImage} 
                              alt={currentScene.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-center">
                              <Activity className="w-8 h-8 text-rose-500" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Middle: Custom short vertical layout for text */}
                    <div className="flex-1 flex flex-col justify-center py-2">
                      <div className="mb-1 text-[10px] font-semibold text-amber-400 tracking-wider flex items-center gap-1 uppercase">
                        <Sparkles className="w-3 h-3" />
                        <span>Truyền Thông Doanh Nghiệp</span>
                      </div>
                      
                      <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight mb-3">
                        {currentScene.title}
                      </h2>

                      {/* Display 3-4 key bullets to avoid vertical overflow in 9:16 portrait mode */}
                      <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
                        {currentScene.bullets.slice(0, 5).map((bullet, idx) => {
                          const isQA = currentScene.illustrationType === 'qa';
                          const isVisible = idx < visibleBulletsCount;
                          
                          return (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0.15 }}
                              className={`flex items-start gap-1.5 p-1 px-2 rounded text-xs text-slate-300 ${
                                isVisible ? 'bg-slate-900/40 border border-slate-800/40' : 'bg-transparent border-transparent'
                              }`}
                            >
                              {isQA ? (
                                bullet.startsWith("Q:") ? (
                                  <span className="font-bold text-amber-400 text-[9px] px-1 bg-amber-500/10 rounded mt-0.5 shrink-0">Q</span>
                                ) : (
                                  <span className="font-bold text-emerald-400 text-[9px] px-1 bg-emerald-500/10 rounded mt-0.5 shrink-0">A</span>
                                )
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                              )}
                              
                              <span className="leading-snug shrink whitespace-pre-line text-[11px] sm:text-xs text-slate-200">
                                {bullet.split('\n')[0] /* trim if multi-line QA view in tight mobile */}
                              </span>
                            </motion.div>
                          );
                        })}
                        {currentScene.bullets.length > 5 && (
                          <div className="text-[10px] text-slate-400 text-center py-0.5">
                            + {currentScene.bullets.length - 5} nội dung phúc lợi khác...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Bar: Captions / Subtitles with Voiceover Text */}
          <div className="border-t border-slate-800/60 pt-3 flex flex-col gap-2 z-20">
            {/* Visual audio voiceover narration bar */}
            <div className="flex items-center gap-3 bg-slate-950/80 px-3 py-2 rounded-xl border border-rose-500/15">
              <div className="flex gap-0.5 h-3 items-center w-6 shrink-0 justify-center">
                <span className="w-0.5 h-2 bg-rose-500 rounded animate-wave-bar" style={{ animationDelay: '0.1s' }} />
                <span className="w-0.5 h-3 bg-rose-500 rounded animate-wave-bar" style={{ animationDelay: '0.3s' }} />
                <span className="w-0.5 h-1 bg-rose-500 rounded animate-wave-bar" style={{ animationDelay: '0.5s' }} />
                <span className="w-0.5 h-2 bg-rose-500 rounded animate-wave-bar" style={{ animationDelay: '0.2s' }} />
              </div>
              <p className="text-xs italic text-slate-300 font-sans tracking-wide leading-relaxed line-clamp-2">
                &ldquo;{currentScene.voiceOver}&rdquo;
              </p>
            </div>

            {/* Bottom visual seek bar inside canvas for realistic look */}
            <div className="w-full bg-slate-800/40 h-1 rounded-full overflow-hidden mt-1 relative">
              <div 
                className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 h-full rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${sceneProgressPercent}%` }}
              />
            </div>
          </div>

        </div>

        {/* Video Overlays (Watermark and time metrics) */}
        <div className="absolute top-4 right-4 z-40 bg-slate-900/90 text-[10px] font-mono px-2 py-0.5 rounded text-white border border-slate-800 pointer-events-none flex items-center gap-1 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>PRO REVIEW</span>
        </div>
      </div>
    </div>
  );
};
