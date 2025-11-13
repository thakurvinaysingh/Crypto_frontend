import AppRoutes from './routes'
import EVMWalletProvider from './components/ConnectWallet/EVMWalletProvider'
import { useReferralCapture } from "./hooks/useReferralCapture";
export default function App() {
  useReferralCapture();
  return (
    <EVMWalletProvider>
      <AppRoutes />
    </EVMWalletProvider>
  )
}



