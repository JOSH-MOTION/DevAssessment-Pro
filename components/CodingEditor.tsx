
import React, { useEffect, useRef } from 'react';

interface CodingEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
}

const CodingEditor: React.FC<CodingEditorProps> = ({ code, onChange, language = 'javascript' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const initMonaco = () => {
      if (typeof window !== 'undefined' && (window as any).require) {
        (window as any).require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
        (window as any).require(['vs/editor/editor.main'], () => {
          if (!containerRef.current) return;
          
          if (!editorRef.current) {
            editorRef.current = (window as any).monaco.editor.create(containerRef.current, {
              value: code,
              language: language,
              theme: 'vs-dark',
              automaticLayout: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineHeight: 24,
              fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
              padding: { top: 24, bottom: 24 },
              scrollBeyondLastLine: false,
              roundedSelection: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              renderLineHighlight: "all",
            });

            editorRef.current.onDidChangeModelContent(() => {
              onChange(editorRef.current.getValue());
            });
          }
        });
      }
    };

    const timeout = setTimeout(initMonaco, 100);

    return () => {
      clearTimeout(timeout);
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== code) {
      editorRef.current.setValue(code);
    }
  }, [code]);

  return (
    <div className="h-full w-full bg-[#1e1e1e]">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
};

export default CodingEditor;
