'use client';

import { useLoadingState } from '~/hooks/useLoadingState';
import { Coffee } from 'lucide-react';

export function LoadingUI() {
  const { isLoading } = useLoadingState();

  return (
    <>
      {isLoading && (
        <div
          className="z-loading fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-[rgba(255,255,255,0.4)]"
          aria-label="読み込み中"
        >
          <div className="flex flex-col items-center">
            <Coffee color="#a06d49" className="size-14 animate-bounce" />
            <p className="mx-auto block font-bold">Loading...</p>
          </div>
        </div>
      )}
    </>
  );
}
