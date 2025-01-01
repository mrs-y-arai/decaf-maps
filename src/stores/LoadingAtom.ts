import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';

export const loadingAtom = atom<boolean>(false);
export const loadingKeyAtom = atom<string[]>([]);

export const changeKeyEffect = atomEffect((get, set) => {
  if (get(loadingKeyAtom).length > 0) {
    set(loadingAtom, true);
    return;
  }

  set(loadingAtom, false);
});
