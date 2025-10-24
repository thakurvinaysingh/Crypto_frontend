import { useNavigate } from "react-router-dom";
import { useEVMWallet } from "../components/ConnectWallet/EVMWalletProvider";

export default function useDisconnectAndHome() {
  const navigate = useNavigate();
  const { disconnect } = useEVMWallet();

  return async function goHome() {
    try {
      await disconnect();
    } finally {
      navigate("/");
    }
  };
}
