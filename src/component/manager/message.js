import moment from 'moment';
import Menu from './menu'
import { useState, useEffect } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../loading'
import Unauthorized from '../unauthorized';
import jwtDecode from 'jwt-decode';

function message() {
    const url = "https://blossomnails.somee.com/api/ClientMessages/";
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState({});
    const [open, setOpen] = useState(false);
    const [messageActive, setMessageActive] = useState('');
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState('');
    const [search, setSearch] = useState('');

    const array = ["Unread", "Read"];

    const style = {
        opacity: '1'
    }

    console.log(messages);

    const handleOpen = async (messageId) => {
        setOpen(true);
        setMessageActive(messageId);
        await axios.get(url + messageId)
            .then((result) => {
                result.data.status = "Read";
                axios.put(url + messageId, result.data)
                setMessage(result.data);
            })
            .catch((error) => {
                toast.error("Error!");
            })
        getData();
    }

    const token = localStorage.getItem("token") !== null ? localStorage.getItem("token") : null;
    const currentUser = token ? jwtDecode(token) : null;

    useEffect(() => {
        setTimeout(() => {
            getData();
            setLoading(false);
        }, 1000);
    }, []);

    const getData = async () => {
        const response = await axios.get(url)
            .catch((error) => {
                toast.error("Have an error when getting data!");
            })
        if (response.status == 200) {
            setMessages(response.data);
        }
    }

    const deleteData = async (messageId) => {
        if (window.confirm(`Do you want to delete this message?`) == true) {
            const response = await axios.delete(url + messageId)
                .catch((error) => {
                    toast.error("Deleting failed!");
                })
            if (response.status == 204) {
                toast.success(`Delete message successfully!`);
                getData();
            }
        }
    }

    return (
        currentUser && currentUser.role === "Administrator" ?
            <>
                <ToastContainer />
                {loading ? (<Loading />) : null}
                <Menu />

                <div className='main'>
                    <h3>Messages</h3>

                    <div className='row'>
                        <div className='col-sm-4'>
                            <div className='search'>
                                <input type='text' placeholder='Search...' value={search} onChange={(e) => setSearch(e.target.value)} />
                                <button type='button'><i className='bx bx-sort-down'></i></button>
                            </div>

                            <div className='status'>
                                <button type='button' className={active && active.length >= 0 ? null : "active"} onClick={() => setActive("")}>All</button>
                                {
                                    array.map((item, index) => {
                                        return (
                                            <button className={`${active == item ? "active" : null}`} type='button' key={index} onClick={() => setActive(item)}>{item}</button>
                                        )
                                    })
                                }
                            </div>

                            <div className='message'>
                                {
                                    messages && messages.length > 0 ?
                                        active === "Unread"
                                            ?
                                            messages.filter(value => value.clientName.toLowerCase().includes(search.toLowerCase()) && value.status === active).map((item) => {
                                                return (
                                                    <div className={`card ${messageActive === item.messageId ? "active" : null}`} onClick={() => handleOpen(item.messageId)} key={item.messageId}>
                                                        <div className={`card-body ${item.status == "Unread" ? "unread" : null}`}>
                                                            <div className='dot-unread'></div>
                                                            <div className="img-first-letter"><span>{item.clientName.split('')[0].toUpperCase()}</span></div>
                                                            <div className='text'>
                                                                <h5 className="card-title">{item.clientName} <span>{moment.utc(item.createdDate).local().startOf('seconds').fromNow()}</span></h5>
                                                                <p>{item.message}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            :
                                            active === "Read" ?
                                                messages.filter(value => value.clientName.toLowerCase().includes(search.toLowerCase()) && value.status === active).map((item) => {
                                                    return (
                                                        <div className={`card ${messageActive === item.messageId ? "active" : null}`} onClick={() => handleOpen(item.messageId)} key={item.messageId}>
                                                            <div className={`card-body ${item.status == "Unread" ? "unread" : null}`}>
                                                                <div className='dot-unread'></div>
                                                                <div className="img-first-letter"><span>{item.clientName.split('')[0].toUpperCase()}</span></div>
                                                                <div className='text'>
                                                                    <h5 className="card-title">{item.clientName} <span>{moment.utc(item.createdDate).local().startOf('seconds').fromNow()}</span></h5>
                                                                    <p>{item.message}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                :
                                                messages.filter(value => value.clientName.toLowerCase().includes(search.toLowerCase())).map((item) => {
                                                    return (
                                                        <div className={`card ${messageActive === item.messageId ? "active" : null}`} onClick={() => handleOpen(item.messageId)} key={item.messageId}>
                                                            <div className={`card-body ${item.status == "Unread" ? "unread" : null}`}>
                                                                <div className='dot-unread'></div>
                                                                <div className="img-first-letter"><span>{item.clientName.split('')[0].toUpperCase()}</span></div>
                                                                <div className='text'>
                                                                    <h5 className="card-title">{item.clientName} <span>{moment.utc(item.createdDate).local().startOf('seconds').fromNow()}</span></h5>
                                                                    <p>{item.message}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                        :
                                        "No message"
                                }
                            </div>

                        </div>

                        <div className='col-sm-8'>
                            {
                                !open ?
                                    (
                                        <div className='no-message'>
                                            <h1>No Message</h1>
                                        </div>
                                    )
                                    :
                                    (
                                        <div className='message-main' style={open ? style : null}>

                                            <div className='actions'>
                                                <ul>
                                                    <li><button type='button'><i className='bx bxs-caret-up-square'></i></button></li>
                                                    <li><button type='button' onClick={() => deleteData(message.messageId)}><i className='bx bx-trash'></i></button></li>
                                                    <li><button type='button'><i className='bx bx-time-five' ></i></button></li>
                                                    <li><button type='button'><i className='bx bx-star' ></i></button></li>
                                                    <li><button type='button'><i className='bx bxs-file-export'></i></button></li>
                                                </ul>
                                            </div>

                                            <div className='information'>
                                                <h5><b>{message.clientName}</b> <span>{moment(message.createdDate).format("YYYY, MMMM DD, HH:mm")}</span></h5>
                                                <p>From: <b>{message.email}</b> <span>To: me</span></p>
                                            </div>

                                            <div className='message-details'>
                                                <p>{message.message}</p>
                                            </div>
                                        </div>
                                    )
                            }
                        </div>
                    </div>
                </div>
            </>
            :
            <Unauthorized />
    )
}

export default message