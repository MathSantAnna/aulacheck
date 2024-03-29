import { Control, RegisterOptions, useController } from 'react-hook-form';
import { Input, InputProps } from 'reactstrap';

type Props = InputProps & {
  label?: string;
  name: string;
  control: Control<any>;
  rules?: RegisterOptions;
};

export function DefaultInput(props: Props) {
  const { name, label, defaultValue, control, rules, ...rest } = props;

  const {
    field,
    fieldState: { error },
  } = useController({ name, control, defaultValue, rules });

  return (
    <div className='d-flex flex-column gap-2 w-100'>
      {label && <label htmlFor={name}>{label}</label>}
      <Input {...rest} {...field} name={name} id={name} />

      {error?.message && <p className='text-danger'>{error.message}</p>}
    </div>
  );
}
