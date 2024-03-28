import { MenuOutlined } from '@mui/icons-material';
import Logo from '../../public/vite.svg';
import { useAuth } from '../hooks/auth';

import '../styles/components/header.scss';
import { useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';

export function Header() {
  const { nmuser, logOut } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

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
          <Button size='large' color='primary'>
            Professores e matérias
          </Button>
          <Button size='large' color='primary'>
            Turmas e alunos
          </Button>

          <Button onClick={logOut} size='large' color='danger'>
            Sair
          </Button>
        </ModalBody>
      </Modal>
    </header>
  );
}
