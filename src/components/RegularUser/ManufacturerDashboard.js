import React from "react";
import ExpireProduct from "./ExpireProduct";
import CheckProductStatus from "./CheckProductStatus";
import AddProduct from "./AddProduct";

const ManufacturerDashboard = () => {
  return (
    <div className="bg-white my-10 rounded-md p-4 flex flex-col items-center lg:w-[90vw] m-auto">
      <div className="font-semibold text-4xl w-full text-center py-4 mb-5 rounded-lg bg-black text-white">
        Manufacturer/Seller Dashboard
      </div>
      <div className="flex md:flex md:flex-row flex-col w-full grow justify-between">
        <div className="flex grow">
          <AddProduct />
        </div>

        <div className="flex flex-col my-4 sm:my-0 grow items-center">
          <ExpireProduct />
          <CheckProductStatus />
        </div>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;