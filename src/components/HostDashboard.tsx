import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import CreateGatheringForm from '@/components/CreateGatheringForm';
import HostGatheringCard from '@/components/HostGatheringCard';
import { mockHostGatherings } from '@/data/mockData';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface HostDashboardProps {
  userName: string;
  onRoleReset: () => void;
}

const HostDashboard = ({ userName, onRoleReset }: HostDashboardProps) => {
  const [gatherings, setGatherings] = useState(mockHostGatherings);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateGathering = (gatheringData: any) => {
    const newGathering = {
      id: Date.now(),
      ...gatheringData,
      status: 'recruiting' as const,
      currentParticipants: 0,
      participants: [] as { id: number; name: string; status: 'pending' | 'approved' | 'rejected'; position: string; rating: number; career: string }[],
      createdAt: new Date().toISOString(),
    };
    setGatherings([newGathering, ...gatherings]);
    setDialogOpen(false);
  };

  const handleUpdateGathering = (id: number, updates: any) => {
    setGatherings(gatherings.map(g => 
      g.id === id ? { ...g, ...updates } : g
    ));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">호스트 대시보드</h2>
          <p className="text-gray-600 mt-2">모집 글을 작성하고 참여자를 관리하세요</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              모집 글 작성
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 모집 글 작성</DialogTitle>
            </DialogHeader>
            <CreateGatheringForm
              onSubmit={handleCreateGathering}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {gatherings.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <Plus className="w-16 h-16 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                첫 모집 글을 작성해보세요
              </h3>
              <p className="text-gray-600 mb-6">
                함께 농구할 사람들을 모집해보세요
              </p>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    모집 글 작성하기
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>새 모집 글 작성</DialogTitle>
                  </DialogHeader>
                  <CreateGatheringForm
                    onSubmit={handleCreateGathering}
                    onCancel={() => setDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          gatherings.map((gathering) => (
            <HostGatheringCard
              key={gathering.id}
              gathering={gathering}
              onUpdate={handleUpdateGathering}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HostDashboard;
