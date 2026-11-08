
import { useState, useEffect } from 'react'
import './App.css'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import Summary from './components/Summary'

function App() {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses')
    return savedExpenses ? JSON.parse(savedExpenses) : []
  })

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState('')
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [selectedMonth, setSelectedMonth] = useState('All')
  const [budget, setBudget] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 5

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  function addExpense(e) {
    e.preventDefault()

    if (!title.trim() || !amount || Number(amount) <= 0 || !date) {
      alert('Please enter valid expense details')
      return
    }

    const expenseData = {
      title: title.trim(),
      amount: Number(amount),
      category,
      date
    }

    if (editId !== null) {
      setExpenses(expenses.map(item =>
        item.id === editId
          ? { ...item, ...expenseData }
          : item
      ))
      setEditId(null)
    } else {
      setExpenses([...expenses, {
        id: Date.now(),
        ...expenseData
      }])
    }

    setTitle('')
    setAmount('')
    setCategory('Food')
    setDate('')
    setCurrentPage(1)
  }

  function editExpense(item) {
    setTitle(item.title)
    setAmount(String(item.amount))
    setCategory(item.category)
    setDate(item.date)
    setEditId(item.id)
  }

  function cancelEdit() {
    setTitle('')
    setAmount('')
    setCategory('Food')
    setDate('')
    setEditId(null)
  }

  function clearFilters() {
    setSelectedMonth('All')
    setCategoryFilter('All')
    setSortOrder('newest')
    setSearch('')
    setCurrentPage(1)
  }

  function exportExpenses() {
    const headers = ['Title', 'Amount', 'Category', 'Date']

    const rows = filteredExpenses.map(item => [
      item.title,
      item.amount,
      item.category,
      item.date
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], {
      type: 'text/csv'
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'expenses.csv'
    link.click()

    URL.revokeObjectURL(url)
  }

  function deleteExpense(id) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this expense?'
    )

    if (!confirmDelete) {
      return
    }

    const updatedExpenses = expenses.filter(
      item => item.id !== id
    )

    setExpenses(updatedExpenses)

    const remainingCount = filteredExpenses.some(
      item => item.id === id
    )
      ? filteredExpenses.length - 1
      : filteredExpenses.length

    const lastPage = Math.max(
      1,
      Math.ceil(remainingCount / itemsPerPage)
    )

    setCurrentPage(prevPage => Math.min(prevPage, lastPage))

    if (editId === id) {
      cancelEdit()
    }
  }

  const total = expenses.reduce(
    (sum, item) => sum + item.amount, 0
  )

  const today = new Date()

  const currentMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, '0')}`

  const monthlyTotal = expenses
    .filter(item => item.date.startsWith(currentMonth))
    .reduce((sum, item) => sum + item.amount, 0)

  const availableMonths = [...new Set(
    expenses.map(item => item.date.slice(0, 7))
  )].sort().reverse()

  const filteredExpenses = expenses.filter(item => {
    const searchText = search.toLowerCase().trim()

    const matchesSearch =
      item.title.toLowerCase().includes(searchText) ||
      item.category.toLowerCase().includes(searchText) ||
      item.date.includes(searchText) ||
      String(item.amount).includes(searchText)

    const matchesCategory =
      categoryFilter === 'All' || item.category === categoryFilter

    const matchesMonth =
      selectedMonth === 'All' || item.date.startsWith(selectedMonth)

    return matchesSearch && matchesCategory && matchesMonth
  })

  const categoryTotals = expenses.reduce((totals, item) => {
    totals[item.category] = (totals[item.category] || 0) + item.amount
    return totals
  }, {})

  const highestExpense = expenses.length > 0
    ? Math.max(...expenses.map(item => item.amount))
    : 0

  const averageExpense = expenses.length > 0
    ? total / expenses.length
    : 0

  const highestCategory = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])[0]

  const budgetPercentage = Number(budget) > 0
    ? (monthlyTotal / Number(budget)) * 100
    : 0

  const totalPages = Math.ceil(
    filteredExpenses.length / itemsPerPage
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  const currentExpenses = [...filteredExpenses]
    .sort((a, b) => {
      if (sortOrder === 'highest') return b.amount - a.amount
      if (sortOrder === 'lowest') return a.amount - b.amount
      return new Date(b.date) - new Date(a.date)
    })
    .slice(indexOfFirstItem, indexOfLastItem)

  return (
    <div className="container">
      <header>
        <h1>Personal Expense Manager</h1>
        <p>Manage your money. Track your expenses.</p>
      </header>

      <section className="insights-section">
        <h2>Expense Insights</h2>

        <p>Highest Spending Category</p>
        <h3>
          {highestCategory ? highestCategory[0] : 'No expenses yet'}
        </h3>

        <p>Average Expense</p>
        <h3>₹{averageExpense.toFixed(2)}</h3>

        <p>Highest Single Expense</p>
        <h3>₹{highestExpense.toFixed(2)}</h3>
      </section>

      <section className="chart-section">
        <h2>Category-wise Expenses</h2>

        {Object.entries(categoryTotals).map(([name, value]) => (
          <div className="chart-item" key={name}>
            <div className="chart-label">
              <span>{name}</span>
              <strong>₹{value.toFixed(2)}</strong>
            </div>

            <div className="chart-bar">
              <div
                className="chart-fill"
                style={{
                  width: total > 0 ? `${(value / total) * 100}%` : '0%'
                }}
              ></div>
            </div>
          </div>
        ))}
      </section>

      <section className="budget-section">
        <h2>Monthly Budget</h2>

        <input
          type="number"
          placeholder="Enter monthly budget"
          value={budget}
          onChange={e => setBudget(e.target.value)}
        />

        <p>Budget: ₹{Number(budget || 0).toFixed(2)}</p>
        <p>Spent: ₹{monthlyTotal.toFixed(2)}</p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min(budgetPercentage, 100)}%`
            }}
          ></div>
        </div>

        <p>{budgetPercentage.toFixed(1)}% of budget used</p>

        {budget !== '' && Number(budget) > 0 &&
          monthlyTotal > Number(budget) && (
            <p className="warning">
              ⚠️ Warning! You exceeded your monthly budget!
            </p>
          )}
      </section>

      <Summary
  total={total}
  monthlyTotal={monthlyTotal}
  expenseCount={expenses.length}
