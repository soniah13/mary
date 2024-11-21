import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoanForm = () => {
    const [loanData, setLoanData] = useState({
        amount: '',
        date_issued: new Date().toISOString().split('T')[0], // Current date in "YYYY-MM-DD" format
        interest_rate: 15,
        loan_id: '',
        payment: '',
        purpose: '',
        status_loan: 'pending', // Default status
    });

    const [loanLimit, setLoanLimit] = useState(null); // State to store loan limit
    const [error, setError] = useState(null);

    // Fetch loan limit on component mount
    useEffect(() => {
        const fetchLoanLimit = async () => {
            const customerId = localStorage.getItem('custome_id');
            const token = localStorage.getItem('access_token');
            if (!customerId) {
              setError('Customer ID is missing.Please log in')
              return;
            }
            
            try {
                const response = await axios.get(`http://127.0.0.1:8000/customers/${customerId}/loan-limit/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Customer ID from localStorage:', customerId);

                setLoanLimit(response.data.loan_limit);
            } catch (error) {
                console.error('Error fetching loan limit:', error);
                setError('Unable to fetch loan limit.');
            }
        };

        fetchLoanLimit();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoanData({
            ...loanData,
            [name]: value,
        });
    };

    const refreshAccessToken = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                refresh: localStorage.getItem('refresh_token'),
            });
            const { access } = response.data;
            localStorage.setItem('access_token', access);
            return access;
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');

        // Validate amount does not exceed the loan limit
        if (loanLimit && parseFloat(loanData.amount) > parseFloat(loanLimit)) {
            setError(`The loan amount exceeds your limit of ${loanLimit}.`);
            return;
        }

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/loans/',
                loanData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log('Loan submitted:', response.data);
            setError(null); // Clear errors if successful
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    const newToken = await refreshAccessToken();
                    const retryResponse = await axios.post(
                        'http://127.0.0.1:8000/loans/',
                        loanData,
                        {
                            headers: {
                                Authorization: `Bearer ${newToken}`,
                            },
                        }
                    );
                    console.log('Loan submitted after refresh:', retryResponse.data);
                } catch (refreshError) {
                    console.error('Error after refreshing token:', refreshError);
                }
            } else {
                console.error('Error submitting loan:', error);
                setError('An error occurred while submitting the loan application.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Loan Limit:</label>
                <p className="w-full p-2 border border-gray-300 rounded bg-gray-100">
                    {loanLimit ? `Ksh ${loanLimit}` : 'Loading...'}
                </p>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Amount:</label>
                <input
                    type="number"
                    name="amount"
                    value={loanData.amount}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Date Issued:</label>
                <input
                    type="text"
                    name="date_issued"
                    value={loanData.date_issued}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Interest Rate (%):</label>
                <input
                    type="number"
                    name="interest_rate"
                    value={loanData.interest_rate}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Loan ID:</label>
                <input
                    type="text"
                    name="loan_id"
                    value={loanData.loan_id}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Payment:</label>
                <select
                    name="payment"
                    value={loanData.payment}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="">Select Payment Method</option>
                    <option value="M_PESA">M-PESA</option>
                    <option value="Bank">Bank</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Purpose:</label>
                <input
                    type="text"
                    name="purpose"
                    value={loanData.purpose}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Loan Status:</label>
                <select
                    name="status_loan"
                    value={loanData.status_loan}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
            <button type="submit" className="w-full bg-rose-400 text-white p-2 rounded">
                Apply for Loan
            </button>
        </form>
    );
};

export default LoanForm;