import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  Collapse,
  IconButton,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Input, Row } from 'reactstrap';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AddOutlined, DeleteOutline } from '@mui/icons-material';
import { DefaultModal } from '../components/DefaultModal';
import { createCourse, deleteCourse, getCourses } from '../services/courses';
import { getTeachers } from '../services/teachers'; // Importa a função para buscar professores
import { getClass } from '../services/class'; // Importa a função para buscar turmas
import { paths } from '../routes';
import { useAuth } from '../hooks/auth';
import CloseIcon from '@mui/icons-material/Close';

export function Courses() {
  const [isOpen, setIsOpen] = useState(false);

  const { isAdmin, loggedUser } = useAuth();

  const [newCourseName, setNewCourseName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const queryClient = useQueryClient();

  const handleOpen = () => setIsOpen((prev) => !prev);

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);

  const [alertSeverity, setAlertSeverity] = useState<
    'warning' | 'success' | 'error'
  >('warning');

  const [alertMessage, setAlertMessage] = useState('');

  const [courseOnDelete, setCourseOnDelete] = useState<any>({});

  const handleOpenDeleteModal = (course: any) => {
    setCourseOnDelete(course);
    return setIsOpenDeleteModal((prev) => !prev);
  };

  const handleDelete = (uuidcourse: string) => {
    mutationDelete.mutate(uuidcourse);
    setIsOpenDeleteModal(false);
    setSuccessOpen(true);
  };

  const mutationDelete = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_LESSONS'] });
      setAlertMessage('Matéria deletada com sucesso.');
      setAlertSeverity('success');
      setIsOpenDeleteModal(false);
    },
    onError: () => {
      setAlertMessage(
        'Erro ao deletar matéria. Desvincule os alunos antes de deletá-la.'
      );
      setAlertSeverity('error');
      setIsOpenDeleteModal(false);
    },
  });

  const mutationCreate = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_LESSONS'] });
      setIsOpen(false);
    },
    onError: () => {
      setIsOpen(false);
    },
  });

  const handleCreateCourse = async () => {
    try {
      await mutationCreate.mutate({
        nmcourse: newCourseName,
        teacherId: teacherId,
        classId: selectedClass,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const isStudent = !!loggedUser.nmstudent;
  console.log('isStudent', isStudent);

  const query = useQuery({
    queryKey: ['GET_LESSONS'],
    queryFn: () => getCourses(loggedUser.uuid, isAdmin || false, isStudent),
  });

  const teacherQuery = useQuery({
    queryKey: ['GET_TEACHERS'],
    queryFn: getTeachers,
  });

  const queryClass = useQuery({
    queryKey: ['GET_CLASS'],
    queryFn: getClass,
  });

  return (
    <Container>
      <Collapse in={successOpen}>
        <Alert
          severity={alertSeverity}
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => {
                setSuccessOpen(false);
              }}
            >
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alertMessage}
        </Alert>
      </Collapse>

      {query.isLoading || teacherQuery.isLoading ? (
        <div
          style={{
            height: '100vh',
          }}
          className='d-flex align-items-center justify-content-center'
        >
          <CircularProgress />
        </div>
      ) : (
        <div className='page-content'>
          <Row>
            <Col sm={6}>
              <h4>Lista de Matérias</h4>
            </Col>
            <Col sm={6} className='d-flex justify-content-end'>
              <Button
                onClick={handleOpen}
                className='d-flex align-items-center gap-2'
                color='primary'
                disabled={!isAdmin}
              >
                <AddOutlined />
                Adicionar
              </Button>
            </Col>
          </Row>
          <TableContainer component={Paper} className='mt-3'>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Curso</TableCell>
                  {/* <TableCell align='center'>Sala</TableCell> */}
                  <TableCell align='center'>Professor</TableCell>
                  <TableCell align='right'></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {query.data?.map((item) => (
                  <TableRow key={item.uuid}>
                    <TableCell>
                      <Link
                        to={paths.courseDetails.replace(
                          ':uuid',
                          item.uuid || ''
                        )}
                      >
                        {item.nmcourse}
                      </Link>
                    </TableCell>
                    {/* <TableCell align='center'>{item.classId}</TableCell> */}
                    <TableCell align='center'>{}</TableCell>
                    <TableCell align='right'>
                      <DeleteOutline
                        color='error'
                        onClick={() => handleOpenDeleteModal(item)}
                        style={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <DefaultModal
            title='Adicionar matéria'
            toggle={handleOpen}
            isOpen={isOpen}
            onConfirm={handleCreateCourse}
          >
            <form className='d-flex flex-column gap-4'>
              Nome da matéria
              <Input
                name='nmcourse'
                label='Nome da matéria'
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
              />
              <label>Professor</label>
              <Select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value='' disabled>
                  Selecione um professor
                </MenuItem>
                {teacherQuery.data?.map((teacher) => (
                  <MenuItem key={teacher.uuid} value={teacher.uuid}>
                    {teacher.nmteacher}
                  </MenuItem>
                ))}
              </Select>
              <label>Turma</label>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={selectedClass}
                inputProps={{ 'aria-label': 'Without label' }}
                displayEmpty
                onChange={(event) => setSelectedClass(event.target.value)}
              >
                <MenuItem value='' disabled>
                  Selecione uma turma
                </MenuItem>
                {queryClass.data?.map((item) => (
                  <MenuItem value={item.uuid}>{item.nmclass}</MenuItem>
                ))}
              </Select>
            </form>
          </DefaultModal>
          <DefaultModal
            title='Confirmar exclusão'
            toggle={() => handleOpenDeleteModal(courseOnDelete)}
            isOpen={isOpenDeleteModal}
            onConfirm={() => handleDelete(courseOnDelete.uuid)}
            confirmLabel='Deletar'
            cancelLabel='Cancelar'
            confirmButtonColor='danger'
          >
            <p>
              Deseja realmente deletar a matéria{' '}
              <strong>{courseOnDelete.nmcourse}</strong>?
            </p>
          </DefaultModal>
        </div>
      )}
    </Container>
  );
}
