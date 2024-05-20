import { useState } from 'react';
import { MenuOutlined } from '@mui/icons-material';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import Logo from '../../public/vite.svg';
import { useAuth } from '../hooks/auth';

import { version } from '../../package.json';

import '../styles/components/header.scss';
import { paths } from '../routes';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { nmuser, logOut } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const navigation = useNavigate();
  const handleOpen = () => setIsOpen((prev) => !prev);

  return (
    <header className='header'>
      <img src={Logo} alt='Logo' />
      <div className='profile' onClick={handleOpen}>
        <span>
          Bem-vindo <strong>{nmuser?.split(' ')[0]}</strong>
        </span>

        <MenuOutlined className='ms-3' />
      </div>

      <Modal isOpen={isOpen}>
        <ModalHeader toggle={handleOpen}>
          <strong>Menu</strong>
        </ModalHeader>
        <ModalBody className='d-flex flex-column gap-3'>
          <Button
            size='large'
            color='primary'
            outline
            onClick={() => {
              navigation(paths.teacher);
              handleOpen();
            }}
          >
            Professores
          </Button>
          <Button
            size='large'
            color='primary'
            outline
            onClick={() => {
              navigation(paths.course);
              handleOpen();
            }}
          >
            Matérias
          </Button>
          <Button
            size='large'
            color='primary'
            outline
            onClick={() => {
              navigation(paths.class);
              handleOpen();
            }}
          >
            Turmas
          </Button>

          <Button
            size='large'
            color='primary'
            outline
            onClick={() => {
              navigation(paths.students);
              handleOpen();
            }}
          >
            Alunos
          </Button>

          <Button onClick={logOut} size='large' color='danger'>
            Sair
          </Button>
        </ModalBody>
      </Modal>
      <div className='d-none'>{version}</div>
    </header>
  );
}
