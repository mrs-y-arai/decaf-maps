'use server';

import { createClient } from '~/lib/supabase/supabaseInit';

export async function updateUser(formData: FormData) {
  const supabase = createClient();

  const data = {
    tenantId: formData.get('tenantId') as string,
  };

  const { error } = await supabase.auth.updateUser({
    data: {
      tenant_id: data.tenantId,
    },
  });

  if (error) throw error;
}
