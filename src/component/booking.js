import Header from './header&footer/header'
import { useEffect, useState } from "react";
import DatePicker from "sassy-datepicker";
import { Timepicker } from 'react-timepicker';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Footer from './header&footer/footer'
import axios from 'axios';
import moment from 'moment/moment';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-timepicker/timepicker.css';
import { Link } from 'react-router-dom';
import Loading from './loading'

function booking() {
    const url_service = "https://blossomnails.somee.com/api/Services/";
    const url_staff = "https://blossomnails.somee.com/api/Staffs/";
    const url_bookingDetails = "https://blossomnails.somee.com/api/BookingDetails/";
    const [data, setData] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [bookingDetails, setBookingDetails] = useState([]);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('0:00');
    const animatedComponents = makeAnimated();
    const [serviceSelected, setServiceSelected] = useState([]);
    const [active, setActive] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [disable, setDisable] = useState([]);

    const options = [];
    const steps = ["Select Time", "Choose Staff", "Information", "Check your booking", "Finish"];
    const stepsIcon = ["bxs-time", "bxs-user", "bxs-info-square", "bxs-bookmark", "bx-check"];
    const [step, setStep] = useState(steps[0]);
    const [stepIcon, setStepIcon] = useState(stepsIcon[0]);

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    // Object
    const [clientName, setClientName] = useState('');
    const [numberPhone, setNumberPhone] = useState('');
    const [services, setServices] = useState('');
    const [totalPrice, setTotalPrice] = useState(Number(0));
    const [message, setMessage] = useState(null);
    const [endTime, setEndTime] = useState('');
    const [staffId, setStaffId] = useState(null);
    const [avatar, setAvatar] = useState('');
    // Object

    data.map((item, index) => {
        const option = {
            'value': item.otherName && item.otherName.length > 0 ? item.serviceName + ` (${item.otherName})` : item.serviceName,
            'id': item.serviceId,
            'label': item.otherName && item.otherName.length > 0 ? item.serviceName + ` (${item.otherName})` : item.serviceName,
            'price': item.otherName && item.otherName.length > 0 ? item.otherPrice : item.price,
            'periodTime': Number(item.periodTime.split(":")[0]) > 0 ? item.periodTime.split(":")[0] + "h" + item.periodTime.split(":")[1] + "m" : item.periodTime.split(":")[1] + "m"
        };
        options.push(option);
    })

    const handleSelectedValue = (e) => {
        setServiceSelected(Array.isArray(e) ? e.map(x => x.value) : []);
        setServices(e.map(item => item.id).join(', '));

        let b = 0;
        let prices = 0;
        for (let i = 0; i < e.length; i++) {
            prices += e[i].price;

            let array = e[i].periodTime.replace("h", " ").replace("m", "").split(" ");
            for (let j = 0; j < array.length; j++) {
                if (array.length > 1) {
                    array[0] = Number(array[0]) * 60;
                }
                b += Number(array[j]);
            }
        }

        let div = 0;
        let mod = 0;
        if (b > 60) {
            div = Math.trunc(b / 60);
            mod = b % 60;
        }
        else if (b == 60) {
            div += 1;
            mod = 0;
        }
        else {
            mod = b;
        }
        let newHours = (Number(time.split(":")[0]) + div).toString().length <= 1 ? "0" + (Number(time.split(":")[0]) + div).toString() : (Number(time.split(":")[0]) + div).toString();
        let newMinutes = (Number(time.split(":")[1]) + mod).toString().length <= 1 ? (Number(time.split(":")[1]) + mod).toString() + "0" : (Number(time.split(":")[1]) + mod).toString();
        setEndTime(newHours + ":" + newMinutes);
        setTotalPrice(prices);
    }

    const handleSelectDate = newDate => {
        setDate(newDate);
    }

    const handleSelectTime = (hoursSelected, minuteSelected) => {
        setHours(hoursSelected);
        setMinutes(minuteSelected);
        setTime(hours + ":" + (minutes == "00" ? "00" : minutes < 10 ? "0" + minutes : minutes));

    }

    useEffect(() => {
        getData();
    }, []);

    const handleTimeSelected = () => {
        if (!(Number(moment(date).format("DD")) >= Number(moment(new Date()).format("DD")))) {
            event.preventDefault();
            toast.error("You can not select a day before today!");
        }
        else if (Number(time.split(":")[0] < 9 || Number(time.split(":")[0] > 18))) {
            event.preventDefault();
            toast.error("We only work from 9:00AM to 18:00PM!");
        }
        else {
            setStep("Choose Staff");
            setStepIcon("bxs-user");
            staffs && staffs.length > 0 ?
                staffs.map((item) => {
                    bookingDetails && bookingDetails.length > 0 ?
                        bookingDetails.find(value => value.staffId === item.staffId && moment(value.bkDate).format("DD/MM/YYYY") == moment(date).format("DD/MM/YYYY") && value.bkTime == time) != undefined ?
                            setDisable(value => [...value, bookingDetails.find(value => value.staffId === item.staffId && moment(value.bkDate).format("DD/MM/YYYY") == moment(date).format("DD/MM/YYYY") && value.bkTime == time)])
                            :
                            null
                        :
                        null
                })
                :
                null
        }
    }

    const handleChooseStaff = async (staffId) => {
        setStaffId(staffId);
        setActive(staffId);
        await axios.get(url_staff + staffId)
            .then((result) => {
                setAvatar(result.data.avatar);
            })
    }

    const handleStaffChosen = () => {
        if (staffId == null || staffId.length <= 0) {
            event.preventDefault();
            toast.error("Please choose staff.");
        }
        else {
            setStep("Information");
            setStepIcon("bxs-info-square");
        }
    }

    const handleInformation = () => {
        if (clientName.length <= 0) {
            event.preventDefault();
            toast.error("Please input your name!");
        }
        else if (numberPhone.length <= 0 && numberPhone.length > 20) {
            event.preventDefault();
            toast.error("Please input correct number phone!");
        }
        else if (services.length <= 0) {
            event.preventDefault();
            toast.error("Please select at least 1 service!");
        }
        else {
            setStep("Check your booking");
            setStepIcon("bxs-bookmark");
        }
    }

    const handleSkip = () => {
        setStep("Information");
        setStepIcon("bxs-info-square");
    }

    const handlePrevious = () => {
        switch (step) {
            case "Finish":
                setStep("Check your booking");
                setStepIcon("bxs-bookmark");
                break;
            case "Check your booking":
                setStep("Information");
                setStepIcon("bxs-info-square")
                break;
            case "Information":
                setStep("Choose Staff");
                setStepIcon("bxs-user");
                break;
            case "Choose Staff":
                setStep("Select Time");
                setStepIcon("bxs-time");
                setDisable([]);
                setStaffId(null);
                setActive('');
                break;
        }
    }

    const getData = async () => {
        await axios.get(url_service)
            .then((result) => {
                setData(result.data);
            })
            .catch((error) => {
                toast.error("Services error!");
            })
        await axios.get(url_staff)
            .then((result) => {
                setStaffs(result.data);
            })
        await axios.get(url_bookingDetails)
            .then((result) => {
                setBookingDetails(result.data);
            })
    }

    const postData = async () => {

        const data = {
            'bookingDetailsId': uuidv4(),
            'clientName': clientName,
            'numberPhone': numberPhone,
            'services': services,
            'bkTime': time,
            'bkDate': moment(date).format("YYYY-MM-DD"),
            'totalPrice': totalPrice,
            'message': message,
            'createdDate': new Date(),
            'endTime': endTime,
            'staffId': staffId
        }

        setLoading(true);

        setTimeout(async () => {
            await axios.post(url_bookingDetails, data)
                .then((result) => {
                    setStep("Finish");
                    setStepIcon("bx-check");
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                })
        }, 2000);
    }

    return (
        <>
            <ToastContainer />
            <Header />
            <section className='section-booking'>
                <h1 style={{ textAlign: "center", margin: "4rem 0" }}>Booking</h1>

                <ul className='steps'>
                    {
                        steps.map((item, index) => {
                            return (
                                <li key={index} className={step == item ? "is-active" : null}>{item}</li>
                            )
                        })
                    }
                </ul>

                <ul className='steps mobile'>
                    {
                        stepsIcon.map((item, index) => {
                            return (
                                <li key={index} className={stepIcon == item ? "is-active" : null}><i className={`bx ${item}`}></i></li>
                            )
                        })
                    }
                </ul>

                <fieldset className={`field ${step === "Choose Staff" ? "is-active" : null}`}>
                    <h4>Choose Staff</h4>
                    <div className='row booking-calender'>
                        <div className='col-sm-12'>
                            <div style={{ width: "100%", textAlign: "center" }}>
                                <div className='choose-staff'>
                                    {
                                        staffs && staffs.length > 0 ?
                                            staffs.filter(value => value.department === "Normal").map((item, index) => {
                                                return (
                                                    <button key={index} className={`btn-staff`} disabled={disable.some(value => value.staffId == item.staffId) ? 'disabled' : null} onClick={() => handleChooseStaff(item.staffId)}>
                                                        <img src={`https://blossomnails.somee.com/Pictures/Staff/${item.avatar}`} alt='' />
                                                        <span>{item.staffName}</span>
                                                        <span className='error'>{disable.some(value => value.staffId == item.staffId) ? `This staff is busy!` : null}</span>
                                                        <i className={`bx bx-check-square ${active == item.staffId ? "active" : null}`}></i>
                                                    </button>
                                                )
                                            })
                                            :
                                            "Please wait..."
                                    }

                                    {
                                        disable.length == staffs.filter(value => value.department === "Normal").length ?
                                            staffs.filter(value => value.department === "Counselor").map((item, index) => {
                                                return (
                                                    <button key={index} className={`btn-staff`} disabled={disable.some(value => value.staffId == item.staffId) ? 'disabled' : null} onClick={() => handleChooseStaff(item.staffId)}>
                                                        <img src={`https://blossomnails.somee.com/Pictures/Staff/${item.avatar}`} alt='' />
                                                        <span>{item.staffName}</span>
                                                        <span className='error'>{disable.some(value => value.staffId == item.staffId) ? `This staff is busy!` : null}</span>
                                                        <i className={`bx bx-check-square ${active == item.staffId ? "active" : null}`}></i>
                                                    </button>
                                                )
                                            })
                                            :
                                            null
                                    }
                                </div>
                                <Link className='skip' onClick={handleSkip}><i>Click here to skip this part</i></Link>
                            </div>
                        </div>

                        <div className='btn-change'>
                            <button className='btn-previous' onClick={handlePrevious}>Previous</button>
                            <button className='btn-next' onClick={handleStaffChosen}>Next</button>
                        </div>

                    </div>
                </fieldset>

                <fieldset className={`field ${step === "Select Time" ? "is-active" : null}`}>
                    <h4>Select Time</h4>
                    <div className='row booking-calender'>
                        <div className='col-sm-12'>
                            <DatePicker onChange={handleSelectDate} value={date} />

                            <div className='timepicker-div'>
                                <Timepicker hours={hours} minutes={minutes} onChange={handleSelectTime} />
                            </div>
                        </div>
                    </div>

                    <div className='btn-change'>
                        <button className='btn-next' onClick={handleTimeSelected}>Next</button>
                    </div>
                </fieldset>

                <fieldset className={`field ${step === "Information" ? "is-active" : null}`}>
                    <h4>Information</h4>
                    <div className='booking-calender'>
                        <form>
                            <p>Please enter your information below</p>
                            <input type='text' placeholder='Full Name' onChange={(e) => setClientName(e.target.value)} />
                            <input type='tel' placeholder='Number Phone' onChange={(e) => setNumberPhone(e.target.value)} />
                            <input type='text' disabled value={moment(date).format("DD-MM-YYYY") + " " + time} placeholder='Please select the time above' />

                            <div className='row service-select'>
                                <div className='col-4'>
                                    <Select
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        isMulti
                                        options={options}
                                        onChange={handleSelectedValue}
                                    />
                                </div>

                                <div className='col-8'>
                                    <p>Your services selected</p>

                                    <ul>
                                        {serviceSelected && serviceSelected.length > 0 ?
                                            serviceSelected.map((item, index) => {
                                                return (
                                                    <li key={index}>{item} ${options.filter(x => x.label == item)[0].price} - {options.filter(x => x.label == item)[0].periodTime}</li>
                                                )
                                            })
                                            :
                                            (<div className='no-selected'>No service selected</div>)
                                        }
                                    </ul>
                                </div>
                            </div>

                            <textarea rows={7} placeholder='Notes' onChange={(e) => setMessage(e.target.value)} />
                        </form>
                    </div>

                    <div className='btn-change'>
                        <button className='btn-previous' onClick={handlePrevious}>Previous</button>
                        <button className='btn-next' onClick={handleInformation}>Next</button>
                    </div>
                </fieldset>

                <fieldset className={`field ${step === "Check your booking" ? "is-active" : null}`}>
                    <div className='row booking-calender'>
                        <div className='col-sm-12 booking-confirmed'>
                            <div className='col-7'>
                                <h4><i className='bx bxs-check-square' ></i> Booking Confirmed</h4>
                                <p className='p-confirmed'>
                                    <img src={avatar && avatar.length > 0 ? `https://blossomnails.somee.com/Pictures/Staff/${avatar}` : "https://cdn-icons-png.flaticon.com/512/4974/4974985.png"} alt='' />
                                    <p>A beautician will be assigned <b>1 hour</b> before the schedule time</p>
                                </p>
                                <div className='time-confirmed'>
                                    <div>
                                        <span>Your schedule will start at</span>
                                        <p>{moment(date).format("dddd, MMM Do YYYY")}, {Number(time.split(":")[0]) <= 12 ? `${time} AM` : `${time} PM`}</p>
                                    </div>
                                    <button onClick={() => setStep("Select Time")}>Re-schedule</button>
                                </div>
                            </div>

                            <div className='col-4'>
                                <h5>Payment Summary</h5>

                                <ul className='service-confirmed'>
                                    {
                                        services && services.length > 0 ?
                                            services.split(", ").map((item, index) => {
                                                return (
                                                    <li key={index}>
                                                        {
                                                            data && data.length > 0 ?
                                                                (
                                                                    <p>
                                                                        {data.find(value => value.serviceId === item).serviceName} {data.find(value => value.serviceId === item).otherName && data.find(value => value.serviceId === item).otherName.length > 0 ? `(${data.find(value => value.serviceId === item).otherName})` : null}
                                                                        <span>€{data.find(value => value.serviceId === item).otherName && data.find(value => value.serviceId === item).otherName.length > 0 ? data.find(value => value.serviceId === item).otherPrice : data.find(value => value.serviceId === item).price}</span>
                                                                    </p>
                                                                )
                                                                :
                                                                null
                                                        }
                                                    </li>
                                                )
                                            })
                                            :
                                            null
                                    }
                                </ul>

                                <p className='total-price'>Total price: <span>€{totalPrice}</span></p>

                                <div className='btn-change'>
                                    <button className='btn-previous' onClick={handlePrevious}>Previous</button>
                                    <button className='btn-next' onClick={postData}>Confirm</button>
                                </div>
                            </div>

                            <div className='col-7 other service-checklist' onClick={handlePrevious}>
                                <div>
                                    <h6>Service Checklist</h6>
                                    <span>See what all you should know or do while the beautician serve you.</span>
                                </div>
                                <i className='bx bx-chevron-right' style={{ fontSize: "24px" }}></i>
                            </div>

                            <div className='col-4 other' style={{ color: "rgb(78 114 211)" }}>
                                <i className='bx bxs-check-shield' style={{ fontSize: "39px" }}></i>
                                <p style={{ fontSize: "14px", width: "70%" }}>Your request is eligible for UrbanClop Insurance Program.</p>
                                <i className='bx bx-info-circle' style={{ fontSize: "20px", color: "rgba(0,0,0,0.3)" }}></i>
                            </div>

                            <div className='col-7 other'>
                                <div>
                                    <h6>Need our help?</h6>
                                    <span>Call us in case you face any issue in our service.</span>
                                </div>
                                <a href='tel:+442380613526' style={{ color: "rgb(211 82 82)" }}>
                                    <i className='bx bxs-phone' ></i>
                                    +44 23 8061 3526
                                </a>
                            </div>
                        </div>
                    </div>

                    {loading ? <Loading /> : null}
                </fieldset>

                <fieldset className={`field ${step === "Finish" ? "is-active" : null}`}>
                    <h4>Finish</h4>
                    <div className='booking-calender'>
                        <div className='row finish'>
                            <div className="firework"></div>
                            <div className="firework"></div>
                            <div className="firework"></div>

                            <div className='col-5'>
                                <i className='bx bxs-check-circle' ></i>
                                <p>BOOKING ID: 012344444444</p>
                                <h5>You Successfully created your booking</h5>
                                <Link to={"/"}><i className='bx bxs-home' ></i> Back to home</Link>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </section >

            <Footer />
        </>
    )
}

export default booking