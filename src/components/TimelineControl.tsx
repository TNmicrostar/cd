import React from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Monitor, Smartphone,
  HelpCircle, MonitorPlay, Sparkles, Sliders, ChevronLeft, ChevronRight, Speech
} from 'lucide-react';
import { Scene, VideoSettings } from '../types';

interface TimelineControlProps {
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  totalTime: number;
  scenes: Scene[];
  settings: VideoSettings;
  updateSettings: (newSettings: Partial<VideoSettings>) => void;
  onJumpToScene: (sceneId: number) => void;
}

export const TimelineControl: React.FC<TimelineControlProps> = ({
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  totalTime,
  scenes,
  settings,
  updateSettings,
  onJumpToScene
}) => {
  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}.${ms}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCurrentTime(value);
  };

  const currentSceneIdx = scenes.findIndex(s => currentTime >= s.start && currentTime <= s.end);
  const activeScene = scenes[currentSceneIdx !== -1 ? currentSceneIdx : 0];

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl">
      {/* Time & Title Track Display */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Đang phác thảo âm cảnh</span>
          <h4 className="text-sm font-semibold text-white line-clamp-1">
            Cảnh {activeScene?.id || 1}: {activeScene?.title || ""}
          </h4>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="font-mono text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800/80">
            <span className="text-cyan-400 font-bold">{formatTime(currentTime)}</span>
            <span className="text-slate-600 px-1">/</span>
            <span>{formatTime(totalTime)}</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded font-semibold border border-rose-500/20 uppercase tracking-widest">
            60 giây
          </span>
        </div>
      </div>

      {/* Main Interactive Seek Bar Track with Clickable Keyframes */}
      <div className="relative mb-5 pt-3">
        {/* Clickable Keyframe Anchors */}
        <div className="absolute inset-x-0 top-0 flex justify-between px-0.5 pointer-events-none">
          {scenes.map((scene) => {
            const isPassed = currentTime >= scene.start;
            const isActive = currentTime >= scene.start && currentTime < scene.end;
            const percentPosition = (scene.start / totalTime) * 100;
            return (
              <button
                key={scene.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onJumpToScene(scene.id);
                }}
                className="absolute transform -translate-x-1/2 pointer-events-auto group focus:outline-none"
                style={{ left: `${percentPosition}%` }}
                title={`Cảnh ${scene.id}: ${scene.title}`}
              >
                <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  isActive 
                    ? 'bg-rose-500 border-white scale-125 shadow-lg shadow-rose-500/50' 
                    : isPassed 
                      ? 'bg-emerald-500 border-emerald-600 scale-100' 
                      : 'bg-slate-700 border-slate-600 scale-90 hover:scale-105'
                }`} />
                {/* Floating scene badge info on hover */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-5 left-1/2 transform -translate-x-1/2 bg-slate-950 text-slate-200 border border-slate-800 text-[10px] py-1 px-2.5 rounded-md whitespace-nowrap z-50 pointer-events-none shadow-lg">
                  Cảnh {scene.id}: {scene.start}s - {scene.end}s
                </div>
              </button>
            );
          })}
          {/* End marker */}
          <div className="absolute right-0 transform translate-x-1/2">
            <div className={`w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-500`} />
          </div>
        </div>

        {/* Sliders track */}
        <input
          type="range"
          min="0"
          max={totalTime}
          step="0.05"
          value={currentTime}
          onChange={handleSeekChange}
          className="w-full h-2 bg-slate-950 rounded-full appearance-none cursor-pointer accent-rose-500 outline-none border border-slate-800 focus:accent-rose-400"
        />
      </div>

      {/* Control Buttons Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/60 pt-4">
        {/* Left: Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isPlaying 
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' 
                : 'bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-600/30'
            }`}
            title={isPlaying ? "Tạm dừng phát" : "Phát thử video"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current text-slate-950" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => {
              setCurrentTime(0);
              setIsPlaying(false);
            }}
            className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center transition"
            title="Quay lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-full px-1.5 py-1">
            {[1.0, 1.5, 2.0].map((speed) => (
              <button
                key={speed}
                onClick={() => updateSettings({ playbackSpeed: speed })}
                className={`text-[10px] font-mono px-2 py-1 rounded-full font-bold transition-all ${
                  settings.playbackSpeed === speed 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Middle: Aspect Ratio Toggle & Options */}
        <div className="flex items-center gap-2">
          {/* Aspect Ratio Landscape (16:9) vs Portrait (9:16) */}
          <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-lg">
            <button
              onClick={() => updateSettings({ aspectRatio: '16:9' })}
              className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded transition ${
                settings.aspectRatio === '16:9' 
                  ? 'bg-rose-600 text-white font-medium shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Phù hợp TV, Màn hình lớn"
            >
              <Monitor className="w-3.5 h-3.5 inline-block" />
              <span>Ngang 16:9</span>
            </button>
            <button
              onClick={() => updateSettings({ aspectRatio: '9:16' })}
              className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded transition ${
                settings.aspectRatio === '9:16' 
                  ? 'bg-rose-600 text-white font-medium shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Phù hợp TikTok, Reels, Shorts"
            >
              <Smartphone className="w-3.5 h-3.5 inline-block" />
              <span>Dọc 9:16</span>
            </button>
          </div>
        </div>

        {/* Right: Audio options & Narrator Settings */}
        <div className="flex items-center gap-2">
          {/* Synthesizer audio track toggle */}
          <button
            onClick={() => updateSettings({ useSFXChords: !settings.useSFXChords })}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition ${
              settings.useSFXChords
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-sm'
                : 'bg-slate-950 text-slate-500 border-slate-800/60'
            }`}
            title="Phát nhạc đệm tự động theo mạch cảm xúc"
          >
            {settings.useSFXChords ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">Nhạc đệm AI</span>
          </button>

          {/* Voice narrator speech synthesis */}
          <button
            onClick={() => updateSettings({ useNarratorTTS: !settings.useNarratorTTS })}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition ${
              settings.useNarratorTTS
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-slate-950 text-slate-500 border-slate-800/60'
            }`}
            title="Đọc giọng thuyết minh tự động khi chuyển slide"
          >
            <Speech className="w-4 h-4" />
            <span className="hidden sm:inline">Thuyết minh (TTS)</span>
            {settings.useNarratorTTS && (
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
