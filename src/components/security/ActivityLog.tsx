import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Globe, Smartphone, Laptop } from "lucide-react";

interface ActivityEvent {
  id: string;
  type: 'login' | 'profile_update' | 'subscription_change' | 'password_change';
  device: string;
  location: string;
  timestamp: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  status: 'success' | 'failed';
}

const ActivityLog = () => {
  const [activities] = useState<ActivityEvent[]>([
    {
      id: '1',
      type: 'login',
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      timestamp: new Date().toISOString(),
      deviceType: 'desktop',
      status: 'success'
    },
    {
      id: '2',
      type: 'profile_update',
      device: 'Safari on iPhone',
      location: 'Delhi, India',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      deviceType: 'mobile',
      status: 'success'
    },
    {
      id: '3',
      type: 'subscription_change',
      device: 'Firefox on MacBook',
      location: 'Bangalore, India',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      deviceType: 'desktop',
      status: 'success'
    }
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'desktop':
        return <Laptop className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getActivityTitle = (type: string) => {
    switch (type) {
      case 'login':
        return 'Sign in';
      case 'profile_update':
        return 'Profile updated';
      case 'subscription_change':
        return 'Subscription changed';
      case 'password_change':
        return 'Password changed';
      default:
        return 'Activity';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 border-b pb-4 last:border-0">
              <div className="p-2 bg-muted rounded-full">
                {getActivityIcon(activity.deviceType)}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{getActivityTitle(activity.type)}</p>
                  <Badge variant={activity.status === 'success' ? 'default' : 'destructive'}>
                    {activity.status}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {activity.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Laptop className="h-4 w-4" />
                    {activity.device}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(activity.timestamp)}
                    <Clock className="h-4 w-4 ml-2" />
                    {formatTime(activity.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLog; 