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
    let currentY = padding;
    let currentX = padding;
    let tablesInCurrentRow = 0;

    // Render tables
    tables.forEach((table, index) => {
      const tableHeight = headerHeight + (table.fields?.length || 0) * fieldHeight + 10;
      
      // Table rectangle
      svgElements.push(`
        <rect x="${currentX}" y="${currentY}" width="${tableWidth}" height="${tableHeight}" 
              fill="white" stroke="#333" stroke-width="1" rx="4"/>
      `);
      
      // Table name header
      svgElements.push(`
        <rect x="${currentX}" y="${currentY}" width="${tableWidth}" height="${headerHeight}" 
              fill="#4F46E5" stroke="#333" stroke-width="1" rx="4"/>
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
          
          svgElements.push(`
            <text x="${currentX + 10}" y="${fieldY + fieldHeight/2 + 4}" 
                  fill="#333" font-family="${fontFamily}" font-size="${fontSize}"
                  font-weight="${isPrimaryKey ? 'bold' : 'normal'}">${field.name}</text>
            <text x="${currentX + tableWidth - 10}" y="${fieldY + fieldHeight/2 + 4}" 
                  text-anchor="end" fill="#666" font-family="${fontFamily}" font-size="${fontSize - 1}"
                  >${field.type.type_name || field.type}${isPrimaryKey ? ' (PK)' : ''}${isNotNull ? ' NOT NULL' : ''}</text>
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

    const svgHeight = currentY + 200; // Add some bottom padding

    return `
      <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .table-header { fill: #4F46E5; }
            .table-border { stroke: #333; stroke-width: 1; fill: none; }
            .field-text { font-family: ${fontFamily}; font-size: ${fontSize}px; }
          </style>
        </defs>
        <rect width="100%" height="100%" fill="#f9fafb"/>
        ${svgElements.join('')}
        <text x="${svgWidth/2}" y="${svgHeight - 10}" text-anchor="middle" 
              fill="#999" font-family="${fontFamily}" font-size="10">Generated from DBML</text>
      </svg>
    `;
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
  return `Table follows {
  following_user_id integer
  followed_user_id integer
  created_at timestamp
}

Table users {
  id integer [primary key]
  username varchar
  role varchar
  created_at timestamp
}

Table posts {
  id integer [primary key]
  title varchar
  body text [note: 'Content of the post']
  user_id integer [not null]
  status varchar
  created_at timestamp
}

Ref user_posts: posts.user_id > users.id // many-to-one

Ref: users.id < follows.following_user_id

Ref: users.id < follows.followed_user_id`;
};