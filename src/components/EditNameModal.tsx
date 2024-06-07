import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Input,
  FormGroup,
  Label,
} from 'reactstrap';

type Props = ModalProps & {
  title: string;
  toggle(): void;
  onConfirm(newName: string): void;
  onCancel?(): void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmButtonColor?: string;
  currentName: string;
};

export function EditNameModal(props: Props) {
  const {
    title,
    onConfirm,
    onCancel,
    confirmLabel,
    cancelLabel,
    confirmButtonColor,
    currentName,
    ...rest
  } = props;

  const [newName, setNewName] = useState(currentName);

  const handleConfirm = () => {
    onConfirm(newName);
  };

  return (
    <Modal {...rest}>
      <ModalHeader toggle={rest.toggle}>
        <strong>{title}</strong>
      </ModalHeader>
      <ModalBody className='d-flex flex-column gap-3'>
        <FormGroup>
          <Label for="name">Nome</Label>
          <Input
            id="name"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onCancel || rest.toggle}>
          {cancelLabel || 'Cancelar'}
        </Button>
        <Button onClick={handleConfirm} color={confirmButtonColor || 'primary'}>
          {confirmLabel || 'Confirmar'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
