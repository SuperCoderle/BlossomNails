import { useEffect, useState } from "react";
import { Link } from "react-router-dom"

function footer() {
    const [scrollTop, setScrollTop] = useState(0);

    useEffect(() => {
        const handleScroll = event => {
            setScrollTop(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {/* Footer */}
            <footer className="footer">
                <div className="row w-100">
                    <div className="col-3 d-flex flex-column">
                        <h2>Quick Links</h2>
                        <Link to={"/about-us"}>About Us</Link>
                        <Link to={"/services"}>Services</Link>
                        <Link to={"/gallery"}>Gallery</Link>
                        <Link to={"/contact-us"}>Contact Us</Link>
                    </div>
                    <div className="col-3 d-flex flex-column">
                        <h2>Operation Hours</h2>
                        <p>Mon-Sat: 09:00AM-6:00PM</p>
                        <p>Sunday: Closed</p>
                    </div>
                    <div className="col-3 d-flex flex-column">
                        <h2>Contact</h2>
                        <p><i className='bx bxs-edit-location'></i> 8c wells place SO50 5PP Eastleigh, UK</p>
                        <p><i className='bx bx-phone'></i> +44 23 8061 3526</p>
                        <p><i className='bx bx-envelope'></i> blossom_nails2018@outlook.com</p>
                    </div>
                    <div className="col-3 d-flex flex-column">
                        <h2>Follow Us</h2>
                        <ul>
                            <li><Link to={"https://www.facebook.com/blossomnailseastleigh/"} target="_blank"><i className='bx bxl-facebook'></i></Link></li>
                            <li><Link to={"/"}><i className='bx bxl-instagram' ></i></Link></li>
                            <li><Link to={"/"}><i className='bx bxl-vk' ></i></Link></li>
                            <li><Link to={"/"}><i className='bx bxl-twitter' ></i></Link></li>
                        </ul>
                    </div>
                </div>

                <div className={`scroll-top ${scrollTop > 498 ? "active" : null}`}>
                    <Link
                        onClick={() => {
                            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                        }}
                    ><i className='bx bx-chevron-up' ></i></Link>
                </div>
            </footer>
        </>
    )
}

export default footer