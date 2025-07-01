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

interface GatheringType {
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
  joinStatus: 'none' | 'applied' | 'confirmed' | 'completed';
  hostRatingGiven?: number;
}

const GuestDashboard = () => {
  const [gatherings, setGatherings] = useState<GatheringType[]>([]);
  const [filteredGatherings, setFilteredGatherings] = useState<GatheringType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [hostRatings, setHostRatings] = useState<{ [key: number]: number }>({});
  const [hostRated, setHostRated] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (mockGuestGatherings && mockGuestGatherings.length > 0) {
      setGatherings(mockGuestGatherings);
      setFilteredGatherings(mockGuestGatherings);
    }
  }, []);

  const handleSearch = () => {
    let filtered = gatherings;
    
    if (searchTerm) {
      filtered = filtered.filter(g => 
        g.sport.includes(searchTerm) || 
        g.location.includes(searchTerm) ||
        g.description.includes(searchTerm)
      );
    }
    
    if (sportFilter && sportFilter !== 'all') {
      filtered = filtered.filter(g => g.sport === sportFilter);
    }
    
    if (locationFilter && locationFilter !== 'all') {
      filtered = filtered.filter(g => g.location.includes(locationFilter));
    }
    
    setFilteredGatherings(filtered);
  };

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

  const handleHostRateComplete = (gatheringId: number) => {
    setGatherings(prev => prev.map(g =>
      g.id === gatheringId ? { ...g, joinStatus: 'completed', hostRatingGiven: hostRatings[gatheringId] } : g
    ));
    setHostRated(prev => ({ ...prev, [gatheringId]: true }));
  };

  const handleHostStarClick = (gatheringId: number, value: number) => {
    setHostRatings(prev => ({ ...prev, [gatheringId]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="search">모임 찾기</TabsTrigger>
          <TabsTrigger value="my">내가 참여한 모임</TabsTrigger>
        </TabsList>
        <TabsContent value="search">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">모임 찾기</h2>
            <p className="text-gray-600">원하는 스포츠 모임을 찾아 참여해보세요</p>
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
                  <Select value={sportFilter} onValueChange={setSportFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="종목 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="농구">농구</SelectItem>
                      <SelectItem value="풋살">풋살</SelectItem>
                      <SelectItem value="배드민턴">배드민턴</SelectItem>
                      <SelectItem value="테니스">테니스</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Button 
                    onClick={handleSearch} 
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
                  gathering={gathering}
                  onJoin={handleJoinGathering}
                />
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
                            <span>{gathering.time}</span>
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
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-medium">호스트 별점 남기기:</span>
                        {[1,2,3,4,5].map(i => (
                          <Star
                            key={i}
                            className={`w-7 h-7 cursor-pointer ${i <= (hostRatings[gathering.id] || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill={i <= (hostRatings[gathering.id] || 0) ? '#facc15' : 'none'}
                            onClick={() => handleHostStarClick(gathering.id, i)}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">{hostRatings[gathering.id] || 0}점</span>
                        <Button
                          className="ml-4 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-2"
                          disabled={!(hostRatings[gathering.id] > 0)}
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
                        <span className="ml-2 text-sm text-gray-500">{gathering.hostRatingGiven || 0}점</span>
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
