import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Plus } from 'lucide-react';
import type { ProfileData } from '../types';
import { editProfile } from '../services/api';

interface ProfileModalProps {
  profileId: string;
  profileData: ProfileData;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  profileId,
  profileData,
  onClose,
}) => {
  const [editedData, setEditedData] = useState<ProfileData>({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditedData({ ...profileData });
  }, [profileData]);

  const handleValueChange = (key: string, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRemoveKey = (key: string) => {
    const updated = { ...editedData };
    delete updated[key];
    setEditedData(updated);
  };

  const handleAddNew = () => {
    if (newKey.trim() && newValue.trim()) {
      setEditedData((prev) => ({
        ...prev,
        [newKey.trim()]: newValue.trim(), // 입력 시에는 문자열로 유지 (저장 시 파싱)
      }));
      setNewKey('');
      setNewValue('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 저장하기 전에 모든 문자열 값을 적절한 타입으로 변환
      const parsedData: ProfileData = {};
      Object.entries(editedData).forEach(([key, value]) => {
        if (typeof value === 'string') {
          parsedData[key] = parseValue(value);
        } else {
          parsedData[key] = value;
        }
      });

      await editProfile({
        id: profileId,
        data: parsedData,
      });
      alert('프로필이 성공적으로 저장되었습니다.');
      onClose();
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      alert('프로필 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const formatValue = (value: string | number | string[]): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  };

  // 문자열을 적절한 타입으로 변환 (배열, 숫자, 문자열)
  const parseValue = (value: string): string | number | string[] => {
    const trimmed = value.trim();
    
    // 쉼표로 구분된 값은 배열로 처리
    if (trimmed.includes(',')) {
      return trimmed.split(',').map((v) => v.trim()).filter((v) => v !== '');
    }
    
    // 숫자 형태면 숫자로 처리
    const num = Number(trimmed);
    if (!isNaN(num) && trimmed !== '') {
      return num;
    }
    
    // 그 외는 문자열
    return trimmed;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent onClose={onClose} className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{profileId} 프로필 편집</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 기존 속성 편집 */}
          {Object.entries(editedData).map(([key, value]) => (
            <div key={key} className="flex items-start gap-2">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input
                  value={key}
                  readOnly
                  className="bg-muted"
                  placeholder="속성 이름"
                />
                <Input
                  value={formatValue(value)}
                  onChange={(e) =>
                    handleValueChange(key, e.target.value)
                  }
                  placeholder="값 (쉼표로 구분 시 배열)"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveKey(key)}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* 새 속성 추가 */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-start gap-2">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="새 속성 이름"
                />
                <Input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="값 (쉼표로 구분 시 배열)"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleAddNew}
                disabled={!newKey.trim() || !newValue.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? '저장 중...' : '저장'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;

