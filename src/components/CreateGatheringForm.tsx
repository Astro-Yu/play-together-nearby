import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateGatheringFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const CreateGatheringForm = ({ onSubmit, onCancel }: CreateGatheringFormProps) => {
  const [formData, setFormData] = useState({
    sport: '',
    location: '',
    date: '',
    time: '',
    maxParticipants: '',
    cost: '',
    description: '',
    level: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.sport && formData.location && formData.date && formData.time && formData.maxParticipants) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <input type="hidden" name="sport" value="농구" />

        <div>
          <Label htmlFor="location">장소 *</Label>
          <Input
            id="location"
            placeholder="예: 서울 강남구 OO체육관"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="date">날짜 *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="time">시간 *</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => handleInputChange('time', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="maxParticipants">모집 인원 *</Label>
          <Input
            id="maxParticipants"
            type="number"
            placeholder="최대 인원 수"
            min="2"
            max="20"
            value={formData.maxParticipants}
            onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="cost">비용</Label>
          <Input
            id="cost"
            placeholder="예: 10,000원 (1/N 분할)"
            value={formData.cost}
            onChange={(e) => handleInputChange('cost', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="level">모임 수준 *</Label>
          <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
            <SelectTrigger>
              <SelectValue placeholder="모임 수준을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="실력 무관">실력 무관</SelectItem>
              <SelectItem value="초보 환영">초보 환영</SelectItem>
              <SelectItem value="중수">중수</SelectItem>
              <SelectItem value="고수">고수</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">모집 메시지</Label>
        <Textarea
          id="description"
          placeholder="참여자들에게 전하고 싶은 메시지를 작성해주세요"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          취소
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          모집 글 등록
        </Button>
      </div>
    </form>
  );
};

export default CreateGatheringForm;
