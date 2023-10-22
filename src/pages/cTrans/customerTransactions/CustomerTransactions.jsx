import "./customerTransactions.css";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline, Edit, OpenWith } from "@mui/icons-material";
// import { transactionHistoryRows } from "../../dummyData";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCTrans, getCTrans } from "../../../redux/apiCalls";
import { format } from "date-fns";
import CircularProgress from "../../../components/CircularProgress/CircularProgress";
// import { BasicModal } from "../../../components/modal/Modal";


const Transactions = () => {
  const dispatch = useDispatch();
  const cTrans = useSelector((state) => state.cTrans.cTrans);
  const isFetching = useSelector((state)=> state.cTrans.isFetching)
  const error = useSelector((state)=> state.cTrans.error)

  const user = useSelector((state) => state.user.currentUser.isAdmin);
  // const [open, setOpen] = React.useState(false);
  
  console.log(cTrans)

  useEffect(() => {
    getCTrans(dispatch);
   
  }, [dispatch]);

  const handleDelete = (id) => {
    deleteCTrans(dispatch, id);
  };
 


 
  const columns = [
    
    {
      field: "createdAt",
      headerName: "Date",
      width: 200,
     
      renderCell: (params) => {
        const createdAt = params.row.createdAt
        const date = new Date(createdAt);
        const formattedDate = format(date, "dd/MM/yyyy");

        return <div>{formattedDate}</div>;
      },
    },
    {
      field: "customername",
      headerName: "Customer Name",
      width: 250,
      renderCell: (params) => {
        return <div>{params.row.customername}</div>;
      },
    },

    {
      field: "phone",
      headerName: "Phone Number",
      width: 250,
      renderCell: (params) => {
        return <div>{params.row.phone}</div>;
      },
    },

    {
      field: "total",
      headerName: "Total",
      width: 100,

      renderCell: (params) => {
        return (
          <div className="totalCell">
            <span>$ {parseFloat(params.row.total).toFixed(2)}</span>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,

      renderCell: (params) => {
        return (
          <>
            <div className="totalCell">
              <div className="iconTotalCell">
                <Link to={"/cTransReceipt/" + params.row._id}>
                  <OpenWith className="openWith" />
                </Link>
              </div>
                {user && 
                <>
              <div className="iconTotalCell">
                <Link to={"/cTransEdit/" + params.row._id}>
                  <Edit className="editCTrans" />
                </Link>
              </div>
              <div className="iconTotalCell">
              {/* <BasicModal open={open} setOpen={setOpen} handleClick={() => handleDelete(params.row._id)} Title={"Delete"} Body={"Are you sure?"}/> */}
                <DeleteOutline
                className="transactionsListDelete"
                onClick={()=>handleDelete(params.row._id)}
                // onClick={()=>setOpen(true)}
                
                />
                </div>
                </>
              }
              
            </div>
          </>
        );
      },
    },
  ];
  const reversedCTrans = [...cTrans].reverse();

  return (
    <div className="transactions">
      <div className="transactionsListTitle">
      <h1 >Transactions List</h1>
      </div>
      <div
        className="transactionsDataGrid"
        style={{ height: 400, width: "100%" }}
      >
        <DataGrid
          disableRowSelectionOnClick
          rows={reversedCTrans}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10 , 25 , 50 , 100]}
          checkboxSelection
        />
         {isFetching && <CircularProgress />}
      </div>
      
      <Link to="/newTransaction">
        <button disabled={isFetching || error} className={isFetching || error ? "errorFetchButton" : "transactionsAddButton"}>Add</button>
      </Link>
      {error && <span style={{color:"red"}}>Somthing went worng! It might be your network connection or you entered an invalid value.<br/>Refresh and try again!</span>}

    </div>
  );
};

export default Transactions;
