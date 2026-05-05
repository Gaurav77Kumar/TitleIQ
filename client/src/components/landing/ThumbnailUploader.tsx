import React, { useState, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

interface ThumbnailUploaderProps {
  onAnalyze: (base64: string, mimeType: string) => void;
  isLoading: boolean;
}

export const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({
  onAnalyze,
  isLoading,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);

    // Validate type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Please upload a JPG or PNG image.');
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Max size is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setError(null);
  };

  const submit = () => {
    if (!preview) return;
    const [header, data] = preview.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    onAnalyze(data, mimeType);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div
        className={clsx(
          'relative border-2 border-dashed rounded-3xl p-4 transition-all duration-300 text-center',
          dragActive ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' : 'border-slate-200 hover:border-indigo-300 bg-white/50 backdrop-blur-sm',
          preview ? 'border-none p-0 overflow-hidden shadow-2xl' : 'shadow-sm'
        )}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
      >
        {!preview ? (
          <label className="cursor-pointer flex flex-col items-center gap-6 py-12">
            <input
              type="file"
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={onChange}
              disabled={isLoading}
            />
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <Upload className="w-10 h-10" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 mb-1">
                Drop your thumbnail here
              </p>
              <p className="text-slate-500">
                or click to browse (JPG, PNG • max 5MB)
              </p>
            </div>
          </label>
        ) : (
          <div className="relative group aspect-video bg-slate-900 flex items-center justify-center">
            <img
              src={preview}
              alt="Thumbnail preview"
              className="w-full h-full object-contain"
            />
            {!isLoading && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={removeImage}
                  className="bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/30 transition-all transform hover:scale-110"
                  title="Remove image"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium text-center"
        >
          {error}
        </motion.div>
      )}

      {preview && !isLoading && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={submit}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-[0.98] text-lg uppercase tracking-wider"
        >
          Run AI Analysis
        </motion.button>
      )}

      {isLoading && (
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-100 rounded-full border-t-indigo-600 animate-spin" />
            <Loader2 className="w-8 h-8 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-slate-800 font-bold text-lg">AI is scanning composition...</p>
            <p className="text-slate-500 text-sm">Checking contrast, faces, and legibility</p>
          </div>
        </div>
      )}
    </div>
  );
};
