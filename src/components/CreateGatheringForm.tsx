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
    startTime: '',
    endTime: '',
    guardCount: '',
    forwardCount: '',
    centerCount: '',
    gender: '',
    cost: '',
    description: '',
    level: '',
    courtType: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.sport &&
      formData.location &&
      formData.date &&
      formData.startTime &&
      formData.endTime &&
      (formData.guardCount || formData.forwardCount || formData.centerCount)
      && formData.courtType
    ) {
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
          <Label htmlFor="startTime">시작 시간 *</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="endTime">종료 시간 *</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="guardCount">가드 모집 인원</Label>
          <Input
            id="guardCount"
            type="number"
            placeholder="가드 인원 수"
            min="0"
            max="10"
            value={formData.guardCount}
            onChange={(e) => handleInputChange('guardCount', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="forwardCount">포워드 모집 인원</Label>
          <Input
            id="forwardCount"
            type="number"
            placeholder="포워드 인원 수"
            min="0"
            max="10"
            value={formData.forwardCount}
            onChange={(e) => handleInputChange('forwardCount', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="centerCount">센터 모집 인원</Label>
          <Input
            id="centerCount"
            type="number"
            placeholder="센터 인원 수"
            min="0"
            max="10"
            value={formData.centerCount}
            onChange={(e) => handleInputChange('centerCount', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="gender">모집 성별</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="성별 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="무관">무관</SelectItem>
              <SelectItem value="남">남</SelectItem>
              <SelectItem value="여">여</SelectItem>
            </SelectContent>
          </Select>
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

        <div>
          <Label htmlFor="courtType">코트 타입 *</Label>
          <Select value={formData.courtType} onValueChange={(value) => handleInputChange('courtType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="실내/야외 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="실내">실내</SelectItem>
              <SelectItem value="야외">야외</SelectItem>
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
