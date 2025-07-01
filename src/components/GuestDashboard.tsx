import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import GuestGatheringCard from '@/components/GuestGatheringCard';
import { mockGuestGatherings } from '@/data/mockData';

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
  joinStatus: 'none' | 'applied' | 'confirmed';
}

const GuestDashboard = () => {
  const [gatherings, setGatherings] = useState<GatheringType[]>(mockGuestGatherings);
  const [filteredGatherings, setFilteredGatherings] = useState<GatheringType[]>(mockGuestGatherings);
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    console.log('GuestDashboard mounted');
    console.log('mockGuestGatherings:', mockGuestGatherings);
    console.log('gatherings state:', gatherings);
    console.log('filteredGatherings state:', filteredGatherings);
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
    
    if (sportFilter) {
      filtered = filtered.filter(g => g.sport === sportFilter);
    }
    
    if (locationFilter) {
      filtered = filtered.filter(g => g.location.includes(locationFilter));
    }
    
    setFilteredGatherings(filtered);
  };

  const handleJoinGathering = (id: number) => {
    console.log('Joining gathering with id:', id);
    setGatherings(gatherings.map(g => 
      g.id === id 
        ? { 
            ...g, 
            currentParticipants: g.currentParticipants + 1,
            joinStatus: 'applied' as const
          } 
        : g
    ));
    setFilteredGatherings(filteredGatherings.map(g => 
      g.id === id 
        ? { 
            ...g, 
            currentParticipants: g.currentParticipants + 1,
            joinStatus: 'applied' as const
          } 
        : g
    ));
  };

  return (
    <div className="max-w-4xl mx-auto">
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
                  <SelectItem value="">전체</SelectItem>
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
                  <SelectItem value="">전체</SelectItem>
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
                검색 결과가 없습니다
              </h3>
              <p className="text-gray-600">
                다른 조건으로 검색해보세요
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
    </div>
  );
};

export default GuestDashboard;
