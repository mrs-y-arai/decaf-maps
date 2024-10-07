import { createClient } from '~/lib/supabase/supabaseInit';

export default async function TenantPage() {
  const supabase = createClient();

  const { data, error } = await supabase.from('tenants').select('*');

  console.log('data', data);

  return (
    <div>{data?.map((tenant) => <p key={tenant.id}>{tenant.name}</p>)}</div>
  );
}
