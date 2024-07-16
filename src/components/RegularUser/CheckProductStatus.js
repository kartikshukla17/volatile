import React, { useContext, useState } from "react";
import { fetchProductStatus } from "components/Soroban/soroban1";
import { productIdContext, pubKeyData } from "App";
import { fetchAllProductStatus } from "components/Soroban/soroban1";


const CheckProductStatus = () => {
  const [productStatus, setProductStatus] = useState({});

  const pubKey = useContext(pubKeyData);
  const {productId} = useContext(productIdContext);

  const handleRefresh = async () => {
    await fetchProductStatus(pubKey, productId).then(
      (values) => setProductStatus(values)
    );
  };

  const status = {
    uniqueID: productStatus[5] || 0,
    created_time: productStatus[0] || 0,
    name: productStatus[4] || "Not_Found",
    description: productStatus[1] || "Not_Found",
    approval_time: productStatus[7] || 0,
    expiration_time: productStatus[2] || 0,
    approval: productStatus[6] || false,
    isexpired: productStatus[3] || false,
  };

  return (
    <div className="flex flex-col font-semibold bg-white rounded-lg my-4 items-center border p-4 w-full">
      <div className="bg-black w-full p-2 rounded-md sm:text-2xl font-bold text-center flex justify-between gap-3 items-center text-white">
        Product Detail
        <button
          className="text-lg hover:bg-violet-500 bg-pink-700 rounded-md p-1 font-bold text-white"
          onClick={handleRefresh}
        >
          Refresh
        </button>
      </div>
      <table className="w-full sm:text-2xl text-center">
        <thead className="border-b-2 border-blue-700">
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="w-[50%]">Product ID</td>
            <td className="w-[50%]">{status.uniqueID}</td>
          </tr>
          <tr>
            <td className="w-[50%]">Product Name</td>
            <td className="w-[50%]">{status.name}</td>
          </tr>
          <tr>
            <td>Description</td>
            <td>{status.description}</td>
          </tr>
          <tr>
            <td>Approval Status</td>
            <td>{status.approval ? "Approved" : "Not Approved"}</td>
          </tr>
          <tr>
            <td>Expiration Status</td>
            <td>{status.isexpired ? "Expired" : "Not Expired"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CheckProductStatus;