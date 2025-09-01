
import React, { useState, useCallback, useEffect } from 'react';
import { generateHtmlFromImage, generateHtmlFromText } from './services/geminiService';
import { type GeneratedCode } from './types';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { CodePreview } from './components/CodePreview';
import { LoadingSpinner, ImageIcon, TextIcon } from './components/icons';
import { Footer } from './components/Footer';
import { TextPromptInput } from './components/TextPromptInput';
import { StyleSelector } from './components/StyleSelector';
import { MoodSelector } from './components/MoodSelector';
import { TargetSelector } from './components/TargetSelector';
import { PageSelector } from './components/PageSelector';
import { moodThemes, styleThemes, type Theme } from './themes';

type Mode = 'image' | 'text';
type Target = 'web' | 'email';

function App(): React.ReactNode {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [textPrompt, setTextPrompt] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [mode, setMode] = useState<Mode>(() => {
    const savedMode = localStorage.getItem('appMode');
    return (savedMode === 'image' || savedMode === 'text') ? savedMode : 'image';
  });

  const [target, setTarget] = useState<Target>(() => {
    const savedTarget = localStorage.getItem('appTarget');
    return (savedTarget === 'web' || savedTarget === 'email') ? savedTarget : 'web';
  });
  
  const [style, setStyle] = useState<string>(() => {
    const savedStyle = localStorage.getItem('appStyle');
    return savedStyle || 'Minimalist';
  });

  const [mood, setMood] = useState<string>(() => {
    const savedMood = localStorage.getItem('appMood');
    return savedMood || 'Nostalgic';
  });

  const [numberOfPages, setNumberOfPages] = useState<number>(() => {
    const savedPages = localStorage.getItem('appNumberOfPages');
    return savedPages ? parseInt(savedPages, 10) : 1;
  });
  
  useEffect(() => {
    localStorage.setItem('appMode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('appTarget', target);
  }, [target]);
  
  useEffect(() => {
    localStorage.setItem('appNumberOfPages', numberOfPages.toString());
  }, [numberOfPages]);

  useEffect(() => {
    localStorage.setItem('appStyle', style);
  }, [style]);

  useEffect(() => {
    localStorage.setItem('appMood', mood);
  }, [mood]);

  // THEME SWITCHER EFFECT
  useEffect(() => {
    const applyTheme = (moodTheme: Theme, styleTheme: Theme) => {
      const combinedTheme = { ...moodTheme, ...styleTheme };
      const themeStyle = document.getElementById('app-theme');

      let cssVariables = '';
      for (const [key, value] of Object.entries(combinedTheme)) {
        cssVariables += `${key}: ${value};\n`;
      }
      
      if (themeStyle) {
        themeStyle.innerHTML = `:root {\n${cssVariables}\n}`;
      }
    };
    
    const selectedMoodTheme = moodThemes[mood] || moodThemes['Nostalgic'];
    const selectedStyleTheme = styleThemes[style] || styleThemes['Minimalist'];
    applyTheme(selectedMoodTheme, selectedStyleTheme);
  }, [mood, style]);

  const handleImageSelected = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove "data:mime/type;base64," prefix
        resolve(result.split(',')[1]);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleConvert = useCallback(async () => {
    if (mode === 'image' && !imageFile) {
      setError('Please upload an image first.');
      return;
    }
    if (mode === 'text' && !textPrompt.trim()) {
      setError('Please enter a description first.');
      return;
    }


    setIsLoading(true);
    setError(null);
    setGeneratedCode(null);

    try {
      let code: GeneratedCode;
      const pagesToGenerate = target === 'web' ? numberOfPages : 1;

      if (mode === 'image' && imageFile) {
        const base64Image = await fileToBase64(imageFile);
        code = await generateHtmlFromImage(base64Image, imageFile.type, style, mood, target, pagesToGenerate);
      } else if (mode === 'text') {
        code = await generateHtmlFromText(textPrompt, style, mood, target, pagesToGenerate);
      } else {
        throw new Error("Invalid mode or missing input.");
      }
      setGeneratedCode(code);
    } catch (err)
 {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error(err);
      setError(`Failed to generate code: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, textPrompt, mode, style, mood, target, numberOfPages]);
  
  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setTextPrompt('');
    setGeneratedCode(null);
    setError(null);
    setIsLoading(false);
    setStyle('Minimalist');
    setMood('Nostalgic');
    setTarget('web');
    setNumberOfPages(1);
  };

  const handleModeChange = (newMode: Mode) => {
    if (isLoading) return;
    setMode(newMode);
    setError(null);
    if (newMode === 'image') {
        setTextPrompt('');
    } else {
        setImageFile(null);
        setImagePreview(null);
    }
  };
  
  const isConvertButtonDisabled = isLoading || (mode === 'image' && !imageFile) || (mode === 'text' && !textPrompt.trim());


  return (
    <div style={{fontFamily: 'var(--font-family)'}} className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] flex flex-col transition-colors duration-500 ease-in-out">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        {!generatedCode && !isLoading && !error && (
          <div className="w-full max-w-2xl flex flex-col items-center">
             <div className="flex justify-center p-1 bg-[var(--color-bg)] border border-[var(--color-border-subtle)] rounded-[var(--border-radius)] mb-6 transition-colors duration-300 shadow-[var(--shadow)]">
              <button
                onClick={() => handleModeChange('image')}
                aria-pressed={mode === 'image'}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold transition-all duration-200 border border-transparent rounded-[var(--border-radius)] ${mode === 'image' ? 'bg-[var(--color-interactive-accent-bg)] text-[var(--color-text-accent)] border-[var(--color-interactive-accent-border)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-interactive-accent-bg)]'}`}
              >
                <ImageIcon className="w-5 h-5" />
                <span>Image to Code</span>
              </button>
              <button
                onClick={() => handleModeChange('text')}
                aria-pressed={mode === 'text'}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold transition-all duration-200 border border-transparent rounded-[var(--border-radius)] ${mode === 'text' ? 'bg-[var(--color-interactive-accent-bg)] text-[var(--color-text-accent)] border-[var(--color-interactive-accent-border)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-interactive-accent-bg)]'}`}
              >
                <TextIcon className="w-5 h-5" />
                <span>Text to Code</span>
              </button>
            </div>
            
            {mode === 'image' ? (
                <ImageUploader 
                  onImageUpload={handleImageSelected} 
                  imagePreview={imagePreview}
                  isProcessing={isLoading} 
                />
            ) : (
                <TextPromptInput 
                  prompt={textPrompt} 
                  onPromptChange={setTextPrompt} 
                  isProcessing={isLoading} 
                />
            )}

            <TargetSelector
              selectedTarget={target}
              onTargetChange={(t) => setTarget(t as Target)}
              disabled={isLoading}
            />
            
            {target === 'web' && (
              <PageSelector
                selectedPages={numberOfPages}
                onPagesChange={setNumberOfPages}
                disabled={isLoading}
              />
            )}

            <MoodSelector
              selectedMood={mood}
              onMoodChange={setMood}
              disabled={isLoading}
            />

            <StyleSelector
                selectedStyle={style}
                onStyleChange={setStyle}
                disabled={isLoading}
            />

            <button
              onClick={handleConvert}
              disabled={isConvertButtonDisabled}
              className="mt-6 w-full bg-transparent hover:bg-[var(--color-button-primary-bg)] hover:text-[var(--color-button-primary-fg)] border border-[var(--color-button-primary-bg)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-text-primary)] font-bold py-3 px-6 transition-all duration-300 flex items-center justify-center rounded-[var(--border-radius)] shadow-[var(--shadow)]"
            >
              Convert to Code
            </button>
          </div>
        )}
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <LoadingSpinner className="w-16 h-16 text-[var(--color-text-accent)]" />
            <p className="mt-4 text-xl font-semibold text-[var(--color-text-accent)]">Gemini is building your page...</p>
            <p className="text-[var(--color-text-secondary)]">Analyzing design... Structuring HTML... Applying styles.</p>
          </div>
        )}

        {error && (
          <div className="w-full max-w-3xl mt-4 p-4 bg-[var(--color-error-bg)] border border-[var(--color-error-border)] text-[var(--color-error-fg)] rounded-[var(--border-radius)] text-center">
            <p className="font-bold">An Error Occurred</p>
            <p>{error}</p>
            <button onClick={handleReset} className="mt-4 bg-[var(--color-error-border)] hover:opacity-80 text-white font-bold py-2 px-4 rounded-[var(--border-radius)] transition-colors">
              Try Again
            </button>
          </div>
        )}

        {generatedCode && !isLoading && (
          <div className="w-full">
            <CodePreview 
              pages={generatedCode.pages} 
              cssCode={generatedCode.css} 
              onReset={handleReset} 
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
