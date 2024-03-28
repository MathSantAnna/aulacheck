import { AddOutlined, DeleteOutline } from '@mui/icons-material';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Button, Col, Row } from 'reactstrap';
import { teachers } from '../mocks/teachers';
import { Link } from 'react-router-dom';
import { paths } from '../routes';
import { DefaultModal } from '../components/DefaultModal';
import { useState } from 'react';
import { DefaultInput } from '../components/DefaultInput';
import { useForm } from 'react-hook-form';

export function Teachers() {
  const [isOpen, setIsOpen] = useState(false);

  const { control } = useForm();

  const handleOpen = () => setIsOpen((prev) => !prev);

  return (
    <div className='page-content'>
      <Row>
        <Col sm={6}>
          <h4>Lista de Professores</h4>
        </Col>
        <Col sm={6} className='d-flex justify-content-end'>
          <Button
            onClick={handleOpen}
            className='d-flex aling-items-center gap-2'
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
              <TableCell align='right'>N° de matérias</TableCell>
              <TableCell align='right'>Criado em</TableCell>
              <TableCell align='right'>Editado em</TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((item) => (
              <TableRow key={item.uuidteacher}>
                <TableCell>
                  <Link
                    to={paths.teacherDetails.replace(
                      ':uuidteacher',
                      item.uuidteacher
                    )}
                  >
                    {item.nmteacher}
                  </Link>
                </TableCell>
                <TableCell align='right'>{item.email}</TableCell>
                <TableCell align='right'>{item.courses.length}</TableCell>
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
        title='Adicionar professor'
        toggle={handleOpen}
        isOpen={isOpen}
        onConfirm={() => {}}
      >
        <form className='d-flex flex-column gap-4'>
          <DefaultInput
            control={control}
            name='nmteacher'
            label='Nome do professor'
          />
          <DefaultInput
            control={control}
            name='email'
            label='E-mail do professor'
          />
          <DefaultInput control={control} name='cpf' label='CPF' />
          <DefaultInput control={control} name='rg' label='RG' />
        </form>
      </DefaultModal>
    </div>
  );
}
