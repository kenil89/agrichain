// import React from 'react'
// import { Routes, Route } from 'react-router-dom'
// import { Web3Provider } from './contexts/Web3Context'
// import LandingPage from './pages/LandingPage'
// import FarmerDashboard from './pages/FarmerDashboard'
// import DistributorDashboard from './pages/DistributorDashboard'
// import RetailerDashboard from './pages/RetailerDashboard'
// import ConsumerTrace from './pages/ConsumerTrace'
// import TrackBatch from './pages/TrackBatch'

// function App() {
//   return (
//     <Web3Provider>
//       <div className="min-h-screen bg-earth-50">
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/farmer" element={<FarmerDashboard />} />
//           <Route path="/distributor" element={<DistributorDashboard />} />
//           <Route path="/retailer" element={<RetailerDashboard />} />
//           <Route path="/trace/:batchId" element={<ConsumerTrace />} />
//           <Route path="/track" element={<TrackBatch />} />
//         </Routes>
//       </div>
//     </Web3Provider>
//   )
// }

// export default App
import React from 'react'
import { Web3Provider } from './contexts/Web3Context' // Make sure this path is correct
import FarmerDashboard from './pages/FarmerDashboard' // Your dashboard component
import { Toaster } from 'react-hot-toast'

const App: React.FC = () => {
  return (
    <Web3Provider>
      <Toaster position="top-right" />
      <FarmerDashboard />
      {/* You can add other pages/components here */}
    </Web3Provider>
  )
}

export default App
