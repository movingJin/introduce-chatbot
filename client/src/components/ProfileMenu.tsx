import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Menu, User } from 'lucide-react';
import type { ProfileList, ProfileData } from '../types';
import { getProfile } from '../services/api';
import ProfileModal from './ProfileModal';

interface ProfileMenuProps {
  onProfileUpdate?: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ onProfileUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profiles, setProfiles] = useState<ProfileList>([]);
  const [selectedProfile, setSelectedProfile] = useState<{
    id: string;
    data: ProfileData;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const data = await getProfile('movingjin');
      setProfiles(data);
    } catch (error) {
      console.error('프로필 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadProfiles();
    }
  }, [isOpen]);

  const handleProfileClick = (id: string, data: ProfileData) => {
    setSelectedProfile({ id, data });
  };

  const handleProfileClose = () => {
    setSelectedProfile(null);
    loadProfiles();
    onProfileUpdate?.();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 h-12 w-12"
      >
        <Menu className="h-6 w-6" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" onClose={() => setIsOpen(false)}>
          <SheetHeader>
            <SheetTitle>프로필 목록</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4 overflow-y-auto max-h-[calc(100vh-120px)]">
            {loading ? (
              <p className="text-center text-muted-foreground">로딩 중...</p>
            ) : profiles.length === 0 ? (
              <p className="text-center text-muted-foreground">
                등록된 프로필이 없습니다.
              </p>
            ) : (
              profiles.map((profile) => {
                const { user_id, ...data } = profile;
                return (
                  <Card
                    key={user_id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleProfileClick(user_id, data)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{user_id}</CardTitle>
                      </div>
                      <CardDescription>
                        {typeof data['이름'] === 'string' && `이름: ${data['이름']}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        {Object.keys(data).length}개의 속성
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </SheetContent>
      </Sheet>

      {selectedProfile && (
        <ProfileModal
          profileId={selectedProfile.id}
          profileData={selectedProfile.data}
          onClose={handleProfileClose}
        />
      )}
    </>
  );
};

export default ProfileMenu;

