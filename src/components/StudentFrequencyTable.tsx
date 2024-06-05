import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourseById, getStudentsByCourse, getTeacherByCourse } from '../services/courses';
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
    Tooltip
} from '@mui/material';
import { MoreVert, HowToReg, InfoOutlined } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardControlKey';
import { blue } from '@mui/material/colors';
import InfoIcon from '@mui/icons-material/Info';
import { Button, Col, Row } from 'reactstrap';
import { Gauge } from '@mui/x-charts';
import { useState } from 'react';

export const StudentFrequencyTable = (props: any) => {
    const { student } = props;
    const [open, setOpen] = useState(false);

    function getCurrentFormattedDate(historyDate: any) {
        const date = new Date(historyDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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
                                            <Tooltip title='teste' arrow  placement='top-start' style={{marginLeft: '5px', cursor: 'pointer'}}>
                                                <InfoOutlined sx={{ fontSize: 20 }}/>

                                            </Tooltip>
                                            
                                        </TableCell>
                                        <TableCell>Periodo</TableCell>
                                        <TableCell align="center">Presente</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {student.classroomDetails.history.map((historyRow) => (
                                        <TableRow key={historyRow.date}>
                                            <TableCell component="th" scope="row">
                                                {getCurrentFormattedDate(historyRow.date)}
                                            </TableCell>
                                            <TableCell>{historyRow.period === 1 ? 'Primeira chamada' : 'Segunda chamada'}</TableCell>
                                            <TableCell align="center">{historyRow.presence ? "Presente" : "Ausente"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )

}


