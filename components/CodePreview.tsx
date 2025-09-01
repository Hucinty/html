
import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { CopyIcon, CheckIcon, ResetIcon, GripVerticalIcon } from './icons';
import { type Page } from '../types';

declare global {
  interface Window {
    Prism?: {
      highlightAll: () => void;
    };
  }
}

interface CodePreviewProps {
  pages: Page[];
  cssCode: string;
  onReset: () => void;
}

type MobileTab = 'preview' | 'html' | 'css';
type DesktopTab = 'html' | 'css';

export const CodePreview: React.FC<CodePreviewProps> = ({ pages, cssCode, onReset }) => {
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [mobileActiveTab, setMobileActiveTab] = useState<MobileTab>('preview');
  const [desktopCodeTab, setDesktopCodeTab] = useState<DesktopTab>('html');
  const [copied, setCopied] = useState<boolean>(false);

  // State for resizable panes
  const [dividerPos, setDividerPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activePage = useMemo(() => pages[activePageIndex] || { name: '', html: '' }, [pages, activePageIndex]);
  const hasCss = useMemo(() => cssCode && cssCode.trim() !== '', [cssCode]);
  const isEmail = useMemo(() => pages.length === 1 && !hasCss, [pages, hasCss]);

  useEffect(() => {
    // When CSS is not present, switch away from the CSS tab if it was active.
    if (!hasCss) {
      if (mobileActiveTab === 'css') setMobileActiveTab('preview');
      if (desktopCodeTab === 'css') setDesktopCodeTab('html');
    }
  }, [hasCss, mobileActiveTab, desktopCodeTab]);

  useEffect(() => {
    // Reset to first page if pages change
    setActivePageIndex(0);
  }, [pages]);

  useEffect(() => {
    if (window.Prism) {
      // Use a timeout to ensure React has rendered the new code before highlighting
      const timer = setTimeout(() => {
        window.Prism?.highlightAll();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activePageIndex, mobileActiveTab, desktopCodeTab, pages, cssCode]);

  const iframeContent = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; }
            ${cssCode}
          </style>
        </head>
        <body>
          ${activePage.html}
        </body>
      </html>
    `;
  }, [activePage.html, cssCode]);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = useCallback(() => {
    if (isDragging) setIsDragging(false);
  }, [isDragging]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
      if (newWidth > 20 && newWidth < 80) setDividerPos(newWidth);
    }
  }, [isDragging]);
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const mobileTabs: { id: MobileTab; label: string }[] = [
    { id: 'preview', label: 'Preview' },
    { id: 'html', label: isEmail ? 'Email Code' : 'HTML' },
    ...(hasCss ? [{ id: 'css' as MobileTab, label: 'CSS' }] : []),
  ];
  
  const desktopTabs: { id: DesktopTab; label: string }[] = [
    { id: 'html', label: isEmail ? 'Email Code' : 'HTML' },
    ...(hasCss ? [{ id: 'css' as DesktopTab, label: 'CSS' }] : []),
  ];
  
  const codeToDisplay = desktopCodeTab === 'html' ? activePage.html : cssCode;

  const CodeBlock: React.FC<{ code: string; language: string;}> = ({ code, language }) => (
    <pre className="h-full w-full overflow-auto bg-[var(--color-interactive-accent-bg)] p-4 text-sm text-[var(--color-text-primary)]">
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
  
  const CopyButton = ({ code }: { code: string }) => {
    if (isEmail && desktopCodeTab === 'html') {
        return (
            <button
                onClick={() => handleCopy(code)}
                className="flex items-center space-x-2 text-sm text-[var(--color-button-primary-fg)] bg-[var(--color-button-primary-bg)] hover:opacity-90 transition-opacity py-2 px-3 rounded-[var(--border-radius)] shadow-[var(--shadow)]"
            >
                {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Embed Code'}</span>
            </button>
        )
    }
    return (
        <button
            onClick={() => handleCopy(code)}
            className="p-2 bg-[var(--color-border-subtle)] hover:opacity-80 rounded-[var(--border-radius)] transition-colors text-[var(--color-text-primary)]"
            aria-label="Copy code"
        >
            {copied ? <CheckIcon className="w-5 h-5 text-[var(--color-text-accent)]" /> : <CopyIcon className="w-5 h-5" />}
        </button>
    )
  };

  return (
    <div className="w-full bg-[var(--color-bg)] rounded-[var(--border-radius)] border border-[var(--color-border)] transition-colors duration-300 overflow-hidden shadow-[var(--shadow)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4">
             {/* Page Tabs */}
            <div className="flex-grow flex-shrink min-w-0">
                <div className="flex items-center border-b-2 border-transparent -mb-px overflow-x-auto">
                    {pages.length > 1 && pages.map((page, index) => (
                        <button
                            key={index}
                            onClick={() => setActivePageIndex(index)}
                            className={`py-3 px-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                                activePageIndex === index
                                ? 'border-[var(--color-text-accent)] text-[var(--color-text-primary)]'
                                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                            }`}
                        >
                            {page.name}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={onReset}
                className="flex-shrink-0 flex items-center space-x-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors py-2 px-3 rounded-[var(--border-radius)] hover:bg-[var(--color-interactive-accent-bg)]"
            >
                <ResetIcon className="w-4 h-4" />
                <span>Start Over</span>
            </button>
        </div>
      
        {/* Mobile View */}
        <div className="md:hidden w-full">
            <div className="flex border-b border-[var(--color-border)]">
                {mobileTabs.map((tab) => (
                    <button
                    key={tab.id}
                    onClick={() => setMobileActiveTab(tab.id)}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors border-b-2 ${
                        mobileActiveTab === tab.id
                        ? 'border-[var(--color-text-accent)] text-[var(--color-text-primary)]'
                        : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                    >
                    {tab.label}
                    </button>
                ))}
            </div>
             <div className="w-full h-[60vh] min-h-[400px]">
                {mobileActiveTab === 'preview' && (
                    <iframe srcDoc={iframeContent} title="Preview" className="w-full h-full bg-white border-0" sandbox="allow-scripts" />
                )}
                 {mobileActiveTab === 'html' && (
                    <div className="relative h-full">
                        <div className="absolute top-2 right-2"><CopyButton code={activePage.html} /></div>
                        <CodeBlock code={activePage.html} language="html" />
                    </div>
                )}
                 {mobileActiveTab === 'css' && hasCss && (
                    <div className="relative h-full">
                         <div className="absolute top-2 right-2"><CopyButton code={cssCode} /></div>
                        <CodeBlock code={cssCode} language="css" />
                    </div>
                )}
            </div>
        </div>
      
        {/* Desktop Split View */}
        <div ref={containerRef} className="hidden md:flex w-full h-[75vh] min-h-[500px] overflow-hidden" onMouseUp={handleMouseUp}>
            {/* Preview Pane */}
            <div className="h-full bg-white" style={{ width: `${dividerPos}%` }}>
                <iframe
                    srcDoc={iframeContent}
                    title="Preview"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts"
                />
            </div>
            
            {/* Divider */}
            <div onMouseDown={handleMouseDown} className="w-2 h-full flex items-center justify-center bg-[var(--color-border-subtle)] hover:bg-[var(--color-border)] cursor-col-resize transition-colors" title="Drag to resize">
                <GripVerticalIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
            </div>
            
            {/* Code Pane */}
            <div className="h-full flex flex-col flex-grow" style={{ width: `calc(${100 - dividerPos}% - 8px)` }}>
                <div className="flex items-center justify-between bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4">
                    <div className="flex">
                        {desktopTabs.map((tab) => (
                           <button
                             key={tab.id}
                             onClick={() => setDesktopCodeTab(tab.id)}
                             className={`py-3 px-4 text-sm font-medium transition-colors border-b-2 ${
                                 desktopCodeTab === tab.id
                                 ? 'border-[var(--color-text-accent)] text-[var(--color-text-primary)]'
                                 : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                             }`}
                           >
                             {tab.label}
                           </button>
                         ))}
                    </div>
                    <CopyButton code={codeToDisplay} />
                </div>
                 <div className="flex-grow h-0 overflow-hidden">
                    <CodeBlock code={codeToDisplay} language={desktopCodeTab} />
                </div>
            </div>
        </div>
    </div>
  );
};