
import React, { useEffect, useState } from "react";

function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/admin/dashboard/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });
                if (response.ok) {
                    const dashboardData = await response.json();
                    setData(dashboardData);
                } else {
                    setError("Failed to fetch dashboard data.");
                }
            } catch (err) {
                setError("An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Customers</h2>
            <ul>
                {data.customers.map((customer) => (
                    <li key={customer.customer_id}>
                        {customer.firstName} {customer.lastName} - {customer.contact}
                    </li>
                ))}
            </ul>
            <h2>Loans</h2>
            <ul>
                {data.loans.map((loan) => (
                    <li key={loan.loan_id}>
                        Loan {loan.loan_id}: Ksh {loan.amount} - {loan.status_loan}
                    </li>
                ))}
            </ul>
            <h2>Payments</h2>
            <ul>
                {data.payments.map((payment) => (
                    <li key={payment.id}>
                        Payment for Loan {payment.loan}: Ksh {payment.amount} - {payment.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminDashboard;
