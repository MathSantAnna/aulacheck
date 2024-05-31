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
import { getStudent } from '../services/students';
import { useParams } from 'react-router-dom';
import { DefaultModal } from '../components/DefaultModal';
import { useState } from 'react';
import { DefaultInput } from '../components/DefaultInput';
import { useForm } from 'react-hook-form';
import { blue } from '@mui/material/colors';
import { useQuery } from '@tanstack/react-query';

const formatStudentCourses = (student) => {
  if (!student.courses || student.courses.length === 0) {
    return 'Nenhum curso encontrado';
  }
  const courseNames = student.courses.map(course => course.nmcourse);

  return courseNames.join(', ');
}

export function StudentDetails() {
  const { uuid } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const { control } = useForm();

  const handleOpen = () => setIsOpen((prev) => !prev);

  const id = uuid || '';

  const query = useQuery({
    queryKey: ['GET_STUDENT'],
    queryFn: () => getStudent(id),
  });

  const student = query.data;

  return (
    !query.isLoading && (
    <div className='page-content'>
      <Row>
        <Col sm={6}>
          <h4>Detalhes do Aluno</h4>
        </Col>
      </Row>

      <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe">
              {student && student.nmstudent.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={student && student.nmstudent}
          subheader={student && student.email}
          action={
            <IconButton aria-label="settings">
              <MoreVert />
            </IconButton>
          }
        />
        <CardContent>
          <ListItemText
            primary="Cursos"
            primaryTypographyProps={{
              fontSize: 15,
              fontWeight: 'medium',
              lineHeight: '20px',
              mb: '2px',
            }}
            secondary={formatStudentCourses(student)}
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
        title='Adicionar aluno'
        toggle={handleOpen}
        isOpen={isOpen}
        onConfirm={() => { }}
      >
        <form className='d-flex flex-column gap-4'>
          <DefaultInput
            control={control}
            name='nmstudent'
            label='Nome do aluno'
          />
          <DefaultInput
            control={control}
            name='email'
            label='E-mail do aluno'
          />
        </form>
      </DefaultModal>
    </div>)
  );
}
