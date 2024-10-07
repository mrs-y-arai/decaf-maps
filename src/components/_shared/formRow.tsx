export function FormRow(props: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-2 ${props.className}`}>
      {props.children}
    </div>
  );
}
