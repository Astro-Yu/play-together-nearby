import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, DollarSign, MessageSquare, Star } from 'lucide-react';

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
  hostName: string;
  hostRating: number;
  joinStatus?: 'none' | 'applied' | 'confirmed';
}

interface GuestGatheringCardProps {
  gathering: Gathering;
  onJoin: (id: number) => void;
}

const GuestGatheringCard = ({ gathering, onJoin }: GuestGatheringCardProps) => {
  const getJoinButton = () => {
    if (gathering.joinStatus === 'applied') {
      return (
        <Button disabled className="flex-1 bg-yellow-100 text-yellow-800">
          신청 완료
        </Button>
      );
    }
    if (gathering.joinStatus === 'confirmed') {
      return (
        <Button disabled className="flex-1 bg-green-100 text-green-800">
          참여 확정
        </Button>
      );
    }
    if (gathering.currentParticipants >= gathering.maxParticipants) {
      return (
        <Button disabled className="flex-1 bg-gray-100 text-gray-500">
          모집 완료
        </Button>
      );
    }
    return (
      <Button 
        onClick={() => onJoin(gathering.id)}
        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
      >
        참여 신청
      </Button>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', { 
      month: 'long', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const isFull = gathering.currentParticipants >= gathering.maxParticipants;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl text-gray-900 mb-2">
              {gathering.sport} 참여자 모집
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
          <div className="text-right">
            {isFull ? (
              <Badge className="bg-red-100 text-red-800">모집완료</Badge>
            ) : (
              <Badge className="bg-green-100 text-green-800">모집중</Badge>
            )}
          </div>
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

        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
          <div>
            <span className="text-sm text-gray-600">호스트: </span>
            <span className="font-medium text-gray-900">{gathering.hostName}</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{gathering.hostRating}</span>
          </div>
        </div>

        {gathering.description && (
          <div className="flex items-start text-gray-600">
            <MessageSquare className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{gathering.description}</p>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          {getJoinButton()}
          <Button variant="outline" className="px-6">
            상세보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestGatheringCard;
