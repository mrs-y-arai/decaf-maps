'use server';

import { createAdminClient } from '~/lib/supabase/supabaseAdminInit';
import { revalidatePath } from 'next/cache';

export async function registerCafe(
  name: string,
  location: { lat: number; lng: number },
  description: string,
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('places')
    .insert({
      name,
      location: `POINT(${location.lng} ${location.lat})`,
      description,
    })
    .select();

  if (error) {
    console.error(error);
    return { error: error.message };
  }

  return { data };
}
