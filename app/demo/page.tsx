'use client';

import { useState } from 'react';
import { DiagramViewer } from '@/features/projects/components/molecules/diagram-viewer';
import { DiagramEditor } from '@/features/projects/components/molecules/diagram-editor';
import { Chat } from '@/features/projects/components/organisms/chat';
import { ActivityFeed } from '@/features/projects/components/organisms/activity-feed';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  MessageSquare, 
  Activity, 
  Save, 
  Settings,
  Download,
  Eye,
  Users
} from 'lucide-react';

export default function DemoPage() {
  const [diagramContent, setDiagramContent] = useState(`Table users {
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

// Define relationships with cardinality
Ref: posts.user_id > users.id // many-to-one (1..n)
Ref: follows.following_user_id > users.id // many-to-one (0..n)
Ref: follows.followed_user_id > users.id // many-to-one (0..n)
Ref: comments.post_id > posts.id // many-to-one (1..n)
Ref: comments.user_id > users.id // many-to-one (0..n)`);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDiagramContentChange = (newContent: string) => {
    setDiagramContent(newContent);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">DBDiagram Demo Project</h1>
            <p className="text-gray-600 mt-1">Interactive demonstration of the enhanced diagram features</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600">Demo Mode</span>
            </div>

            {/* Active Users */}
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                  U
                </div>
                <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                  T
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button size="sm" className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r">
          <Tabs defaultValue="diagrams" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="diagrams" className="gap-2">
                <FileText className="h-4 w-4" />
                Diagrams
              </TabsTrigger>
              <TabsTrigger value="chat" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-2">
                <Activity className="h-4 w-4" />
                Activity
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="diagrams" className="p-4 space-y-4 h-full overflow-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Demo Diagram</h3>
                <p className="text-sm text-blue-700 mb-3">
                  This demonstrates the enhanced diagram features including:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Zoom controls & fullscreen mode</li>
                  <li>• Auto-arrange functionality</li>
                  <li>• Relationship highlighting</li>
                  <li>• Cardinality notation (1..n, 0..n)</li>
                  <li>• Site color theming for relationships</li>
                </ul>
                <Badge variant="outline" className="mt-2">DBML</Badge>
              </div>
            </TabsContent>
            
            <TabsContent value="chat" className="p-0 h-full">
              <div className="p-4 text-center text-gray-600">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="font-medium mb-2">Real-time Chat</p>
                <p className="text-sm">
                  Chat feature with Socket.io integration for real-time collaboration.
                  Messages are persisted and support mentions.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="p-0 h-full">
              <div className="p-4 text-center text-gray-600">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="font-medium mb-2">Activity Feed</p>
                <p className="text-sm">
                  Track all project activities including diagram edits, 
                  user joins/leaves, chat messages, and more.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Editor Area */}
        <div className="flex-1">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col">
                <div className="bg-white border-b px-4 py-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Editor</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">DBML</Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <DiagramEditor
                    value={diagramContent}
                    onChange={handleDiagramContentChange}
                    syntax="dbml"
                  />
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle />
            
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col">
                <div className="bg-white border-b px-4 py-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Preview</h3>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <DiagramViewer 
                    content={diagramContent} 
                    syntax="dbml"
                    isFullscreen={isFullscreen}
                    onFullscreenToggle={() => setIsFullscreen(!isFullscreen)}
                  />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}