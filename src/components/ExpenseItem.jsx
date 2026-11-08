
function ExpenseItem({ item, editExpense, deleteExpense }) {
  return (
    <div className="expense">
      <div>
        <h3>{item.title}</h3>
        <p>{item.category} • {item.date}</p>
      </div>

      <strong>₹{item.amount.toFixed(2)}</strong>

      <button
        type="button"
        className="edit"
        onClick={() => editExpense(item)}
      >
        Edit
      </button>

      <button
        type="button"
        className="delete"
        onClick={() => deleteExpense(item.id)}
      >
        Delete
      </button>
    </div>
  )
}

export default ExpenseItem
