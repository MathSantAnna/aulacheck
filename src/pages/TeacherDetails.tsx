import { useParams } from 'react-router-dom';

export function TeacherDetails() {
  const { uuidteacher } = useParams();

  console.log('uuidteacher', uuidteacher);

  return <></>;
}
