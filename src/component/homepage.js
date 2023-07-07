import { useEffect, useRef, useState } from 'react';
import Header from './header&footer/header'
import Footer from './header&footer/footer';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import axios from 'axios';
import 'swiper/css';

function homepage() {
    const swiperRef = useRef();
    const url = "https://blossomnails.somee.com/api/Products/";

    const [products, setProducts] = useState([]);

    useEffect(() => {
        getData();
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

    return (
        <>

            <Header />

            {/* Content */}

            <nav className='banner'>
                <div className='banner-content'>
                    <h1>TRENDING NOW!</h1>
                    <p>Get your glitter ready - festival season is calling! Our shimmer shades and party polishes will make your nails take centre stage...</p>
                    <button type='button'>Shop Now</button>
                </div>
            </nav>

            <section>

                <div className='introduction'>
                    <h1 className='title'>Beauty Services</h1>
                    <p>We carry the finest beauty products and offer the largest selection of beauty services in the area.</p>

                    <ul className='introduction-icon'>
                        <li>
                            <img src='https://cdn-icons-png.flaticon.com/512/3789/3789848.png' alt='' />
                            <p>NAIL EXTENSIONS</p>
                        </li>
                        <li>
                            <img src='https://icons-for-free.com/iconfiles/png/512/cosmetics+gel+mails+makeup+nail+polish+icon-1320183136573509865.png' alt='' />
                            <p>GEL COLOUR / SHELLAC</p>
                        </li>
                        <li>
                            <img src='https://cdn-icons-png.flaticon.com/512/6416/6416192.png' alt='' />
                            <p>NATURAL TREATMENT</p>
                        </li>
                        <li>
                            <img src='https://static.thenounproject.com/png/4603199-200.png' alt='' />
                            <p>OTHER</p>
                        </li>
                    </ul>
                </div>
            </section>

            <section>
                <div className='introduction'>
                    <div className='row'>
                        <div className='col-6'>
                            <h3>A great manicure requires a great technician.</h3>
                            <p>Nail care is a huge part of a person's personality. The manicured nails will add to the outfit more than you might think. They become part of the outfit; they become the best accessory you will ever wear. That's why come to our blossoms nails, where you can freely express your style, with a team of many years of experience in consulting and guiding customers, we believe will do you are satisfied with our service.</p>
                            <Link to={"/booking"} target='_blank'>Booking Now</Link>
                        </div>
                        <div className='col-6'>
                            <img src='https://thuthuatnhanh.com/wp-content/uploads/2022/02/Mau-nail-don-gian-sang-trong.jpg' alt='banner' />
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className='introduction'>
                    <h2 className='title'>Products We Use</h2>

                    <Swiper
                        spaceBetween={30}
                        slidesPerView={5}
                        onSlideChange={() => console.log('slide change')}
                        onSwiper={(swiper) => swiperRef.current = swiper}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                              },
                              639: {
                                slidesPerView: 3,
                              },
                              865:{
                                slidesPerView:5
                              }
                        }}
                    >
                        <div className='chervon-left' onClick={() => swiperRef.current.slidePrev()}>
                            <i className='bx bxs-chevron-left'></i>
                        </div>
                        <div className='chervon-right' onClick={() => swiperRef.current.slideNext()}>
                            <i className='bx bxs-chevron-right'></i>
                        </div>

                        {
                            products && products.length > 0 ?
                                products.map((item, index) => {
                                    return (
                                        <SwiperSlide key={index}>
                                            <div className='slider-box'>
                                                <div className='slider-img'>
                                                    <img src={`https://blossomnails.somee.com/Pictures/Product/${item.picture}`} alt='' />
                                                    <div className='figcaption'>
                                                        <i className='bx bxs-heart' ></i>
                                                        <div>
                                                            <h5>{item.productName}</h5>
                                                            <p>{item.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    )
                                })
                                :
                                null
                        }
                    </Swiper>
                </div>
            </section>

            <Footer />
        </>
    )
}

export default homepage