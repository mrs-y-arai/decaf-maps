import { Button } from '~/components/ui/button';
import { updateUser } from '../actions/updateUser';

export default function UserPage() {
  return (
    <form action={updateUser}>
      <div className="flex flex-col gap-2">
        <label htmlFor="tenantId">TenantId:</label>
        <input id="tenantId" name="tenantId" type="text" required />
      </div>
      <Button type="submit">User Update</Button>
    </form>
  );
}
