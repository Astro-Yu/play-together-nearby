import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, MapPin, Star } from 'lucide-react';
import RoleSelection from '@/components/RoleSelection';
import HostDashboard from '@/components/HostDashboard';
import GuestDashboard from '@/components/GuestDashboard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import UserProfileModal from '@/components/UserProfileModal';
import { useUserProfileContext } from '@/App';
import Header from '@/components/Header';

export type UserRole = 'host' | 'guest' | null;

const Index = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState<string>('');
  const [loginName, setLoginName] = useState<string>('');
  const [loginOpen, setLoginOpen] = useState<boolean>(true);
  
  const { userProfile, setUserProfile, isProfileModalOpen, setIsProfileModalOpen } = useUserProfileContext();

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
  };

  const handleRoleReset = () => {
    setUserRole(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginName.trim()) {
      const userName = loginName.trim();
      setUserName(userName);
      
      // 사용자 프로필 정보 생성
      const mockProfile = {
        name: userName,
        experience: Math.floor(Math.random() * 10) + 1, // 1-10년 랜덤
        preferredPosition: ['가드', '포워드', '센터', '무관'][Math.floor(Math.random() * 4)],
        location: ['서울 강남구', '서울 송파구', '서울 마포구', '서울 성동구'][Math.floor(Math.random() * 4)],
      };
      setUserProfile(mockProfile);
      setLoginOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* 로그인 다이얼로그 */}
      <Dialog open={loginOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>로그인</DialogTitle>
            <DialogDescription>이름을 입력하고 시작하세요</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              placeholder="이름을 입력하세요"
              value={loginName}
              onChange={e => setLoginName(e.target.value)}
              autoFocus
              maxLength={12}
            />
            <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-2">
              시작하기
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* Header */}
      <Header 
        userName={userName} 
        userRole={userRole} 
        onRoleReset={handleRoleReset} 
      />
      {/* User Profile Modal */}
      {userProfile && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          userProfile={userProfile}
        />
      )}
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {!userName ? null :
          (!userRole ? (
            <>
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  함께 농구할 사람을 찾아보세요
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  호스트가 되어 인원을 모집하거나, 게스트로 참여하세요
                </p>
              </div>
              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="text-center p-6">
                  <CardHeader>
                    <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <CardTitle className="text-lg">위치 기반 매칭</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      내 주변에서 진행되는 농구 모임을 쉽게 찾아보세요
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card className="text-center p-6">
                  <CardHeader>
                    <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <CardTitle className="text-lg">실시간 모집</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      원하는 시간대의 농구 모임에 즉시 참여할 수 있어요
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card className="text-center p-6">
                  <CardHeader>
                    <Star className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <CardTitle className="text-lg">신뢰 평점 시스템</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      참여자들의 평점을 통해 안전하고 즐거운 모임을 보장해요
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
              <RoleSelection onRoleSelect={handleRoleSelect} />
            </>
          ) : userRole === 'host' ? (
            <HostDashboard userName={userName} onRoleReset={handleRoleReset} />
          ) : (
            <GuestDashboard userName={userName} onRoleReset={handleRoleReset} />
          ))}
      </main>
    </div>
  );
};

export default Index;
