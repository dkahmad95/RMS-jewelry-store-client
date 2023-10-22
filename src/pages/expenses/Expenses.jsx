import { useDispatch, useSelector } from "react-redux";
import "./expenses.css";
import { addExpenses, deleteExpenses, getExpenses } from "../../redux/apiCalls";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { DeleteOutline } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
// import { BasicModal } from "../../components/modal/Modal";
import CircularProgress from "../../components/CircularProgress/CircularProgress"

const Expenses = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.expenses);
  console.log(expenses);
  const [inputs, setInputs] = useState({expensename: "salaries"});
  // const [open, setOpen] = React.useState(false);
  const isAdmin = useSelector((state) => state.user.currentUser.isAdmin);
  const isFetching = useSelector((state)=> state.expenses.isFetching)
  const error = useSelector((state)=> state.expenses.error)

  useEffect(() => {
    getExpenses(dispatch);
   
  }, [dispatch]);

  const handleDelete = (id) => {
    deleteExpenses(dispatch, id);
    console.log(id)
  };

  

  const columns = [
    {
      field: "createdAt",
      headerName: "Date",
      width: 300,
      ////////// i neeed to optimize the filtration
      renderCell: (params) => {
        const createdAt = params.row.createdAt;
        const date = new Date(createdAt);
        const formattedDate = format(date, "dd/MM/yyyy");

        return <div>{formattedDate}</div>;
      },
    },
    {
      field: "expensename",
      headerName: "Expense",
      width: 300,
      renderCell: (params) => {
        return <div>{params.row.expensename}</div>;
      },
    },

    {
      field: "expensevalue",
      headerName: "Value",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="totalCell">
            <div>$ {params.row.expensevalue}</div>
           
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "",
      width: 50,
      renderCell: (params) => {
        return (
          <div className="totalCell">
            {isAdmin && (
              <>
                < DeleteOutline
                  className="transactionsListDelete"
                  onClick={()=>handleDelete(params.row._id)}
                  // onClick={() => setOpen(true)}
                />
                {/* <BasicModal
                  open={open}
                  setOpen={setOpen}
                  handleClick={() => handleDelete(params.row._id)}
                 
                  Title={"Delete"}
                  Body={"Are you sure?"}
                /> */}
              </>
            )}
          </div>
        );
      },
    },
  ];

  const handleAdd = async  () => {
    await addExpenses(dispatch, inputs);
    window.location.reload();
  };

  const handleInputChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  console.log("inputs", inputs);
  const reversedExpenses = [...expenses].reverse();
  return (
    <div className="expenses">
      <div className="expenseContainer">
        <div className="topExpense">
          <div className="expensesListTitle">
            <h1>Expenses List</h1>
          </div>
          <div className="form">
            <form className="expenseForm">
              <div className="newExpensInput">
                <label>Expense</label>
                <select
                  className="selectExpense"
                  name="expensename"
                  id="expense"
                  onChange={handleInputChange}
                  >
                  <option value="salaries">Salaries</option>
                  <option value="electricity">Electricity</option>
                  <option value="water">Water</option>
                  <option value="internet">Internet</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="packaging">Packaging</option>
                  <option value="display">Display</option>
                  <option value="khums">Khums</option>
                  <option value="donation">Donation</option>
                  <option value="socialMedia">Social Media</option>
                  <option value="food&beverage">Food & Beverage</option>
                  <option value="withdrawals">Withdrawals</option>
                  <option value="others">others</option>
                </select>
              </div>
              <div className="newExpensInput">
                <label>Value</label>
                <div className="value">
                  <input
                    type="text"
                    name="expensevalue"
                    onChange={handleInputChange}
                    placeholder="$"
                    />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div
          className="expensesDataGrid"
          style={{ height: 400, width: "100%" }}
          >
          <DataGrid
            disableRowSelectionOnClick
            rows={reversedExpenses}
            columns={columns}
            getRowId={(row) => row._id}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            checkboxSelection
            />
            {isFetching && <CircularProgress />}
        </div>

        <div className="buttonExpense">
        {error && <span style={{color:"red"}}>Somthing went worng! It might be your network connection or you entered an invalid value.<br/>Refresh and try again!</span>}
          <button disabled={isFetching || error} className={isFetching || error ? "errorFetchButton" :"expensesAddButton"} onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