/>

      <ExpenseForm
        title={title}
        setTitle={setTitle}
        amount={amount}
        setAmount={setAmount}
        category={category}
        setCategory={setCategory}
        date={date}
        setDate={setDate}
        editId={editId}
        addExpense={addExpense}
        cancelEdit={cancelEdit}
      />

      <section className="list-section">
        <h2>Recent Expenses</h2>

        <button type="button" onClick={exportExpenses}>
          Export Expenses
        </button>

        <label>Filter by Month</label>
        <select
          value={selectedMonth}
          onChange={e => {
            setSelectedMonth(e.target.value)
            setCurrentPage(1)
          }}
        >
          <option value="All">All Months</option>

          {availableMonths.map(month => (
            <option key={month} value={month}>
              {new Date(`${month}-01`).toLocaleDateString('en-IN', {
                month: 'long',
                year: 'numeric'
              })}
            </option>
          ))}
        </select>

        <label>All Categories</label>
        <select
          value={categoryFilter}
          onChange={e => {
            setCategoryFilter(e.target.value)
            setCurrentPage(1)
          }}
        >
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Education">Education</option>
          <option value="Bills">Bills</option>
          <option value="Other">Other</option>
        </select>

        <label>Sort by</label>
        <select
          value={sortOrder}
          onChange={e => {
            setSortOrder(e.target.value)
            setCurrentPage(1)
          }}
        >
          <option value="newest">Latest Date</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>

        <label>Search Expenses</label>
        <input
          type="text"
          placeholder="Search expenses..."
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
        />

        <button type="button" onClick={clearFilters}>
          Clear Filters
        </button>

        <ExpenseList
          filteredExpenses={filteredExpenses}
          currentExpenses={currentExpenses}
          currentPage={currentPage}
          totalPages={totalPages}
          editExpense={editExpense}
          deleteExpense={deleteExpense}
          setCurrentPage={setCurrentPage}
        />
      </section>
    </div>
  )
}

export default App
