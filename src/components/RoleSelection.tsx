
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Search } from 'lucide-react';
import { UserRole } from '@/pages/Index';

interface RoleSelectionProps {
  onRoleSelect: (role: UserRole) => void;
}

const RoleSelection = ({ onRoleSelect }: RoleSelectionProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">역할을 선택해주세요</h3>
        <p className="text-gray-600">호스트로 모집하거나, 게스트로 참여하세요</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card 
          className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-orange-300"
          onClick={() => onRoleSelect('host')}
        >
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-orange-600">호스트</CardTitle>
            <CardDescription className="text-lg">인원을 모집하고 싶어요</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <ul className="space-y-2 text-gray-600 mb-6">
              <li>• 모집 글 작성</li>
              <li>• 참여자 관리</li>
              <li>• 모임 진행</li>
            </ul>
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3"
              onClick={(e) => {
                e.stopPropagation();
                onRoleSelect('host');
              }}
            >
              호스트로 시작하기
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-blue-300"
          onClick={() => onRoleSelect('guest')}
        >
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-blue-600">게스트</CardTitle>
            <CardDescription className="text-lg">모임에 참여하고 싶어요</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <ul className="space-y-2 text-gray-600 mb-6">
              <li>• 모임 탐색</li>
              <li>• 참여 신청</li>
              <li>• 운동 참여</li>
            </ul>
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3"
              onClick={(e) => {
                e.stopPropagation();
                onRoleSelect('guest');
              }}
            >
              게스트로 시작하기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelection;
