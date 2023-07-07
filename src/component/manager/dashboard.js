import Menu from './menu'
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Loading from '../loading'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Unauthorized from '../unauthorized';
import jwtDecode from 'jwt-decode';

function dashboard() {
    const url_clients = "https://blossomnails.somee.com/api/Clients/";
    const url_staffs = "https://blossomnails.somee.com/api/Staffs/";
    const url_services = "https://blossomnails.somee.com/api/Services/";
    const url_bookingDetails = "https://blossomnails.somee.com/api/BookingDetails/";
    const url_clientMessages = "https://blossomnails.somee.com/api/ClientMessages/";
    const url_accounts = "https://blossomnails.somee.com/api/Accounts/";

    const [clients, setClients] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [services, setServices] = useState([]);
    const [bookingDetails, setBookingDetails] = useState([]);
    const [clientMessages, setClientMessages] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token") !== null ? localStorage.getItem("token") : null;
    const currentUser = token ? jwtDecode(token) : null;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    useEffect(() => {
        setTimeout(() => {
            getData();
            setLoading(false);
        }, 1000);
    }, []);

    const getData = async () => {
        await axios.get(url_clients)
            .then((result) => {
                setClients(result.data);
            })
        await axios.get(url_staffs)
            .then((result) => {
                setStaffs(result.data);
            })
        await axios.get(url_services)
            .then((result) => {
                setServices(result.data);
            })
        await axios.get(url_bookingDetails)
            .then((result) => {
                setBookingDetails(result.data);
            })
        await axios.get(url_clientMessages)
            .then((result) => {
                setClientMessages(result.data);
            })
        await axios.get(url_accounts)
            .then((result) => {
                setAccounts(result.data);
            })
    }

    const numberBooking = [];
    const numberAccount = [];

    for (let i = 0; i < months.length; i++) {
        numberBooking.push(bookingDetails.filter(value => moment(value.createdDate).format("DD MMM YYYY").split(" ")[1] == months[i]).length);
        numberAccount.push(accounts.filter(value => moment(value.createdDate).format("DD MMM YYYY").split(" ")[1] == months[i]).length);
    }

    const data = {
        labels: months,
        datasets: [
            {
                label: 'Number of bookings in the year',
                data: numberBooking,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)'
                ],
                borderWidth: 1,
            },
            {
                label: 'Register account',
                data: numberAccount,
                backgroundColor: [
                    'rgba(255, 159, 64, 0.6)'
                ],
                borderWidth: 1,
            }
        ],
    }

    const options = {}

    Chart.register(
        BarElement,
        CategoryScale,
        LinearScale,
        Tooltip,
        Legend
    )

    return (
        currentUser && currentUser.role === "Administrator" ?
        <>
            {loading ? (<Loading />) : null}
            <Menu />

            <div className='main'>
                <h3>Dashboard</h3>

                <div className='row' style={{height: "auto"}}>
                    <div className='col-12'>
                        <div className='row dashboard'>
                            <div className='col-4'>
                                <div className='card' style={{ background: "linear-gradient(rgb(131 184 193), rgb(206 149 156))", color: "white" }}>
                                    <div>
                                        <h4 className='m-0' style={{ fontWeight: "900" }}>{clients.length}</h4>
                                        <p>Clients</p>
                                    </div>
                                    <div>
                                        <i className='bx bxs-user' style={{ fontSize: "36px" }}></i>
                                    </div>
                                </div>
                            </div>

                            <div className='col-4'>
                                <div className='card' style={{ background: "linear-gradient(#FE5858, #EE9617)", color: "white" }}>
                                    <div>
                                        <h4 className='m-0' style={{ fontWeight: "900" }}>{staffs.length}</h4>
                                        <p>Staffs</p>
                                    </div>
                                    <div>
                                        <i className='bx bxs-user-circle' style={{ fontSize: "36px" }}></i>
                                    </div>
                                </div>
                            </div>

                            <div className='col-4'>
                                <div className='card' style={{ background: "linear-gradient(rgb(177 204 116), rgb(101 187 113))", color: "white" }}>
                                    <div>
                                        <h4 className='m-0' style={{ fontWeight: "900" }}>{services.length}</h4>
                                        <p>Services</p>
                                    </div>
                                    <div>
                                        <i className='bx bx-droplet' style={{ fontSize: "36px" }}></i>
                                    </div>
                                </div>
                            </div>

                            <div className='col-4'>
                                <div className='card' style={{ background: "linear-gradient(#E58C8A, #EEC0C6)", color: "white" }}>
                                    <div>
                                        <h4 className='m-0' style={{ fontWeight: "900" }}>{bookingDetails.filter(value => value.status === "In Progress").length}</h4>
                                        <p>New Booking</p>
                                    </div>
                                    <div>
                                        <i className='bx bxs-bookmarks' style={{ fontSize: "36px" }}></i>
                                    </div>
                                </div>
                            </div>

                            <div className='col-4'>
                                <div className='card' style={{ background: "linear-gradient(rgb(214 84 225), rgb(148 148 135))", color: "white" }}>
                                    <div>
                                        <h4 className='m-0' style={{ fontWeight: "900" }}>{clientMessages.filter(value => value.status === "unread").length}</h4>
                                        <p>New Message</p>
                                    </div>
                                    <div>
                                        <i className='bx bxs-message' style={{ fontSize: "36px" }}></i>
                                    </div>
                                </div>
                            </div>

                            <div className='col-4'>
                                <div className='card' style={{ background: "linear-gradient(rgb(214 84 225), rgb(148 148 135))", color: "white" }}>
                                    <div>
                                        <h4 className='m-0' style={{ fontWeight: "900" }}>872</h4>
                                        <p>Checkin</p>
                                    </div>
                                    <div>
                                        <i className='bx bxs-arrow-to-left' style={{ fontSize: "36px" }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='analytic'>
                    <h3>Analystic</h3>
                    <Bar
                        data={data}
                        options={options}
                    ></Bar>
                </div>
            </div>
        </>
        :
        (
            <Unauthorized />
        )
    )
}

export default dashboard