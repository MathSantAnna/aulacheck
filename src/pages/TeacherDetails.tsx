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

const formatTeacherCourses = (teacher: any) => {
  return '';
}

export function TeacherDetails() {
  const { uuid } = useParams();
  
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [currentName, setCurrentName] = useState('');
  const { control, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();
  const [successOpen, setSuccessOpen] = useState(false);
  
  const toggleEditNameModal = () => setIsEditNameModalOpen((prev) => !prev);

  const id = uuid || '';

  const { data: teacher, isLoading } = useQuery({
    queryKey: ['GET_TEACHER', id],
    queryFn: () => getTeacher(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (newName: string) => updateTeacher(id, { nmteacher: newName }),
    onSuccess: () => {
      queryClient.invalidateQueries(['GET_TEACHER', id]);
      toggleEditNameModal();
      setSuccessOpen(true);  
    },
  });

  const handleEditNameClick = () => {
    if (teacher) {
      setCurrentName(teacher.nmteacher);
      reset({ nmteacher: teacher.nmteacher }); 
      toggleEditNameModal();
    }
  };

  const handleEditNameConfirm = (data: any) => {
    mutation.mutate(data.nmteacher);
  };

  return (
   <Container>

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
         Nome do professor atualizado com sucesso!
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
               <IconButton aria-label="settings" onClick={handleEditNameClick}>
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
       </div>
     )}
   </Container>
    
  );
}
