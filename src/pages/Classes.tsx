import {
  CircularProgress,
  Collapse,
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
import { Button, Col, Container, Input, Row } from 'reactstrap';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AddOutlined, DeleteOutline } from '@mui/icons-material';
import { DefaultModal } from '../components/DefaultModal';
import { getClass, createClass, deleteClass } from '../services/class';
import { paths } from '../routes';
import { getStudents } from '../services/students';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import { useAuth } from '../hooks/auth';

export function Classes() {
  const [isOpen, setIsOpen] = useState(false);

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [newClass, setNewClass] = useState('');

  const [newYear, setNewYear] = useState(0);

  const [classOnDelete, setClassOnDelete] = useState({});

  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'warning'
  >('warning');

  const [alertMessage, setAlertMessage] = useState('');

  const [successOpen, setSuccessOpen] = useState(false);

  const queryClient = useQueryClient();

  const { isAdmin } = useAuth();

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
    if (isOpen) {
      setNewClass('');
      setNewYear(0);
    }
  };

  const handleOpenDeleteModal = (classOnDelete: any) => {
    if (!isAdmin) return;

    setClassOnDelete(classOnDelete);
    return setIsOpenDeleteModal((prev) => !prev);
  };

  const mutationDeleteClass = useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      setAlertSeverity('success');
      setAlertMessage('Removido com sucesso!');
      query.refetch();
    },
    onError: () => {
      setAlertMessage(
        'Oops! Esta matéria não pode ser deletada. Desvincule os alunos antes de deletá-la.'
      );
      setAlertSeverity('error');
    },
  });

  const mutationCreateClass = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_CLASSES'] });
    },
  });

  const handleCreateClass = async () => {
    try {
      await mutationCreateClass.mutate({
        nmclass: newClass,
        graduarion: newYear,
      });
      setIsOpen(false);
    } catch (err) {
      setIsOpen(false);
    }
  };

  const handleDeleteClass = async (uuid: string) => {
    mutationDeleteClass.mutate(uuid);
    setIsOpenDeleteModal(false);
    setSuccessOpen(true);
  };

  const query = useQuery({
    queryKey: ['GET_CLASSES'],
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
              <h4>Lista de Turmas</h4>
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
                  <TableCell>Turma</TableCell>
                  <TableCell align='center'>Ano</TableCell>
                  <TableCell align='center'>Número de alunos</TableCell>
                  <TableCell align='center'>Quantidade de matérias</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {query.data?.map((item) => (
                  <TableRow key={item.uuid}>
                    <TableCell>
                      <Link
                        to={paths.courseDetails.replace(':uuid', item.uuid)}
                      >
                        {item.nmclass}
                      </Link>
                    </TableCell>
                    <TableCell align='center'>{item.graduarion}</TableCell>
                    <TableCell align='center'>{0}</TableCell>
                    <TableCell align='center'>{0}</TableCell>
                    <TableCell align='center'>
                      <DeleteOutline
                        onClick={() => handleOpenDeleteModal(item)}
                        style={{ cursor: 'pointer' }}
                        color={isAdmin ? 'error' : 'disabled'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <DefaultModal
            title='Adicionar turma'
            toggle={handleOpen}
            isOpen={isOpen}
            onConfirm={() => handleCreateClass()}
          >
            <form className='d-flex flex-column gap-4'>
              <div className='d-flex flex-column gap-2 w-100'>
                Nome da turma
                <Input
                  name='nmclass'
                  label='Nome da turma'
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  required
                />
              </div>
              <div className='d-flex flex-column gap-2 w-100'>
                Ano
                <Input
                  type='number'
                  name='graduarion'
                  label='Ano'
                  value={newYear}
                  onChange={(e) => setNewYear(parseInt(e.target.value, 10))}
                  required
                />
              </div>
            </form>
          </DefaultModal>

          <DefaultModal
            title='Confirmar exclusão'
            toggle={() => handleOpenDeleteModal(classOnDelete)}
            isOpen={isOpenDeleteModal}
            onConfirm={() => handleDeleteClass(classOnDelete.uuid)}
            confirmLabel='Deletar'
            cancelLabel='Cancelar'
            confirmButtonColor='danger'
          >
            <p>
              Tem certeza de que deseja excluir a turma{' '}
              <strong>{classOnDelete.nmclass}</strong>?
            </p>
          </DefaultModal>
        </div>
      )}
    </Container>
  );
}
