import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import { Col, Container, Row } from 'reactstrap';
import { Button, Card, CardContent } from '@mui/material';
import { AddOutlined, CheckCircleOutline, HighlightOff, Margin } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import {getStudentsByClass} from '../services/students';

export function ClassRoomRollCall() {
    const [checked, setChecked] = React.useState([1]);

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const uuid = '1852a2de-932a-410c-ab2a-f3b0f0d3cba9';

    const queryStudents = useQuery({
        queryKey: ['GET_COURSES'],
        queryFn: () => getStudentsByClass(uuid || ''),
    });

    const students = queryStudents.data || [];
    console.log(students);
    



    return (
        <Container>
            <div className='page-content'>
                <Row>
                    <Col sm={6}>
                        <h4>Chamada</h4>
                    </Col>
                </Row>
            </div>
            <div style={{ margin: "10px 0" }}>
                <Card>
                    <CardContent>
                        <h5>Matemática</h5>
                        <p>Professor: Pedro Santos</p>
                        <p>Turma: 7B</p>
                    </CardContent>
                </Card>
            </div>
            <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {students.map((student:any) => {
                    const labelId = `checkbox-list-secondary-label-${student}`;
                    return (
                        <ListItem
                            key={student.uuid}
                            secondaryAction={
                                <Checkbox icon={<HighlightOff />} checkedIcon={<CheckCircleOutline />} />
                            }
                            disablePadding
                        >
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar
                                        alt={`Avatar n°${student + 1}`}
                                        src={`/static/images/avatar/${student + 1}.jpg`}
                                    />
                                </ListItemAvatar>
                                <ListItemText id={labelId} primary={student.nmstudent} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Button color='primary' style={{ margin: "10px 0", width: "100%" }}>Finalizar Chamada</Button>
        </Container >
    );
}