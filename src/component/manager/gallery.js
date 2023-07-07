import { useState, useEffect } from 'react'
import Menu from './menu'
import { Modal, Box } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import Unauthorized from '../unauthorized';
import jwtDecode from 'jwt-decode';
import Loading from '../loading'

function gallery() {
    const url = "https://blossomnails.somee.com/api/Galleries/";

    const [data, setData] = useState([]);
    const [show, setShow] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); }

    const [picture, setPicture] = useState('');
    const [path, setPath] = useState('');
    const [size, setSize] = useState('');

    const token = localStorage.getItem("token") !== null ? localStorage.getItem("token") : null;
    const currentUser = token ? jwtDecode(token) : null;

    useEffect(() => {
        setTimeout(() => {
            getData();
            setLoading(false);
        }, 1000)
    }, []);

    const getData = async () => {
        await axios.get(url)
            .then((result) => {
                setData(result.data);
            })
    }

    const close = () => {
        setPicture('');
        setPath('');
    }

    const handleClick = () => {
        close();
        handleOpen();
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        p: 2,
    };

    const uploadImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", e.target.files[0], e.target.files[0].name);
        await axios.post(url + "UploadImage/", formData)
            .then((result) => {
                setPicture(result.data);
            })
        formatBytes(e.target.files[0].size);
    }

    const postData = async () => {
        const data = {
            'pictureId': uuidv4(),
            'pictureName': picture,
            'picturePath': path
        }

        await axios.post(url, data)
            .then((result) => {
                toast.success("Uploaded successfully!");
            })
        getData();
    }

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) {
            setSize('0 Byte');
        }

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        setSize(`${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`);
    }

    const deleteData = async () => {
        if(window.confirm("Do you want to delete this image?") == true)
        {
            await axios.delete(url + show)
                .then((result) => {
                    toast.success("Deleted successfully!");
                    getData();
                })
        }
    }

    return (
        currentUser && currentUser.role === "Administrator" ?
        <>
            <ToastContainer />
            <Menu />
            {loading ? (<Loading />) : ""}

            <div className='main'>
                <h3>Gallery</h3>

                <div className='tool'>
                    <div className='control'>
                        <button className='add' type='button' onClick={handleClick}><i className='bx bx-plus-medical'></i> Add files...</button>
                        <button className='delete' type='button' onClick={deleteData}><i className='bx bxs-trash' ></i> Delete</button>
                    </div>
                </div>

                <div className='gallery'>
                    {
                        data && data.length > 0 ?
                            data.map((item, index) => {
                                return (
                                    <div className='img-div' onClick={() => setShow(item.pictureId)} key={index}>
                                        <img src={item.pictureName.length > 0 ? `https://blossomnails.somee.com/Pictures/List/${item.pictureName}` : item.picturePath} alt='' />
                                        <div className={show === item.pictureId ? "show" : null}>
                                            <i className='bx bx-check'></i>
                                        </div>
                                    </div>
                                )
                            })
                            :
                            "No picture..."
                    }
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
                        <div className="modal-header gallery-header">
                            <div className="modal-logo">
                                <span className="logo-circle">
                                    <img src='https://cdn-icons-png.flaticon.com/512/5082/5082720.png' alt='' />
                                </span>
                            </div>
                        </div>
                        <div className="modal-body gallery-body">
                            <h2 className="modal-title">Upload a file</h2>
                            <p className="modal-description">Attach the file below</p>
                            <div className="upload-area">
                                <input type='file' id='upload' onChange={uploadImage} />
                                <label htmlFor='upload'>
                                    <span className="upload-area-icon">
                                        <img src='https://cdn-icons-png.flaticon.com/512/5415/5415275.png' alt='' />
                                    </span>
                                    <span className="upload-area-title">Drag file(s) here to upload.</span>
                                    <span className="upload-area-description">
                                        Alternatively, you can select a file by <br /><strong>clicking here</strong>
                                    </span>
                                </label>
                            </div>
                            <div className={`file-block ${picture.length > 0 ? "show" : null}`}>
                                <div className="file-info"> <span className="material-icons-outlined file-icon"><i className='bx bxs-file' ></i></span> <span className="file-name">{picture}</span> | <span className="file-size">{size}</span> </div>
                                <span className="material-icons remove-file-icon"><i className='bx bxs-trash' ></i></span>
                                <div className="progress-bar"> </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={handleClose}>Cancel</button>
                            <button className="btn-primary" onClick={postData}>Upload File</button>
                        </div>
                    </Box>
                </Modal>
            </div>
        </>
        :
        <Unauthorized />
    )
}

export default gallery