
import ExpenseItem from './ExpenseItem'

function ExpenseList({
  filteredExpenses,
  currentExpenses,
  currentPage,
  totalPages,
  editExpense,
  deleteExpense,
  setCurrentPage
}) {
  return (
    <>
      {filteredExpenses.length === 0 ? (
        <p className="empty">
          No expenses yet. Add your first expense!
        </p>
      ) : (
        currentExpenses.map(item => (
          <ExpenseItem
            key={item.id}
            item={item}
            editExpense={editExpense}
            deleteExpense={deleteExpense}
          />
        ))
      )}

      {filteredExpenses.length > 0 && (
        <div className="pagination">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          <span>Page {currentPage} of {totalPages}</span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  )
}

export default ExpenseList
