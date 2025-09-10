'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { DbmlRenderer, getDefaultDbmlContent } from '@/shared/lib/utils/dbml';

interface DiagramViewerProps {
  content: string;
  syntax?: string;
  className?: string;
}

export const DiagramViewer: React.FC<DiagramViewerProps> = ({
  content,
  syntax = 'mermaid',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !content.trim()) {
      setIsLoading(false);
      return;
    }

    const renderDiagram = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Clear the container
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        let svg: string;

        if (syntax === 'dbml') {
          // Render DBML diagram
          svg = await DbmlRenderer.renderToSvg(content);
        } else {
          // Render Mermaid diagram (default)
          // Initialize Mermaid
          mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            flowchart: {
              useMaxWidth: false,
              htmlLabels: true,
            },
            er: {
              useMaxWidth: false,
              entityPadding: 15,
              fill: '#f9f9f9',
              fontSize: 12,
            },
          });

          // Generate unique ID for this diagram
          const id = `mermaid-diagram-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          // Parse and render the diagram
          const result = await mermaid.render(id, content);
          svg = result.svg;
        }

        if (containerRef.current) {
          // Create a div for the diagram
          const diagramDiv = document.createElement('div');
          diagramDiv.style.textAlign = 'center';
          diagramDiv.innerHTML = svg;
          
          containerRef.current.appendChild(diagramDiv);
          
          // Make the diagram interactive
          const svgElement = diagramDiv.querySelector('svg');
          if (svgElement) {
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.cursor = 'grab';
            
            // Add zoom and pan functionality
            let isPanning = false;
            let startX = 0;
            let startY = 0;
            let scale = 1;
            
            svgElement.addEventListener('wheel', (e) => {
              e.preventDefault();
              const delta = e.deltaY > 0 ? 0.9 : 1.1;
              scale *= delta;
              scale = Math.max(0.1, Math.min(5, scale));
              svgElement.style.transform = `scale(${scale})`;
            });
            
            svgElement.addEventListener('mousedown', (e) => {
              isPanning = true;
              startX = e.clientX;
              startY = e.clientY;
              svgElement.style.cursor = 'grabbing';
            });
            
            svgElement.addEventListener('mousemove', (e) => {
              if (!isPanning) return;
              
              const dx = e.clientX - startX;
              const dy = e.clientY - startY;
              
              const rect = svgElement.getBoundingClientRect();
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              
              svgElement.style.transformOrigin = `${centerX + dx}px ${centerY + dy}px`;
            });
            
            svgElement.addEventListener('mouseup', () => {
              isPanning = false;
              svgElement.style.cursor = 'grab';
            });
            
            svgElement.addEventListener('mouseleave', () => {
              isPanning = false;
              svgElement.style.cursor = 'grab';
            });
          }
        }
      } catch (err) {
        console.error('Diagram rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      } finally {
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [content, syntax]);

  const getDefaultContent = () => {
    if (syntax === 'dbml') {
      return getDefaultDbmlContent();
    }
    
    return `erDiagram
    CUSTOMER {
        string name
        string email
        string phone
    }
    ORDER {
        int id
        date order_date
        decimal total
    }
    PRODUCT {
        int id
        string name
        decimal price
    }
    
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--o{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : "ordered in"
    
    ORDER_ITEM {
        int quantity
        decimal price
    }`;
  };

  const displayContent = content.trim() || getDefaultContent();

  return (
    <div className={`relative h-full w-full bg-white rounded-lg border ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Rendering diagram...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
          <div className="text-center p-4">
            <div className="text-red-600 font-medium mb-2">Diagram Error</div>
            <div className="text-red-500 text-sm">{error}</div>
            <div className="text-gray-500 text-xs mt-2">
              Check your diagram syntax and try again
            </div>
          </div>
        </div>
      )}
      
      <div 
        ref={containerRef} 
        className="h-full w-full overflow-auto p-4"
        style={{ 
          minHeight: '300px',
          display: isLoading || error ? 'none' : 'block'
        }}
      />
      
      {!content.trim() && !isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
          Start typing in the editor to see your diagram here...
        </div>
      )}
    </div>
  );
};