import Menu from './menu'
import { useState, useEffect } from 'react';
import { Modal, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import Loading from '../loading';
import { CSVLink } from 'react-csv';
import Unauthorized from '../unauthorized';
import jwtDecode from 'jwt-decode';
import * as yup from 'yup';

function services() {
    const url = "https://blossomnails.somee.com/api/Services/";
    const [services, setServices] = useState([]);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleOpen = () => { setOpen(true) };
    const handleClose = () => { setOpen(false) };

    const [search, setSearch] = useState('');

    // Object
    const [serviceId, setServiceId] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [typeOfService, setTypeOfService] = useState('');
    const [price, setPrice] = useState(Number(0));
    const [hours, setHours] = useState(Number(0));
    const [minutes, setMinutes] = useState(Number(0));
    const [otherName, setOtherName] = useState('');
    const [otherPrice, setOtherPrice] = useState(0);

    const useSchema = yup.object({
        serviceName: yup.string().required(),
        typeOfService: yup.string().required(),
        price: yup.number().required(),
        hourse: yup.number().required(),
        minutes: yup.number().required()
    })
    // Object

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        height: 480,
        bgcolor: 'background.paper',
        p: 2,
    };

    const clear = () => {
        setServiceName('');
        setTypeOfService('');
        setPrice(Number(0));
        setHours(0);
        setMinutes(0);
        setOtherName('');
        setOtherPrice(0);
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
            .then((result) => {
                setServices(result.data);
            })
            .catch((error) => {
                toast.error("Have an error when getting data!");
            })
    }

    const postData = async () => {
        const data = {
            'serviceId': uuidv4(),
            'serviceName': serviceName,
            'typeOfService': typeOfService,
            'price': price,
            'periodTime': hours < 10 ? "0" + hours + ":" + minutes + ":00" : hours + ":" + minutes + ":00",
            'otherName': otherName,
            'otherPrice': otherPrice
        }

        await axios.post(url, data)
            .then((result) => {
                toast.success("A new service has been added.");
                clear();
                getData();
            })
            .catch((error) => {
                toast.error("Please check if you have filled it out completely.");
            })
    }

    const createClick = () => {
        handleOpen();
        clear();
        setTitle("Add New Service");
    }

    const editClick = async (serviceId) => {
        handleOpen();
        setTitle("Update Service");
        await axios.get(url + serviceId)
            .then((result) => {
                setServiceId(serviceId);
                setServiceName(result.data.serviceName);
                setTypeOfService(result.data.typeOfService);
                setPrice(result.data.price);
                setHours(result.data.periodTime.split(":")[0]);
                setMinutes(result.data.periodTime.split(":")[1]);
                result.data.otherName ?
                    setOtherName(result.data.otherName)
                    :
                    setOtherName('')
                result.data.otherPrice ?
                    setOtherPrice(result.data.otherPrice)
                    :
                    setOtherPrice(0)
            })
            .catch((error) => {
                toast.error("Can not get this service.");
            })
    }

    const updateData = async () => {
        const data = {
            'serviceId': serviceId,
            'serviceName': serviceName,
            'typeOfService': typeOfService,
            'price': price,
            'periodTime': hours < 10 ? "0" + hours + ":" + minutes + ":00" : hours + ":" + minutes + ":00",
            'otherName': otherName,
            'otherPrice': otherPrice
        }

        const response = await axios.put(url + serviceId, data)
            .then((result) => {
                toast.success("Updated successfully!");
                clear();
                getData();
            })
            .catch((error) => {
                toast.error("Please check if you have filled it out completely.");
            })
    }

    const deleteData = async (serviceId, serviceName) => {
        if (window.confirm(`Do you want to delete service ${serviceName}?`) == true) {
            const response = await axios.delete(url + serviceId)
                .catch((error) => {
                    toast.error("Deleting failed!");
                })
            if (response.status == 204) {
                toast.success(`Delete service ${serviceName} successfully!`);
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
                    <h3>Services</h3>

                    <div className='tool'>
                        <div className='control'>
                            <button type='button' className='add' onClick={createClick}><i className='bx bx-plus-medical' ></i> Add Services</button>
                            <button className='export-csv'>
                                <CSVLink data={services} filename='ServicesData' className='text-white'><i className='bx bxs-file-export'></i> Export to excel</CSVLink>
                            </button>
                        </div>

                        <div className='search-tool'>
                            <input type='text' placeholder='Seach Staff' value={search} onChange={(e) => setSearch(e.target.value)}></input>
                            <i className='bx bx-search' ></i>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th className='text-center' style={{ width: "10%" }}>#</th>
                                <th style={{ width: "20%" }}>Service</th>
                                <th style={{ width: "20%" }}>Type Of Service</th>
                                <th style={{ width: "15%" }}>Classify</th>
                                <th style={{ width: "5%" }}>Price</th>
                                <th style={{ width: "15%" }}>Period Time</th>
                                <th className='text-center' style={{ width: "15%" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                services && services.length > 0 ?
                                    services.filter((value) => value.serviceName.toLowerCase().includes(search.toLowerCase())).sort().map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className='text-center'>{index + 1}</td>
                                                <td>
                                                    {item.serviceName}
                                                </td>
                                                <td>{item.typeOfService}</td>
                                                <td>{item.otherName}</td>
                                                <td>€{item.otherName && item.otherName.length > 0 ? item.otherPrice : item.price}</td>
                                                <td>{item.periodTime}</td>
                                                <td className='text-center'>
                                                    <button type='button' className='edit-btn' onClick={() => editClick(item.serviceId)}><i className='bx bxs-edit-alt' ></i> <span className='tooltips'>Edit</span></button>
                                                    <button type='button' className='delete-btn' onClick={() => deleteData(item.serviceId, item.serviceName)}><i className='bx bx-trash' ></i> <span className='tooltips'>Delete</span></button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    :
                                    null
                            }

                        </tbody>
                    </table>
                </div>

                <div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <div className='modal-header'>
                                <h3>{title}</h3>
                                <button type='button' onClick={handleClose}><i className='bx bx-x' ></i></button>
                            </div>

                            <div className='modal-body'>
                                <form>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <label htmlFor='name'>Name</label>
                                            <input type='text' id='name' placeholder='Name' value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
                                            <label htmlFor='type'>Type Of Service</label>
                                            <select value={typeOfService} onChange={(e) => setTypeOfService(e.target.value)}>
                                                <option value={''} hidden>Choose One</option>
                                                <option value={"Nail Extensions"}>Nail Extensions</option>
                                                <option value={"Gel Colour / Shellac"}>Gel Colour / Shallec</option>
                                                <option value={"Natural Treatment"}>Natural Treatment</option>
                                                <option value={"Other"}>Other</option>
                                            </select>
                                            <Link className="add-other" style={show ? { display: "none" } : { display: "block" }} onClick={() => setShow(true)}><i className='bx bx-plus'></i> Add Others</Link>
                                            <div className="other" style={!show ? { display: "none" } : { display: "flex" }}>
                                                <input type='text' placeholder='Name' value={otherName} onChange={(e) => setOtherName(e.target.value)} />
                                                <input type='number' placeholder='Price' value={otherPrice} onChange={(e) => setOtherPrice(e.target.value)} />
                                            </div>
                                            <div className="other-btn" style={!show ? { display: "none" } : { display: "block" }}>
                                                <button type='button' onClick={() => setShow(false)}>Close</button>
                                            </div>
                                        </div>

                                        <div className='col-6'>
                                            <label htmlFor='price'>Price</label>
                                            <input type='number' id='price' placeholder='Price' value={price} onChange={(e) => setPrice(e.target.value)} />
                                            <label htmlFor='periodTime'>Period Time</label>
                                            <div className='periodTime'>
                                                <input type='number' max={12} min={0} value={hours} onChange={(e) => setHours(e.target.value)} placeholder='00' />
                                                &nbsp; : &nbsp;
                                                <input type='number' max={60} min={0} value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder='00' />
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        title == "Add New Service" ?
                                            (
                                                <>
                                                    <button type='button' onClick={postData}>Submit</button>
                                                </>
                                            )
                                            :
                                            (
                                                <>
                                                    <button type='button' onClick={updateData}>Submit</button>
                                                </>
                                            )
                                    }
                                    <button type='button' onClick={clear}>Clear</button>
                                </form>
                            </div>
                        </Box>
                    </Modal>
                </div>
            </>
            :
            <Unauthorized />
    )
}

export default services