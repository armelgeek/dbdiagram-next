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
          // Calculate connection points (center-right of from table, center-left of to table)
          const fromX = fromPos.x + fromPos.width;
          const fromY = fromPos.y + fromPos.height / 2;
          const toX = toPos.x;
          const toY = toPos.y + toPos.height / 2;
          
          // Draw relationship line with better styling
          const midX = (fromX + toX) / 2;
          
          relationshipElements.push(`
            <g class="relationship">
              <path d="M ${fromX} ${fromY} Q ${midX} ${fromY} ${midX} ${(fromY + toY) / 2} Q ${midX} ${toY} ${toX} ${toY}" 
                    stroke="#ff6b35" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>
              <circle cx="${fromX}" cy="${fromY}" r="3" fill="#ff6b35"/>
              <circle cx="${toX}" cy="${toY}" r="3" fill="#ff6b35"/>
              <!-- Relationship label -->
              <text x="${midX}" y="${(fromY + toY) / 2 - 5}" text-anchor="middle" 
                    fill="#ff6b35" font-family="${fontFamily}" font-size="10" font-weight="bold">
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
            .table-group { cursor: move; }
            .table-group:hover .table-rect { stroke: #4F46E5; stroke-width: 2; }
            .table-header { fill: #4F46E5; }
            .table-border { stroke: #333; stroke-width: 1; fill: none; }
            .field-text { font-family: ${fontFamily}; font-size: ${fontSize}px; }
            .relationship { opacity: 0.8; }
            .relationship:hover { opacity: 1; }
          </style>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                  refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#ff6b35" />
          </marker>
        </defs>
        <rect width="100%" height="100%" fill="#f9fafb"/>
        ${svgElements.join('')}
        ${relationshipElements.join('')}
        <text x="${svgWidth/2}" y="${svgHeight - 10}" text-anchor="middle" 
              fill="#999" font-family="${fontFamily}" font-size="10">Generated from DBML</text>
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