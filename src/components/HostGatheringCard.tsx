import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, DollarSign, MessageSquare } from 'lucide-react';

interface Gathering {
  id: number;
  sport: string;
  location: string;
  date: string;
  time: string;
  maxParticipants: number;
  currentParticipants: number;
  cost: string;
  description: string;
  status: 'recruiting' | 'full' | 'completed';
  participants: any[];
}

interface HostGatheringCardProps {
  gathering: Gathering;
  onUpdate: (id: number, updates: any) => void;
}

const HostGatheringCard = ({ gathering, onUpdate }: HostGatheringCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'recruiting':
        return <Badge className="bg-green-100 text-green-800">모집중</Badge>;
      case 'full':
        return <Badge className="bg-blue-100 text-blue-800">모집완료</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">완료</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleStatusChange = () => {
    if (gathering.status === 'recruiting') {
      onUpdate(gathering.id, { status: 'full' });
    } else if (gathering.status === 'full') {
      onUpdate(gathering.id, { status: 'completed' });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', { 
      month: 'long', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-gray-900 mb-2">
              {gathering.sport} 모집
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(gathering.date)}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {gathering.time}
              </div>
            </div>
          </div>
          {getStatusBadge(gathering.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{gathering.location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {gathering.currentParticipants}/{gathering.maxParticipants}명
            </span>
          </div>
          
          {gathering.cost && (
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-1" />
              <span className="text-sm">{gathering.cost}</span>
            </div>
          )}
        </div>

        {gathering.description && (
          <div className="flex items-start text-gray-600">
            <MessageSquare className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{gathering.description}</p>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          {gathering.status === 'recruiting' && (
            <Button 
              onClick={handleStatusChange}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              모집 완료로 변경
            </Button>
          )}
          {gathering.status === 'full' && (
            <Button 
              onClick={handleStatusChange}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              운동 완료
            </Button>
          )}
          {gathering.status === 'completed' && (
            <Button 
              disabled
              className="flex-1 bg-gray-100 text-gray-500"
            >
              완료된 모집
            </Button>
          )}
          <Button variant="outline" className="px-6">
            참여자 관리
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HostGatheringCard;
