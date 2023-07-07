import Menu from './menu'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import Loading from '../loading'
import { CSVLink } from 'react-csv';
import Unauthorized from '../unauthorized'
import jwtDecode from 'jwt-decode';

function client() {
    const url = "https://blossomnails.somee.com/api/Clients/";
    const [clients, setClients] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Object
    const [clientId, setClientId] = useState('');
    const [clientName, setClientName] = useState('');
    const [typeOfClient, setTypeOfClient] = useState('');
    const [numberPhone, setNumberPhone] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
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
        width: 800,
        height: 340,
        bgcolor: 'background.paper',
        p: 2,
    };

    const clear = () => {
        setClientName('');
        setTypeOfClient('');
        setNumberPhone('');
        setEmail('');
        setAvatar('');
    }

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
            setClients(response.data);
        }
    }

    const postData = async () => {
        const data = {
            'clientId': uuidv4(),
            'clientName': clientName,
            'typeOfClient': typeOfClient,
            'numberPhone': numberPhone,
            'email': email,
            'status': Number(0),
            'avatar': avatar
        }

        const response = await axios.post(url, data)
            .catch((error) => {
                toast.error("Have an error when posting data!");
            })
        if (response.status == 201) {
            toast.success("A new client has been added.");
            clear();
            getData();
        }
    }

    const uploadImage = (e) => {
        e.preventDefault();
        setAvatar(e.target.files[0].name);
    }

    const deleteData = async (clientId, clientName) => {
        if (window.confirm(`Do you want to delete client ${clientName}?`) == true) {
            const response = await axios.delete(url + clientId)
                .catch((error) => {
                    toast.error("Deleting failed!");
                })
            if (response.status == 204) {
                toast.success(`Delete client ${clientName} successfully!`);
                getData();
            }
        }
        else {
            toast.warning("Oops! Nothing changed.");
        }
    }

    return (
        currentUser && currentUser.role === "Administrator" ?
        <>
            <ToastContainer />
            <Menu />
            {loading ? (<Loading />) : null}

            <div className='main'>
                <h3>Clients</h3>

                <div className='tool'>
                    <div className='control'>
                        <button type='button' className='add' onClick={handleOpen}><i className='bx bx-plus-medical' ></i> Add Clients</button>
                        <button type='button' className='export-csv'>
                            <CSVLink data={clients} filename='ClientsData' className='text-white'><i className='bx bxs-file-export'></i> Export to excel</CSVLink>
                        </button>
                    </div>

                    <div className='search-tool'>
                        <input type='text' placeholder='Seach Client'></input>
                        <i className='bx bx-search' ></i>
                    </div>
                </div>

                <div className='clients'>
                    <div className="row">
                        {
                            clients && clients.length > 0 ?
                                clients.map((item) => {
                                    return (
                                        <div className="col-4" key={item.clientId}>
                                            <div className="card desktop">
                                                <div className="card-body">
                                                    <h5 className="card-title"><button type="button"><i className='bx bx-heart' ></i></button> <b>{item.clientName}</b> <img src='https://cdn-icons-png.flaticon.com/512/552/552721.png' alt={item.clientName} /></h5>
                                                    <p className="card-text">{item.typeOfClient}</p>
                                                    <p className='contact'><i className='bx bx-phone'></i> {item.numberPhone}</p>
                                                    <br />
                                                    <p className='contact'><i className='bx bx-envelope'></i> {item.email} <button type='button' onClick={() => deleteData(item.clientId, item.clientName)}><i className='bx bx-trash'></i></button></p>
                                                </div>
                                            </div>

                                            <div className='card mobile'>
                                                <div className='card-body'>
                                                    <div className='card-mobile'>
                                                        <img src='https://cdn-icons-png.flaticon.com/512/552/552721.png' alt={item.clientName} />
                                                        <div>
                                                            <h5>{item.clientName}</h5>
                                                            <span>{item.numberPhone} - {item.email}</span>
                                                        </div>
                                                        <div>
                                                            <button type='button'><i className='bx bxs-edit' ></i></button>
                                                            <button type='button'><i className='bx bx-trash' ></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                :
                                null
                        }
                    </div>
                </div>
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
                            <h3>Add New Client</h3>
                            <button type='button' onClick={handleClose}><i className='bx bx-x' ></i></button>
                        </div>

                        <div className='modal-body'>
                            <form>
                                <div className='row'>
                                    <div className='col-4'>
                                        <label htmlFor='name'>Name</label>
                                        <input type='text' id='name' placeholder='Name' value={clientName} onChange={(e) => setClientName(e.target.value)} />
                                        <label htmlFor='type'>Type Of Client</label>
                                        <select defaultValue={''} value={typeOfClient} onChange={(e) => setTypeOfClient(e.target.value)}>
                                            <option value={''} hidden>Choose One</option>
                                            <option value={"Normal"}>Normal</option>
                                            <option value={"VIP"}>VIP</option>
                                            <option value={"Potential"}>Potential</option>
                                            <option value={"Blacklist"}>Blacklist</option>
                                        </select>
                                    </div>
                                    <div className='col-4'>
                                        <label htmlFor='numberPhone'>Number Phone</label>
                                        <input type='tel' id='numberPhone' placeholder='Number phone' value={numberPhone} onChange={(e) => setNumberPhone(e.target.value)} />
                                        <label htmlFor='email'>Email</label>
                                        <input type='email' id='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <div className='col-4 text-center'>
                                        <div className="image-upload">
                                            <label htmlFor="file-input">
                                                <img src="https://antimatter.vn/wp-content/uploads/2023/01/hinh-anh-avatar-dep-cute-ngau.jpg" />
                                            </label>
                                            <input id="file-input" type="file" onChange={uploadImage} />
                                        </div>
                                    </div>
                                </div>
                                <button type='button' onClick={postData}>Submit</button>
                                <button type='reset'>Clear</button>
                            </form>
                        </div>
                    </Box>
                </Modal>
            </div>
        </>
        :
        (
            <Unauthorized />
        )
    )
}

export default client