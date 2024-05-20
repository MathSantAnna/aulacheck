import { useParams } from 'react-router-dom';

export function CourseDetails() {
  const { uuid } = useParams();

  console.log('uuid', uuid);

  return <></>;
}
