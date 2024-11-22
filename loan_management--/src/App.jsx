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

function App({ profileData }) {
  // Global state to manage user data
  
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
          
          {/* Static route for Customer Profile */}
          <Route 
            path="/CustomerProfile" 
            element={<CustomerProfile profileData={profileData} />}
          />

          {/* Dynamic route for Customer Profile based on customerID */}
          <Route 
            path="/customers/profile/" 
            element={<CustomerProfile />}  // This will fetch the profile based on customerID
          />

          <Route 
            path="/logOut" 
            element={<Logout />} 
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
