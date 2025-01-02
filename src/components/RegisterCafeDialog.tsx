'use client';

import { registerCafe } from '~/actions/registerCafe';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { useState, useEffect } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  location: {
    lat: number;
    lng: number;
  } | null;
  address: string | null;
  placeId: string | null;
  map: google.maps.Map | null;
  searchNearByCafe: () => Promise<void>;
};

export function RegisterCafeDialog({
  isOpen,
  setIsOpen,
  location,
  address,
  placeId,
  map,
  searchNearByCafe,
}: Props) {
  const places = useMapsLibrary('places');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setName('');
    setDescription('');
  };

  useEffect(() => {
    if (!placeId || !places || !map) return;
    const _places = new places.PlacesService(map);
    _places.getDetails({ placeId }, (result: any) => {
      setName(result.name ?? '');
    });
  }, [placeId]);

  const handleSubmit = async (formData: FormData) => {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    if (!name || !location || !description) return;

    await registerCafe(name, location, description);

    alert('登録しました');

    resetForm();
    await searchNearByCafe();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="md:max-w-[700px]">
        <form action={handleSubmit}>
          <DialogHeader className="mb-4">
            <DialogTitle>カフェを登録</DialogTitle>
            <DialogDescription>
              カフェの情報を入力してください。
            </DialogDescription>
          </DialogHeader>
          <div className="mb-4 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">店名</Label>
              <Input
                id="name"
                placeholder="例: スターバックス 井の頭公園店"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">住所</Label>
              <Textarea id="address" value={address ?? ''} readOnly />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">補足</Label>
              <Textarea
                id="description"
                value={description}
                placeholder="例: ブラックコーヒーのみカフェインレス有"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('description', description);
                await handleSubmit(formData);
              }}
              type="submit"
            >
              登録する
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
