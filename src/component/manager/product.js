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

function product() {
    const url = "https://blossomnails.somee.com/api/Products/";
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');

    const handleOpen = () => { setOpen(true) };
    const handleClose = () => { setOpen(false) };

    const [search, setSearch] = useState('');

    // Object
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState('');
    const [favorites, setFavorites] = useState(0);
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

    const token = localStorage.getItem("token") !== null ? localStorage.getItem("token") : null;
    const currentUser = token ? jwtDecode(token) : null;


    useEffect(() => {
        setTimeout(() => {
            getData();
            setLoading(false);
        }, 1000);
    }, []);

    const getData = async () => {
        await axios.get(url)
            .then((result) => {
                setProducts(result.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const clear = () => {
        setProductId('');
        setProductName('');
        setDescription('');
        setPicture('');
        setFavorites(0);
    }

    const createClick = () => {
        handleOpen();
        clear();
        setTitle("Add New Product");
    }

    const editClick = async (productId) => {
        handleOpen();
        setTitle("Update Product");
        await getDataById(productId);
    }

    const getDataById = async (productId) => {
        await axios.get(url + productId)
            .then((result) => {
                setProductId(result.data.productId);
                setProductName(result.data.productName);
                setDescription(result.data.description != null ? result.data.description : "");
                setPicture(result.data.picture);
                setFavorites(result.data.favorites);
            })
            .catch((error) => {
                toast.error("Can not get this product.");
            })
    }


    const postData = async () => {
        const data = {
            "productId": uuidv4(),
            "productName": productName,
            "description": description.length > 0 ? description : "",
            "picture": picture,
            "favorites": Number(0)
        }

        await axios.post(url, data)
            .then((result) => {
                toast.success("Created product successfully.");
                getData();
                clear();
            })
            .catch((error) => {
                toast.error("Please check if you have filled it out completely.");
            })
    }

    const updateData = async (productId) => {
        const data = {
            "productId": productId,
            "productName": productName,
            "description": description,
            "picture": picture,
            "favorites": favorites
        }

        await axios.put(url + productId, data)
            .then((result) => {
                toast.success("Updated product sucessfully.");
                getData();
                clear();
            })
            .catch((error) => {
                toast.error("Please check if you have filled it out completely.");
            })
    }

    const deleteData = async (productId) => {
        if (window.confirm("Do you want to delete this product?") == true) {
            await axios.delete(url + productId)
                .then((result) => {
                    toast.success("Delete product successfully.");
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    const uploadImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", e.target.files[0], e.target.files[0].name);
        await axios.post(url + "UploadImage/", formData)
            .then((result) => {
                setPicture(result.data);
            })
            .catch((error) => {
                toast.error("Failed upload image.");
            })
    }

    return (
        currentUser != null && currentUser.role === "Administrator" ?
            (
                <>
                    <ToastContainer />
                    {loading ? (<Loading />) : ""}

                    <Menu />

                    <div className='main'>
                        <h3>Products</h3>

                        <div className='tool'>
                            <div className='control'>
                                <button type='button' className='add' onClick={createClick}><i className='bx bx-plus-medical' ></i> Add Staffs</button>
                                <button type='button' className='export-csv'>
                                    <CSVLink data={products} filename='StaffsData' className='text-white'><i className='bx bxs-file-export'></i> Export to excel</CSVLink>
                                </button>
                            </div>

                            <div className='search-tool'>
                                <input type='text' placeholder='Seach Staff' />
                                <i className='bx bx-search' ></i>
                            </div>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th className='text-center'>#</th>
                                    <th style={{ width: "20%" }}>Name</th>
                                    <th style={{ width: "25%" }}>Description</th>
                                    <th className='text-center' style={{ width: "15%" }}>Favorites</th>
                                    <th  className='text-center' style={{ width: "20%" }}>Picture</th>
                                    <th className='text-center' style={{ width: "20%" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    products && products.length > 0 ?
                                        products.filter((value) => value.productName.toLowerCase().includes(search.toLowerCase())).map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className='text-center'>{index + 1}</td>
                                                    <td>{item.productName}</td>
                                                    <td>{item.description && item.description.length > 0 ? item.description : null}</td>
                                                    <td  className='text-center'>{item.favorites}</td>
                                                    <td className='text-center'>
                                                        <img className='product-img' src={`https://blossomnails.somee.com/Pictures/Product/${item.picture}`} alt=''/>
                                                    </td>
                                                    <td className='text-center'>
                                                        <div>
                                                            <button type='button' className='edit-btn'><i className='bx bxs-edit-alt' onClick={() => editClick(item.productId)}></i> <span className='tooltips'>Edit</span></button>
                                                            <button type='button' className='delete-btn'><i className='bx bx-trash' onClick={() => deleteData(item.productId)}></i> <span className='tooltips'>Delete</span></button>
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
                                            <div className='col-6'>
                                                <label htmlFor='name'>Name</label>
                                                <input type='text' id='name' placeholder='Name' value={productName} onChange={(e) => setProductName(e.target.value)}/>
                                                <label htmlFor='basicSalary'>Description</label>
                                                <textarea type='number' placeholder='Description' rows={5} value={description} onChange={(e) => setDescription(e.target.value)}/>
                                            </div>

                                            <div className='col-4 text-center'>
                                                <div className="image-upload">
                                                    <label htmlFor="file-input">
                                                        <img src={picture.length > 0 ? `https://blossomnails.somee.com/Pictures/Product/${picture}` : `https://blossomnails.somee.com/Pictures/anonymous.jpg`} />
                                                    </label>

                                                    <input id="file-input" type="file" onChange={uploadImage} />
                                                </div>
                                            </div>
                                        </div>

                                        {
                                            title == "Add New Product" ?
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
                </>
            )
            :
            (
                <Unauthorized />
            )
    )
}

export default product