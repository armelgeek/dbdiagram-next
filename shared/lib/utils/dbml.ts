import { Parser, exporter } from '@dbml/core';

export interface DbmlRenderOptions {
  theme?: 'default' | 'dark';
  fontSize?: number;
  fontFamily?: string;
}

export class DbmlRenderer {
  static async renderToSvg(
    dbmlContent: string,
    options: DbmlRenderOptions = {}
  ): Promise<string> {
    try {
      // Parse DBML content to AST
      const parser = new Parser();
      const database = parser.parse(dbmlContent, 'dbml');
      
      // Convert to simple SVG representation
      const svg = this.generateSvgFromDatabase(database, options);
      
      return svg;
    } catch (error) {
      console.error('DBML rendering error:', error);
      throw new Error(`Failed to render DBML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static generateSvgFromDatabase(database: any, options: DbmlRenderOptions): string {
    const { fontSize = 12, fontFamily = 'Arial, sans-serif' } = options;
    
    // Extract tables from the database
    const tables: any[] = [];
    const refs: any[] = [];
    
    if (database.schemas && database.schemas.length > 0) {
      const schema = database.schemas[0];
      if (schema.tables) {
        tables.push(...schema.tables);
      }
      if (schema.refs) {
        refs.push(...schema.refs);
      }
    }

    if (tables.length === 0) {
      return this.createEmptyDiagramSvg();
    }

    // Calculate layout
    const tableWidth = 200;
    const tableSpacing = 80;
    const headerHeight = 30;
    const fieldHeight = 20;
    const padding = 20;
    
    const tablesPerRow = Math.max(1, Math.ceil(Math.sqrt(tables.length)));
    const svgWidth = (tableWidth + tableSpacing) * tablesPerRow + padding * 2;
    
    const svgElements: string[] = [];
    const relationshipElements: string[] = [];
    const tablePositions: Map<string, { x: number, y: number, width: number, height: number }> = new Map();
    
    let currentY = padding;
    let currentX = padding;
    let tablesInCurrentRow = 0;

    // Render tables and store their positions
    tables.forEach((table, index) => {
      const tableHeight = headerHeight + (table.fields?.length || 0) * fieldHeight + 10;
      
      // Store table position for relationship rendering
      tablePositions.set(table.name, {
        x: currentX,
        y: currentY,
        width: tableWidth,
        height: tableHeight
      });
      
      // Table rectangle with draggable class
      svgElements.push(`
        <g class="table-group" data-table="${table.name}" transform="translate(0,0)">
          <rect x="${currentX}" y="${currentY}" width="${tableWidth}" height="${tableHeight}" 
                fill="white" stroke="#333" stroke-width="1" rx="4" class="table-rect"/>
          
          <!-- Table name header -->
          <rect x="${currentX}" y="${currentY}" width="${tableWidth}" height="${headerHeight}" 
                fill="#4F46E5" stroke="#333" stroke-width="1" rx="4" class="table-header"/>
          <text x="${currentX + tableWidth/2}" y="${currentY + headerHeight/2 + 4}" 
                text-anchor="middle" fill="white" font-family="${fontFamily}" 
                font-size="${fontSize + 2}" font-weight="bold">${table.name}</text>
      `);

      // Table fields
      if (table.fields) {
        table.fields.forEach((field: any, fieldIndex: number) => {
          const fieldY = currentY + headerHeight + fieldIndex * fieldHeight;
          const isPrimaryKey = field.pk;
          const isNotNull = field.not_null;
          const isForeignKey = field.ref;
          
          svgElements.push(`
            <text x="${currentX + 10}" y="${fieldY + fieldHeight/2 + 4}" 
                  fill="#333" font-family="${fontFamily}" font-size="${fontSize}"
                  font-weight="${isPrimaryKey ? 'bold' : 'normal'}">${field.name}</text>
            <text x="${currentX + tableWidth - 10}" y="${fieldY + fieldHeight/2 + 4}" 
                  text-anchor="end" fill="#666" font-family="${fontFamily}" font-size="${fontSize - 1}"
                  >${field.type.type_name || field.type}${isPrimaryKey ? ' (PK)' : ''}${isForeignKey ? ' (FK)' : ''}${isNotNull ? ' NOT NULL' : ''}</text>
          `);
          
          // Field separator line
          if (fieldIndex > 0) {
            svgElements.push(`
              <line x1="${currentX}" y1="${fieldY}" x2="${currentX + tableWidth}" y2="${fieldY}" 
                    stroke="#eee" stroke-width="1"/>
            `);
          }
        });
      }
      
      svgElements.push('</g>');

      // Update position for next table
      tablesInCurrentRow++;
      if (tablesInCurrentRow >= tablesPerRow) {
        currentX = padding;
        currentY += Math.max(tableHeight + tableSpacing, 150);
        tablesInCurrentRow = 0;
      } else {
        currentX += tableWidth + tableSpacing;
      }
    });

    // Render relationships
    refs.forEach((ref: any) => {
      const endpoints = ref.endpoints;
      if (endpoints && endpoints.length >= 2) {
        const fromEndpoint = endpoints[0];
        const toEndpoint = endpoints[1];
        
        const fromTable = fromEndpoint.tableName;
        const toTable = toEndpoint.tableName;
        const fromField = fromEndpoint.fieldNames?.[0];
        const toField = toEndpoint.fieldNames?.[0];
        
        const fromPos = tablePositions.get(fromTable);
        const toPos = tablePositions.get(toTable);
        
        if (fromPos && toPos) {
          // Calculate better connection points
          const fromCenterX = fromPos.x + fromPos.width / 2;
          const fromCenterY = fromPos.y + fromPos.height / 2;
          const toCenterX = toPos.x + toPos.width / 2;
          const toCenterY = toPos.y + toPos.height / 2;
          
          // Determine which sides to connect
          let fromX, fromY, toX, toY;
          
          if (fromCenterX < toCenterX) {
            // Connect right side of from table to left side of to table
            fromX = fromPos.x + fromPos.width;
            fromY = fromCenterY;
            toX = toPos.x;
            toY = toCenterY;
          } else {
            // Connect left side of from table to right side of to table
            fromX = fromPos.x;
            fromY = fromCenterY;
            toX = toPos.x + toPos.width;
            toY = toCenterY;
          }
          
          // Draw relationship line with better styling
          const midX = (fromX + toX) / 2;
          const controlX1 = fromX + (midX - fromX) * 0.5;
          const controlX2 = toX - (toX - midX) * 0.5;
          
          relationshipElements.push(`
            <g class="relationship" data-from="${fromTable}" data-to="${toTable}">
              <!-- Connection line -->
              <path d="M ${fromX} ${fromY} C ${controlX1} ${fromY} ${controlX2} ${toY} ${toX} ${toY}" 
                    stroke="#ff6b35" stroke-width="2" fill="none" 
                    marker-end="url(#arrowhead)" class="relationship-line"/>
              
              <!-- Connection points -->
              <circle cx="${fromX}" cy="${fromY}" r="3" fill="#ff6b35" class="connection-point"/>
              <circle cx="${toX}" cy="${toY}" r="3" fill="#ff6b35" class="connection-point"/>
              
              <!-- Relationship label -->
              <rect x="${midX - 30}" y="${(fromY + toY) / 2 - 10}" width="60" height="20" 
                    fill="white" stroke="#ff6b35" stroke-width="1" rx="3" class="relationship-label-bg"/>
              <text x="${midX}" y="${(fromY + toY) / 2 + 3}" text-anchor="middle" 
                    fill="#ff6b35" font-family="${fontFamily}" font-size="9" font-weight="bold"
                    class="relationship-label">
                ${this.getRelationshipType(ref)}
              </text>
            </g>
          `);
        }
      }
    });

    const svgHeight = currentY + 200; // Add some bottom padding

    return `
      <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .table-group { 
              cursor: move; 
              transition: filter 0.2s ease;
            }
            .table-group:hover { 
              filter: drop-shadow(2px 2px 6px rgba(0,0,0,0.2));
            }
            .table-group:hover .table-rect { 
              stroke: #4F46E5; 
              stroke-width: 2; 
            }
            .table-header { 
              fill: #4F46E5; 
            }
            .table-rect {
              transition: stroke 0.2s ease, stroke-width 0.2s ease;
            }
            .field-text { 
              font-family: ${fontFamily}; 
              font-size: ${fontSize}px; 
            }
            .relationship { 
              opacity: 0.9; 
              transition: opacity 0.2s ease;
            }
            .relationship:hover { 
              opacity: 1; 
            }
            .relationship-line {
              transition: stroke-width 0.2s ease;
            }
            .relationship:hover .relationship-line {
              stroke-width: 3;
            }
            .connection-point {
              transition: r 0.2s ease;
            }
            .relationship:hover .connection-point {
              r: 4;
            }
            .relationship-label-bg {
              transition: stroke-width 0.2s ease;
            }
            .relationship:hover .relationship-label-bg {
              stroke-width: 2;
            }
          </style>
          <marker id="arrowhead" markerWidth="12" markerHeight="8" 
                  refX="11" refY="4" orient="auto" markerUnits="strokeWidth">
            <polygon points="0 0, 12 4, 0 8" fill="#ff6b35" />
          </marker>
        </defs>
        <rect width="100%" height="100%" fill="#f8fafc"/>
        ${svgElements.join('')}
        ${relationshipElements.join('')}
        <text x="${svgWidth/2}" y="${svgHeight - 20}" text-anchor="middle" 
              fill="#64748b" font-family="${fontFamily}" font-size="12" font-weight="500">
          Interactive Database Diagram - Drag tables to rearrange
        </text>
      </svg>
    `;
  }

  private static getRelationshipType(ref: any): string {
    // Try to determine relationship type from the reference
    const rel = ref.relation || '>';
    
    switch (rel) {
      case '>':
      case '<':
        return 'many-to-one';
      case '-':
        return 'one-to-one';
      case '<>':
        return 'many-to-many';
      default:
        return 'relation';
    }
  }

  private static createEmptyDiagramSvg(): string {
    return `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f9fafb"/>
        <text x="200" y="100" text-anchor="middle" fill="#666" 
              font-family="Arial, sans-serif" font-size="14">No tables found in DBML</text>
      </svg>
    `;
  }

  static validateDbml(dbmlContent: string): { isValid: boolean; error?: string } {
    try {
      const parser = new Parser();
      parser.parse(dbmlContent, 'dbml');
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Invalid DBML syntax',
      };
    }
  }
}

export const getDefaultDbmlContent = (): string => {
  return `Table users {
  id integer [primary key]
  username varchar [unique, not null]
  email varchar [unique, not null]
  role varchar [default: 'user']
  created_at timestamp [default: \`now()\`]
}

Table posts {
  id integer [primary key]
  title varchar [not null]
  body text [note: 'Content of the post']
  user_id integer [ref: > users.id]
  status varchar [default: 'draft']
  created_at timestamp [default: \`now()\`]
  updated_at timestamp
}

Table follows {
  following_user_id integer [ref: > users.id]
  followed_user_id integer [ref: > users.id]
  created_at timestamp [default: \`now()\`]
  
  indexes {
    (following_user_id, followed_user_id) [unique]
  }
}

Table comments {
  id integer [primary key]
  post_id integer [ref: > posts.id]
  user_id integer [ref: > users.id]
  content text [not null]
  created_at timestamp [default: \`now()\`]
}

// Define relationships
Ref: posts.user_id > users.id // many-to-one
Ref: follows.following_user_id > users.id // many-to-one  
Ref: follows.followed_user_id > users.id // many-to-one
Ref: comments.post_id > posts.id // many-to-one
Ref: comments.user_id > users.id // many-to-one`;
};