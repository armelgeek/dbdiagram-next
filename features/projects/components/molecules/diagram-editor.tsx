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
  syntax?: string;
}

export const DiagramEditor: React.FC<DiagramEditorProps> = ({
  value,
  onChange,
  onCursorChange,
  readOnly = false,
  language,
  syntax = 'mermaid',
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Determine the appropriate language based on syntax
  const editorLanguage = language || (syntax === 'dbml' ? 'sql' : 'yaml');

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
    // Define custom languages for diagram syntax
    if (typeof window !== 'undefined' && window.monaco) {
      // Register Mermaid language
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

      // Register DBML language
      window.monaco.languages.register({ id: 'dbml' });
      
      window.monaco.languages.setMonarchTokensProvider('dbml', {
        tokenizer: {
          root: [
            [/^(Table|Ref|Enum|TableGroup|Project)/, 'keyword'],
            [/\b(primary key|not null|null|unique|increment|default)\b/, 'type'],
            [/\b(varchar|text|integer|int|bigint|smallint|decimal|float|double|boolean|timestamp|date|time|json|uuid)\b/, 'type.identifier'],
            [/\b(many-to-one|one-to-many|one-to-one|many-to-many)\b/, 'relationship'],
            [/[><\-]+/, 'relationship'],
            [/".*?"/, 'string'],
            [/'.*?'/, 'string'],
            [/\/\/.*$/, 'comment'],
            [/\/\*[\s\S]*?\*\//, 'comment'],
            [/\{/, 'delimiter.curly'],
            [/\}/, 'delimiter.curly'],
            [/\[/, 'delimiter.square'],
            [/\]/, 'delimiter.square'],
            [/\(/, 'delimiter.parenthesis'],
            [/\)/, 'delimiter.parenthesis'],
            [/:/, 'delimiter.colon'],
            [/;/, 'delimiter.semicolon'],
          ],
        },
      });

      // Define themes
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

      window.monaco.editor.defineTheme('dbml-theme', {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: '0066cc', fontStyle: 'bold' },
          { token: 'type', foreground: '6A1B9A', fontStyle: 'bold' },
          { token: 'type.identifier', foreground: '2E7D32' },
          { token: 'relationship', foreground: 'ff6600' },
          { token: 'string', foreground: 'cc0000' },
          { token: 'comment', foreground: '888888', fontStyle: 'italic' },
        ],
        colors: {},
      });
    }
  }, []);

  return (
    <div className="h-full w-full border rounded-lg overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={editorLanguage}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          theme: syntax === 'dbml' ? 'dbml-theme' : 'vs-light',
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