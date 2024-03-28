import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from 'reactstrap';

type Props = ModalProps & {
  title: string;
  toggle(): void;

  onConfirm?(): void;
  onCancel?(): void;
  confirmLabel?: string;
  cancelLabel?: string;
};

export function DefaultModal(props: Props) {
  const { title, onConfirm, onCancel, confirmLabel, cancelLabel, ...rest } =
    props;

  return (
    <Modal {...rest}>
      <ModalHeader toggle={rest.toggle}>
        <strong>{title}</strong>
      </ModalHeader>
      <ModalBody className='d-flex flex-column gap-3'>
        {rest.children}
      </ModalBody>
      {(onConfirm || onCancel) && (
        <ModalFooter>
          <Button onClick={onCancel || rest.toggle}>
            {cancelLabel || 'Fechar'}
          </Button>
          <Button onClick={onConfirm} color='primary'>
            {confirmLabel || 'Enviar'}
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
}
