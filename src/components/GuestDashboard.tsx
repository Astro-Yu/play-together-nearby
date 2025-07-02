import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import GuestGatheringCard from '@/components/GuestGatheringCard';
import { mockGuestGatherings } from '@/data/mockData';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Star } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, DollarSign, MessageSquare } from 'lucide-react';

interface GatheringType {
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
  joinStatus: 'none' | 'applied' | 'confirmed' | 'completed';
  hostRatingGiven?: number;
  level?: string;
  hostTagGiven?: string;
  createdAt: string;
}

const TAG_OPTIONS = [
  '#친절', '#매너 좋음', '#고수', '#과격함', '#소통', '#시간 엄수', '#무단 결석', '#추천하고 싶음', '#또 하고 싶음'
];

const GuestDashboard = () => {
  const [gatherings, setGatherings] = useState<GatheringType[]>([]);
  const [filteredGatherings, setFilteredGatherings] = useState<GatheringType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [startTimeFilter, setStartTimeFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [hostRatings, setHostRatings] = useState<{ [key: number]: number }>({});
  const [hostRated, setHostRated] = useState<{ [key: number]: boolean }>({});
  const [hostTags, setHostTags] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (mockGuestGatherings && mockGuestGatherings.length > 0) {
      setGatherings(mockGuestGatherings);
      setFilteredGatherings(mockGuestGatherings);
    }
  }, []);

  const handleSearch = (customSortBy?: string) => {
    let filtered = gatherings;
    if (searchTerm) {
      filtered = filtered.filter(g => 
        g.location.includes(searchTerm) ||
        g.description.includes(searchTerm)
      );
    }
    if (locationFilter && locationFilter !== 'all') {
      filtered = filtered.filter(g => g.location.includes(locationFilter));
    }
    if (startTimeFilter && startTimeFilter !== 'all') {
      filtered = filtered.filter(g => g.startTime.startsWith(startTimeFilter));
    }
    if (positionFilter && positionFilter !== 'all') {
      filtered = filtered.filter(g => {
        if (positionFilter === 'guard') return g.guardCount > 0;
        if (positionFilter === 'forward') return g.forwardCount > 0;
        if (positionFilter === 'center') return g.centerCount > 0;
        return true;
      });
    }
    if (genderFilter && genderFilter !== 'all') {
      filtered = filtered.filter(g => {
        if (genderFilter === '무관') return g.gender === '무관';
        if (genderFilter === '남') return g.gender === '남';
        if (genderFilter === '여') return g.gender === '여';
        return true;
      });
    }
    const sortKey = customSortBy || sortBy;
    if (sortKey === 'hostRating') {
      filtered = [...filtered].sort((a, b) => b.hostRating - a.hostRating);
    } else if (sortKey === 'latest') {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    setFilteredGatherings(filtered);
  };

  useEffect(() => {
    if (sortBy !== 'default') {
      handleSearch(sortBy);
    }
    // eslint-disable-next-line
  }, [sortBy]);

  const handleJoinGathering = (id: number) => {
    const updatedGatherings = gatherings.map(g => 
      g.id === id 
        ? { 
            ...g, 
            currentParticipants: g.currentParticipants + 1,
            joinStatus: 'applied' as const
          } 
        : g
    );
    const updatedFilteredGatherings = filteredGatherings.map(g => 
      g.id === id 
        ? { 
            ...g, 
            currentParticipants: g.currentParticipants + 1,
            joinStatus: 'applied' as const
          } 
        : g
    );
    
    setGatherings(updatedGatherings);
    setFilteredGatherings(updatedFilteredGatherings);
  };

  const myConfirmedGatherings = gatherings.filter(g => g.joinStatus === 'confirmed' || g.joinStatus === 'completed');

  const handleRatingChange = (id: number, value: number[]) => {
    setRatings(prev => ({ ...prev, [id]: value[0] }));
  };

  const handleHostTagSelect = (gatheringId: number, tag: string) => {
    setHostTags(prev => ({ ...prev, [gatheringId]: tag }));
  };

  const handleHostRateComplete = (gatheringId: number) => {
    setGatherings(prev => prev.map(g =>
      g.id === gatheringId ? { ...g, joinStatus: 'completed', hostRatingGiven: hostRatings[gatheringId], hostTagGiven: hostTags[gatheringId] } : g
    ));
    setHostRated(prev => ({ ...prev, [gatheringId]: true }));
  };

  const handleHostStarClick = (gatheringId: number, value: number) => {
    setHostRatings(prev => ({ ...prev, [gatheringId]: value }));
  };

  const handleCancelApply = (id: number) => {
    setGatherings(prev => prev.map(g =>
      g.id === id ? { ...g, joinStatus: 'none' as const } : g
    ));
    setFilteredGatherings(prev => prev.map(g =>
      g.id === id ? { ...g, joinStatus: 'none' as const } : g
    ));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="search">모임 찾기</TabsTrigger>
          <TabsTrigger value="applied">내가 신청한 모임</TabsTrigger>
          <TabsTrigger value="my">내가 참여한 모임</TabsTrigger>
        </TabsList>
        <TabsContent value="search">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">모임 찾기</h2>
              <p className="text-gray-600">원하는 농구 모임을 찾아 참여해보세요</p>
            </div>
            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="정렬 기준" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">기본 정렬</SelectItem>
                  <SelectItem value="hostRating">호스트 별점 순</SelectItem>
                  <SelectItem value="latest">최신순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search and Filter */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                필터 검색
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Input
                    placeholder="검색어 입력..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="지역 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="강남구">강남구</SelectItem>
                      <SelectItem value="성동구">성동구</SelectItem>
                      <SelectItem value="마포구">마포구</SelectItem>
                      <SelectItem value="송파구">송파구</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={startTimeFilter} onValueChange={setStartTimeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="시작 시간" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="09">09시대</SelectItem>
                      <SelectItem value="10">10시대</SelectItem>
                      <SelectItem value="14">14시대</SelectItem>
                      <SelectItem value="15">15시대</SelectItem>
                      <SelectItem value="18">18시대</SelectItem>
                      <SelectItem value="19">19시대</SelectItem>
                      <SelectItem value="20">20시대</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={positionFilter} onValueChange={setPositionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="포지션" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="guard">가드</SelectItem>
                      <SelectItem value="forward">포워드</SelectItem>
                      <SelectItem value="center">센터</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={genderFilter} onValueChange={setGenderFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="모집 성별" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="무관">성별 무관</SelectItem>
                      <SelectItem value="남">남</SelectItem>
                      <SelectItem value="여">여</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Button 
                    onClick={() => handleSearch()} 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    검색
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gatherings List */}
          <div className="space-y-4">
            {filteredGatherings.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto mb-4" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {gatherings.length === 0 ? '데이터를 불러오는 중...' : '검색 결과가 없습니다'}
                  </h3>
                  <p className="text-gray-600">
                    {gatherings.length === 0 ? '잠시만 기다려주세요' : '다른 조건으로 검색해보세요'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredGatherings.map((gathering) => (
                <GuestGatheringCard
                  key={gathering.id}
                  gathering={gathering as any}
                  onJoin={handleJoinGathering}
                />
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="applied">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">내가 신청한 모임</h2>
            <p className="text-gray-600">아직 확정되지 않은 신청 내역입니다</p>
          </div>
          <div className="space-y-4">
            {gatherings.filter(g => g.joinStatus === 'applied').length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto mb-4" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    신청한 모임이 없습니다
                  </h3>
                  <p className="text-gray-600">
                    모임에 신청해보세요
                  </p>
                </CardContent>
              </Card>
            ) : (
              gatherings.filter(g => g.joinStatus === 'applied').map((gathering) => (
                <Card key={gathering.id} className="hover:shadow-md transition-shadow">
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
                        </div>
                        <CardTitle className="text-xl text-gray-900 mb-2">
                          {gathering.sport} 참여자 모집
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {gathering.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {gathering.startTime} ~ {gathering.endTime}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-yellow-100 text-yellow-800">신청중</Badge>
                      </div>
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
                      <Button
                        className="flex-1 bg-red-100 text-red-700 border border-red-300"
                        onClick={() => handleCancelApply(gathering.id)}
                      >
                        신청 취소
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="my">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">내가 참여한 모임</h2>
            <p className="text-gray-600">참가 확정된 모임의 호스트에게 별점을 남겨보세요</p>
          </div>
          <div className="space-y-4">
            {myConfirmedGatherings.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-400 mb-4">
                    <Star className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    아직 참가 확정된 모임이 없습니다
                  </h3>
                  <p className="text-gray-600">
                    모임에 참여하고 호스트에게 별점을 남겨보세요
                  </p>
                </CardContent>
              </Card>
            ) : (
              myConfirmedGatherings.map((gathering) => (
                <Card key={gathering.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-gray-900 mb-2">
                          {gathering.sport} 모임
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <span className="mr-2">{gathering.date}</span>
                            <span>{gathering.startTime} - {gathering.endTime}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">장소:</span>
                            <span>{gathering.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">호스트: {gathering.hostName}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {gathering.joinStatus !== 'completed' ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 font-medium">호스트 별점 남기기:</span>
                          {[0,1,2,3,4,5].map(i => (
                            <Star
                              key={i}
                              className={`w-7 h-7 cursor-pointer ${i <= (hostRatings[gathering.id] || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill={i <= (hostRatings[gathering.id] || 0) ? '#facc15' : 'none'}
                              onClick={() => handleHostStarClick(gathering.id, i)}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-500">{hostRatings[gathering.id] ?? 0}점</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 font-medium">태그:</span>
                          <select
                            className="border rounded px-2 py-1 text-sm"
                            value={hostTags[gathering.id] || ''}
                            onChange={e => handleHostTagSelect(gathering.id, e.target.value)}
                          >
                            <option value="">태그 선택</option>
                            {TAG_OPTIONS.map(tag => (
                              <option key={tag} value={tag}>{tag}</option>
                            ))}
                          </select>
                        </div>
                        <Button
                          className="ml-4 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-2"
                          disabled={hostRatings[gathering.id] === undefined || hostTags[gathering.id] === undefined || hostTags[gathering.id] === ''}
                          onClick={() => handleHostRateComplete(gathering.id)}
                        >
                          평가 완료
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-medium">내가 남긴 호스트 평점:</span>
                        {[1,2,3,4,5].map(i => (
                          <Star
                            key={i}
                            className={`w-7 h-7 ${i <= (gathering.hostRatingGiven || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill={i <= (gathering.hostRatingGiven || 0) ? '#facc15' : 'none'}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">{gathering.hostRatingGiven ?? 0}점</span>
                        {gathering.hostTagGiven && (
                          <span className="ml-2 text-xs bg-gray-100 rounded px-2 py-1">{gathering.hostTagGiven}</span>
                        )}
                      </div>
                    )}
                    <div className="text-gray-600 text-sm">{gathering.description}</div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuestDashboard;
