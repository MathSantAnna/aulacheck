import { AddOutlined, MoreVert } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  ListItemText,
  Paper,
  TableContainer,
  Typography
} from '@mui/material';
import { Button, Col, Row } from 'reactstrap';
import { getTeacher } from '../services/teachers';
import { useParams } from 'react-router-dom';
// import { paths } from '../routes';
import { DefaultModal } from '../components/DefaultModal';
import { useState } from 'react';
import { DefaultInput } from '../components/DefaultInput';
import { useForm } from 'react-hook-form';
import { red } from '@mui/material/colors';
import { useQuery } from '@tanstack/react-query';




const formatTeacherCourses = (teacher: any) => {
  /*if (!teacher.courses || teacher.courses.length === 0) {
    return 'Nenhum curso encontrado';
  }
  const courseNames = teacher.courses.map(course => course.nmcourse);

  return courseNames.join(', ');
  */
  return '';
  
}


export function TeacherDetails() {
  const { uuid } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const { control } = useForm();

  const handleOpen = () => setIsOpen((prev) => !prev);

  const id = uuid || '';

  const query = useQuery({
    queryKey: ['GET_TEACHER'],
    queryFn: () => getTeacher(id),
  });


  const teacher = query.data;
  

  return (
    !query.isLoading && (
    <div className='page-content'>
      <Row>
        <Col sm={6}>
          <h4>Detalhes do Professor</h4>
        </Col>
      </Row>


      <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {teacher && teacher.nmteacher.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={teacher && teacher.nmteacher}
          subheader={teacher && teacher.email}
          action={
            <IconButton aria-label="settings">
              <MoreVert />
            </IconButton>
          }
        />
        <CardContent>
          <ListItemText
            primary="Matérias"
            primaryTypographyProps={{
              fontSize: 15,
              fontWeight: 'medium',
              lineHeight: '20px',
              mb: '2px',
            }}
            secondary={formatTeacherCourses(teacher)}
            secondaryTypographyProps={{
              noWrap: true,
              fontSize: 12,
              lineHeight: '16px',
            }}
            sx={{ my: 0 }}
          />
        </CardContent>
      </Card>


      <DefaultModal
        title='Adicionar professor'
        toggle={handleOpen}
        isOpen={isOpen}
        onConfirm={() => { }}
      >
        <form className='d-flex flex-column gap-4'>
          <DefaultInput
            control={control}
            name='nmteacher'
            label='Nome do professor'
          />
          <DefaultInput
            control={control}
            name='email'
            label='E-mail do professor'
          />
          <DefaultInput control={control} name='cpf' label='CPF' />
          <DefaultInput control={control} name='rg' label='RG' />
        </form>
      </DefaultModal>
    </div>)
  );
}