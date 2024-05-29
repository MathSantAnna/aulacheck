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
  
  import { getClass } from '../services/class';
  
  import { paths } from '../routes';
import { getStudents } from '../services/students';
  
  export function Classes() {
    const [isOpen, setIsOpen] = useState(false);
  
    const { control } = useForm();
  
    const handleOpen = () => setIsOpen((prev) => !prev);
  
    const query = useQuery({
      queryKey: ['GET_CLASSES'],
      queryFn: getClass,
    });

    const queryStudents = useQuery({
        queryKey: ['GET_STUDENTS'],
        queryFn: getStudents,
      });
  
    console.log(queryStudents);
    
    
  
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
                <h4>Lista de Turmas</h4>
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
                    <TableCell>Turma</TableCell>
                    <TableCell align='center'>Ano</TableCell>
                    <TableCell align='center'>Número de alunos</TableCell>
                    <TableCell align='center'>Quantidade de Matérias</TableCell>
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
                        <DeleteOutline color='error' />
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
              onConfirm={() => {}}
            >
              <form className='d-flex flex-column gap-4'>
                <DefaultInput
                  control={control}
                  name='nmteacher'
                  label='Nome da turma'
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
  