import React, { useState } from 'react';
import { 
  FileText, Plus, RotateCcw, Save, Trash2, 
  HelpCircle, ChevronDown, ChevronUp, Sparkles, 
  ListPlus, Clock, MessageSquare, PlusCircle
} from 'lucide-react';
import { Scene } from '../types';

interface ScriptEditorProps {
  scenes: Scene[];
  setScenes: (scenes: Scene[]) => void;
  onRestoreDefaults: () => void;
  onJumpToScene: (sceneId: number) => void;
  activeSceneId: number;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  scenes,
  setScenes,
  onRestoreDefaults,
  onJumpToScene,
  activeSceneId
}) => {
  const [expandedSceneId, setExpandedSceneId] = useState<number | null>(1);

  const handleSceneChange = (id: number, key: keyof Scene, value: any) => {
    const updated = scenes.map((scene) => {
      if (scene.id === id) {
        return { ...scene, [key]: value };
      }
      return scene;
    });
    setScenes(updated);
  };

  const handleBulletsChange = (id: number, textValue: string) => {
    // Split lines, filter out empty lines, and clean whitespace
    const bulletList = textValue.split('\n').filter(line => line.trim() !== '');
    handleSceneChange(id, 'bullets', bulletList);
  };

  const handleToggleAccordion = (id: number) => {
    setExpandedSceneId(expandedSceneId === id ? null : id);
    onJumpToScene(id);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Panel Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-rose-500" />
          <h3 className="font-bold text-white text-base">Kịch Bản & Biên Tập Phân Cảnh</h3>
        </div>
        <button
          onClick={onRestoreDefaults}
          className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg hover:text-white transition font-medium"
          title="Khôi phục về nội dung kịch bản gốc của Ban Giám Đốc"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Kịch Bản Gốc</span>
        </button>
      </div>

      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Nhấp chọn một phân cảnh dưới đây để chỉnh sửa trực quan nội dung thuyết minh, tiêu đề thẻ và các chế độ đãi ngộ. Tiến trình video sẽ lập tức cập nhật thời gian thực.
      </p>

      {/* Accordion Scenes Grid */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[520px]">
        {scenes.map((scene, idx) => {
          const isExpanded = expandedSceneId === scene.id;
          const isActive = activeSceneId === scene.id;
          
          return (
            <div 
              key={scene.id}
              className={`rounded-xl transition border ${
                isActive 
                  ? 'border-rose-500 bg-slate-950/60 shadow-md shadow-rose-500/5' 
                  : 'border-slate-800 bg-slate-900/40'
              }`}
            >
              {/* Accordion Header */}
              <button
                onClick={() => handleToggleAccordion(scene.id)}
                className="w-full text-left p-3 flex items-center justify-between gap-2 focus:outline-none"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  <span className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center shrink-0 ${
                    isActive 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {scene.id}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${isActive ? 'text-rose-400' : 'text-slate-200'}`}>
                      {scene.title || `Phân cảnh ${scene.id}`}
                    </p>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                      Thời lượng: {scene.start}s &rarr; {scene.end}s ({scene.end - scene.start} giây)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </button>

              {/* Accordion Content Body */}
              {isExpanded && (
                <div className="p-3 border-t border-slate-850 bg-slate-950/40 rounded-b-xl space-y-3.5">
                  {/* Title editor */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1 font-bold">
                      Tiêu đề phân cảnh
                    </label>
                    <input
                      type="text"
                      value={scene.title}
                      onChange={(e) => handleSceneChange(scene.id, 'title', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20"
                      placeholder="Nhập tiêu đề trình chiếu..."
                    />
                  </div>

                  {/* Range timing details */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>Bắt đầu (s)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={scene.start}
                        onChange={(e) => handleSceneChange(scene.id, 'start', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>Kết thúc (s)</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={scene.end}
                        onChange={(e) => handleSceneChange(scene.id, 'end', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  {/* Bullet points textarea */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1 font-bold flex items-center gap-1 justify-between">
                      <span className="flex items-center gap-1">
                        <ListPlus className="w-3.5 h-3.5 text-slate-500" />
                        <span>Các gạch đầu dòng phúc lợi</span>
                      </span>
                      <span className="text-[9px] text-slate-500 italic uppercase">1 dòng = 1 mục</span>
                    </label>
                    <textarea
                      rows={4}
                      value={scene.bullets.join('\n')}
                      onChange={(e) => handleBulletsChange(scene.id, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-rose-500 leading-relaxed"
                      placeholder="Gõ mỗi mục phúc lợi ở một dòng mới..."
                    />
                  </div>

                  {/* Voice Over script */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1 font-bold flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>Lời bình Thuyết minh (Voice-over)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={scene.voiceOver}
                      onChange={(e) => handleSceneChange(scene.id, 'voiceOver', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-rose-500 leading-relaxed"
                      placeholder="Nhập nội dung lời bình sẽ hiển thị và tự thuyết minh bằng giọng nói..."
                    />
                  </div>

                  {/* Illustration mapping preset helper */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1 font-bold">
                      Ảnh Minh Họa / Sơ đồ
                    </label>
                    <select
                      value={scene.illustrationType}
                      onChange={(e) => handleSceneChange(scene.id, 'illustrationType', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
                    >
                      <option value="activities">Trại Hè & Gắn Kết (Team Trip)</option>
                      <option value="handshake">Hợp tác & Thành lập (Handshake)</option>
                      <option value="benefits">Đãi ngộ & Quà tặng (Welfares)</option>
                      <option value="financial">Sơ đồ cơ cấu tài chính (Financing)</option>
                      <option value="qa">Hỏi đáp Q&A Công đoàn (Q&A)</option>
                      <option value="closing">Cảnh kết: Tập thể gắn kết (Alliance)</option>
                    </select>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mini Quick statistics metrics */}
      <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Thời lượng: 60s tổng cộng</span>
        </span>
        <span className="font-mono text-slate-500">
          {scenes.reduce((acc, scene) => acc + scene.bullets.length, 0)} phúc lợi được biên tập
        </span>
      </div>
    </div>
  );
};
