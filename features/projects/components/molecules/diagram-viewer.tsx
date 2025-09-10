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
            svgElement.style.userSelect = 'none';
            
            // Add zoom and pan functionality
            let scale = 1;
            let panX = 0;
            let panY = 0;
            let isPanning = false;
            let startX = 0;
            let startY = 0;
            
            // Apply transform
            const applyTransform = () => {
              svgElement.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
            };
            
            // Zoom functionality
            svgElement.addEventListener('wheel', (e) => {
              e.preventDefault();
              const delta = e.deltaY > 0 ? 0.9 : 1.1;
              scale *= delta;
              scale = Math.max(0.1, Math.min(5, scale));
              applyTransform();
            });
            
            // Pan functionality - only when not clicking on tables
            svgElement.addEventListener('mousedown', (e) => {
              const target = e.target as Element;
              if (target.closest('.table-group')) {
                return; // Let table drag handle this
              }
              
              isPanning = true;
              startX = e.clientX - panX;
              startY = e.clientY - panY;
              svgElement.style.cursor = 'grabbing';
            });
            
            svgElement.addEventListener('mousemove', (e) => {
              if (!isPanning) return;
              
              panX = e.clientX - startX;
              panY = e.clientY - startY;
              applyTransform();
            });
            
            document.addEventListener('mouseup', () => {
              if (isPanning) {
                isPanning = false;
                svgElement.style.cursor = 'default';
              }
            });

            // Helper function to get table's current position and bounds
            const getTableBounds = (tableGroup: Element) => {
              const transform = (tableGroup as SVGElement).getAttribute('transform') || 'translate(0,0)';
              const match = transform.match(/translate\(([^,]+),([^)]+)\)/);
              const translateX = match ? parseFloat(match[1]) : 0;
              const translateY = match ? parseFloat(match[2]) : 0;
              
              const rect = tableGroup.querySelector('.table-rect') as SVGRectElement;
              if (!rect) return null;
              
              const x = parseFloat(rect.getAttribute('x') || '0') + translateX;
              const y = parseFloat(rect.getAttribute('y') || '0') + translateY;
              const width = parseFloat(rect.getAttribute('width') || '0');
              const height = parseFloat(rect.getAttribute('height') || '0');
              
              return { x, y, width, height };
            };

            // Helper function to update relationship lines
            const updateRelationships = (movedTableName?: string) => {
              const relationships = svgElement.querySelectorAll('.relationship');
              
              relationships.forEach((relationship) => {
                const fromTable = relationship.getAttribute('data-from');
                const toTable = relationship.getAttribute('data-to');
                
                // Only update if this relationship involves the moved table, or update all if no specific table
                if (movedTableName && fromTable !== movedTableName && toTable !== movedTableName) {
                  return;
                }
                
                const fromTableGroup = svgElement.querySelector(`[data-table="${fromTable}"]`);
                const toTableGroup = svgElement.querySelector(`[data-table="${toTable}"]`);
                
                if (!fromTableGroup || !toTableGroup) return;
                
                const fromBounds = getTableBounds(fromTableGroup);
                const toBounds = getTableBounds(toTableGroup);
                
                if (!fromBounds || !toBounds) return;
                
                // Calculate connection points
                const fromCenterX = fromBounds.x + fromBounds.width / 2;
                const fromCenterY = fromBounds.y + fromBounds.height / 2;
                const toCenterX = toBounds.x + toBounds.width / 2;
                const toCenterY = toBounds.y + toBounds.height / 2;
                
                let fromX, fromY, toX, toY;
                
                // Determine which sides to connect based on relative positions
                if (fromCenterX < toCenterX) {
                  // Connect right side of from table to left side of to table
                  fromX = fromBounds.x + fromBounds.width;
                  fromY = fromCenterY;
                  toX = toBounds.x;
                  toY = toCenterY;
                } else {
                  // Connect left side of from table to right side of to table
                  fromX = fromBounds.x;
                  fromY = fromCenterY;
                  toX = toBounds.x + toBounds.width;
                  toY = toCenterY;
                }
                
                // Update the relationship path
                const midX = (fromX + toX) / 2;
                const controlX1 = fromX + (midX - fromX) * 0.5;
                const controlX2 = toX - (toX - midX) * 0.5;
                
                const pathElement = relationship.querySelector('.relationship-line') as SVGPathElement;
                if (pathElement) {
                  pathElement.setAttribute('d', `M ${fromX} ${fromY} C ${controlX1} ${fromY} ${controlX2} ${toY} ${toX} ${toY}`);
                }
                
                // Update connection points
                const fromPoint = relationship.querySelector('.connection-point:first-of-type') as SVGCircleElement;
                const toPoint = relationship.querySelector('.connection-point:last-of-type') as SVGCircleElement;
                
                if (fromPoint) {
                  fromPoint.setAttribute('cx', fromX.toString());
                  fromPoint.setAttribute('cy', fromY.toString());
                }
                if (toPoint) {
                  toPoint.setAttribute('cx', toX.toString());
                  toPoint.setAttribute('cy', toY.toString());
                }
                
                // Update relationship label position
                const labelBg = relationship.querySelector('.relationship-label-bg') as SVGRectElement;
                const labelText = relationship.querySelector('.relationship-label') as SVGTextElement;
                
                if (labelBg && labelText) {
                  const labelX = midX - 30;
                  const labelY = (fromY + toY) / 2 - 10;
                  const labelTextY = (fromY + toY) / 2 + 3;
                  
                  labelBg.setAttribute('x', labelX.toString());
                  labelBg.setAttribute('y', labelY.toString());
                  labelText.setAttribute('x', midX.toString());
                  labelText.setAttribute('y', labelTextY.toString());
                }
              });
            };

            // Enhanced table dragging functionality
            const tableGroups = svgElement.querySelectorAll('.table-group');
            tableGroups.forEach((tableGroup) => {
              let isDragging = false;
              let dragStartX = 0;
              let dragStartY = 0;
              let initialTransform = { x: 0, y: 0 };
              
              // Parse initial transform
              const transform = (tableGroup as SVGElement).getAttribute('transform') || 'translate(0,0)';
              const match = transform.match(/translate\(([^,]+),([^)]+)\)/);
              if (match) {
                initialTransform.x = parseFloat(match[1]);
                initialTransform.y = parseFloat(match[2]);
              }
              
              const tableName = tableGroup.getAttribute('data-table');
              
              tableGroup.addEventListener('mousedown', (e) => {
                e.stopPropagation(); // Prevent canvas panning
                e.preventDefault();
                
                const mouseEvent = e as MouseEvent;
                isDragging = true;
                dragStartX = mouseEvent.clientX;
                dragStartY = mouseEvent.clientY;
                
                (tableGroup as any).style.cursor = 'grabbing';
                svgElement.style.cursor = 'grabbing';
              });
              
              document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const mouseEvent = e as MouseEvent;
                const deltaX = (mouseEvent.clientX - dragStartX) / scale;
                const deltaY = (mouseEvent.clientY - dragStartY) / scale;
                
                const newX = initialTransform.x + deltaX;
                const newY = initialTransform.y + deltaY;
                
                (tableGroup as SVGElement).setAttribute('transform', `translate(${newX}, ${newY})`);
                
                // Update relationships involving this table
                if (tableName) {
                  updateRelationships(tableName);
                }
              });
              
              document.addEventListener('mouseup', () => {
                if (isDragging) {
                  isDragging = false;
                  
                  // Update initial transform for next drag
                  const currentTransform = (tableGroup as SVGElement).getAttribute('transform') || 'translate(0,0)';
                  const currentMatch = currentTransform.match(/translate\(([^,]+),([^)]+)\)/);
                  if (currentMatch) {
                    initialTransform.x = parseFloat(currentMatch[1]);
                    initialTransform.y = parseFloat(currentMatch[2]);
                  }
                  
                  (tableGroup as any).style.cursor = 'move';
                  svgElement.style.cursor = 'default';
                }
              });
              
              // Set initial cursor
              (tableGroup as any).style.cursor = 'move';
              
              // Add hover effects
              tableGroup.addEventListener('mouseenter', () => {
                if (!isDragging) {
                  (tableGroup as any).style.cursor = 'move';
                }
              });
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