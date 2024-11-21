import React, {useEffect, useState} from 'react'
import axios from 'axios'


const Loan = () => {
  const[loans, setLoans] = useState([]);
  const[error, setError] = useState('');

  useEffect(() =>{
    const fetchLoans = async () => {
      try{
        const token = localStorage.getItem('access');
        const response = await axios.get('http://127.0.0.1:8000/api/loans/', {
          headers :{
            'Authorization': `Bearer ${token}`
          }
        });
        setLoans(response.data);
      }catch (err) {
        setError('Failed to get loan');
      }
    };
    fetchLoans();

  }, []);

  return(
    <div>
      <h1>This is your current loan</h1>
      {error && <p>{error}</p>}

      <ul>
        {loans.map(loan => (
          <li key={loan.id}>
            Amount :{loan.amount}, Status:{loan.status},Intrest Rate: {loan.intrest_rate}%


          </li>
        ))}
      </ul>
    </div>
  );
} ;


export default Loan
// check wether loan should be in caps