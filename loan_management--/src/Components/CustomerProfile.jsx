import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CustomerProfile() {
    const [customerId, setCustomerId] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [isEmployed, setIsEmployed] = useState(false);
    const [income, setIncome] = useState('');
    const [guarantor, setGuarantor] = useState('');
    const [loanLimit, setLoanLimit] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

  

    const handleSubmit = async (event) => {
        event.preventDefault();

        const customerProfile = {
            customer_id: customerId,
            contact,
            address,
            firstName,
            lastName,
            middleName,
            isEmployed,
            income,
            guarantor,
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/customers/profile/', customerProfile,{
              
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
                
            });

            if (response.status === 200) {
                const data = await response.json();
                setMessage('Profile updated successfully');
                setLoanLimit(data.loan_limit); // Update the loan limit
                setError('');
            } else {
                const errorData = await response.json();
                setError(`Error: ${errorData.message || 'Failed to update profile'}`);
                setMessage('');
            }
        } catch (error) {
            console.error('There was an error!', error);
            setError('An unexpected error occurred');
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-20 bg-white p-8 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700">First Name:</label>
                    <input
                        type="text"
                        value={firstName || ''}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Last Name:</label>
                    <input
                        type="text"
                        value={lastName || ''}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Middle Name:</label>
                    <input
                        type="text"
                        value={middleName || ''}
                        onChange={(e) => setMiddleName(e.target.value)}
                        required
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Contact:</label>
                    <input
                        type="text"
                        value={contact || ''}
                        onChange={(e) => setContact(e.target.value)}
                        required
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Address:</label>
                    <textarea
                        value={address || ''}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="flex items-center">
                    <label className="block text-gray-700 mr-2">Employed:</label>
                    <input
                        type="checkbox"
                        checked={isEmployed}
                        onChange={(e) => setIsEmployed(e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Income:</label>
                    <input
                        type="number"
                        value={income || ''}
                        onChange={(e) => setIncome(e.target.value)}
                        min="0"
                        step="0.01"
                        required
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Loan Limit:</label>
                    <input
                        type="text"
                        value={loanLimit || ''}
                        readOnly
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Guarantor:</label>
                    <input
                        type="text"
                        value={guarantor || ''}
                        onChange={(e) => setGuarantor(e.target.value)}
                        required
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-rose-400 text-white rounded-md hover:bg-blue-700"
                >
                    Update Profile
                </button>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    );
}

export default CustomerProfile;
