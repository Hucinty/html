
import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon, ReplaceIcon, TrashIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File | null) => void;
  imagePreview: string | null;
  isProcessing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imagePreview, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };
  
  const handleRemove = () => {
    onImageUpload(null);
    if (inputRef.current) {
        inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
        {imagePreview ? (
            <div className="w-full p-4 border border-[var(--color-border)] bg-[var(--color-border-subtle)] flex flex-col items-center transition-colors duration-300 rounded-[var(--border-radius)] shadow-[var(--shadow)]">
                <p className="text-lg font-medium text-[var(--color-text-primary)] mb-4">Your Uploaded Image:</p>
                <img src={imagePreview} alt="Preview" className="max-w-full max-h-96 border border-[var(--color-border)] rounded-[var(--border-radius)]" />
                <div className="flex items-center space-x-4 mt-4">
                    <button 
                        onClick={onButtonClick} 
                        disabled={isProcessing}
                        className="flex items-center space-x-2 text-sm text-[var(--color-button-primary-fg)] bg-[var(--color-button-primary-bg)] hover:opacity-90 transition-opacity py-2 px-4 rounded-[var(--border-radius)] shadow-[var(--shadow)]"
                    >
                        <ReplaceIcon className="w-4 h-4" />
                        <span>Change Image</span>
                    </button>
                    <button 
                        onClick={handleRemove} 
                        disabled={isProcessing}
                        className="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors py-2 px-4 rounded-[var(--border-radius)] hover:bg-[var(--color-interactive-accent-bg)]"
                    >
                        <TrashIcon className="w-4 h-4" />
                        <span>Remove</span>
                    </button>
                </div>
            </div>
        ) : (
             <form 
                className={`w-full p-8 border border-dashed rounded-[var(--border-radius)] text-center transition-all duration-300 border-[var(--color-border)] hover:border-[var(--color-text-accent)] hover:bg-[var(--color-interactive-accent-bg)] shadow-[var(--shadow)] ${dragActive ? 'border-[var(--color-text-accent)] bg-[var(--color-interactive-accent-bg)]' : ''}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onSubmit={(e) => e.preventDefault()}
                >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleChange}
                    disabled={isProcessing}
                />
                <div className="flex flex-col items-center justify-center space-y-4">
                    <UploadIcon className="w-12 h-12 text-[var(--color-text-secondary)]" />
                    <p className="text-[var(--color-text-primary)] font-medium">
                    Drag & drop your image here or{' '}
                    <button type="button" onClick={onButtonClick} disabled={isProcessing} className="font-semibold text-[var(--color-text-accent)] hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] focus:ring-[var(--color-border)]">
                        click to browse
                    </button>
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">PNG, JPG, or WEBP supported</p>
                </div>
            </form>
        )}
    </div>
  );
};
