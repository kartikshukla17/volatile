import React from "react";
import ApproveProduct from "./ApproveProduct";
import CheckAllProductStatus from "./CheckAllProductStatus";

const ConsumerDashboard = () => {
  return (
    <div className="bg-white my-10 rounded-md p-4 flex flex-col items-center lg:w-[90vw] m-auto">
      <div className="w-full text-4xl font-semibold text-center text-black py-4 mb-5 rounded-lg bg-white border border-black">
        Consumer Dashboard
      </div>
      <div className="flex gap-10 max-xl:flex-col justify-between w-full items-center">
        <CheckAllProductStatus />
        <ApproveProduct />
      </div>
    </div>
  );
};

export default ConsumerDashboard;