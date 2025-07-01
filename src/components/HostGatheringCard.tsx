import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, DollarSign, MessageSquare, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';

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
  guestRatings?: { [key: number]: number };
}

interface HostGatheringCardProps {
  gathering: Gathering;
  onUpdate: (id: number, updates: any) => void;
}

const HostGatheringCard = ({ gathering, onUpdate }: HostGatheringCardProps) => {
  const [open, setOpen] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [rated, setRated] = useState(false);

  // 평가 완료 시 모든 게스트 평가 여부 확인
  useEffect(() => {
    if (gathering.status === 'full' && rateOpen) {
      const approved = gathering.participants.filter((p: any) => p.status === 'approved');
      if (approved.length > 0 && approved.every((p: any) => ratings[p.id])) {
        setRated(true);
      } else {
        setRated(false);
      }
    }
  }, [ratings, gathering, rateOpen]);

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
      // 모집 완료로 변경 시 대기중 참여자 거부 처리
      const updatedParticipants = gathering.participants.map((p: any) =>
        p.status === 'pending' ? { ...p, status: 'rejected' } : p
      );
      onUpdate(gathering.id, { status: 'full', participants: updatedParticipants });
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

  // 참여자 상태 변경 핸들러
  const handleParticipantStatus = (participantId: number, status: 'approved' | 'rejected') => {
    const updatedParticipants = gathering.participants.map((p: any) =>
      p.id === participantId ? { ...p, status } : p
    );
    onUpdate(gathering.id, { participants: updatedParticipants });
  };

  // 별 클릭 핸들러
  const handleStarClick = (id: number, value: number) => {
    setRatings(prev => ({ ...prev, [id]: value }));
  };

  // 평가 완료 버튼 클릭 시 모집글 상태를 completed로 변경
  const handleRateComplete = () => {
    onUpdate(gathering.id, { status: 'completed', guestRatings: ratings });
    setRateOpen(false);
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

        {/* 참여자 관리 모달 */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>참여자 관리</DialogTitle>
            </DialogHeader>
            {gathering.participants && gathering.participants.length > 0 ? (
              <div className="space-y-2">
                {gathering.participants.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <span className="text-gray-700">{p.name}</span>
                    {p.status === 'pending' && (
                      <>
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1" onClick={() => handleParticipantStatus(p.id, 'approved')}>
                          참여 승인
                        </Button>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white px-3 py-1" onClick={() => handleParticipantStatus(p.id, 'rejected')}>
                          거부
                        </Button>
                        <Badge className="bg-yellow-100 text-yellow-800 ml-2">대기중</Badge>
                      </>
                    )}
                    {p.status === 'approved' && <Badge className="bg-green-100 text-green-800">참여 승인</Badge>}
                    {p.status === 'rejected' && <Badge className="bg-red-100 text-red-800">거부됨</Badge>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">아직 신청한 참여자가 없습니다.</div>
            )}
          </DialogContent>
        </Dialog>

        {/* 운동 완료 시 평점 모달 */}
        <Dialog open={rateOpen} onOpenChange={setRateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>게스트 평점 남기기</DialogTitle>
            </DialogHeader>
            {gathering.participants && gathering.participants.filter((p: any) => p.status === 'approved').length > 0 ? (
              <div className="space-y-4">
                {gathering.participants.filter((p: any) => p.status === 'approved').map((p: any) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="text-gray-800 font-medium w-20">{p.name}</span>
                    {[1,2,3,4,5].map(i => (
                      <Star
                        key={i}
                        className={`w-7 h-7 cursor-pointer ${i <= (ratings[p.id] || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill={i <= (ratings[p.id] || 0) ? '#facc15' : 'none'}
                        onClick={() => handleStarClick(p.id, i)}
                        data-testid={`star-${p.id}-${i}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">{ratings[p.id] || 0}점</span>
                  </div>
                ))}
                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-2 mt-4"
                  disabled={!rated}
                  onClick={handleRateComplete}
                >
                  평가 완료
                </Button>
              </div>
            ) : (
              <div className="text-gray-500">참여 승인된 게스트가 없습니다.</div>
            )}
          </DialogContent>
        </Dialog>

        {/* 운동 완료 상태에서 별점만 보기 */}
        {gathering.status === 'completed' && gathering.guestRatings && (
          <div className="pt-2">
            <div className="font-semibold mb-2 text-gray-800">게스트 평점 결과</div>
            <div className="space-y-2">
              {gathering.participants.filter((p: any) => p.status === 'approved').map((p: any) => (
                <div key={p.id} className="flex items-center gap-2">
                  <span className="text-gray-700 w-20">{p.name}</span>
                  {[1,2,3,4,5].map(i => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i <= (gathering.guestRatings?.[p.id] || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill={i <= (gathering.guestRatings?.[p.id] || 0) ? '#facc15' : 'none'}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">{gathering.guestRatings?.[p.id] || 0}점</span>
                </div>
              ))}
            </div>
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
              onClick={() => setRateOpen(true)}
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
          <Button variant="outline" className="px-6" onClick={() => setOpen(true)} disabled={gathering.status !== 'recruiting'}>
            참여자 관리
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HostGatheringCard;
