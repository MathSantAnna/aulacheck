import { useState } from 'react';
import { MenuOutlined } from '@mui/icons-material';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import Logo from '../../public/vite.svg';
import { useAuth } from '../hooks/auth';

import { useNavigate } from "react-router-dom";

import { version } from '../../package.json';

import '../styles/components/header.scss';
import { paths } from '../routes';

export function Header() {
  const navigate = useNavigate();

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
          <Button size='large' color='primary' onClick={() => navigate("/")}>
            Professores e matérias
          </Button>
          <Button size='large' color='primary' onClick={() => navigate("/aluno")}>
            Turmas e alunos
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
