import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, DollarSign, MessageSquare, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';

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
  status: 'recruiting' | 'full' | 'completed';
  participants: { id: number; name: string; status: 'pending' | 'approved' | 'rejected'; position: string; rating: number }[];
  guestRatings?: { [key: number]: number };
  guestTags?: { [key: number]: string };
  level?: string;
  courtType?: string;
}

interface HostGatheringCardProps {
  gathering: Gathering;
  onUpdate: (id: number, updates: any) => void;
}

const TAG_OPTIONS = [
  '#친절', '#매너 좋음', '#고수', '#과격함', '#소통', '#시간 엄수', '#무단 결석', '#추천하고 싶음', '#또 하고 싶음'
];

const HostGatheringCard = ({ gathering, onUpdate }: HostGatheringCardProps) => {
  const [open, setOpen] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [rated, setRated] = useState(false);
  const [guestTags, setGuestTags] = useState<{ [key: number]: string }>({});
  const [noShowTarget, setNoShowTarget] = useState<number|null>(null);
  const [noShowDialogOpen, setNoShowDialogOpen] = useState(false);
  const [noShowMap, setNoShowMap] = useState<{ [key: number]: boolean }>({});

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
  const handleParticipantStatus = (participantId: number, status: 'approved' | 'rejected' | 'pending') => {
    const updatedParticipants = gathering.participants.map((p: any) =>
      p.id === participantId ? { ...p, status } : p
    );
    onUpdate(gathering.id, { participants: updatedParticipants });
  };

  // 별 클릭 핸들러
  const handleStarClick = (id: number, value: number) => {
    setRatings(prev => ({ ...prev, [id]: value }));
  };

  // 노쇼 처리 핸들러
  const handleNoShow = (id: number) => {
    setNoShowTarget(id);
    setNoShowDialogOpen(true);
  };

  const confirmNoShow = () => {
    if (noShowTarget !== null) {
      setRatings(prev => ({ ...prev, [noShowTarget]: 0 }));
      setNoShowMap(prev => ({ ...prev, [noShowTarget]: true }));
      setNoShowDialogOpen(false);
      setNoShowTarget(null);
    }
  };

  const cancelNoShow = (id: number) => {
    setNoShowMap(prev => ({ ...prev, [id]: false }));
    setRatings(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleGuestTagSelect = (participantId: number, tag: string) => {
    setGuestTags(prev => ({ ...prev, [participantId]: tag }));
  };

  // 평가 완료 버튼 클릭 시 모집글 상태를 completed로 변경
  const handleRateComplete = () => {
    onUpdate(gathering.id, { status: 'completed', guestRatings: ratings, guestTags });
    setRateOpen(false);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
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
              농구 모집
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
          {getStatusBadge(gathering.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{gathering.location}</span>
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
                    <span className="text-gray-700 w-20">{p.name}</span>
                    <span className="text-xs text-gray-500 w-14">{p.position}</span>
                    <span className="text-xs text-gray-500 w-14">{p.career ?? '-'}</span>
                    <span className="ml-1 text-sm text-yellow-600 font-semibold w-10">{typeof p.rating === 'number' ? p.rating.toFixed(1) : '-'}</span>
                    <div className="flex-1" />
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        size="icon"
                        className={p.status === 'approved' ? 'p-1 bg-green-500 text-white' : 'p-1 bg-gray-200 text-gray-500'}
                        onClick={() => handleParticipantStatus(p.id, 'approved')}
                        variant="default"
                        disabled={p.status === 'approved'}
                      >
                        <span className="text-lg">O</span>
                      </Button>
                      <Button
                        size="icon"
                        className={p.status === 'rejected' ? 'p-1 bg-red-500 text-white' : 'p-1 bg-gray-200 text-gray-500'}
                        onClick={() => handleParticipantStatus(p.id, 'rejected')}
                        variant="default"
                        disabled={p.status === 'rejected'}
                      >
                        <span className="text-lg">X</span>
                      </Button>
                      {p.status === 'pending' && <Badge className="bg-yellow-100 text-yellow-800 ml-2">대기중</Badge>}
                      {p.status === 'approved' && <Badge className="bg-green-100 text-green-800 ml-2">참여 승인</Badge>}
                      {p.status === 'rejected' && <Badge className="bg-red-100 text-red-800 ml-2">거부됨</Badge>}
                    </div>
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
                  <div key={p.id} className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-800 font-medium w-20">{p.name}</span>
                      <Star
                        key={0}
                        className={`w-7 h-7 cursor-pointer text-gray-300 ${noShowMap[p.id] ? 'opacity-50 pointer-events-none' : ''}`}
                        fill="none"
                        stroke="#facc15"
                        onClick={() => !noShowMap[p.id] && handleStarClick(p.id, 0)}
                        data-testid={`star-${p.id}-0`}
                      />
                      {[1,2,3,4,5].map(i => (
                        <Star
                          key={i}
                          className={`w-7 h-7 cursor-pointer ${(i <= (ratings[p.id] || 0)) ? 'text-yellow-400' : 'text-gray-300'} ${noShowMap[p.id] ? 'opacity-50 pointer-events-none' : ''}`}
                          fill={i <= (ratings[p.id] || 0) ? '#facc15' : 'none'}
                          stroke={'#facc15'}
                          onClick={() => !noShowMap[p.id] && handleStarClick(p.id, i)}
                          data-testid={`star-${p.id}-${i}`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">{ratings[p.id] ?? 0}점</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="ml-2 px-2 py-1 text-xs"
                        onClick={() => handleNoShow(p.id)}
                        disabled={noShowMap[p.id]}
                      >
                        노쇼
                      </Button>
                      {noShowMap[p.id] && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-2 px-2 py-1 text-xs border-green-500 text-green-700"
                          onClick={() => cancelNoShow(p.id)}
                        >
                          노쇼 취소
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 font-medium">태그:</span>
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={guestTags[p.id] || ''}
                        onChange={e => handleGuestTagSelect(p.id, e.target.value)}
                      >
                        <option value="">태그 선택</option>
                        {TAG_OPTIONS.map(tag => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-2 mt-4"
                  disabled={!gathering.participants.filter((p: any) => p.status === 'approved').every(p => ratings[p.id] !== undefined && guestTags[p.id])}
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

        {/* 운동 완료 상태에서 별점/태그만 보기 */}
        {gathering.status === 'completed' && gathering.guestRatings && (
          <div className="pt-2">
            <div className="font-semibold mb-2 text-gray-800">게스트 평점 결과</div>
            <div className="space-y-2">
              {gathering.participants.filter((p: any) => p.status === 'approved').map((p: any) => (
                <div key={p.id} className="flex items-center gap-2">
                  <span className="text-gray-700 w-20">{p.name}</span>
                  <Star
                    key={0}
                    className="w-5 h-5 text-gray-300"
                    fill="none"
                    stroke="#facc15"
                  />
                  {[1,2,3,4,5].map(i => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${(i <= (gathering.guestRatings?.[p.id] || 0)) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill={i <= (gathering.guestRatings?.[p.id] || 0) ? '#facc15' : 'none'}
                      stroke={'#facc15'}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">{gathering.guestRatings?.[p.id] ?? 0}점</span>
                  {gathering.guestTags && gathering.guestTags[p.id] && (
                    <span className="ml-2 text-xs bg-gray-100 rounded px-2 py-1">{gathering.guestTags[p.id]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <div className="flex gap-2 pt-4 px-6 pb-6">
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

      {/* 노쇼 처리 모달 */}
      <AlertDialog open={noShowDialogOpen} onOpenChange={setNoShowDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 노쇼 처리 하시겠습니까?</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="text-sm text-gray-700 mb-4">노쇼 처리 시 별점이 <span className="font-bold text-red-600">0점</span>으로 고정됩니다.</div>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmNoShow}>노쇼 처리</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default HostGatheringCard;