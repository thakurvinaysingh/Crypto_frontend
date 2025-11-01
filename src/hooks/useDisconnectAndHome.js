import { useNavigate } from "react-router-dom";
import { useEVMWallet } from "../components/ConnectWallet/EVMWalletProvider";

export default function useDisconnectAndHome() {
  const navigate = useNavigate();
  const { disconnect } = useEVMWallet();
  // Clear user-related localStorage whenever we disconnect
  const clearLocalSession = () => {
    try {
      localStorage.removeItem("fx_user_id");        // backend record id (data.id)
      localStorage.removeItem("fx_user_userId");    // backend user id (data.userId)
      localStorage.removeItem("fx_wallet_addr");    // connected wallet
    } catch {
      // swallow
    }
  };

  return async function goHome() {
    try {
       await disconnect?.();
    } finally {
      clearLocalSession();
     navigate("/", { replace: true });
    }
  };
}
