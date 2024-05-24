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
  import { getStudents } from '../services/students';

  import { paths } from '../routes';
  
  export function Students() {
    const [isOpen, setIsOpen] = useState(false);
  
    const { control } = useForm();
  
    const handleOpen = () => setIsOpen((prev) => !prev);
  
    const query = useQuery({
      queryKey: ['GET_STUDENTS'],
      queryFn: getStudents, 
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
                <h4>Lista de Alunos</h4>
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
                    <TableCell>Nome</TableCell>
                    <TableCell align='right'>E-mail</TableCell>
                    <TableCell align='right'>Data de Matrícula</TableCell>
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
                          to={paths.student.replace(
                            ':uuid',
                            item.uuid
                          )}
                        >
                          {item.nmstudent}
                        </Link>
                      </TableCell>
                      <TableCell align='right'>{item.email}</TableCell>
                      <TableCell align='right'>
                        {new Date(item.enrollmentDate).toLocaleString()}
                      </TableCell>
                      <TableCell align='right'>
                        {new Date(item.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell align='right'>
                        {new Date(item.updated_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <DeleteOutline color='error' />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
  
            <DefaultModal
              title='Adicionar aluno'
              toggle={handleOpen}
              isOpen={isOpen}
              onConfirm={() => {}}
            >
              <form className='d-flex flex-column gap-4'>
                <DefaultInput
                  control={control}
                  name='name'
                  label='Nome do aluno'
                />
                <DefaultInput
                  control={control}
                  name='email'
                  label='E-mail do aluno'
                />
                <DefaultInput control={control} name='cpf' label='CPF' />
                <DefaultInput control={control} name='rg' label='RG' />
              </form>
            </DefaultModal>
          </div>
        )}
      </Container>
    );
  }
  