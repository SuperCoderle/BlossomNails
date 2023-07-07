import Header from './header&footer/header'
import Footer from './header&footer/footer'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { Fragment, useEffect, useState } from 'react';
import GoogleMapReact from "google-map-react";

function services() {
    const url_client_message = "https://blossomnails.somee.com/api/ClientMessages/";
    const url_service = "https://blossomnails.somee.com/api/Services/";
    const url_gallery = "https://blossomnails.somee.com/api/Galleries/";
    const param = useParams();
    const [services, setServices] = useState([]);
    const [galleries, setGalleries] = useState([]);

    // Object
    /* Client Message */
    const [clientName, setClientName] = useState('');
    const [numberPhone, setNumberPhone] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    // Object

    // Google Map
    const AnyReactComponent = ({ text }) => <div>{text}</div>;

    const defaultProps = {
        center: {
            lat: 10.99835602,
            lng: 77.01502627
        },
        zoom: 3
    };
    // Google Map

    const imgList = [
        "https://static.thenounproject.com/png/975683-200.png",
        "https://static.thenounproject.com/png/1303315-200.png",
        "https://cdn-icons-png.flaticon.com/512/1024/1024529.png",
        "https://static.thenounproject.com/png/4603199-200.png",
        "https://cdn-icons-png.flaticon.com/512/1005/1005685.png",
        "https://cdn-icons-png.flaticon.com/512/5458/5458875.png"
    ]

    useEffect(() => {
        getData();
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, []);

    const getData = async () => {
        await axios.get(url_service)
            .then((result) => {
                setServices(result.data);
            })
        await axios.get(url_gallery)
            .then((result) => {
                setGalleries(result.data);
            })
    }

    const postMessage = async () => {
        const messageData = {
            "messageId": uuidv4(),
            "clientName": clientName,
            "email": email,
            "numberPhone": numberPhone,
            "message": message,
            "createdDate": new Date(),
            "status": "Unread"
        }

        const response = await axios.post(url_client_message, messageData)
            .catch((error) => {
                toast.error("Message can not be sent.");
            })
    }

    const array = ["Nail Extensions", "Gel Colour / Shellac", "Natural Treatment", "Other"]
    const [active, setActive] = useState("Nail Extensions");

    return (
        <Fragment>
            <Header />
            {/* Promotion */}
            {
                {
                    'services':
                        <>
                            {/* <nav className='banner' style={{ background: "url(https://www.allurasalonsuites.com/wp-content/uploads/2020/07/Manicure@2x-1.jpg) 0% 0% / cover" }}>
                                <div className='banner-content' style={{ left: "10%" }}>
                                    <h1>TRENDING NOW!</h1>
                                    <p>Get your glitter ready - festival season is calling! Our shimmer shades and party polishes will make your nails take centre stage...</p>
                                    <button type='button'>Shop Now</button>
                                </div>
                            </nav> */}

                            <div className='bg-text' style={{paddingTop: "8rem"}}>
                                <h1 style={{ textAlign: "center" }}>Our Services</h1>
                            </div>

                            <section style={{paddingTop: "3rem"}}>
                                <div className='service-introduction'>
                                    <div className="card">
                                        <div className="card-body">
                                            <img src='https://www.thebeautyemporium.com.au/wp-content/uploads//2016/06/hands-feet.jpg' alt='.' />
                                        </div>
                                        <h4>Manicure</h4>
                                    </div>

                                    <div className="card">
                                        <div className="card-body">
                                            <img src='https://sf.ezoiccdn.com/ezoimgfmt/www.salonrates.com/wp-content/uploads/2019/03/steps-to-professional-pedicure.jpg?ezimgfmt=rs:352x226/rscb1/ngcb1/notWebP' alt='.' />
                                        </div>
                                        <h4>Pedicure</h4>
                                    </div>

                                    <div className="card">
                                        <div className="card-body">
                                            <img src='https://cdn2.stylecraze.com/wp-content/uploads/2021/09/What-Is-Eyebrow-Waxing.jpg' alt='.' />
                                        </div>
                                        <h4>Eyebrow</h4>
                                    </div>

                                    <div className="card">
                                        <div className="card-body">
                                            <img src='https://cdn2.stylecraze.com/wp-content/uploads/2018/12/What-Is-Dip-Powder-Manicure.jpg' alt='.' />
                                        </div>
                                        <h4>Powder</h4>
                                    </div>

                                    <div className="card">
                                        <div className="card-body">
                                            <img src='https://www.capitalhairandbeauty.ie/Images/Blogs/Valstep1and10.jpg' alt='.' />
                                        </div>
                                        <h4>Nails</h4>
                                    </div>

                                    <div className="card">
                                        <div className="card-body">
                                            <img src='https://i.pinimg.com/736x/6d/a2/5a/6da25a4f73700cc7c6a190743343ebc3.jpg' alt='.' />
                                        </div>
                                        <h4>Polish</h4>
                                    </div>
                                </div>
                            </section>

                            {/* Services */}
                            <section className='service-section'>
                                <h2>Price List</h2>
                                <ul className='service-categories'>
                                    {
                                        array.map((item, index) => {
                                            return (
                                                <li key={index} className={active == item ? "active" : undefined} onClick={() => setActive(item)}>
                                                    <Link>
                                                        <p>{item}</p>
                                                        <img src={imgList[index]} alt='' />
                                                    </Link>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>

                                <div className='items'>
                                    {
                                        services && services.filter(value => value.typeOfService === active).length > 0 ?
                                            services.filter(value => value.typeOfService === active).map((item) => {
                                                return (
                                                    <div className='item' key={item.serviceId}>
                                                        <h5>
                                                            <Link to={"/"}>{item.serviceName} {item.otherName != null ? `(${item.otherName})` : null}</Link>
                                                            <span>€{item.otherPrice != null ? item.otherPrice : item.price}</span>
                                                        </h5>
                                                    </div>
                                                )
                                            })
                                            :
                                            (
                                                <p>Loading Service...</p>
                                            )
                                    }
                                    {
                                        active == "Nail Extensions" ?
                                            (
                                                <p className='note'>
                                                    ADD EXTRA $7 WITH GEL COLOUR / SHELLAC <br />
                                                    ADD EXTRA $3 - $5 WITH FRENCH OR COLOUR TIP <br />
                                                    ADD EXTRA $2 WITH NORMAL COLOUR
                                                </p>
                                            )
                                            :
                                            active == "Gel Colour / Shellac" || active == "Natural Treatment" ?
                                                (
                                                    <p className='note'>
                                                        ADD EXTRA $3 WITH FRENCH WHITE
                                                    </p>
                                                )
                                                :
                                                null
                                    }
                                </div>
                            </section>
                        </>,
                    'contact-us':
                        <>
                            {/* <nav className='banner' style={{ background: "url(https://static.vecteezy.com/system/resources/previews/007/095/588/original/nail-polish-realistic-3d-makeup-cosmetic-illustration-manicure-and-pedicure-mockup-color-ad-product-background-spash-paint-beauty-fashion-pink-lacquer-bottle-brand-varnish-poster-art-reflection-gel-free-vector.jpg) 0% 0% / cover" }}>
                                <div className='banner-content' style={{ left: "10%" }}>
                                    <h1>TRENDING NOW!</h1>
                                    <p>Get your glitter ready - festival season is calling! Our shimmer shades and party polishes will make your nails take centre stage...</p>
                                    <button type='button'>Shop Now</button>
                                </div>
                            </nav> */}

                            <div className='bg-text' style={{paddingTop: "8rem"}}>
                                <h1 style={{ textAlign: "center" }}>Contact Us</h1>
                            </div>

                            <section style={{paddingTop: "1rem"}}>
                                <div className='row' style={{ marginTop: "2rem" }}>
                                    <div className='col-5'>
                                        <p>
                                            <i className='bx bxs-edit-location' ></i> Address: <br />
                                            <span>
                                                8c wells place SO50 5PP Eastleigh, UK
                                            </span>
                                        </p>

                                        <p>
                                            <i className='bx bx-phone' ></i> Number Phone: &nbsp;
                                            <span>
                                                +44 23 8061 3526
                                            </span>
                                        </p>

                                        <p>
                                            <i className='bx bx-envelope' ></i> Email: &nbsp;
                                            <span>
                                                blossom_nails2018@outlook.com
                                            </span>
                                        </p>

                                        <p>
                                            <i className='bx bx-briefcase-alt-2'></i> Working Time <br />
                                            <span>
                                                - MON-SAT: 9A-6P <br />
                                                - SUN: Closed
                                            </span>
                                        </p>
                                    </div>
                                    <div className='col-7'>
                                        <form>
                                            <div className='form-text'>
                                                <div className='group'>
                                                    <label htmlFor='name'>Name <span>*</span></label>
                                                    <input type='text' id='name' required onChange={(e) => setClientName(e.target.value)} />
                                                </div>
                                                <div className='group'>
                                                    <label htmlFor='email'>Email <span>*</span></label>
                                                    <input type='email' id='email' required onChange={(e) => setEmail(e.target.value)} />
                                                </div>
                                                <div className='group'>
                                                    <label htmlFor='phone'>Number Phone <span>*</span></label>
                                                    <input type='tel' maxLength={11} id='phone' required onChange={(e) => setNumberPhone(e.target.value)} />
                                                </div>
                                                <div className='group'>
                                                    <label htmlFor='name'>Message <span>*</span></label>
                                                    <textarea cols={4} rows={6} id='message' required onChange={(e) => setMessage(e.target.value)} />
                                                </div>
                                                <button type='button' onClick={postMessage}><i className='bx bxs-envelope'></i> Send Message</button>
                                            </div>
                                        </form>
                                    </div>

                                    <div className='google-map'>
                                        <GoogleMapReact
                                            bootstrapURLKeys={{ key: "" }}
                                            defaultCenter={defaultProps.center}
                                            defaultZoom={defaultProps.zoom}
                                        >
                                            <AnyReactComponent
                                                lat={59.955413}
                                                lng={30.337844}
                                                text="My Marker"
                                            />
                                        </GoogleMapReact>
                                    </div>
                                </div>
                            </section>
                        </>,

                    'gallery':
                        <>
                            {/* <nav className='banner' style={{ background: "url(https://cdn.wallpapersafari.com/45/32/CtRjI0.jpg) 0% 0% / cover" }}>
                                <div className='banner-content' style={{ left: "10%" }}>
                                    <h1>TRENDING NOW!</h1>
                                    <p>Get your glitter ready - festival season is calling! Our shimmer shades and party polishes will make your nails take centre stage...</p>
                                    <button type='button'>Shop Now</button>
                                </div>
                            </nav> */}

                            <div className='bg-text' style={{paddingTop: "8rem"}}>
                                <h1 style={{ textAlign: "center" }}>Gallery</h1>
                            </div>

                            <section style={{paddingTop: "2rem"}}>
                                <div className='item'>
                                    <ul>
                                        <li><Link className='active'>All</Link></li>
                                    </ul>
                                </div>

                                <div className='gallery'>
                                    {
                                        galleries && galleries.length > 0 ?
                                            galleries.map((item, index) => {
                                                return (
                                                    <div className='img-div' key={index}>
                                                        <img src={item.pictureName.length > 0 ? `https://blossomnails.somee.com/Pictures/List/${item.pictureName}` : item.picturePath} alt='' />
                                                    </div>
                                                )
                                            })
                                            :
                                            "No picture..."
                                    }
                                </div>
                            </section>
                        </>
                }[param.item]
            }


            <Footer />
        </Fragment>
    )
}

export default services