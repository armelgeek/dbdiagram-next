'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Users, 
  Save, 
  Settings, 
  FileText,
  MessageSquare,
  Activity,
  Eye,
  Trash2,
  Download
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createDiagramSchema, type CreateDiagramInput } from '@/features/projects/config/project.schema';
import { useProject } from '@/features/projects/hooks/use-project';
import { DiagramEditor } from '@/features/projects/components/molecules/diagram-editor';
import { DiagramViewer } from '@/features/projects/components/molecules/diagram-viewer';
import { SocketProvider } from '@/features/projects/hooks/use-socket';
import { toast } from 'sonner';

function ProjectPageContent() {
  const params = useParams();
  const projectId = params.id as string;
  const { project, activeUsers, isLoading, error, isConnected, actions } = useProject(projectId);
  
  const [selectedDiagramId, setSelectedDiagramId] = useState<string | null>(null);
  const [diagramContent, setDiagramContent] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedDiagram = project?.diagrams.find(d => d.id === selectedDiagramId);

  const form = useForm<CreateDiagramInput>({
    resolver: zodResolver(createDiagramSchema),
    defaultValues: {
      name: '',
      description: '',
      content: '',
      syntax: 'dbml',
    },
  });

  // Load the first diagram by default
  useEffect(() => {
    if (project?.diagrams.length && !selectedDiagramId) {
      const firstDiagram = project.diagrams[0];
      setSelectedDiagramId(firstDiagram.id);
      setDiagramContent(firstDiagram.content);
    }
  }, [project?.diagrams, selectedDiagramId]);

  // Update content when diagram changes
  useEffect(() => {
    if (selectedDiagram) {
      setDiagramContent(selectedDiagram.content);
    }
  }, [selectedDiagram]);

  const handleDiagramContentChange = (newContent: string) => {
    setDiagramContent(newContent);
  };

  const handleSaveDiagram = async () => {
    if (!selectedDiagramId) return;

    setIsSaving(true);
    try {
      await actions.updateDiagram(selectedDiagramId, {
        content: diagramContent,
      });
      toast.success('Diagram saved successfully!');
    } catch (error) {
      console.error('Error saving diagram:', error);
      toast.error('Failed to save diagram');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateDiagram = async (data: CreateDiagramInput) => {
    try {
      const newDiagram = await actions.createDiagram(data);
      setSelectedDiagramId(newDiagram.id);
      setDiagramContent(newDiagram.content);
      setIsCreateDialogOpen(false);
      form.reset();
      toast.success('Diagram created successfully!');
    } catch (error) {
      console.error('Error creating diagram:', error);
      toast.error('Failed to create diagram');
    }
  };

  const handleDeleteDiagram = async (diagramId: string) => {
    if (!confirm('Are you sure you want to delete this diagram?')) return;

    try {
      await actions.deleteDiagram(diagramId);
      if (selectedDiagramId === diagramId) {
        const remainingDiagrams = project?.diagrams.filter(d => d.id !== diagramId);
        if (remainingDiagrams?.length) {
          setSelectedDiagramId(remainingDiagrams[0].id);
          setDiagramContent(remainingDiagrams[0].content);
        } else {
          setSelectedDiagramId(null);
          setDiagramContent('');
        }
      }
      toast.success('Diagram deleted successfully!');
    } catch (error) {
      console.error('Error deleting diagram:', error);
      toast.error('Failed to delete diagram');
    }
  };

  const handleCursorChange = (line: number, column: number) => {
    if (selectedDiagramId) {
      actions.updateCursor(selectedDiagramId, line, column);
    }
  };

  const getDefaultDiagramContent = () => {
    const syntax = selectedDiagram?.syntax || 'dbml';
    if (syntax === 'dbml') {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Project not found'}
          </h1>
          <p className="text-gray-600">
            The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            {project.description && (
              <p className="text-gray-600 mt-1">{project.description}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            {/* Active Users */}
            {activeUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <div className="flex -space-x-2">
                  {activeUsers.slice(0, 3).map((user) => (
                    <Avatar key={user.socketId} className="w-8 h-8 border-2 border-white">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {activeUsers.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                      +{activeUsers.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button 
                onClick={handleSaveDiagram} 
                disabled={!selectedDiagramId || isSaving}
                size="sm"
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Diagram
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={form.handleSubmit(handleCreateDiagram)}>
                    <DialogHeader>
                      <DialogTitle>Create New Diagram</DialogTitle>
                      <DialogDescription>
                        Add a new diagram to your project
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Diagram Name</Label>
                        <Input
                          id="name"
                          placeholder="User Management ER Diagram"
                          {...form.register('name')}
                        />
                        {form.formState.errors.name && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.name.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your diagram..."
                          {...form.register('description')}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Create Diagram</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
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
              {project.diagrams.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No diagrams yet</p>
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create First Diagram
                  </Button>
                </div>
              ) : (
                project.diagrams.map((diagram) => (
                  <Card
                    key={diagram.id}
                    className={`cursor-pointer transition-all ${
                      selectedDiagramId === diagram.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => {
                      setSelectedDiagramId(diagram.id);
                      setDiagramContent(diagram.content);
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{diagram.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDiagram(diagram.id);
                          }}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {diagram.description && (
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {diagram.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(diagram.updatedAt).toLocaleDateString()}</span>
                        <Badge variant="outline">{diagram.syntax}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="chat" className="p-4">
              <div className="text-center py-8 text-gray-600">
                Chat feature coming soon...
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="p-4">
              <div className="text-center py-8 text-gray-600">
                Activity feed coming soon...
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Editor Area */}
        <div className="flex-1">
          {selectedDiagramId ? (
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full flex flex-col">
                  <div className="bg-white border-b px-4 py-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Editor</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{selectedDiagram?.syntax?.toUpperCase() || 'DBML'}</Badge>
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
                      onCursorChange={handleCursorChange}
                      syntax={selectedDiagram?.syntax || 'dbml'}
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
                      content={diagramContent || getDefaultDiagramContent()} 
                      syntax={selectedDiagram?.syntax || 'dbml'}
                    />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No diagram selected
                </h3>
                <p className="text-gray-600 mb-4">
                  Select a diagram from the sidebar or create a new one to get started.
                </p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create New Diagram
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectPage() {
  return (
    <SocketProvider>
      <ProjectPageContent />
    </SocketProvider>
  );
}