import AppRoutes from './routes'
import EVMWalletProvider from './components/ConnectWallet/EVMWalletProvider'

export default function App() {
  return (
    <EVMWalletProvider>
      <AppRoutes />
    </EVMWalletProvider>
  )
}



// import AppRoutes from './routes'
// export default function App(){ return <AppRoutes/> }
