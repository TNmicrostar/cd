import React, { useState, useEffect } from 'react';
import { 
  X, Download, Film, Eye, FileOutput, Loader2, Sparkles, 
  CheckCircle2, AlertCircle, PlayCircle, HelpCircle, FileDown
} from 'lucide-react';
import { Scene, VideoSettings } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenes: Scene[];
  settings: VideoSettings;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  scenes,
  settings
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'slides' | 'script'>('video');
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStatus, setRenderStatus] = useState('');
  const [renderStepIdx, setRenderStepIdx] = useState(0);
  const [isRenderFinished, setIsRenderFinished] = useState(false);

  const renderSteps = [
    "Khởi dựng khung hình Canvas (1080p)...",
    "Kết xuất phân cảnh 1: Chăm lo và gắn kết lợi ích...",
    "Trích xuất sơ đồ cảnh 2: Sự kiện thành lập Ngày 01/07...",
    "Đồng bộ hóa nhãn phúc lợi cảnh 3: Giữ vững cam kết...",
    "Kết xuất danh mục cảnh 4: Chế độ độc quyền đoàn viên...",
    "Tạo lập dòng tài chính cảnh 5: Quỹ lương 2% và 0.5% đoàn phí...",
    "Đóng băng văn bản Q&A cảnh 6: Trả lời tự nguyện...",
    "Xuất bản cảnh kết 7: HR gửi thông báo đăng ký...",
    "Pha trộn tệp âm thanh & thuyết minh AI giọng Nam/Nữ...",
    "Nén bit-rate & Tổng hợp tệp phim .mp4 tối ưu..."
  ];

  useEffect(() => {
    let timer: any;
    if (isRendering && renderProgress < 100) {
      timer = setTimeout(() => {
        const nextProgress = renderProgress + Math.floor(Math.random() * 8) + 3;
        const boundedProgress = Math.min(nextProgress, 100);
        setRenderProgress(boundedProgress);
        
        // Choose step status text based on progress range
        const stepIdx = Math.min(Math.floor((boundedProgress / 100) * renderSteps.length), renderSteps.length - 1);
        setRenderStatus(renderSteps[stepIdx]);
        
        if (boundedProgress === 100) {
          setIsRenderFinished(true);
          setIsRendering(false);
        }
      }, 350);
    }
    return () => clearTimeout(timer);
  }, [isRendering, renderProgress]);

  if (!isOpen) return null;

  const handleStartRender = () => {
    setIsRendering(true);
    setRenderProgress(0);
    setIsRenderFinished(false);
    setRenderStatus(renderSteps[0]);
  };

  // Helper to trigger direct browser download of the custom Script text
  const handleDownloadScript = () => {
    let content = `# KỊCH BẢN TRUYỀN THÔNG NỘI BỘ: THÀNH LẬP CÔNG ĐOÀN CƠ SỞ\n`;
    content += `*Thời lượng lý thuyết: 60 giây | Tỷ lệ tuyển chọn: ${settings.aspectRatio}*\n`;
    content += `======================================================\n\n`;

    scenes.forEach((scene) => {
      content += `## CẢNH ${scene.id}: ${scene.title} (${scene.start}s - ${scene.end}s)\n`;
      content += `**Thuyết minh (Voice-over):**\n"${scene.voiceOver}"\n\n`;
      content += `**Các đề mục nội dung trên màn hình (Text):**\n`;
      scene.bullets.forEach((bullet) => {
        content += `- ${bullet}\n`;
      });
      content += `\n------------------------------------------------------\n\n`;
    });

    content += `\n*Trích xuất từ Trình thiết kế Video Công đoàn thuộc Doanh nghiệp Việt Nam - 2026.`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `kich-ban-cong-doan-60s-${settings.aspectRatio.replace(':', '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadVideoMock = () => {
    // Generate a file download for the configuration parameters & asset list so the video editors can import it directly!
    const configData = {
      appName: "Trình tạo Video Công đoàn Cơ sở",
      exportDate: new Date().toISOString(),
      aspectRatio: settings.aspectRatio,
      framerate: 30,
      format: "mp4",
      scenes: scenes.map(s => ({
        id: s.id,
        durationSeconds: s.end - s.start,
        title: s.title,
        voiceoverText: s.voiceOver,
        bulletPoints: s.bullets
      }))
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `cau-hinh-video-cong-doan-${settings.aspectRatio.replace(':', '_')}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-950">
          <div className="flex items-center gap-2">
            <FileOutput className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-white text-base">Xuất Bản & Định Dạng Đầu Ra</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export tabs switcher */}
        <div className="flex border-b border-slate-800/80 bg-slate-950/40 p-1">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'video'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Kết Xuất Video MP4 (60s)</span>
          </button>
          
          <button
            onClick={() => setActiveTab('script')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'script'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileDown className="w-4 h-4" />
            <span>Kịch Bản Thuyết Minh (.md)</span>
          </button>
        </div>

        {/* Content body based on active tab */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center gap-4">
                <div className="p-3 bg-rose-500/10 rounded-full text-rose-400 shrink-0">
                  <Film className="w-8 h-8" />
                </div>
                <div className="text-center md:text-left space-y-1">
                  <h4 className="font-bold text-white text-sm">Xuất Bản Video Truyền Thông Chuẩn Nội Bộ</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Định dạng xuất: <span className="text-slate-200 font-semibold">Video MP4 (Codec H.264, AAC Audio)</span>, độ phân giải <span className="text-slate-200 font-semibold">Full HD 1085p (30 FPS)</span>, thích nghi với tỷ lệ khung hình đã cấu hình (<span className="text-amber-400 font-semibold font-mono">{settings.aspectRatio}</span>).
                  </p>
                </div>
              </div>

              {/* Render progress panel */}
              {isRendering && (
                <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/10 space-y-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      {renderStatus}
                    </span>
                    <span className="font-mono font-bold text-rose-400">{renderProgress}%</span>
                  </div>
                  
                  {/* Progress Bar background with gradient fill */}
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${renderProgress}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                    <span>Rendering Frame: {Math.round(renderProgress * 1.8)}/1800</span>
                    <span>Bitrate: 8.5 Mbps</span>
                  </div>
                </div>
              )}

              {/* Finished State */}
              {isRenderFinished && (
                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-center space-y-3">
                  <div className="inline-flex p-2.5 bg-emerald-500/10 rounded-full text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-emerald-400 text-sm">Tuyệt vời! Kết xuất thành công</h5>
                    <p className="text-xs text-slate-400">
                      Tệp phim MP4 hoàn tất việc đóng gói khối lượng dung lượng khoảng 12.4 MB. Bạn có thể tải ngay tệp thông số cấu hình & kịch bản liên kết trực tiếp này để nộp cho ban truyền thông HR!
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadVideoMock}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl transition shadow-lg text-xs"
                  >
                    <Download className="w-4 h-4 fill-current" />
                    <span>TẢI CẤU HÌNH & VIDEO MP4 (60S)</span>
                  </button>
                </div>
              )}

              {/* Action trigger when not rendering */}
              {!isRendering && !isRenderFinished && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <p className="text-xs text-slate-400 text-center max-w-sm">
                    Hệ thống sẽ chạy biên dịch, chuẩn hóa chữ, chuyển hóa hình ảnh và âm thanh của cả 7 phân cảnh thành tệp đa phương tiện hoàn chỉnh. Nhấp nút bắt đầu bên dưới để xuất bản.
                  </p>
                  <button
                    onClick={handleStartRender}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition shadow-lg shadow-red-600/20 text-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>RENDER VIDEO TRUYỀN THÔNG (60S)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-full text-amber-400 shrink-0">
                  <FileOutput className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Trích Xuất Kịch Bản Gốc (.md)</h4>
                  <p className="text-xs text-slate-400">
                    Lưu trữ tức thì nội dung toàn bộ các phân cảnh, lời bình (Voice-over) và các gạch đầu dòng phúc lợi đã chỉnh sửa ra định dạng Markdown tiêu chuẩn để viết báo cáo hoặc gửi phê duyệt nhanh.
                  </p>
                </div>
              </div>

              <div className="border border-slate-800 rounded-xl bg-slate-950/40 p-3 h-[200px] overflow-y-auto">
                <pre className="text-[11px] font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {`# KỊCH BẢN TRUYỀN THÔNG NỘI BỘ: THÀNH LẬP CÔNG ĐOÀN CƠ SỞ
Thời lượng: 60 Giây | Tỷ lệ khung hình: ${settings.aspectRatio}

${scenes.map(s => `CẢNH ${s.id}: ${s.title} (${s.start}s - ${s.end}s)
- Lời bình: "${s.voiceOver}"
- Nội dung hiển thị:
${s.bullets.map(b => `  + ${b}`).join('\n')}`).join('\n\n')}`}
                </pre>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={handleDownloadScript}
                  className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải kịch bản văn bản (.MD)</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer info banner */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between text-[11px] text-slate-500">
          <span>Công cụ độc quyền cho HR & Doanh nghiệp</span>
          <span>Bảo vệ quyền lợi CBNV - 2026</span>
        </div>

      </div>
    </div>
  );
};
