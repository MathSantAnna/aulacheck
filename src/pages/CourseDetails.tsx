import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourseById, getStudentsByCourse, getTeacherByCourse } from '../services/courses';
import { Link } from 'react-router-dom';
import { paths } from '../routes';
import {
  Avatar,
  Card,
  CardHeader,
  IconButton,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Collapse
} from '@mui/material';
import { MoreVert, HowToReg } from '@mui/icons-material';
import { blue } from '@mui/material/colors';
import { Button, Col, Row } from 'reactstrap';
import { useState } from 'react';
import { StudentFrequencyTable } from '../components/StudentFrequencyTable';
import { useAuth } from '../hooks/auth';


export function CourseDetails() {
  const { isStudent } = useAuth();

  const { uuid } = useParams();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);


  const courseQuery = useQuery({
    queryKey: ['GET_COURSE'],
    queryFn: () => getCourseById(uuid || ''),
  });

  const course = courseQuery.data;

  const teacherQuery = useQuery({
    queryKey: ['GET_TEACHER'],
    queryFn: () => getTeacherByCourse(uuid || ''),
  });

  const teacher = teacherQuery.data;

  const queryStudents = useQuery({
    queryKey: ['GET_COURSES'],
    queryFn: () => getStudentsByCourse(course?.uuid || ''),
  });

  const students = queryStudents.data || [];

 
  return (
    <div className='page-content'>
      <Row>
        <Col sm={6}>
          <h4>Detalhes da Matéria</h4>
        </Col>
        <Col sm={6} className='d-flex justify-content-end'>
         {!isStudent && <Button
            
            onClick={() => {
              navigate(paths.classRoomRollCall, { state: { course: course } });
            }}
            className='d-flex align-items-center gap-2'
            color='primary'
          >
            <HowToReg />
            Realizar chamada
          </Button>}
        </Col>
      </Row>

      <Card className='mt-3'>


        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe">
              {course && course.nmcourse.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={course && course.nmcourse}
          subheader={teacher && teacher.nmteacher}
          action={
            <IconButton aria-label="settings">
              <MoreVert />
            </IconButton>
          }
        />
      </Card>

      <TableContainer component={Paper} className='mt-3'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Nome</TableCell>
              <TableCell align='center'>E-mail</TableCell>
              <TableCell align='center'>Faltas</TableCell>
              <TableCell align='center'>Frequência</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students?.map((item) => (
              <StudentFrequencyTable 
                key={item.uuid}
                student={item}
              />
            ))}

          </TableBody>
        </Table>
      </TableContainer>



    </div>
  );
}
