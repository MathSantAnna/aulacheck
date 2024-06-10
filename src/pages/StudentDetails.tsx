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
  Menu,
  MenuItem,
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
import { se } from 'date-fns/locale';

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
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
  const [currentName, setCurrentName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const { control, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();
  const [successOpen, setSuccessOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('warning');
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleEditNameModal = () => setIsEditNameModalOpen((prev) => !prev);
  const toggleEditPasswordModal = () => setIsEditPasswordModalOpen((prev) => !prev);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const id = uuid || '';

  const { data: student, isLoading } = useQuery({
    queryKey: ['GET_STUDENT', id],
    queryFn: () => getStudent(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (data) => updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['GET_STUDENT', id]);
      setAlertMessage('Operação realizada com sucesso!');
      setAlertSeverity('success');
      setSuccessOpen(true);
    },
  });

  const handleEditNameClick = () => {
    if (student) {
      setCurrentName(student.nmstudent);
      reset({ nmstudent: student.nmstudent });
      toggleEditNameModal();
    }
    handleMenuClose();
  };

  const handleEditPasswordClick = () => {
    if (student) {
      setCurrentPassword(student.password);
      reset({ password: '' });
      toggleEditPasswordModal();
    }
    handleMenuClose();
  };

  const handleEditNameConfirm = (data) => {
    if (data.nmstudent.trim() === '') {
      setIsEditNameModalOpen(false);
      setAlertMessage('O nome não pode estar em branco.');
      setAlertSeverity('error');
      setSuccessOpen(true);
      return;
    }
    mutation.mutate({ nmstudent: data.nmstudent });
    toggleEditNameModal();
  };

  const handleEditPasswordConfirm = (data) => {
    if (data.password.trim() === '') {
      setIsEditPasswordModalOpen(false);
      setAlertMessage('A senha não pode estar em branco.');
      setAlertSeverity('error');
      setSuccessOpen(true);
      return;
    }
    mutation.mutate({ password: data.password });
    toggleEditPasswordModal();
  };

  return (
    <>
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
                <>
                  <IconButton aria-label="settings" onClick={handleMenuOpen}>
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleEditNameClick}>Editar Nome</MenuItem>
                    <MenuItem onClick={handleEditPasswordClick}>Editar Senha</MenuItem>
                  </Menu>
                </>
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
          <DefaultModal
            title={`Editar senha do aluno`}
            toggle={toggleEditPasswordModal}
            isOpen={isEditPasswordModalOpen}
            onConfirm={handleSubmit(handleEditPasswordConfirm)}
          >
            <form className='d-flex flex-column gap-4'>
              <DefaultInput
                control={control}
                name='password'
                label='Nova senha'
                type='password'
                defaultValue={currentPassword}
              />
            </form>
          </DefaultModal>
        </div>
      )}
    </>
  );
}
