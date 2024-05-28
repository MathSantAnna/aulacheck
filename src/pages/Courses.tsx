import {
  CircularProgress,
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
import { useForm } from 'react-hook-form';
import { Button, Col, Container, Row } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import { AddOutlined, DeleteOutline } from '@mui/icons-material';

import { DefaultModal } from '../components/DefaultModal';
import { DefaultInput } from '../components/DefaultInput';

import { getCourses } from '../services/courses';

import { paths } from '../routes';

export function Courses() {
  const [isOpen, setIsOpen] = useState(false);

  const { control } = useForm();

  const handleOpen = () => setIsOpen((prev) => !prev);

  const query = useQuery({
    queryKey: ['GET_LESSONS'],
    queryFn: getCourses,
  });

  return (
    <Container>
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
              <h4>Lista de Matérias</h4>
            </Col>
            <Col sm={6} className='d-flex justify-content-end'>
              <Button
                onClick={handleOpen}
                className='d-flex align-items-center gap-2'
                color='primary'
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
                  <TableCell align='center'>Sala</TableCell>
                  <TableCell align='right'></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {query.data?.map((item) => (
                  <TableRow key={item.uuid}>
                    <TableCell>
                      <Link
                        to={paths.courseDetails.replace(':uuid', item.uuid)}
                      >
                        {item.nmcourse}
                      </Link>
                    </TableCell>
                    <TableCell align='center'>{item.classId}</TableCell>
                    <TableCell align='right'>
                      <DeleteOutline color='error' />
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
            onConfirm={() => {}}
          >
            <form className='d-flex flex-column gap-4'>
              <DefaultInput
                control={control}
                name='nmteacher'
                label='Nome da matéria'
              />
              <DefaultInput
                control={control}
                name='email'
                label='E-mail do professor'
              />
            </form>
          </DefaultModal>
        </div>
      )}
    </Container>
  );
}
