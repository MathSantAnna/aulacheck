import { Input, InputProps } from 'reactstrap';

type Props = InputProps;

export function DefaultInput(props: Props) {
  return <Input {...props} />;
}
