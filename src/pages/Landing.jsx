import Logo from '../assets/logo1.png'
import { useDispatch, useSelector } from 'react-redux'
import { openPreview, closePreview, setQuery } from '../store/slices/uiSlice'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'
import { useNavigate } from 'react-router-dom'

/* ↓↓↓ add these */
import useWalletModal from '../hooks/useWalletModal'
import ConnectButton from '../components/ ConnectWallet/ConnectButton'
import WalletModal from '../components/ ConnectWallet/WalletModal'

export default function Landing(){
  const { previewOpen, query } = useSelector(s=>s.ui)
  const dispatch = useDispatch()
  const nav = useNavigate()

  const openDashboard = () => { if (query.trim() === '1') nav('/main') }
  const onKeyDown = (e) => { if (e.key === 'Enter') openDashboard() }

  /* ↓↓↓ wallet modal state */
  const { isOpen, open, close } = useWalletModal()

  return (
    <section className="relative">
      {/* Hero logo — large on desktop, balanced on mobile */}
      <div className="mx-auto max-w-4xl pt-0 sm:pt-6 md:pt-0">
        <img
          src={Logo}
          alt="Forton"
          className="mx-auto w-[85%] max-w-[920px] md:w-[78%] lg:w-[72%] select-none pointer-events-none"
          draggable="false"
        />
      </div>

      {/* Headline + actions */}
      <div className="mt-0 sm:mt-8 md:mt-0">
        <h1 className="text-center leading-tight font-semibold text-[12px] sm:text-[34px] md:text-[34px] lg:text-[34px]">
          <span className="block">Earn with friends</span>
          <span className="block mt-2">here and now.</span>
        </h1>

        <div className="mt-8 sm:mt-10 flex items-center justify-center gap-4">
          {/* ⬇️ replace the old Button with the real Connect button */}
          <ConnectButton onOpen={open} />

          <button
            aria-label="Open preview"
            onClick={()=>dispatch(openPreview())}
            className="btn-circle"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M11 19a8 8 0 1 1 5.293-2.707L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Preview modal (unchanged) */}
      <Modal open={previewOpen} onClose={()=>dispatch(closePreview())}>
        <h3 className="text-2xl font-semibold mb-1">Preview mode</h3>
        <p className="text-white/70 mb-4">Enter user ID to preview their data</p>
        <input
          autoFocus
          value={query}
          onChange={(e)=>dispatch(setQuery(e.target.value))}
          onKeyDown={onKeyDown}
          placeholder="Enter user ID"
          className="input mb-4"
        />
        <Button className="w-full" onClick={openDashboard}>Open dashboard</Button>
      </Modal>

      {/* ⬇️ mount the wallet modal */}
      <WalletModal isOpen={isOpen} onClose={close} />

      {/* Extra vertical space for safe-area on phones */}
      <div className="h-safe" />
    </section>
  )
}



// import Logo from '../assets/logo1.png'
// import { useDispatch, useSelector } from 'react-redux'
// import { openPreview, closePreview, setQuery } from '../store/slices/uiSlice'
// import Modal from '../components/common/Modal'
// import Button from '../components/common/Button'
// import { useNavigate } from 'react-router-dom'

// export default function Landing(){
//   const { previewOpen, query } = useSelector(s=>s.ui)
//   const dispatch = useDispatch()
//   const nav = useNavigate()

//   const openDashboard = () => { if (query.trim() === '1') nav('/main') }
//   const onKeyDown = (e) => { if (e.key === 'Enter') openDashboard() }

//   return (
//     <section className="relative">
//       {/* Hero logo — large on desktop, balanced on mobile */}
//       <div className="mx-auto max-w-4xl pt-0 sm:pt-6 md:pt-0">
//         <img
//           src={Logo}
//           alt="Forton"
//           className="mx-auto w-[85%] max-w-[920px] md:w-[78%] lg:w-[72%] select-none pointer-events-none"
//           draggable="false"
//         />
//       </div>

//       {/* Headline + actions */}
//       <div className="mt-0 sm:mt-8 md:mt-0">
//         <h1 className="text-center leading-tight font-semibold text-[12px] sm:text-[34px] md:text-[34px] lg:text-[34px]">
//           <span className="block">Earn with friends</span>
//           <span className="block mt-2">here and now.</span>
//         </h1>

//         <div className="mt-8 sm:mt-10 flex items-center justify-center gap-4">
//           <Button>Connect Wallet</Button>
//           <button
//             aria-label="Open preview"
//             onClick={()=>dispatch(openPreview())}
//             className="btn-circle"
//           >
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//               <path d="M11 19a8 8 0 1 1 5.293-2.707L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Preview modal */}
//       <Modal open={previewOpen} onClose={()=>dispatch(closePreview())}>
//         <h3 className="text-2xl font-semibold mb-1">Preview mode</h3>
//         <p className="text-white/70 mb-4">Enter user ID to preview their data</p>
//         <input
//           autoFocus
//           value={query}
//           onChange={(e)=>dispatch(setQuery(e.target.value))}
//           onKeyDown={onKeyDown}
//           placeholder="Enter user ID"
//           className="input mb-4"
//         />
//         <Button className="w-full" onClick={openDashboard}>Open dashboard</Button>
//       </Modal>

//       {/* Extra vertical space for safe-area on phones */}
//       <div className="h-safe" />
//     </section>
//   )
// }
