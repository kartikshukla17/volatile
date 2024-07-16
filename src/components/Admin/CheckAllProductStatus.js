import React, { useContext, useState } from "react";
import { fetchAllProductStatus } from "components/Soroban/soroban1";
import { pubKeyData } from "App";

const CheckAllProductStatus = () => {
  const [allProductStatus, setAllProductStatus] = useState([0,0,0,0]);

  const pubKey = useContext(pubKeyData);

  const handleRefresh = async () => {
    try {
      const values = await fetchAllProductStatus(pubKey);
      if (Array.isArray(values) && values.length === 4) {
        setAllProductStatus(values);
      } else {
        console.error("Unexpected data format from fetchAllProductStatus");
        setAllProductStatus([0, 0, 0, 0]);
      }
    } catch (error) {
      console.error("Error fetching product status:", error);
      setAllProductStatus([0, 0, 0, 0]);
    }
  };

  const allStatus = {
    approved: allProductStatus[0] || 0,
    expired: allProductStatus[1] || 0,
    pending: allProductStatus[2] || 0,
    total: allProductStatus[3] || 0,
  };

  return (
    <div className="flex flex-col bg-white rounded-lg my-4 items-center border border-black p-4 min-w-max">
      <div className="bg-black w-full p-2 rounded-md sm:text-2xl text-center flex gap-3 justify-between items-center font-bold text-white">
        Products Scanned
        <button
          className="text-lg hover:bg-violet-500 bg-pink-700 rounded-md p-1 font-bold text-white"
          onClick={handleRefresh}
        >
          Refresh
        </button>
      </div>
      <div className="text-center flex justify-center sm:text-2xl font-semibold ">
        <table>
          <thead className="border-b-2 border-dashed border-blue-700">
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Approved</td>
              <td>{allStatus.approved}</td>
            </tr>
            <tr>
              <td>Expired</td>
              <td>{allStatus.expired}</td>
            </tr>
            <tr>
              <td>Pending</td>
              <td>{allStatus.pending}</td>
            </tr>
            <tr>
              <td>Total</td>
              <td>{allStatus.total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckAllProductStatus;