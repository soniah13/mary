//show the loan limit,payment and amount of loan

import React from 'react'
import loanLimit from './loanLimit'
import PaymentForm from './payment'
import Loan from './Loan'

function LoanManagement() {
  return (
    <div>
      <Loan />
      <Payment/>
      <loanLimit />
    </div>
  )
}

export default LoanManagement
