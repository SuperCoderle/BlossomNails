import axios from "axios";
import jwtDecode from "jwt-decode";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';

function login() {
    const navigate = useNavigate();
    const url = "https://blossomnails.somee.com/api/Accounts/";
    const [loading, setLoading] = useState(false);

    // Object
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    // Object

    const handleSignin = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            signin();
            setLoading(false);
        }, 1500);
    }

    const signin = async () => {
        await axios.get(`${url}Verify?Username=${username}&Password=${password}`)
            .then((result) => {
                if (result.data.token != null) {
                    localStorage.setItem("token", result.data.token);
                    if (jwtDecode(result.data.token).role === "Administrator") {
                        navigate("/manager/dashboard");
                    }
                    else {
                        navigate("/");
                    }
                }
            })
            .catch((error) => {
                toast.error(error.response.data);
            })
    }

    const handleSignup = async (e) => {
        if (rePassword !== password) {
            e.preventDefault();
            toast.error("The password is not same.");
        }
        else {
            const data = {
                'accountId': uuidv4(),
                'username': username,
                'password': password
            }

            const client = {
                'clientId': uuidv4(),
                'clientName': 'New Member',
                'typeOfClient': 'Client',
                'numberPhone': '+1-234-567-890',
                'email': 'example@gmail.com',
                'status': Number(0),
                'avatar': 'member.png',
                'accountId': data.accountId
            }

            await axios.post(url, data)
                .catch((error) => {
                    toast.error("Error in sign up!");
                })

            await axios.post(url_staff, client)
                .catch((error) => {
                    toast.error("Client can not be created.");
                })
        }
    }

    return (
        <>
            <ToastContainer />
            <main className="main-container">
                <div className="login-wrapper">

                    <div className="left-container">
                        <div className="header">
                            <Link to={"/"} className="arrow"><i className='bx bx-left-arrow-alt'></i></Link>
                            <Link to={"/"} className="register">Register</Link>
                        </div>
                        <div className="main-content">
                            <h2>Login</h2>
                            <p>Welcome! Please fill username and password to sign in  into your account.</p>

                            <form onSubmit={handleSignin}>
                                <input type="text" name="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                {
                                    loading ?
                                        <div className="load-wrapp">
                                            <div className="load-4">
                                                <div className="ring-1"></div>
                                            </div>
                                            <div>Please wait...</div>
                                        </div>

                                        :
                                        null
                                }

                                <div className="forgotPass">
                                    <Link to={"/"}>Forgot your password?</Link>
                                </div>
                                <div className="login-now">
                                    <button type="submit">Login Now</button>
                                </div>

                                <span className="line"></span>
                            </form>
                        </div>
                        <div className="main-footer">
                            <div className="social-media">
                                <h3>You can also login with</h3>
                                <div className="links-wrapper">
                                    <Link className="facebook"><i className='bx bxl-facebook' ></i></Link>
                                    <Link className="google"><i className='bx bxl-google' ></i></Link>
                                    <Link className="apple"><i className='bx bxl-apple' ></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="side-container">
                        <div className="side-text-container">
                            <div className="short-line">
                                <hr />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default login