import {
  Checkbox,
  CircularProgress,
  Collapse,
  FormControlLabel,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Row } from 'reactstrap';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AddOutlined, DeleteOutline, } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import { DefaultModal } from '../components/DefaultModal';
import { Input } from 'reactstrap';
import { getTeachers, deleteTeacher, createTeacher } from '../services/teachers';
import { paths } from '../routes';
import { useAuth } from '../hooks/auth';

export function Teachers() {
  const {isAdmin, loggedUser} = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);

  const [newTeacherIsAdmin, setIsAdmin] = useState(false);

  const [newTeacherName, setNewTeacherName] = useState('');

  const [newTeacherEmail, setNewTeacherEmail] = useState('');

  const [alertSeverity, setAlertSeverity] = useState('warning');

  const [alertMessage, setAlertMessage] = useState('');

  const handleOpen = () => setIsOpen((prev) => !prev);

  const [teacherOnDelete, setTeacherOnDelete] = useState({});

  const handleOpenDeleteModal = (teacher: any) => {
    setTeacherOnDelete(teacher)
    return setIsOpenDeleteModal((prev) => !prev);
  }

  const handleDelete = (uuidteacher: string) => {
    mutation.mutate(uuidteacher);
    setIsOpenDeleteModal(false);
    setSuccessOpen(true);
  };

  const handleCreate = async () => {
    if (newTeacherName.trim() === '' || newTeacherEmail.trim() === '') {
      setIsOpen(false);
      setAlertMessage('Nome e e-mail do professor não podem estar em branco.');
      setAlertSeverity('error');
      setSuccessOpen(true);
      return;
    }
  
    try {
      await mutationCreate.mutate({ nmteacher: newTeacherName, email: newTeacherEmail, admin: newTeacherIsAdmin });
      setIsOpen(false);
      setAlertMessage('Professor criado com sucesso.');
      setAlertSeverity('success');
      setSuccessOpen(true);
    } catch (err) {
      setAlertMessage('Erro ao criar professor. Tente novamente.');
      setAlertSeverity('error');
      setSuccessOpen(true);
    }
  }

  console.log(newTeacherIsAdmin);
  

  const queryClient = useQueryClient();


  const query = useQuery({
    queryKey: ['GET_TEACHERS'],
    queryFn: getTeachers,
  });

  const mutation = useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries(['GET_TEACHERS']);
      setAlertMessage('Professor excluído com sucesso.');
      setAlertSeverity('success');
    },
    onError: () => {
      setAlertMessage('Oops! Este professor está vinculado a matérias. Desvincule-o das disciplinas antes de excluí-lo');
      setAlertSeverity('error');
    }
  });

  const mutationCreate = useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries(['GET_TEACHERS']);
    },
  });



  return (

    <Container>
      <Collapse in={successOpen}>
        <Alert
          severity={alertSeverity}
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
          {alertMessage}
        </Alert>
      </Collapse>
      {query.isLoading ? (
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
              <h4>Lista de Professores</h4>
            </Col>
            <Col sm={6} className='d-flex justify-content-end'>
              <Button
                onClick={handleOpen}
                className='d-flex align-items-center gap-2'
                color='primary'
                disabled={!isAdmin}
                style={{ cursor:  isAdmin ? 'pointer' : 'not-allowed' }}
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
                  <TableCell>Nome</TableCell>
                  <TableCell align='right'>E-mail</TableCell>
                  <TableCell align='right'>N° de matérias</TableCell>
                  <TableCell align='right'>Criado em</TableCell>
                  <TableCell align='right'>Editado em</TableCell>
                  <TableCell align='right'></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {query.data?.map((item) => (
                  <TableRow key={item.uuid}>
                    <TableCell>
                      <Link
                        to={paths.teacherDetails.replace(
                          ':uuid',
                          item.uuid
                        )}
                      >
                        {item.nmteacher}
                      </Link>
                    </TableCell>
                    <TableCell align='right'>{item.email}</TableCell>
                    <TableCell align='right'>
                      {item && item.courses && item.courses?.length}
                    </TableCell>
                    <TableCell align='right'>
                      {new Date(item.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell align='right'>
                      {new Date(item.updated_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <DeleteOutline
                        color={isAdmin && loggedUser.uuid !== item.uuid ? 'error' : 'disabled'}
                        onClick={isAdmin && loggedUser.uuid !== item.uuid ? () => handleOpenDeleteModal(item) : () => { }}
                        style={{ cursor:  isAdmin ? 'pointer' : 'not-allowed' }}
                        disabled={!isAdmin && loggedUser.uuid === item.uuid }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <DefaultModal
            title='Adicionar professor'
            toggle={handleOpen}
            isOpen={isOpen}
            onConfirm={() => handleCreate()}
          >
            <form className='d-flex flex-column gap-4'>
              <div className='d-flex flex-column gap-2 w-100'>
                Nome do professor
                <Input
                  name='nmteacher'
                  label='Nome do professor'
                  value={newTeacherName}
                  onChange={(event: any) => setNewTeacherName(event.target.value)}
                />
              </div>
              <div className='d-flex flex-column gap-2 w-100'>
                E-mail do professor
                <Input
                  name='email'
                  label='E-mail do professor'
                  value={newTeacherEmail}
                  onChange={(event: any) => setNewTeacherEmail(event.target.value)}
                />
              </div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newTeacherIsAdmin}
                    onChange={() => setIsAdmin(!newTeacherIsAdmin)}
                  />
                }
                label="Administrador"
              />
            </form>
          </DefaultModal>

          <DefaultModal
            title='Confirmar exclusão'
            toggle={() => handleOpenDeleteModal(teacherOnDelete)}
            isOpen={isOpenDeleteModal}
            onConfirm={() => handleDelete(teacherOnDelete.uuid)}
            confirmLabel='Deletar'
            cancelLabel='Cancelar'
            confirmButtonColor='danger'
          >
            <p>Tem certeza de que deseja excluir o professor <strong>{teacherOnDelete.nmteacher}</strong>?</p>
          </DefaultModal>

        </div>
      )}
    </Container>
  );
}
