import React, { useState } from 'react';
import axios from 'axios';

function Payment() {
  const [paymentData, setPaymentData] = useState({
    loanId: '',
    amount: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/payments/', paymentData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setStatus('Payment successful!');
    } catch (error) {
      setStatus('Payment failed. Please try again.');
      console.error('Payment error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md mt-8">
      <h2 className="text-2xl font-semibold text-center">Make a Payment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="loanId" className="block text-sm font-medium text-gray-700">Loan ID</label>
          <input
            type="text"
            name="loanId"
            value={paymentData.loanId}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={paymentData.amount}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-rose-400 text-white rounded-md hover:bg-gray-400">Submit Payment</button>
      </form>
      {status && <p className="text-center text-rose-400 mt-4">{status}</p>}
    </div>
  );
}

export default Payment;
