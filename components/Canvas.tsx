
import React, { useRef, useEffect, useState } from 'react';
import { Palette, Eraser, Sparkles, Save, Trash2, Download } from 'lucide-react';
import { applyAIEffect } from '../services/geminiService';

interface CanvasProps {
  onSave: (imageUrl: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({ onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ff0000');
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('Add demonic wings and a metallic texture');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = isEraser ? '#1e293b' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleAIAction = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsProcessing(true);
    try {
      const base64 = canvas.toDataURL('image/png');
      const result = await applyAIEffect(base64, aiPrompt);
      if (result) {
        const img = new Image();
        img.onload = () => {
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
        };
        img.src = result;
      }
    } catch (error) {
      console.error("AI Effect Failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto p-4 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-800 rounded-lg">
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              setIsEraser(false);
            }}
            className="w-10 h-10 bg-transparent border-none cursor-pointer"
          />
          <div className="flex gap-2">
            {[1, 5, 10, 20].map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={`w-8 h-8 rounded-full border border-slate-600 flex items-center justify-center transition ${brushSize === size ? 'bg-red-600' : 'bg-slate-700 hover:bg-slate-600'}`}
              >
                <div className="bg-white rounded-full" style={{ width: size, height: size }}></div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`p-2 rounded-lg transition ${isEraser ? 'bg-red-600' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            <Eraser size={20} />
          </button>
          <button
            onClick={clearCanvas}
            className="p-2 rounded-lg bg-slate-700 hover:bg-red-900 transition text-red-400"
          >
            <Trash2 size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="AI Effect Prompt..."
            className="px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 w-48 md:w-64"
          />
          <button
            onClick={handleAIAction}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg transition disabled:opacity-50"
          >
            <Sparkles size={20} />
            {isProcessing ? 'Forging...' : 'AI Mutation'}
          </button>
          <button
            onClick={() => onSave(canvasRef.current?.toDataURL('image/png') || '')}
            className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg transition"
          >
            <Save size={20} />
            Publish Art
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
        className="w-full h-auto cursor-crosshair bg-slate-800 rounded-lg border-2 border-slate-700"
      />
      
      <div className="flex justify-between items-center text-xs text-slate-400 italic px-2">
        <span>* Canvas set to High Resolution (1000x600)</span>
        <span>Drag to paint your metal vision</span>
      </div>
    </div>
  );
};

export default Canvas;
