
function ExpenseForm({
  title,
  setTitle,
  amount,
  setAmount,
  category,
  setCategory,
  date,
  setDate,
  editId,
  addExpense,
  cancelEdit
}) {
  return (
    <section className="form-section">
      <h2>{editId !== null ? 'Edit Expense' : 'Add New Expense'}</h2>

      <form onSubmit={addExpense}>
        <label>Expense Title</label>
        <input
          type="text"
          placeholder="Example: Groceries"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <label>Amount (₹)</label>
        <input
          type="number"
          placeholder="Enter amount"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <label>Category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Education</option>
          <option>Bills</option>
          <option>Other</option>
        </select>

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        <button type="submit">
          {editId !== null ? 'Update Expense' : '+ Add Expense'}
        </button>

        {editId !== null && (
          <button
            type="button"
            className="cancel"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        )}
      </form>
    </section>
  )
}

export default ExpenseForm
