import { useRef, useState } from 'react';
import Menu from './menu'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { Modal, Box } from '@mui/material';
import logo from '../../wwwroot/image/logo.png'
import Loading from '../loading';
import Unauthorized from '../unauthorized';
import jwtDecode from 'jwt-decode';
import ReactToPrint, { useReactToPrint } from 'react-to-print';

function online_booking() {

    const url = "https://blossomnails.somee.com/api/BookingDetails/";
    const url_staffs = "https://blossomnails.somee.com/api/Staffs/";
    const url_services = "https://blossomnails.somee.com/api/Services/"

    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [staffs, setStaffs] = useState([]);
    const [serviceList, setServiceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const componentRef = useRef();
    const [filter, setFilter] = useState(false);

    const [staffId, setStaffId] = useState('');
    const [search, setSearch] = useState('');

    // Object
    const [bookingId, setBookingId] = useState('');
    const [clientName, setClientName] = useState('');
    const [numberPhone, setNumberPhone] = useState('');
    const [services, setServices] = useState('');
    const [bkTime, setBkTime] = useState('');
    const [bkDate, setBkDate] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [message, setMessage] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    const [endTime, setEndTime] = useState('');
    // Object

    const handleOpen = () => { setOpen(true) };
    const handleClose = () => { setOpen(false) };

    const token = localStorage.getItem("token") !== null ? localStorage.getItem("token") : null;
    const currentUser = token ? jwtDecode(token) : null;

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        p: 2,
        borderRadius: "5px"
    };

    useEffect(() => {
        setTimeout(() => {
            getData();
            setLoading(false);
        }, 1000);
    }, []);

    const getData = async () => {
        await axios.get(url)
            .then((result) => {
                setData(result.data);
            })
            .catch((error) => {
                toast.error("Booking Failed!");
            })
        await axios.get(url_staffs)
            .then((result) => {
                setStaffs(result.data);
            })
        await axios.get(url_services)
            .then((result) => {
                setServiceList(result.data);
            })
    }

    const getSimpleData = async (bookingId) => {
        setOpen(true);
        await axios.get(url + bookingId)
            .then((result) => {
                setBookingId(result.data.bookingDetailsId);
                setClientName(result.data.clientName);
                setNumberPhone(result.data.numberPhone);
                setServices(result.data.services);
                setBkTime(result.data.bkTime);
                setBkDate(result.data.bkDate);
                setTotalPrice(result.data.totalPrice);
                setMessage(result.data.message);
                setCreatedDate(result.data.createdDate);
                setEndTime(result.data.endTime);
                setStaffId(result.data.staffId);
            })
    }

    const handleDelete = async (bookingDetailsId) => {
        if (window.confirm("Do you want to delete this booking?")) {
            await axios.delete(url + bookingDetailsId)
                .then((result) => {
                    toast.success("Delete successfully!");
                    getData();
                })
        }
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Invoice",
        pageStyle: "print"
    })

    const handleCheck = () => {
        if (event.target.checked) {
            setFilter(true);
        }
        else {
            setFilter(false);
        }
    }

    return (
        currentUser && currentUser.role === "Administrator" ?
            <>
                <ToastContainer />
                {loading ? (<Loading />) : null}

                <Menu />

                <div className='main'>
                    <h3>Online Booking</h3>

                    <div className='tool'>
                        <div className='filter'>
                            <input type='checkbox' id='today' name='today' onClick={handleCheck} />
                            <label htmlFor='today'>Booking Scheduler Today</label>
                        </div>

                        <div className='search-tool'>
                            <input type='text' placeholder='Seach Booking' value={search} onChange={(e) => setSearch(e.target.value)}></input>
                            <i className='bx bx-search' ></i>
                        </div>

                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th style={{ width: "15%" }}>Client Name</th>
                                <th style={{ width: "25%" }}>Services</th>
                                <th className='text-center' style={{ width: "10%" }}>Total Price</th>
                                <th className='text-center' style={{ width: "15%" }}>Staff</th>
                                <th className='text-center' style={{ width: "20%" }}>Booking Scheduler</th>
                                <th className='text-center' style={{ width: "15%" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filter ?
                                    data && data.length > 0 ?
                                        data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()).filter((value) =>
                                            moment(value.bkDate).format("DD/MM/YYYY") == moment(new Date).format("DD/MM/YYYY") &&
                                            (
                                                value.clientName.toLowerCase().includes(search.toLowerCase()) ||
                                                value.services.toLowerCase().includes(search.toLowerCase()) ||
                                                value.status.toLowerCase().includes(search.toLowerCase())
                                            ))
                                            .map((item, index) => {
                                                return (
                                                    <tr key={item.bookingDetailsId}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.clientName}</td>
                                                        <td>
                                                            {
                                                                item.services.split(', ').map((item, index) => {
                                                                    return (
                                                                        serviceList && serviceList.length > 0 ?
                                                                            <span key={index}>{serviceList.find(value => value.serviceId === item).serviceName} {serviceList.find(value => value.serviceId === item).otherName && serviceList.find(value => value.serviceId === item).otherName.length > 0 ? `(${serviceList.find(value => value.serviceId === item).otherName})` : null}  <br /></span>
                                                                            :
                                                                            null
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                        <td className='text-center'>€{item.totalPrice}</td>
                                                        <td className='text-center'>{item.staffId && item.staffId.length > 0 ? staffs && staffs.length > 0 ? staffs.find(value => value.staffId === item.staffId).staffName : null : <i>No staff</i>}</td>
                                                        <td className='text-center'>
                                                            <span style={{ width: "100%" }}>{moment(item.bkDate).format("DD-MM-YYYY")}</span>
                                                            <span style={{ width: "100%", display: "block", fontSize: "14px" }}>{item.bkTime} - {item.endTime}</span>
                                                        </td>
                                                        <td className='text-center'>
                                                            <div>
                                                                <button type='button' className='info-btn' onClick={() => getSimpleData(item.bookingDetailsId)}><i className='bx bx-info-circle'></i> <span className='tooltips'>Info</span></button>
                                                                <button type='button' className='delete-btn' onClick={() => handleDelete(item.bookingDetailsId)}><i className='bx bx-trash'></i> <span className='tooltips'>Delete</span></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        :
                                        (
                                            <tr className='loading-text'><td>No schedule at the moment...</td></tr>
                                        )
                                    :
                                    data && data.length > 0 ?
                                        data.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()).filter((value) =>
                                            value.clientName.toLowerCase().includes(search.toLowerCase()) ||
                                            value.services.toLowerCase().includes(search.toLowerCase() ||
                                                value.status.toLowerCase().includes(search.toLowerCase()))).map((item, index) => {
                                                    return (
                                                        <tr key={item.bookingDetailsId}>
                                                            <td>{index + 1}</td>
                                                            <td>{item.clientName}</td>
                                                            <td>
                                                                {
                                                                    item.services.split(', ').map((item, index) => {
                                                                        return (
                                                                            serviceList && serviceList.length > 0 ?
                                                                                <span key={index}>{serviceList.find(value => value.serviceId === item).serviceName} {serviceList.find(value => value.serviceId === item).otherName && serviceList.find(value => value.serviceId === item).otherName.length > 0 ? `(${serviceList.find(value => value.serviceId === item).otherName})` : null}  <br /></span>
                                                                                :
                                                                                null
                                                                        )
                                                                    })
                                                                }
                                                            </td>
                                                            <td className='text-center'>€{item.totalPrice}</td>
                                                            <td className='text-center'>{item.staffId && item.staffId.length > 0 ? staffs && staffs.length > 0 ? staffs.find(value => value.staffId === item.staffId).staffName : null : <i>No staff</i>}</td>
                                                            <td className='text-center'>
                                                                <span style={{ width: "100%" }}>{moment(item.bkDate).format("DD-MM-YYYY")}</span>
                                                                <span style={{ width: "100%", display: "block", fontSize: "14px" }}>{item.bkTime} - {item.endTime}</span>
                                                            </td>
                                                            <td className='text-center'>
                                                                <div>
                                                                    <button type='button' className='info-btn' onClick={() => getSimpleData(item.bookingDetailsId)}><i className='bx bx-info-circle'></i> <span className='tooltips'>Info</span></button>
                                                                    <button type='button' className='delete-btn' onClick={() => handleDelete(item.bookingDetailsId)}><i className='bx bx-trash'></i> <span className='tooltips'>Delete</span></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                        :
                                        (
                                            <tr className='loading-text'><td>No schedule at the moment...</td></tr>
                                        )
                            }

                        </tbody>
                    </table>
                </div>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className='invoice-modal'
                >
                    <Box sx={style}>
                        <div className="invoice-box" ref={componentRef}>
                            <table cellPadding="0" cellSpacing="0">
                                <tbody>
                                    <tr className="top">
                                        <td colSpan="2">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td className="title">
                                                            <img src={logo} style={{ width: "100%", maxWidth: "300px" }} />
                                                        </td>

                                                        <td>
                                                            Invoice #: {bookingId.split("-").slice(0, 1)}<br />
                                                            Created: {moment(new Date).format("MMM DD, YYYY")}<br />
                                                            Due: February 1, 2015
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>

                                    <tr className="information">
                                        <td colSpan="2">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            Blossom Nails Store<br />
                                                            12345 Sunny Road<br />
                                                            Sunnyville, CA 12345
                                                        </td>

                                                        <td>
                                                            Client<br />
                                                            {clientName}<br />
                                                            {numberPhone}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>

                                    <tr className="heading">
                                        <td>
                                            Payment Method
                                        </td>

                                        <td>
                                            Check #
                                        </td>
                                    </tr>

                                    <tr className="details">
                                        <td>
                                            Check
                                        </td>

                                        <td>
                                            1000
                                        </td>
                                    </tr>

                                    <tr className="heading">
                                        <td>
                                            Item
                                        </td>

                                        <td>
                                            Price
                                        </td>
                                    </tr>

                                    {
                                        services && services.length > 0 ?
                                            services.split(", ").map(x =>
                                                serviceList && serviceList.length > 0 ?
                                                    (
                                                        <tr className="item" key={serviceList.find(value => value.serviceId === x).serviceId}>
                                                            <td>
                                                                {serviceList.find(value => value.serviceId === x).serviceName} {serviceList.find(value => value.serviceId === x).otherName && serviceList.find(value => value.serviceId === x).otherName.length > 0 ? `(${serviceList.find(value => value.serviceId === x).serviceName})` : null}
                                                            </td>

                                                            <td>
                                                                €{serviceList.find(value => value.serviceId === x).otherName && serviceList.find(value => value.serviceId === x).otherName.length > 0 ?
                                                                    serviceList.find(value => value.serviceId === x).otherPrice
                                                                    :
                                                                    serviceList.find(value => value.serviceId === x).price}
                                                            </td>
                                                        </tr>
                                                    )
                                                    : null)
                                            :
                                            null
                                    }

                                    {/* <tr className="item last">
                                        <td>
                                            Domain name (1 year)
                                        </td>

                                        <td>
                                            $10.00
                                        </td>
                                    </tr> */}

                                    <tr className="total">
                                        <td></td>
                                        <td>
                                            Total: €{totalPrice}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' onClick={handlePrint}><i className='bx bx-printer'></i> Print Invoice</button>
                        </div>
                    </Box>
                </Modal>
            </>
            :
            <Unauthorized />
    )
}

export default online_booking