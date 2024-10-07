import { signup } from '~/app/actions/signUp';
import { Button } from '~/components/ui/button';
import { FormRow } from '~/components/_shared/formRow';
import { Input } from '~/components/ui/input';

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-[600px] p-10">
      <h1 className="text-center text-xl font-bold">会員登録</h1>
      <form
        className="mx-auto flex max-w-[600px] flex-col gap-3"
        action={signup}
      >
        <FormRow>
          <label htmlFor="email">Email:</label>
          <Input id="email" name="email" type="email" required />
        </FormRow>
        <FormRow>
          <label htmlFor="password">Password:</label>
          <Input id="password" name="password" type="password" required />
        </FormRow>
        <Button className="mx-auto flex w-fit" type="submit">
          Sign up
        </Button>
      </form>
    </div>
  );
}
