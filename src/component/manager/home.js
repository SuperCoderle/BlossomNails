import { useEffect, useState } from 'react';
import Menu from './menu'
import { appointments } from '../../data/appointment'
// import { Scheduler } from "@aldabil/react-scheduler";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import Unauthorized from '../unauthorized';
import jwtDecode from 'jwt-decode';
import styled from '@mui/material/styles/styled';
import LinearProgress from '@mui/material/LinearProgress/LinearProgress';
import { EditingState, ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    DayView,
    Appointments,
    AppointmentTooltip,
    WeekView,
    ViewSwitcher,
    Toolbar,
    MonthView,
    DateNavigator,
    TodayButton,
    AppointmentForm,
    EditRecurrenceMenu,
    ConfirmationDialog,
} from '@devexpress/dx-react-scheduler-material-ui';
import { Paper } from '@mui/material';

function home() {
    const url_bookingDetails = "https://blossomnails.somee.com/api/BookingDetails/";
    const url_staffs = "https://blossomnails.somee.com/api/Staffs/";

    const [data, setData] = useState([]);
    const [mode, setMode] = useState("tabs");
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date);

    const appointment_schedule = [];
    const navigation = [];

    const [color, setColor] = useState("");

    const token = localStorage.getItem("token") !== null ? localStorage.getItem("token") : null;
    const currentUser = token ? jwtDecode(token) : null;

    useEffect(() => {
        getData();
    }, []);

    const classes = {
        toolbarRoot: `blossom-toolbarRoot`,
        progress: 'blossom-progress'
    };

    const StyledDiv = styled("div")({
        [`&.${classes.toolbarRoot}`]: {
            position: "relative"
        }
    });

    const StyledLinearProgress = styled(LinearProgress)(() => ({
        [`&.${classes.progress}`]: {
            position: "absolute",
            width: "100%",
            bottom: 0,
            left: 0
        }
    }));

    const getData = async () => {
        setLoading(true);
        await axios.get(url_bookingDetails)
            .then((result) => {
                setTimeout(() => {
                    result.data.map((item) => {
                        const object = {
                            'id': item.bookingDetailsId,
                            'title': item.message && item.message.length > 0? `From ${item.clientName}: ${item.message}` : "No message",
                            'startDate': moment(new Date(`${moment(item.bkDate).format("MMM DD, YYYY")} ${item.bkTime}:00`)),
                            'endDate': moment(new Date(`${moment(item.bkDate).format("MMM DD, YYYY")} ${item.endTime}:00`))
                        }
                        setData(value => [...value, object]);
                    })
                    updateUnique(data);
                    setLoading(false);
                }, 600);
            });
    }

    function uniqueById(data) {
        const set = new Set();
        return data.filter((item) => {
            const isDuplicate = set.has(item.id);
            set.add(item.id);
            return !isDuplicate;
        });
    }

    const updateUnique = (newData) => {
        setData((data) => {
            return uniqueById([...data, ...newData]);
        });
    };

    console.log(data);

    const ToolbarWithLoading = ({ children, ...restProps }) => (
        <StyledDiv className={classes.toolbarRoot}>
            <Toolbar.Root {...restProps}>{children}</Toolbar.Root>
            <StyledLinearProgress className={classes.progress} />
        </StyledDiv>
    );

    const usaTime = date => new Date(date).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });

    const schedulerData = [
        { startDate: new Date, endDate: new Date, title: 'Meeting' },
        { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
    ];

    const handleDateChanged = (currentDate) => { setDate(currentDate) };

    return (
        currentUser && currentUser.role === "Administrator" ?
            <>
                <ToastContainer />
                <Menu />
                <Paper className='paper'>
                    <Scheduler
                        data={data}
                        height={660}
                        locale={'en-UK'}
                    >
                        <ViewState
                            defaultCurrentDate={date}
                            defaultCurrentViewName='Week'
                        />
                        <DayView
                            startDayHour={9}
                            endDayHour={18}
                            cellDuration={15}
                        />
                        <WeekView
                            startDayHour={9}
                            endDayHour={18}
                            excludedDays={[0, 6]}
                            cellDuration={15}
                        />
                        <MonthView />
                        <Toolbar
                            {...(loading ? { rootComponent: ToolbarWithLoading } : null)}
                        />
                        <ViewSwitcher />
                        <DateNavigator />
                        <TodayButton />
                        <Appointments />
                        <AppointmentTooltip
                            showCloseButton
                        />
                        <AppointmentForm
                            readOnly
                        />
                    </Scheduler>
                </Paper>


            </>
            :
            <Unauthorized />
    )
}

export default home