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
import { Button, Col, Container, Row } from 'reactstrap';
import { getTeacher, updateTeacher } from '../services/teachers';
import { useParams } from 'react-router-dom';
import { DefaultModal } from '../components/DefaultModal';
import { useState } from 'react';
import { DefaultInput } from '../components/DefaultInput';
import { useForm } from 'react-hook-form';
import { red } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/auth';

const formatTeacherCourses = (teacher) => {
  return '';
}

export function TeacherDetails() {

  const { isAdmin, loggedUser } = useAuth();
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
  
  const { data: teacher, isLoading } = useQuery({
    queryKey: ['GET_TEACHER', id],
    queryFn: () => getTeacher(id),
    enabled: !!id,
  });

  const ableToEdit = loggedUser.uuid === teacher?.uuid;

  const mutation = useMutation({
    mutationFn: (data) => updateTeacher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['GET_TEACHER', id]);
      setAlertMessage('Operação realizada com sucesso!');
      setAlertSeverity('success');
      setSuccessOpen(true);
    },
  });

  const handleEditNameClick = () => {
    if (teacher) {
      setCurrentName(teacher.nmteacher);
      reset({ nmteacher: teacher.nmteacher });
      toggleEditNameModal();
    }
    handleMenuClose();
  };

  const handleEditPasswordClick = () => {
    if (teacher) {
      setCurrentPassword(teacher.password);
      reset({ password: '' }); 
      toggleEditPasswordModal();
    }
    handleMenuClose();
  };

  const handleEditNameConfirm = (data) => {
    if (data.nmteacher.trim() === '') {
      setIsEditNameModalOpen(false);
      setAlertMessage('O nome não pode estar em branco.');
      setAlertSeverity('error');
      setSuccessOpen(true);
      return;
    }

    mutation.mutate({ nmteacher: data.nmteacher });
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
    
      {!isLoading && teacher && (
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
                <>
                  <IconButton aria-label="settings" onClick={handleMenuOpen}>
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    {(ableToEdit || isAdmin) && <MenuItem onClick={handleEditNameClick}>Editar Nome</MenuItem>}
                   {ableToEdit && <MenuItem onClick={handleEditPasswordClick}>Editar Senha</MenuItem>}
                  </Menu>
                </>
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
            title={`Editar nome do professor`}
            toggle={toggleEditNameModal}
            isOpen={isEditNameModalOpen}
            onConfirm={handleSubmit(handleEditNameConfirm)}
          >
            <form className='d-flex flex-column gap-4'>
              <DefaultInput
                control={control}
                name='nmteacher'
                label='Nome do professor'
                defaultValue={currentName}
              />
            </form>
          </DefaultModal>
          <DefaultModal
            title={`Editar senha do professor`}
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
    </Container>
  );
}
