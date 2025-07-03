import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, MapPin } from 'lucide-react';

interface UserProfile {
  name: string;
  experience: number; // 농구 구력 (년)
  preferredPosition: string; // 선호 포지션
  location?: string; // 지역 (선택사항)
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

const UserProfileModal = ({ isOpen, onClose, userProfile }: UserProfileModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            사용자 정보
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* 사용자 이름 */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900">{userProfile.name}님</h3>
          </div>
          
          {/* 농구 구력 */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">농구 구력</p>
              <p className="font-medium">{userProfile.experience}년</p>
            </div>
          </div>
          
          {/* 선호 포지션 */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">선호 포지션</p>
              <Badge variant="secondary" className="mt-1">
                {userProfile.preferredPosition}
              </Badge>
            </div>
          </div>
          
          {/* 지역 (있는 경우) */}
          {userProfile.location && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">활동 지역</p>
                <p className="font-medium">{userProfile.location}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal; 