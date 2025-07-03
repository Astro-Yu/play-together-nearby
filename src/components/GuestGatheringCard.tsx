import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, DollarSign, MessageSquare, Star, Copy } from 'lucide-react';
import { useState } from 'react';

interface Gathering {
  id: number;
  sport: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  guardCount: number;
  forwardCount: number;
  centerCount: number;
  gender: string;
  currentParticipants: number;
  cost: string;
  description: string;
  hostName: string;
  hostRating: number;
  joinStatus?: 'none' | 'applied' | 'confirmed';
  level?: string;
  courtType?: '실내' | '야외';
}

interface GuestGatheringCardProps {
  gathering: Gathering;
  onJoin: (id: number) => void;
}

const GuestGatheringCard = ({ gathering, onJoin }: GuestGatheringCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (gathering.location) {
      await navigator.clipboard.writeText(gathering.location);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

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
    const isFull = gathering.currentParticipants >= (gathering.guardCount + gathering.forwardCount + gathering.centerCount);
    if (isFull) {
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

  const isFull = gathering.currentParticipants >= (gathering.guardCount + gathering.forwardCount + gathering.centerCount);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {gathering.level && (
                <Badge
                  className={
                    gathering.level === '실력 무관'
                      ? 'bg-black text-white'
                      : gathering.level === '초보 환영'
                      ? 'bg-green-100 text-green-700'
                      : gathering.level === '중수'
                      ? 'bg-yellow-100 text-yellow-800'
                      : gathering.level === '고수'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }
                >
                  {gathering.level}
                </Badge>
              )}
              {gathering.gender && (
                <Badge
                  className={
                    gathering.gender === '남'
                      ? 'bg-blue-100 text-blue-700'
                      : gathering.gender === '여'
                      ? 'bg-pink-100 text-pink-700'
                      : 'bg-gray-200 text-gray-700'
                  }
                >
                  {gathering.gender === '무관' ? '성별 무관' : gathering.gender}
                </Badge>
              )}
              {gathering.courtType && (
                <Badge className={gathering.courtType === '실내' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}>
                  {gathering.courtType}
                </Badge>
              )}
            </div>
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
                {gathering.startTime} ~ {gathering.endTime}
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
          <button
            type="button"
            className="ml-2 p-1 rounded hover:bg-gray-100"
            onClick={handleCopy}
            title="주소 복사"
          >
            <Copy className="w-4 h-4" />
          </button>
          {copied && (
            <span className="ml-2 text-xs text-green-600">복사됨!</span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600 gap-4">
            <span className="text-sm">가드: {gathering.guardCount}명</span>
            <span className="text-sm">포워드: {gathering.forwardCount}명</span>
            <span className="text-sm">센터: {gathering.centerCount}명</span>
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
