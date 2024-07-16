import React, { useContext } from "react";
import { expireProduct } from "components/Soroban/soroban1";
import { productIdContext, pubKeyData } from "App";

const ExpireProduct = () => {
  const pubKey = useContext(pubKeyData);
  const { productId } = useContext(productIdContext);

  const handleExpire = async () => {
    await expireProduct(pubKey, productId);
  };

  return (
    <div>
      <button
        className="text-xl w-52 hover:bg-gray-700 bg-gray-500 rounded-md p-2 font-bold text-white"
        onClick={handleExpire}
      >
        Expire Product
      </button>
    </div>
  );
};

export default ExpireProduct;