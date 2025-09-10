'use client';

import { useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

interface DiagramEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCursorChange?: (line: number, column: number) => void;
  readOnly?: boolean;
  language?: string;
}

export const DiagramEditor: React.FC<DiagramEditorProps> = ({
  value,
  onChange,
  onCursorChange,
  readOnly = false,
  language = 'yaml', // Default to YAML for Mermaid-like syntax
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (editorInstance: editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance;

    // Configure Mermaid-like syntax highlighting
    editorInstance.updateOptions({
      fontSize: 14,
      lineNumbers: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      folding: true,
      renderWhitespace: 'none',
      automaticLayout: true,
    });

    // Listen for cursor position changes
    if (onCursorChange) {
      editorInstance.onDidChangeCursorPosition((e) => {
        onCursorChange(e.position.lineNumber, e.position.column);
      });
    }
  };

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  };

  useEffect(() => {
    // Define custom language for Mermaid if needed
    if (typeof window !== 'undefined' && window.monaco) {
      window.monaco.languages.register({ id: 'mermaid' });
      
      window.monaco.languages.setMonarchTokensProvider('mermaid', {
        tokenizer: {
          root: [
            [/^(erDiagram|classDiagram|sequenceDiagram|flowchart|graph)/, 'keyword'],
            [/\|\|--\|\||o\|--\|\||}\|--\|{/, 'relationship'],
            [/\w+/, 'entity'],
            [/".*?"/, 'string'],
            [/\{/, 'delimiter.curly'],
            [/\}/, 'delimiter.curly'],
            [/\[/, 'delimiter.square'],
            [/\]/, 'delimiter.square'],
            [/\(/, 'delimiter.parenthesis'],
            [/\)/, 'delimiter.parenthesis'],
          ],
        },
      });

      window.monaco.editor.defineTheme('mermaid-theme', {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: '0066cc', fontStyle: 'bold' },
          { token: 'entity', foreground: '008000' },
          { token: 'relationship', foreground: 'ff6600' },
          { token: 'string', foreground: 'cc0000' },
        ],
        colors: {},
      });
    }
  }, []);

  return (
    <div className="h-full w-full border rounded-lg overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={language}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          theme: 'vs-light',
          fontSize: 14,
          lineNumbers: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          folding: true,
          renderWhitespace: 'none',
          automaticLayout: true,
        }}
      />
    </div>
  );
};