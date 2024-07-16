import {
    Contract,
    SorobanRpc,
    TransactionBuilder,
    Networks,
    BASE_FEE,
    nativeToScVal,
    Address,
  } from "@stellar/stellar-sdk";
  import { userSignTransaction } from "../Freighter";
  
  let rpcUrl = "https://soroban-testnet.stellar.org";
  
  let contractAddress =
    "CDHHT6IKGRCFPSYJNKR2JEC3GUHRXGPIDUE2JN4LQLZMTCHYKLB4KZ7D";
  
  // ... (keep other utility functions unchanged)
  const accountToScVal = (account) => new Address(account).toScVal();


const stringToScValString = (value) => {
  return nativeToScVal(value);
};

const numberToU64 = (value) => {
  return nativeToScVal(value, { type: "u64" });
};

let params = {
  fee: BASE_FEE,
  networkPassphrase: Networks.TESTNET,
};
  
  async function contractInt(caller, functName, values) {
    // ... (keep this function unchanged)
    const provider = new SorobanRpc.Server(rpcUrl, { allowHttp: true });
    const sourceAccount = await provider.getAccount(caller);
    const contract = new Contract(contractAddress);
    let buildTx;
  
    if (values == null) {
      buildTx = new TransactionBuilder(sourceAccount, params)
        .addOperation(contract.call(functName))
        .setTimeout(30)
        .build();
    } else if (Array.isArray(values)) {
      buildTx = new TransactionBuilder(sourceAccount, params)
        .addOperation(contract.call(functName, ...values))
        .setTimeout(30)
        .build();
    } else {
      buildTx = new TransactionBuilder(sourceAccount, params)
        .addOperation(contract.call(functName, values))
        .setTimeout(30)
        .build();
    }
  
    let _buildTx = await provider.prepareTransaction(buildTx);
  
    let prepareTx = _buildTx.toXDR(); 
  
    let signedTx = await userSignTransaction(prepareTx, "TESTNET", caller);
  
    let tx = TransactionBuilder.fromXDR(signedTx, Networks.TESTNET);
  
    try {
      let sendTx = await provider.sendTransaction(tx).catch(function (err) {
        console.error("Catch-1", err);
        return err;
      });
      if (sendTx.errorResult) {
        throw new Error("Unable to submit transaction");
      }
      if (sendTx.status === "PENDING") {
        let txResponse = await provider.getTransaction(sendTx.hash);
        
        while (txResponse.status === "NOT_FOUND") {
          txResponse = await provider.getTransaction(sendTx.hash);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        if (txResponse.status === "SUCCESS") {
          let result = txResponse.returnValue;
          return result;
        }
      }
    } catch (err) {
      console.log("Catch-2", err);
      return;
    }
  }
  
  async function addProduct(caller, name, description) {
    let nameScVal = stringToScValString(name);
    let descriptionScVal = stringToScValString(description);
    let values = [nameScVal, descriptionScVal];
  
    try {
      const productId = await contractInt(caller, "add_product", values);
      let resolvedProductId = Number(productId?._value?._value);
      console.log(resolvedProductId);
      
      return resolvedProductId;
    } catch (error) {
      console.log("Product not added. Check if you already have a pending product");
    }
  }
  
  async function approveProduct(caller, product_id) {
    let values = numberToU64(product_id);
  
    try {
      await contractInt(caller, "approve_product", values);
      console.log(`!!Product ID - ${product_id}, is now Approved!!`);
    } catch (error) {
      console.log("Product can't be approved!!");
    }
  }
  
  async function expireProduct(caller, product_id) {
    let values = numberToU64(product_id);
  
    try {
      await contractInt(caller, "expire_product", values);
      console.log(`!!Product ID - ${product_id}, is now expired!!`);
    } catch (error) {
      console.log("Product can't be expired!!");
    }
  }
  
  async function fetchAllProductStatus(caller) {
    try {
      let result = await contractInt(caller, "view_all_product_status", null);
  
      let approvedVal = Number(result?._value[0]?._attributes?.val?._value);
      let expiredVal = Number(result?._value[1]?._attributes?.val?._value);
      let pendingVal = Number(result?._value[2]?._attributes?.val?._value);
      let totalVal = Number(result?._value[3]?._attributes?.val?._value);
  
      console.log(approvedVal, expiredVal, pendingVal, totalVal);
      let ansArr = [approvedVal, expiredVal, pendingVal, totalVal];
      return ansArr;
    } catch (error) {
      console.log("Unable to fetch All Product Status!!");
    }
  }
  
  async function fetchProductStatus(caller, product_id) {
    let values = numberToU64(product_id);
    let result1;
    let result2;
  
    try {
      result1 = await contractInt(caller, "view_product", values);
    } catch (error) {
      console.log("Unable to fetch Your Product Status!!");
    }
    
    try {
      result2 = await contractInt(caller, "view_admin_control_by_id", values);
    } catch (error) {
      console.log("Unable to fetch Your Product Status!!");
    }
    
    let creationTimeVal = Number(result1?._value[0]?._attributes?.val?._value);
    let descriptionVal = result1?._value[1]?._attributes?.val?._value?.toString();
    let expirationTimeVal = Number(result1?._value[2]?._attributes?.val?._value);
    let isExpiredVal = result1?._value[3]?._attributes?.val?._value;
    let nameVal = result1?._value[4]?._attributes?.val?._value?.toString();
    let productIdVal = Number(result1?._value[5]?._attributes?.val?._value);
    let approvalStatusVal = result2?._value[1]?._attributes?.val?._value;
    let approvalTimeVal = Number(result2?._value[2]?._attributes?.val?._value);
  
    let ansArr = [
      creationTimeVal,
      descriptionVal,
      expirationTimeVal,
      isExpiredVal,
      nameVal,
      productIdVal,
      approvalStatusVal,
      approvalTimeVal
    ];
  
    return ansArr;
  }
  
  export {
    addProduct,
    approveProduct,
    expireProduct,
    fetchAllProductStatus,
    fetchProductStatus,
  };