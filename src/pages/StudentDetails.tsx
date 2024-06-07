import { AddOutlined, MoreVert } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  ListItemText,
  Paper,
  TableContainer,
  Typography
} from '@mui/material';
import { Button, Col, Row } from 'reactstrap';
import { getStudent, updateStudent } from '../services/students';
import { useParams } from 'react-router-dom';
import { DefaultModal } from '../components/DefaultModal';
import { useState } from 'react';
import { DefaultInput } from '../components/DefaultInput';
import { useForm } from 'react-hook-form';
import { blue } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const formatStudentCourses = (student) => {
  if (!student.courses || student.courses.length === 0) {
    return 'Nenhum curso encontrado';
  }
  const courseNames = student.courses.map(course => course.nmcourse);

  return courseNames.join(', ');
}

export function StudentDetails() {
  const { uuid } = useParams();
  
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [currentName, setCurrentName] = useState('');
  const { control, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();
  const [successOpen, setSuccessOpen] = useState(false);
  
  const toggleEditNameModal = () => setIsEditNameModalOpen((prev) => !prev);

  const id = uuid || '';

  const { data: student, isLoading } = useQuery({
    queryKey: ['GET_STUDENT', id],
    queryFn: () => getStudent(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (newName: string) => updateStudent(id, { nmstudent: newName }),
    onSuccess: () => {
      queryClient.invalidateQueries(['GET_STUDENT', id]);
      toggleEditNameModal();
      setSuccessOpen(true);  
    },
  });

  const handleEditNameClick = () => {
    if (student) {
      setCurrentName(student.nmstudent);
      reset({ nmstudent: student.nmstudent }); 
      toggleEditNameModal();
    }
  };

  const handleEditNameConfirm = (data: any) => {
    mutation.mutate(data.nmstudent);
  };

  return (
    <>
      <Collapse in={successOpen}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setSuccessOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Nome do aluno atualizado com sucesso!
        </Alert>
      </Collapse>
    
      {!isLoading && student && (
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
                <IconButton aria-label="settings" onClick={handleEditNameClick}>
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
            title={`Editar nome do aluno`}
            toggle={toggleEditNameModal}
            isOpen={isEditNameModalOpen}
            onConfirm={handleSubmit(handleEditNameConfirm)}
          >
            <form className='d-flex flex-column gap-4'>
              <DefaultInput
                control={control}
                name='nmstudent'
                label='Nome do aluno'
                defaultValue={currentName}
              />
            </form>
          </DefaultModal>
        </div>
      )}
    </>
  );
}
