import "./App.css";
import Header from "./components/Header";
import ConsumerDashboard from "./components/Admin/ConsumerDashboard";
import RegularUser from "./components/RegularUser/ManufacturerDashboard";
import { createContext, useState } from "react";
import { ADMIN_KEY } from "./constants/constants";

const pubKeyData = createContext();
const productIdContext = createContext();

function App() {
  const [pubkey, _setPubKey] = useState("");
  const [productId, setProductId] = useState();

  return (
    <div className="App">
      <pubKeyData.Provider value={pubkey}>
        <Header setPubKey={_setPubKey} />

          <productIdContext.Provider value={{productId, setProductId}}>
            <RegularUser />
            {pubkey.toString() === ADMIN_KEY && <ConsumerDashboard />}
          </productIdContext.Provider>
      </pubKeyData.Provider>
    </div>
  );
}

export default App;
export { pubKeyData, productIdContext };
