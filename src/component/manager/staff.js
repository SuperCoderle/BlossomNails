import { useState, useEffect } from 'react'
import Menu from './menu'
import { Modal, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment/moment';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../loading'
import { CSVLink } from 'react-csv';
import Unauthorized from '../unauthorized'
import jwtDecode from 'jwt-decode';

function staff() {
    const url = "https://blossomnails.somee.com/api/Staffs/";
    const [staffs, setStaffs] = useState([]);
    const [open, setOpen] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);
    const [title, setTitle] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // Object
    const [staffId, setStaffId] = useState('');
    const [staffName, setStaffName] = useState('');
    const [department, setDepartment] = useState('');
    const [numberPhone, setNumberPhone] = useState('');
    const [email, setEmail] = useState('');
    const [hireDate, setHireDate] = useState('');
    const [basicSalary, setBasicSalary] = useState(Number(0));
    const [avatar, setAvatar] = useState('');
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState(null);
    // Object

    const handleOpen = () => { setOpen(true) };
    const handleClose = () => { setOpen(false) };
    const handleCloseInfo = () => { setOpenInfo(false) };

    const token = localStorage.getItem("token") !== null ? localStorage.getItem("token") : null;
    const currentUser = token ? jwtDecode(token) : null;

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        height: 440,
        bgcolor: 'background.paper',
        p: 2
    };

    const clear = () => {
        setStaffName('');
        setDepartment('');
        setNumberPhone('');
        setEmail('');
        setBasicSalary(0);
        setAvatar('');
    }

    useEffect(() => {
        setTimeout(() => {
            getData();
            setLoading(false);
        }, 1000);
    }, []);

    const getData = async () => {
        await axios.get(url)
            .then((result) => {
                setStaffs(result.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const getDataById = async (staffId) => {
        await axios.get(url + staffId)
            .then((result) => {
                setStaffId(result.data.staffId);
                setStaffName(result.data.staffName);
                setDepartment(result.data.department);
                setNumberPhone(result.data.numberPhone);
                setEmail(result.data.email);
                setHireDate(result.data.hireDate);
                setBasicSalary(result.data.basicSalary);
                setAvatar(result.data.avatar);
                setBirthday(result.data.birthday);
                setGender(result.data.gender);
                setAddress(result.data.address);
            })
            .catch((error) => {
                toast.error("Can not get this staff.");
            })
    }

    const postData = async () => {
        const data = {
            'staffId': uuidv4(),
            'staffName': staffName,
            'department': department,
            'numberPhone': numberPhone,
            'email': email,
            'hireDate': new Date(),
            'basicSalary': parseFloat(basicSalary),
            'avatar': avatar,
            'status': 'working',
            'birthday': new Date(),
            'gender': 'Female',
            'address': 'as'
        }

        console.log(data);

        const response = await axios.post(url, data)
            .catch((error) => {
                toast.error("Please check if you have filled it out completely.");
            })
        if (response.status == 201) {
            toast.success("A new staff has been added.");
            clear();
            getData();
        }
    }

    const uploadImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", e.target.files[0], e.target.files[0].name);
        await axios.post(url + "UploadImage/", formData)
            .then((result) => {
                setAvatar(result.data);
            })
            .catch((error) => {
                toast.error("Failed upload image.");
            })
    }

    const createClick = () => {
        handleOpen();
        clear();
        setTitle("Add New Staff");
    }

    const editClick = async (staffId) => {
        handleOpen();
        setTitle("Update Staff");
        await getDataById(staffId);
    }

    const infoClick = async (staffId) => {
        setOpenInfo(true);
        await getDataById(staffId);
    }

    const updateData = async () => {
        const data = {
            'staffId': staffId,
            'staffName': staffName,
            'department': department,
            'numberPhone': numberPhone,
            'email': email,
            'hireDate': hireDate,
            'basicSalary': parseFloat(basicSalary),
            'avatar': avatar,
            'status': 'working',
            'birthday': moment(birthday).format("YYYY-MM-DD"),
            'gender': gender,
            'address': address ? address : ""
        }

        await axios.put(url + staffId, data)
            .then((result) => {
                toast.success("Updated successfully!");
                clear();
                getData();
            })
            .catch((error) => {
                toast.error("Please check if you have filled it out completely.");
            })
    }

    const deleteData = async (staffId, staffName) => {
        if (window.confirm(`Do you want to delete client ${staffName}?`) == true) {
            const response = await axios.delete(url + staffId)
                .catch((error) => {
                    toast.error("Deleting failed!");
                })
            if (response.status == 204) {
                toast.success(`Delete staff ${staffName} successfully!`);
                getData();
            }
        }
    }

    return (
        currentUser != null && currentUser.role === "Administrator" ?
            (
                <>
                    <ToastContainer />
                    {loading ? (<Loading />) : ""}

                    <Menu />

                    <div className='main'>
                        <h3>Staffs</h3>

                        <div className='tool'>
                            <div className='control'>
                                <button type='button' className='add' onClick={createClick}><i className='bx bx-plus-medical' ></i> Add Staffs</button>
                                <button type='button' className='export-csv'>
                                    <CSVLink data={staffs} filename='StaffsData' className='text-white'><i className='bx bxs-file-export'></i> Export to excel</CSVLink>
                                </button>
                            </div>

                            <div className='search-tool'>
                                <input type='text' placeholder='Seach Staff' value={search} onChange={(e) => setSearch(e.target.value)} />
                                <i className='bx bx-search' ></i>
                            </div>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th className='text-center'>#</th>
                                    <th style={{ width: "20%" }}>Name</th>
                                    <th style={{ width: "10%" }}>Department</th>
                                    <th style={{ width: "20%" }}>Contact</th>
                                    <th className='text-center' style={{ width: "15%" }}>Basic Salary</th>
                                    <th className='text-center' style={{ width: "15%" }}>Hire Date</th>
                                    <th className='text-center' style={{ width: "20%" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    staffs && staffs.length > 0 ?
                                        staffs.filter((value) => value.staffName.toLowerCase().includes(search.toLowerCase())).map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className='text-center'>{index + 1}</td>
                                                    <td>
                                                        <img src={`https://blossomnails.somee.com/Pictures/Staff/${item.avatar}`} alt='user' />
                                                        {item.staffName}
                                                    </td>
                                                    <td>{item.department}</td>
                                                    <td>
                                                        {item.numberPhone}
                                                        <br />
                                                        {item.email}
                                                    </td>
                                                    <td className='text-center'>
                                                        ${item.basicSalary}
                                                    </td>
                                                    <td className='text-center'>{moment(item.hireDate).format("DD-MM-YYYY")}</td>
                                                    <td className='text-center'>
                                                        <div>
                                                            <button type='button' className='info-btn' onClick={() => infoClick(item.staffId)}><i className='bx bx-info-circle'></i> <span className='tooltips'>Info</span></button>
                                                            <button type='button' className='edit-btn' onClick={() => editClick(item.staffId)}><i className='bx bxs-edit-alt' ></i> <span className='tooltips'>Edit</span></button>
                                                            <button type='button' className='delete-btn' onClick={() => deleteData(item.staffId, item.staffName)}><i className='bx bx-trash' ></i> <span className='tooltips'>Delete</span></button>
                                                        </div>
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
                                            <div className='col-4'>
                                                <label htmlFor='name'>Name</label>
                                                <input type='text' id='name' placeholder='Name' value={staffName} onChange={(e) => setStaffName(e.target.value)} />
                                                <label htmlFor='type'>Department</label>
                                                <select defaultValue={''} value={department} onChange={(e) => setDepartment(e.target.value)}>
                                                    <option value={''} hidden>Choose One</option>
                                                    <option value={"Normal"}>Normal</option>
                                                    <option value={"Counselor"}>Counselor</option>
                                                </select>
                                                <label htmlFor='basicSalary'>Basic Salary</label>
                                                <input type='number' value={basicSalary} id='basicSalary' placeholder='Basic Salary' onChange={(e) => setBasicSalary(e.target.value)} />
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
                                                        <img src={avatar.length > 0 ? `https://blossomnails.somee.com/Pictures/Staff/${avatar}` : `https://blossomnails.somee.com/Pictures/anonymous.jpg`} />
                                                    </label>

                                                    <input id="file-input" type="file" onChange={uploadImage} />
                                                </div>
                                            </div>
                                        </div>

                                        {
                                            title == "Add New Staff" ?
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
                                        <button type='reset' onClick={clear}>Clear</button>

                                    </form>
                                </div>
                            </Box>
                        </Modal>
                    </div>

                    <div>
                        <Modal
                            open={openInfo}
                            onClose={handleCloseInfo}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box>
                                <div className="staff">
                                    <div className="left">
                                        <img src={`https://blossomnails.somee.com/Pictures/Staff/${avatar}`} alt="user" width="100" />
                                        <h4>{staffName}</h4>
                                        <p>{department}</p>

                                        <div className="social_media">
                                            <ul>
                                                <li className='fb'><a href="#"><i className='bx bxl-facebook'></i></a></li>
                                                <li className='tw'><a href="#"><i className='bx bxl-twitter' ></i></a></li>
                                                <li className='ig'><a href="#"><i className='bx bxl-instagram' ></i></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="right">
                                        <div className="info">
                                            <h3>Information</h3>
                                            <div className="info_data">
                                                <div className="data">
                                                    <h6>Email</h6>
                                                    <p>{email}</p>
                                                </div>
                                                <div className="data">
                                                    <h6>Phone</h6>
                                                    <p>{numberPhone}</p>
                                                </div>
                                            </div>

                                            <div className="info_data" style={{marginTop: "1rem"}}>
                                                <div className="data">
                                                    <h6>Hire Date</h6>
                                                    <p>{moment(hireDate).format("DD/MM/YYYY")}</p>
                                                </div>
                                                <div className="data">
                                                    <h6>Basic Salary</h6>
                                                    <p>€{basicSalary}</p>
                                                </div>
                                            </div>

                                            <div className="info_data" style={{marginTop: "1rem"}}>
                                                <div className="data">
                                                    <h6>Birthday</h6>
                                                    <p>{moment(birthday).format("DD/MM/YYYY")}</p>
                                                </div>
                                                <div className="data">
                                                    <h6>Gender</h6>
                                                    <p>{gender}</p>
                                                </div>
                                            </div>

                                            <div className="info_data" style={{marginTop: "1rem"}}>
                                                <div className="data">
                                                    <h6>Address</h6>
                                                    <p>{address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Box>
                        </Modal>
                    </div>
                </>
            )
            :
            (
                <Unauthorized />
            )
    )
}

export default staff