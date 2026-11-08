
function Summary({ total, monthlyTotal, expenseCount }) {
  return (
    <div className="summary">
      <p>Total Expenses</p>
      <h2>₹{total.toFixed(2)}</h2>

      <p>Current Month Expenses</p>
      <h2>₹{monthlyTotal.toFixed(2)}</h2>

      <span>{expenseCount} transactions</span>
    </div>
  )
}

export default Summary
