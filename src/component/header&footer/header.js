import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import logo from '../../wwwroot/image/logo3.png'
import OutsideClickHandler from 'react-outside-click-handler';
import jwtDecode from 'jwt-decode';

function header() {

    const list = ["About Us", "Services", "Gallery", "Contact Us"];
    const [active, setActive] = useState(false);
    const [open, setOpen] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);

    const [search, setSearch] = useState('');

    const handleClose = () => {
        setActive(false);
        setSearch('');
    }

    const token = localStorage.getItem("token") !== null ? localStorage.getItem("token") : null;
    const currentUser = token ? jwtDecode(token) : null;

    const logout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    }

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
            {/* Contact Section */}
            <section id='a'>
                <div className={`quick-contact ${scrollTop > 438 ? "active" : null}`}>
                    <Link to={"/"} className='logo'>
                        <img src={logo} alt='logo' />
                    </Link>

                    <Link className="menu" onClick={() => setOpen(true)}><i className='bx bx-menu' ></i></Link>

                    <ul className={`navbar ${open ? "open" : null}`}>
                        <li>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <img src={logo} alt='logo' style={{ width: "80%" }} />
                                <Link onClick={() => setOpen(false)}><i className='bx bx-x'></i></Link>
                            </div>
                        </li>
                        <li>
                            <Link to={'/'}>Home</Link>
                        </li>
                        {
                            list.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <Link className='menu-item' to={`/${item.replace(/ /g, '-').toLowerCase()}`}
                                            onClick={() => setOpen(false)}
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                )
                            })
                        }
                        {
                            currentUser ?
                                <li>
                                    <Link onClick={logout}>Log Out</Link>
                                </li>
                                : null
                        }
                    </ul>
                    <ul className="social-list">
                        <li>
                            <OutsideClickHandler onOutsideClick={handleClose}>
                                <input className={`search-box ${active ? "show" : null}`} type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search...' />
                                <Link onClick={() => setActive(!active)}><i className='bx bx-search'></i></Link>
                            </OutsideClickHandler>
                        </li>
                        <li>
                            <Link to={"/login"}><i className='bx bx-user'></i></Link>
                        </li>
                        <li>
                            <Link to={"/booking"} target='_blank'><i className='bx bx-calendar-check' ></i> &nbsp; Booking Now</Link>
                        </li>
                    </ul>
                </div>
            </section>
        </>
    )
}

export default header