import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourseById, getTeacherByCourse } from '../services/courses';
import { getStudentsByClass } from '../services/students';
import { Link } from 'react-router-dom';
import { paths } from '../routes';
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
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,

} from '@mui/material';
import { MoreVert, HowToReg } from '@mui/icons-material';
import { blue } from '@mui/material/colors';
import { Button, Col, Row } from 'reactstrap';


export function CourseDetails() {
  const { uuid } = useParams();

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
    queryFn: () => getStudentsByClass(course?.classId || ''),
  });

  const students = queryStudents.data || [];



  return (
    <div className='page-content'>
      <Row>
        <Col sm={6}>
          <h4>Detalhes da Matéria</h4>
        </Col>
        <Col sm={6} className='d-flex justify-content-end'>
          <Button
            //onClick={handleOpen}
            className='d-flex align-items-center gap-2'
            color='primary'
          >
            <HowToReg />
            Realizar chamada
          </Button>
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
                  <TableCell>Nome</TableCell>
                  <TableCell align='center'>E-mail</TableCell>
                  <TableCell align='center'>Frequencia</TableCell>                
                </TableRow>
              </TableHead>
              <TableBody>
                {students?.map((item) => (
                  <TableRow key={item.uuid}>
                    <TableCell>
                      <Link
                        to={paths.studentsDetails.replace(
                          ':uuid',
                          item.uuid
                        )}
                      >
                        {item.nmstudent}
                      </Link>
                    </TableCell>
                    <TableCell align='center'>{item.email}</TableCell>              
                    <TableCell align='center'>{'100%'}</TableCell>              
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>



    </div>
  );
}
