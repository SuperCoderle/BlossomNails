import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './component/homepage'
import Services from './component/services'
import Home from './component/manager/home'
import Staff from './component/manager/staff'
import Service from './component/manager/services'
import Client from './component/manager/client'
import Message from './component/manager/message'
import Login from './component/login'
import Booking from './component/booking'
import Online_Booking from './component/manager/online_booking'
import Dashboard from './component/manager/dashboard'
import Loading from './component/loading'
import Gallery from './component/manager/gallery'
import Product from './component/manager/product'
import './wwwroot/css/style.css'
import './wwwroot/css/mobile.css'
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  const token = localStorage.getItem("token");

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route exact path='manager/calender' element={<Home />}></Route>
          <Route exact path='manager/staff' element={<Staff />}></Route>
          <Route exact path='manager/services' element={<Service />}></Route>
          <Route exact path='manager/client' element={<Client />}></Route>
          <Route exact path='manager/message' element={<Message />}></Route>
          <Route exact path='manager/online_booking' element={<Online_Booking />}></Route>
          <Route exact path='manager/dashboard' element={<Dashboard />}></Route>
          <Route exact path='manager/gallery' element={<Gallery />}></Route>
          <Route exact path='manager/product' element={<Product />}></Route>
          <Route exact path='/' element={<Homepage />}></Route>
          <Route exact path=':item' element={<Services />}></Route>
          <Route exact path='login' element={<Login />}></Route>
          <Route exact path='booking' element={<Booking />}></Route>
          <Route exact path='loading' element={<Loading />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
