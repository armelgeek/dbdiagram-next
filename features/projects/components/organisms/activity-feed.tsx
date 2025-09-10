'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Users, 
  MessageSquare, 
  Edit, 
  Trash2, 
  UserPlus, 
  UserMinus,
  Plus
} from 'lucide-react';
import { useSocket } from '@/features/projects/hooks/use-socket';

interface ActivityItem {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  action: string;
  entityType: string;
  entityId?: string;
  metadata: {
    entityName?: string;
    oldValue?: string;
    newValue?: string;
    [key: string]: any;
  };
  createdAt: string;
}

interface ActivityFeedProps {
  projectId: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ projectId }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { socket } = useSocket();

  // Load existing activities
  useEffect(() => {
    const loadActivities = async () => {
      try {
        const response = await fetch(`/api/v1/projects/${projectId}/activity`);
        if (response.ok) {
          const data = await response.json();
          setActivities(data.activities || []);
        }
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();
  }, [projectId]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewActivity = (activity: ActivityItem) => {
      setActivities(prev => [activity, ...prev]);
    };

    socket.on('activity:new', handleNewActivity);

    return () => {
      socket.off('activity:new', handleNewActivity);
    };
  }, [socket]);

  const getActivityIcon = (action: string, entityType: string) => {
    const iconClass = "h-4 w-4";
    
    switch (action) {
      case 'create':
        return <Plus className={`${iconClass} text-green-600`} />;
      case 'update':
      case 'edit':
        return <Edit className={`${iconClass} text-blue-600`} />;
      case 'delete':
        return <Trash2 className={`${iconClass} text-red-600`} />;
      case 'join':
        return <UserPlus className={`${iconClass} text-green-600`} />;
      case 'leave':
        return <UserMinus className={`${iconClass} text-orange-600`} />;
      case 'invite':
        return <Users className={`${iconClass} text-blue-600`} />;
      case 'message':
        return <MessageSquare className={`${iconClass} text-purple-600`} />;
      default:
        if (entityType === 'diagram') {
          return <FileText className={`${iconClass} text-gray-600`} />;
        }
        return <FileText className={`${iconClass} text-gray-600`} />;
    }
  };

  const getActivityMessage = (activity: ActivityItem) => {
    const { action, entityType, metadata } = activity;
    const entityName = metadata.entityName || 'item';
    
    switch (action) {
      case 'create':
        return `created ${entityType} "${entityName}"`;
      case 'update':
      case 'edit':
        return `edited ${entityType} "${entityName}"`;
      case 'delete':
        return `deleted ${entityType} "${entityName}"`;
      case 'join':
        return `joined the project`;
      case 'leave':
        return `left the project`;
      case 'invite':
        return `invited ${metadata.invitedEmail} to the project`;
      case 'message':
        return `sent a message in chat`;
      case 'cursor_move':
        return `is editing ${entityType} "${entityName}"`;
      default:
        return `performed ${action} on ${entityType}`;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'create':
      case 'join':
        return 'bg-green-100 text-green-800';
      case 'update':
      case 'edit':
      case 'invite':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'leave':
        return 'bg-orange-100 text-orange-800';
      case 'message':
        return 'bg-purple-100 text-purple-800';
      case 'cursor_move':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b bg-gray-50">
        <h3 className="text-sm font-medium text-gray-900">Recent Activity</h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No activity yet. Start collaborating!</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={activity.user.image} alt={activity.user.name} />
                  <AvatarFallback className="text-xs">
                    {activity.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {getActivityIcon(activity.action, activity.entityType)}
                    <span className="text-sm font-medium text-gray-900">
                      {activity.user.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(activity.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">
                    {getActivityMessage(activity)}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getActivityColor(activity.action)}`}
                    >
                      {activity.action}
                    </Badge>
                    {activity.entityType && (
                      <Badge variant="outline" className="text-xs">
                        {activity.entityType}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};