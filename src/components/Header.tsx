import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useUserProfileContext } from '@/App';

interface HeaderProps {
  userName: string;
  userRole: 'host' | 'guest' | null;
  onRoleReset: () => void;
}

const Header = ({ userName, userRole, onRoleReset }: HeaderProps) => {
  const { setIsProfileModalOpen } = useUserProfileContext();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">농구 게더</h1>
          </div>
          {userRole && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRoleReset}
              className="text-sm"
            >
              역할 변경
            </Button>
          )}
          {userName && (
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="ml-4 text-gray-700 font-medium hover:text-blue-600 transition-colors cursor-pointer"
            >
              {userName}님
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 