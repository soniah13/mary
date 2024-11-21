import React, { useEffect, useState } from 'react';
function CustomerDashboard() {
    const [customerData, setCustomerData] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/customers/profile/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setCustomerData(data);
                    console.log("Fetched Customer Data:", data);
                } else {
                    console.error("API error:", response.status, response.statusText);
                    setError('Failed to fetch customer data.');
                }
            } catch (err) {
                console.error('Error fetching customer data:', err);
                setError('An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomerData();
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }
    return (
        <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded">
            <h1 className="text-2xl font-bold mb-4">Welcome {customerData.firstName || 'Customer'}</h1>
            <div>
                {customerData.firstName ? (
                    <>
                        <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
                        <p className="mb-2"><strong>First Name:</strong> {customerData.firstName || 'N/A'}</p>
                        <p className="mb-2"><strong>Last Name:</strong> {customerData.lastName || 'N/A'}</p>
                        <p className="mb-2"><strong>Middle Name:</strong> {customerData.middleName || 'N/A'}</p>
                        <p className="mb-2"><strong>Contact:</strong> {customerData.contact || 'N/A'}</p>
                        <p className="mb-2"><strong>Address:</strong> {customerData.address || 'N/A'}</p>
                        <p className="mb-2"><strong>Employment Status:</strong> {customerData.isEmployed ? 'Employed' : 'Unemployed'}</p>
                        <p className="mb-2"><strong>Income:</strong> Ksh {customerData.income || 'N/A'}</p>
                        <p className="mb-2"><strong>Guarantor:</strong> {customerData.guarantor || 'N/A'}</p>
                        <p className="mb-2"><strong>Loan Limit:</strong> Ksh {customerData.loan_limit || 'N/A'}</p>
                    </>
                ) : (
                    <p>No profile data available. Please complete your profile.</p>
                )}
            </div>
        </div>
    );
}
export default CustomerDashboard;