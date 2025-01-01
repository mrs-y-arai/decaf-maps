import { TopPresentation } from '~/features/top/TopPresentation';
import { createAdminClient } from '~/lib/supabase/supabaseAdminInit';

export default async function Home() {
  // const cafeList = await getCafeList();
  // console.log('cafeList', cafeList);
  return <TopPresentation />;
}

async function getCafeList() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc('all_places');
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}
