import { approveProduct } from "components/Soroban/soroban1";
import { pubKeyData } from "App";
import React, { useState, useContext } from "react";

const PendingProduct = ({ pendingProductId, pendingProductIndex }) => {
  const [approvalStatus, setApprovalStatus] = useState(false);
  const pubKey = useContext(pubKeyData);

  const handleApprove = () => {
    localStorage.setItem(pendingProductId, "true");
    approveProduct(pubKey, pendingProductId);
    setApprovalStatus(true);
  };

  return (
    localStorage.getItem(pendingProductId) === "false" && (
      <tr className="flex gap-4 justify-between border border-black min-w-max p-1 bg-yellow-500 rounded-lg items-center">
        <td className="p-2 text-lg "> {pendingProductId} </td>
        <td>
          <button
            className={`p-2 rounded-md text-white hover:text-black hover:bg-green-300 ${"bg-green-600"}`}
            onClick={handleApprove}
          >
            {localStorage.getItem(pendingProductId) === "false" && "Approve"}
          </button>
        </td>
      </tr>
    )
  );
};

export default PendingProduct;