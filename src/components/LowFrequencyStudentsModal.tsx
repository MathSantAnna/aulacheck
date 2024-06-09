
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import { DialogContent } from '@mui/material';

//const students = [{ email: 'rafael@gmail.com', nome: "Rafael", responsavel: "oslier@gmail.com" }];

export interface SimpleDialogProps {
    students: any[];
}

export default function LowFrequencyStudentsModal(props: SimpleDialogProps) {

    const [open, setOpen] = useState(true);


    const handleClose = () => {
        setOpen(false);
    };
    let { students } = props;


    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Os alunos a seguir estão com baixa frequência de presença</DialogTitle>
            <DialogContent>Um e-mail será enviado automaticamente aos pais dos seguintes alunos:</DialogContent>
            <List sx={{ pt: 0 }}>
                {students.map((s, key) => (
                    <ListItem disableGutters key={key}>
                        <ListItemButton onClick={() => handleClose()}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={"Aluno"} secondary={s.nmstudent} />
                            <ListItemText primary={"Email do responsável:"} secondary={s.parentemail} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}