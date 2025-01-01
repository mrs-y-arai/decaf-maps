'use server';

import { createAdminClient } from '~/lib/supabase/supabaseAdminInit';

export async function getNearByCafe(lat: number, lng: number) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc('nearby_cafe', {
    lat: lat,
    long: lng,
    radius: 1000,
  });
  if (error) {
    console.error(error);
    return [];
  }
  return data.map((cafe: any) => ({
    id: cafe.id,
    name: cafe.name,
    description: cafe.description,
    lat: cafe.lat,
    long: cafe.long,
  }));
}
