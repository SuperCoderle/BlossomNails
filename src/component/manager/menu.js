import { Link, useNavigate } from "react-router-dom"
import '../../wwwroot/css/manager.css'
import { useEffect, useState } from "react"
import logo from '../../wwwroot/image/logo.png'
import axios from "axios";
import moment from "moment";
import OutsideClickHandler from "react-outside-click-handler";
import jwtDecode from "jwt-decode";

function menu() {
    const url_bookingDetails = "https://blossomnails.somee.com/api/BookingDetails/";
    const [show, setShow] = useState(false);
    const [showNoti, setShowNoti] = useState(false);
    const [showOpt, setShowOpt] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("token") !== null ? localStorage.getItem("token") : null;
    const currentUser = token ? jwtDecode(token) : null;

    const [data, setData] = useState([]);
    function showNotificationCount() {
        data.filter(value => moment(value.bkDate).format("DD/MM/YYYY") == moment(new Date).format("DD/MM/YYYY")).length > 0 ?
            document.title = "(" + data.filter(value => moment(value.bkDate).format("DD/MM/YYYY") == moment(new Date).format("DD/MM/YYYY")).length + ") " + "You have new booking today!"
            :
            "";
    }

    useEffect(() => {
        getData();
        currentUser && currentUser.role === "Administrator" ?
            showNotificationCount()
            :
            null
    })

    const getData = async () => {
        await axios.get(url_bookingDetails)
            .then((result) => {
                setData(result.data);
            })
    }

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
    }

    return (
        <>
            <div className="top-menu">
                <div className="top-item">
                    <Link to={"/"} className="logo">
                        <img src={logo} alt="logo" />
                    </Link>

                    <ul>
                        <li><Link to={"/"}><i className='bx bx-search' ></i></Link></li>
                        <li><Link><i className='bx bx-credit-card' ></i></Link></li>
                        <li>
                            <OutsideClickHandler onOutsideClick={() => setShowNoti(false)}>
                                <Link onClick={() => setShowNoti(!showNoti)}><i className='bx bxs-bell' >{data.filter(value => value.status === "In Progress").length > 0 ? (<div></div>) : null}</i></Link>
                                <div className={`notification ${showNoti ? "show" : null}`}>
                                    {
                                        data && data.length > 0 ?
                                            data.filter(value => value.status === "In Progress").map((item, index) => {
                                                return (
                                                    <div className="notification-item" key={index}>
                                                        <div className="img-first-letter">{item.clientName.split('')[0].toUpperCase()}</div>
                                                        <div>
                                                            <p>Blossom Nails <span>{moment.utc(item.createdDate).local().startOf('seconds').fromNow()}</span></p>
                                                            <span>You have a new booking from {item.clientName}. The time will start at {moment(item.bkDate).format("DD MMM YYYY")} {item.bkTime} </span>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            :
                                            "You have no any no notifications right now."
                                    }
                                </div>
                            </OutsideClickHandler>
                        </li>
                        <li>
                            <OutsideClickHandler onOutsideClick={() => setShowOpt(false)}>
                                <Link onClick={() => setShowOpt(!showOpt)}><img src="https://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png" alt="" /></Link>
                                <div className={`user-option ${showOpt ? "show" : null}`}>
                                    <button type="button" onClick={logout}>Log out</button>
                                </div>
                            </OutsideClickHandler>
                        </li>
                    </ul>

                    <Link className="menu" onClick={() => setShow(true)}><i className='bx bx-menu'></i></Link>
                </div>
            </div>
            <nav className={show ? "show" : null}>
                <div className="menu-bar">
                    <ul>
                        <li><Link onClick={() => setShow(false)}><i className='bx bx-x'></i></Link></li>
                        <p>Home</p>
                        <li><Link to={'/manager/dashboard'}><i className='bx bxs-dashboard'></i> Dashboard</Link></li>
                        <li><Link to={'/manager/calender'}><i className='bx bx-calendar-alt' ></i> Calender</Link></li>
                        <li><Link to={'/loading'}><i className='bx bxs-bookmark-minus'></i> Sales</Link></li>
                        <li>
                            <Link to={'/manager/online_booking'}><i className='bx bxs-calendar-check' ></i> Online Booking
                                <span>
                                    {
                                        data && data.length > 0 ?
                                            data.filter(value => moment(value.bkDate).format("DD/MM/YYYY") == moment(new Date).format("DD/MM/YYYY")).length
                                            :
                                            "0"
                                    }
                                </span>
                            </Link>
                        </li>
                        <p>Management</p>
                    </ul>
                    <ul>
                        <li><Link to={'/manager/client'}><i className='bx bx-user'></i> Clients</Link></li>
                        <li><Link to={'/manager/staff'}><i className='bx bx-briefcase-alt'></i> Staffs</Link></li>
                        <li><Link to={'/manager/services'}><i className='bx bxs-detail'></i> Services</Link></li>
                        <li><Link to={'/manager/product'}><i className='bx bxs-detail'></i> Products</Link></li>
                        <p>Others</p>
                        <li><Link to={'/manager/message'}><i className='bx bx-message-rounded'></i> Client Message</Link></li>
                        <li><Link to={'/manager/gallery'}><i className='bx bx-images' ></i> Galerry</Link></li>
                    </ul>
                </div>
            </nav>


        </>
    )
}

export default menu