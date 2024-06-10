import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCourseById, getStudentsByCourse, getTeacherByCourse, updateClassRoom } from '../services/courses';
import { Link } from 'react-router-dom';
import { paths } from '../routes';
import {
    Avatar,
    Card,
    CardHeader,
    IconButton,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box,
    Typography,
    Collapse,
    Tooltip,
    ToggleButtonGroup,
    ToggleButton
} from '@mui/material';
import { MoreVert, HowToReg, InfoOutlined } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardControlKey';
import { blue } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import { Gauge } from '@mui/x-charts';
import { useState } from 'react';
import { useAuth } from '../hooks/auth';
import { DefaultModal } from './DefaultModal';

export const StudentFrequencyTable = (props: any) => {

    const { isStudent } = useAuth();
    const { student, course } = props;
    const [open, setOpen] = useState(false);
    const [isEditPresenceModalOpen, setIsEditPresenceModalOpen] = useState(false);
    const [presence, setPresence] = useState(false);
    const [selectedClassroom, setSelectedClassroom] = useState({} as any);
    const [studentData, setStudentData] = useState(student);

    const queryClient = useQueryClient();

    function getCurrentFormattedDate(historyDate: any) {
        const date = new Date(historyDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }


    const mutationUpdateClassRoom = useMutation({
        mutationFn: (data: { uuid: any, presence: any }) => updateClassRoom(data.uuid, data.presence),
        onSuccess: () => {
            queryClient.invalidateQueries([`GET_STUDENTS_${course?.uuid}`]);
            // Update the local state to reflect the changes instantly
            const updatedHistory = studentData.classroomDetails.history.map((entry: any) => {
                if (entry.uuid === selectedClassroom.uuid) {
                    return { ...entry, presence: presence };
                }
                return entry;
            });
            setStudentData({
                ...studentData,
                classroomDetails: {
                    ...studentData.classroomDetails,
                    history: updatedHistory
                }
            });
        },
    });

    function handleEditClick(classroomDetails: any) {
        setSelectedClassroom(classroomDetails);
        setPresence(classroomDetails.presence);
        setIsEditPresenceModalOpen(true);
    }

    function handleEditPresence() {
        mutationUpdateClassRoom.mutate({ uuid: selectedClassroom.uuid, presence: presence });
        setIsEditPresenceModalOpen(false);
    }





    return (
        <>
            <TableRow key={student.uuid}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    <Link
                        to={paths.studentsDetails.replace(
                            ':uuid',
                            student.uuid
                        )}
                    >
                        {student.nmstudent}
                    </Link>
                </TableCell>
                <TableCell align='center'>{student.email}</TableCell>
                <TableCell align='center'>{student.classroomDetails.numberOfAbsent}</TableCell>
                <TableCell align='center'>
                    <div style={{ alignItems: "center", display: "flex" }}>
                        <Gauge width={80} height={80} value={student.classroomDetails.frequence} valueMax={100} startAngle={-90} endAngle={90} />
                    </div>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Histórico
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Data
                                        </TableCell>
                                        <TableCell>
                                            Periodo
                                            <Tooltip title='Registro de presença' arrow placement='top-start' style={{ marginLeft: '5px', marginBottom: '3px', cursor: 'pointer' }}>
                                                <InfoOutlined sx={{ fontSize: 20 }} color='disabled' />
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">Presente</TableCell>
                                        {!isStudent && <TableCell align="center"></TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {student.classroomDetails.history.map((historyRow) => (
                                        <>
                                            <TableRow key={historyRow.date}>
                                                <TableCell component="th" scope="row">
                                                    {getCurrentFormattedDate(historyRow.date)}
                                                </TableCell>
                                                <TableCell>{historyRow.period === 1 ? 'Primeira chamada' : 'Segunda chamada'}</TableCell>
                                                <TableCell align="center">{historyRow.presence ? "Presente" : "Ausente"}</TableCell>
                                                {!isStudent && <TableCell align="center">
                                                    <EditIcon

                                                        fontSize='small'
                                                        style={{ cursor: 'pointer', color: '#6c757d' }}
                                                        onClick={() => {
                                                            handleEditClick(historyRow)
                                                        }}
                                                    />
                                                </TableCell>}
                                            </TableRow>
                                        </>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <DefaultModal
                title={`Editar presença de ${student.nmstudent}`}
                isOpen={isEditPresenceModalOpen}
                onConfirm={() => handleEditPresence()}
                onCancel={() => setIsEditPresenceModalOpen(false)}
            >
                <div className='text-center'>
                    <ToggleButtonGroup
                        value={presence}
                        exclusive
                        aria-label="presença"
                        size='small'
                    >
                        <ToggleButton color='primary' onClick={() => setPresence(true)} value={true} aria-label="Primeiro periodo">
                            Presente
                        </ToggleButton>
                        <ToggleButton color='primary' onClick={() => setPresence(false)} value={false} aria-label="Segundo periodo">
                            Ausente
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </DefaultModal>
        </>
    )

}


