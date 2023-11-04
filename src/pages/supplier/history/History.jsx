import "./history.css";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, OpenWith } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { format } from "date-fns";
import { getOneSupplier, getOneSupplierTrans, getSupplierTrans } from "../../../redux/apiCalls";
import { useEffect } from "react";

const History = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state.user.currentUser.isAdmin);
  const supplierTrans = useSelector(
    (state) => state.supplierTrans.supplierTrans
  );
  console.log(supplierTrans);
  const suppliers = useSelector((state) => state.suppliers.oneSupplier);
  const supplierId = suppliers._id;
  console.log("supplierId",supplierId)
  useEffect(()=>{
   getSupplierTrans(dispatch,supplierId)
  },[dispatch])
  const columns = [
    {
      field: "createdAt",
      headerName: "Date",
      width: 200,
      renderCell: (params) => {
        const createdAt = params.row.createdAt;
        const date = new Date(createdAt);
        const formattedDate = format(date, "dd/MM/yyyy");

        return <div>{formattedDate}</div>;
      },
    },

    {
      field: "ramliTotal",
      headerName: "Ramli Total",

      width: 250,
      renderCell: (params) => {
        const sTrans = params.row.sTrans;
        const ramliSec = sTrans.map((item) => item.ramliSec).flat();
        const ramliTotal = ramliSec.map((item) => item.ramliTotal);

        return <div>{ramliTotal} g</div>;
      },
    },
    {
      field: "cashTotal",
      headerName: "Cash Total",

      width: 250,
      renderCell: (params) => {
        const sTrans = params.row.sTrans;
        const cashSec = sTrans.map((item) => item.cashSec).flat();
        const cashTotal = cashSec.map((item) => item.cashTotal);
        return <div>$ {cashTotal}</div>;
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,

      renderCell: (params) => {
        return (
          <>
            <div className="iconList">
              <div className="iconTotalList">
                
                  <OpenWith className="openWithIcon" onClick={async () => {
                  await getOneSupplier(dispatch, params.row.supplierId)
                  await getOneSupplierTrans(dispatch,params.row._id )
                  navigate("/supplierTransReceipt/" + params.row._id);
                }}/>
                
              </div>
              {isAdmin && (
                <div className="iconTotalList">
                  <Link to={"/editSupplierTrans/" + params.row._id}>
                    <Edit className="suppleirsTransEditButton" />
                  </Link>
                </div>
              )}
            </div>
          </>
        );
      },
    },
  ];
  const reversedSupplierTrans = [...supplierTrans].reverse();

  return (
    <div className="history">
      <div className="historyListTitle">
        <h1>{suppliers?.suppliername}'s Transaction List</h1>
        <span>Phone: {suppliers?.phone}</span>
      </div>
      <div className="historyDataGrid" style={{ height: 400, width: "100%" }}>
        <DataGrid
          disableRowSelectionOnClick
          rows={reversedSupplierTrans}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 100]}
          checkboxSelection
        />
      </div>
      <Link to={"/supplierTrans/" + supplierId}>
        <button
          onClick={() => {
            getOneSupplierTrans(dispatch, supplierId);
          }}
          className="historyAddButton"
        >
          Add
        </button>
      </Link>
    </div>
  );
};

export default History;
