import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import { Col, Container, Row, Button } from 'reactstrap';
import { Alert, Box, Card, Divider, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material';
import TodayIcon from '@mui/icons-material/Today';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { getStudentsByCourse, getTeacherByCourse, submitAttendance, getRollCallByDate } from '../services/courses';
import { getClass } from '../services/class';
import { paths } from '../routes';

export function ClassRoomRollCall() {
    const [checked, setChecked] = React.useState<{ [key: string]: boolean }>({});

    const [periodOneDisabled, setPeriodOneDisabled] = React.useState(false);
    const [periodTwoDisabled, setPeriodTwoDisabled] = React.useState(false);
    const [bothPeriodsDisabled, setBothPeriodsDisabled] = React.useState(false);

    const [period, setPeriod] = React.useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { course } = location.state || {};

    const queryStudents = useQuery({
        queryKey: ['GET_COURSES'],
        queryFn: () => getStudentsByCourse(course.uuid || ''),
    });

    const queryRollCallByDate = useQuery({
        queryKey: ['GET_ROLL_CALL_BY_DATE'],
        queryFn: () => getRollCallByDate(course.uuid, new Date()),
    });

    const pastRollCall = queryRollCallByDate.data || {};

    const { firstPeriod, secondPeriod } = pastRollCall;

    const students = queryStudents.data || [];

    const teacherQuery = useQuery({
        queryKey: ['GET_TEACHER'],
        queryFn: () => getTeacherByCourse(course.uuid || ''),
    });

    const teacher = teacherQuery.data || [];

    const classQuery = useQuery({
        queryKey: ['GET_CLASS'],
        queryFn: () => getClass()
    });

    const classes = classQuery.data || [];

    function getNameClass(classId: string) {
        if (!classId) return null;
        return classes.find(c => c.uuid === classId)?.nmclass;
    }

    const handleToggle = (studentId: string) => () => {
        setChecked(prev => ({
            ...prev,
            [studentId]: !prev[studentId]
        }));
    };

    const handlePeriodAble = (pastCall: any) => {
        const { firstPeriod, secondPeriod } = pastCall;

        setPeriodOneDisabled(!firstPeriod);
        setPeriodTwoDisabled(!secondPeriod);

        let newPeriod = period;

        if (period === "1" && firstPeriod) {
            if (!secondPeriod) {
                newPeriod = "2";
            } else {
                newPeriod = "3";
                setBothPeriodsDisabled(true);
            }
        }

        if (period === "2" && secondPeriod) {
            if (!firstPeriod) {
                newPeriod = "1";
            } else {
                newPeriod = "3";
                setBothPeriodsDisabled(true);
            }
        }

        if (newPeriod !== period) {
            setPeriod(newPeriod);
        }
    }

    function getCurrentFormattedDate() {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const mutateAttendance = useMutation({
        mutationFn: (attendanceData: any) => submitAttendance(attendanceData),
        onSuccess: () => {
            navigate(paths.courseDetails.replace(':uuid', course.uuid), { state: { newRollCall: true } })
        }
    });

    const finalizarChamada = () => {
        const attendanceData = students.map(student => ({
            courseId: course.uuid,
            studentId: student.uuid,
            presence: !!checked[student.uuid],
            period: Number(period)
        }));

        console.log(attendanceData)

        mutateAttendance.mutate(attendanceData);
    };

    // handlePeriodAble(pastRollCall);

    return (
        <Container>
            {
                firstPeriod && secondPeriod ?
                    <Alert style={{ marginTop: "10px" }} severity="warning">A chamada para esta data já foi realizada para todos os períodos</Alert>
                    :
                    <></>
            }
            <div className='page-content'>
                <Row>
                    <Col sm={6}>
                        <h4>Chamada</h4>
                    </Col>
                </Row>
            </div>
            <div style={{ margin: "10px 0" }}>
                <Card variant="outlined">
                    <Box sx={{ p: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography gutterBottom variant="h5" component="div">
                                {course.nmcourse}
                            </Typography>
                            <Typography gutterBottom variant="h6" component="div">
                                <Box display="flex" alignItems="center">
                                    <TodayIcon />
                                    <Box ml={1}>{getCurrentFormattedDate()}</Box>
                                </Box>
                            </Typography>
                        </Stack>
                        <Typography color="text.secondary" variant="body2">
                            {`Professor ${teacher.nmteacher}`}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                            {`Turma: ${getNameClass(course.classId)}`}
                        </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                        <Typography gutterBottom variant="body2">
                            Selecione o período
                        </Typography>
                        <ToggleButtonGroup
                            value={period}
                            disabled={firstPeriod && secondPeriod}
                            exclusive
                            aria-label="periodo"
                            size='small'
                        >
                            <ToggleButton disabled={firstPeriod} color='primary' onClick={() => setPeriod("1")} value="1" aria-label="Primeiro periodo">
                                Período 1
                            </ToggleButton>
                            <ToggleButton disabled={secondPeriod} color='primary' onClick={() => setPeriod("2")} value="2" aria-label="Segundo periodo">
                                Período 2
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </Card>
            </div>
            <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {students.map((student) => {
                    const labelId = `checkbox-list-secondary-label-${student.uuid}`;
                    return (
                        <ListItem
                            key={student.uuid}
                            secondaryAction={
                                <Checkbox
                                    icon={<HighlightOff />}
                                    checkedIcon={<CheckCircleOutline />}
                                    checked={!!checked[student.uuid]}
                                    onChange={handleToggle(student.uuid)}
                                />
                            }
                            disablePadding
                        >
                            <ListItemButton onClick={handleToggle(student.uuid)}>
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
            <Button disabled={period !== "1" && period !== "2"} color='primary' style={{ margin: "10px 0", width: "100%" }} onClick={finalizarChamada}>Finalizar Chamada</Button>
        </Container>
    );
}