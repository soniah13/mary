import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/dashboard';
import Login from './Components/login';
import Register from './Components/register';
import Home from './Components/home';
import LoanForm from './Components/loanForm';
import AboutUs from './Components/aboutUs';
import Navbar from './Components/navbar';
import Payment from './Components/payment';
import AllLoans from './Components/AllLoans';
import CustomerProfile from './Components/CustomerProfile';
import Logout from './Components/logOut';
import CustomerDashboard from './Components/customerDashboard';
import ProtectedRoute from './Components/protected';

function App() {
  // Global state to manage user data
  const [userData, setUserData] = useState({
    customerId: '',
    contact: '',
    address: '',
    firstName: '',
    lastName: '',
    middleName: '',
    isEmployed: false,
    income: '',
    guarantor: '',
    loanLimit: '',
    message: '',
    error: '',
  });

  // Function to reset user data on logout
  const resetUserData = () => {
    setUserData({
      customerId: '',
      contact: '',
      address: '',
      firstName: '',
      lastName: '',
      middleName: '',
      isEmployed: false,
      income: '',
      guarantor: '',
      loanLimit: '',
      message: '',
      error: '',
    });
  };

  return (
    <Router>
      <Navbar />
      <div className="container mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/LoanForm" element={<LoanForm />} />
          <Route path="/Aboutus" element={<AboutUs />} />
          <Route path="/AllLoans" element={<AllLoans />} />
          <Route 
            path="/CustomerProfile" 
            element={
              <CustomerProfile 
                userData={userData} 
                setUserData={setUserData} 
              />
            } 
          />
          <Route 
            path="/customer/:customerId" 
            element={
              <CustomerProfile 
                userData={userData} 
                setUserData={setUserData} 
              />
            } 
          />
          <Route 
            path="/logOut" 
            element={
              <Logout onLogout={resetUserData} /> 
            } 
          />
          <Route 
            path='/CustomerDashboard'
            element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
