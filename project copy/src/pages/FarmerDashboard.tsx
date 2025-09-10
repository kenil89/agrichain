// import React, { useState } from 'react'
// import { useWeb3 } from '../contexts/Web3Context'
// import toast from 'react-hot-toast'

// import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import { Sprout, Plus, QrCode, Send, ArrowLeft } from 'lucide-react'
// import { QRCodeSVG } from 'qrcode.react'
// import { useWeb3 } from '../contexts/Web3Context'
// import toast from 'react-hot-toast'

// interface Batch {
//   id: number
//   productType: string
//   quantity: number
//   location: string
//   timestamp: number
//   qrCode: string
// }

// const FarmerDashboard = () => {
//   const { account, contract, connectWallet, isConnected } = useWeb3()
//   const [batches, setBatches] = useState<Batch[]>([])
//   const [showCreateForm, setShowCreateForm] = useState(false)
//   const [showQRModal, setShowQRModal] = useState<Batch | null>(null)
//   const [showTransferModal, setShowTransferModal] = useState<Batch | null>(null)
//   const [loading, setLoading] = useState(false)

//   const [formData, setFormData] = useState({
//     productType: '',
//     quantity: '',
//     location: ''
//   })

//   const [transferData, setTransferData] = useState({
//     distributorAddress: '',
//     otp: ''
//   })

//   useEffect(() => {
//     if (isConnected && contract) {
//       loadBatches()
//     }
//   }, [isConnected, contract])

//   const loadBatches = async () => {
//     try {
//       if (!contract || !account) return
      
//       const batchIds = await contract.getBatchesByOwner(account)
//       const batchDetails = await Promise.all(
//         batchIds.map(async (id: bigint) => {
//           const details = await contract.getBatchDetails(id)
//           return {
//             id: Number(id),
//             productType: details.productType,
//             quantity: Number(details.quantity),
//             location: details.location,
//             timestamp: Number(details.timestamp),
//             qrCode: `${window.location.origin}/trace/${id}`
//           }
//         })
//       )
//       setBatches(batchDetails)
//     } catch (error) {
//       console.error('Error loading batches:', error)
//       toast.error('Failed to load batches')
//     }
//   }

//   const handleCreateBatch = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!contract) return

//     setLoading(true)
//     try {
//       const tx = await contract.createBatch(
//         formData.productType,
//         parseInt(formData.quantity),
//         formData.location
//       )
//       await tx.wait()
      
//       toast.success('Batch created successfully!')
//       setFormData({ productType: '', quantity: '', location: '' })
//       setShowCreateForm(false)
//       loadBatches()
//     } catch (error) {
//       console.error('Error creating batch:', error)
//       toast.error('Failed to create batch')
//     }
//     setLoading(false)
//   }

//   const handleTransferBatch = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!contract || !showTransferModal) return

//     setLoading(true)
//     try {
//       const tx = await contract.transferBatch(
//         showTransferModal.id,
//         transferData.distributorAddress,
//         transferData.otp
//       )
//       await tx.wait()
      
//       toast.success('Batch transferred successfully!')
//       setTransferData({ distributorAddress: '', otp: '' })
//       setShowTransferModal(null)
//       loadBatches()
//     } catch (error) {
//       console.error('Error transferring batch:', error)
//       toast.error('Failed to transfer batch')
//     }
//     setLoading(false)
//   }

//   if (!isConnected) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="card max-w-md w-full text-center">
//           <Sprout className="h-16 w-16 text-forest-600 mx-auto mb-6" />
//           <h2 className="text-2xl font-bold text-earth-900 mb-4">Connect Your Wallet</h2>
//           <p className="text-earth-700 mb-6">Please connect your MetaMask wallet to access the farmer dashboard</p>
//           <button onClick={connectWallet} className="btn-primary w-full">
//             Connect Wallet
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-earth-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-earth-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div className="flex items-center space-x-4">
//               <Link to="/" className="text-earth-600 hover:text-earth-800">
//                 <ArrowLeft className="h-6 w-6" />
//               </Link>
//               <div className="flex items-center space-x-3">
//                 <Sprout className="h-8 w-8 text-forest-600" />
//                 <h1 className="text-2xl font-bold text-earth-900">Farmer Dashboard</h1>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="text-sm text-earth-600">
//                 {account?.slice(0, 6)}...{account?.slice(-4)}
//               </span>
//               <button 
//                 onClick={() => setShowCreateForm(true)}
//                 className="btn-primary flex items-center"
//               >
//                 <Plus className="h-5 w-5 mr-2" />
//                 Create Batch
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-earth-900 mb-2">Your Batches</h2>
//           <p className="text-earth-700">Manage your produce batches and track their journey</p>
//         </div>

//         {batches.length === 0 ? (
//           <div className="card text-center py-12">
//             <Sprout className="h-16 w-16 text-earth-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-earth-900 mb-2">No batches yet</h3>
//             <p className="text-earth-700 mb-6">Create your first batch to get started</p>
//             <button 
//               onClick={() => setShowCreateForm(true)}
//               className="btn-primary"
//             >
//               Create First Batch
//             </button>
//           </div>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {batches.map((batch) => (
//               <div key={batch.id} className="card">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h3 className="text-lg font-semibold text-earth-900">{batch.productType}</h3>
//                     <p className="text-earth-600">Batch #{batch.id}</p>
//                   </div>
//                   <span className="badge-success">Active</span>
//                 </div>
                
//                 <div className="space-y-2 mb-6">
//                   <p className="text-earth-700"><span className="font-medium">Quantity:</span> {batch.quantity} kg</p>
//                   <p className="text-earth-700"><span className="font-medium">Location:</span> {batch.location}</p>
//                   <p className="text-earth-700"><span className="font-medium">Created:</span> {new Date(batch.timestamp * 1000).toLocaleDateString()}</p>
//                 </div>

//                 <div className="flex space-x-2">
//                   <button 
//                     onClick={() => setShowQRModal(batch)}
//                     className="btn-secondary flex-1 flex items-center justify-center"
//                   >
//                     <QrCode className="h-4 w-4 mr-2" />
//                     QR Code
//                   </button>
//                   <button 
//                     onClick={() => setShowTransferModal(batch)}
//                     className="btn-primary flex-1 flex items-center justify-center"
//                   >
//                     <Send className="h-4 w-4 mr-2" />
//                     Transfer
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       {/* Create Batch Modal */}
//       {showCreateForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="card max-w-md w-full">
//             <h3 className="text-xl font-bold text-earth-900 mb-6">Create New Batch</h3>
//             <form onSubmit={handleCreateBatch} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-earth-700 mb-2">Product Type</label>
//                 <input
//                   type="text"
//                   value={formData.productType}
//                   onChange={(e) => setFormData({...formData, productType: e.target.value})}
//                   className="input-field"
//                   placeholder="e.g., Organic Tomatoes"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-earth-700 mb-2">Quantity (kg)</label>
//                 <input
//                   type="number"
//                   value={formData.quantity}
//                   onChange={(e) => setFormData({...formData, quantity: e.target.value})}
//                   className="input-field"
//                   placeholder="100"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-earth-700 mb-2">Farm Location</label>
//                 <input
//                   type="text"
//                   value={formData.location}
//                   onChange={(e) => setFormData({...formData, location: e.target.value})}
//                   className="input-field"
//                   placeholder="e.g., Green Valley Farm, CA"
//                   required
//                 />
//               </div>
//               <div className="flex space-x-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowCreateForm(false)}
//                   className="btn-secondary flex-1"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="btn-primary flex-1"
//                 >
//                   {loading ? 'Creating...' : 'Create Batch'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* QR Code Modal */}
//       {showQRModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="card max-w-sm w-full text-center">
//             <h3 className="text-xl font-bold text-earth-900 mb-6">Batch QR Code</h3>
//             <div className="bg-white p-4 rounded-lg mb-6 inline-block">
//               <QRCodeSVG value={showQRModal.qrCode} size={200} />
//             </div>
//             <p className="text-earth-700 mb-6">Scan this QR code to track the batch</p>
//             <button
//               onClick={() => setShowQRModal(null)}
//               className="btn-primary w-full"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Transfer Modal */}
//       {showTransferModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="card max-w-md w-full">
//             <h3 className="text-xl font-bold text-earth-900 mb-6">Transfer Batch</h3>
//             <form onSubmit={handleTransferBatch} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-earth-700 mb-2">Distributor Address</label>
//                 <input
//                   type="text"
//                   value={transferData.distributorAddress}
//                   onChange={(e) => setTransferData({...transferData, distributorAddress: e.target.value})}
//                   className="input-field"
//                   placeholder="0x..."
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-earth-700 mb-2">OTP Code</label>
//                 <input
//                   type="text"
//                   value={transferData.otp}
//                   onChange={(e) => setTransferData({...transferData, otp: e.target.value})}
//                   className="input-field"
//                   placeholder="Enter 6-digit OTP"
//                   required
//                 />
//               </div>
//               <div className="flex space-x-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowTransferModal(null)}
//                   className="btn-secondary flex-1"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="btn-primary flex-1"
//                 >
//                   {loading ? 'Transferring...' : 'Transfer'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// // export default FarmerDashboard
// import React, { useState } from 'react'
// import { useWeb3 } from '../contexts/Web3Context'
// import toast from 'react-hot-toast'

// const FarmerDashboard: React.FC = () => {
//   const { account, contract, connectWallet, isConnected } = useWeb3()

//   const [stockId, setStockId] = useState('')
//   const [name, setName] = useState('')
//   const [qty, setQty] = useState(0)
//   const [price, setPrice] = useState(0)

//   const handleCreateStock = async () => {
//     if (!contract) return toast.error('Contract not connected')
//     if (!stockId || !name || qty <= 0 || price <= 0) return toast.error('Fill all fields')

//     try {
//       const tx = await contract.createFarmerStock(stockId, name, qty, price)
//       await tx.wait() // wait for transaction to be mined
//       toast.success(`Stock ${stockId} created successfully!`)
//       setStockId('')
//       setName('')
//       setQty(0)
//       setPrice(0)
//     } catch (error: any) {
//       console.error(error)
//       toast.error(error?.message || 'Failed to create stock')
//     }
//   }

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Farmer Dashboard</h1>

//       {!isConnected ? (
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           onClick={connectWallet}
//         >
//           Connect Wallet
//         </button>
//       ) : (
//         <div>
//           <p>Connected Account: {account}</p>

//           <div className="mt-4 space-y-2">
//             <input
//               type="text"
//               placeholder="Stock ID"
//               value={stockId}
//               onChange={(e) => setStockId(e.target.value)}
//               className="border px-2 py-1 rounded w-full"
//             />
//             <input
//               type="text"
//               placeholder="Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="border px-2 py-1 rounded w-full"
//             />
//             <input
//               type="number"
//               placeholder="Quantity"
//               value={qty}
//               onChange={(e) => setQty(Number(e.target.value))}
//               className="border px-2 py-1 rounded w-full"
//             />
//             <input
//               type="number"
//               placeholder="Unit Price"
//               value={price}
//               onChange={(e) => setPrice(Number(e.target.value))}
//               className="border px-2 py-1 rounded w-full"
//             />

//             <button
//               className="bg-green-500 text-white px-4 py-2 rounded mt-2"
//               onClick={handleCreateStock}
//             >
//               Create Stock
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default FarmerDashboard


import React, { useState, useEffect } from 'react'
import { useWeb3 } from '../contexts/Web3Context'
import toast from 'react-hot-toast'

interface Stock {
  stockId: string
  name: string
  quantity: number
  unitPrice: number
}

const CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' // AgriChain contract

const FarmerDashboard: React.FC = () => {
  const { account, contract, connectWallet, isConnected } = useWeb3()

  const [stockId, setStockId] = useState('')
  const [name, setName] = useState('')
  const [qty, setQty] = useState(0)
  const [price, setPrice] = useState(0)
  const [stocks, setStocks] = useState<Stock[]>([])

  const handleCreateStock = async () => {
    if (!contract) return toast.error('Contract not connected')
    if (!stockId || !name || qty <= 0 || price <= 0) return toast.error('Fill all fields')

    try {
      const tx = await contract.createFarmerStock(stockId, name, qty, price)
      await tx.wait()
      toast.success(`Stock ${stockId} created successfully!`)
      setStocks([...stocks, { stockId, name, quantity: qty, unitPrice: price }])
      setStockId('')
      setName('')
      setQty(0)
      setPrice(0)
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message || 'Failed to create stock')
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Farmer Dashboard</h1>

      {!isConnected ? (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p><strong>Connected Account:</strong> {account}</p>
          <p><strong>Contract:</strong> {CONTRACT_ADDRESS}</p>

          <div className="mt-4 space-y-2">
            <input
              type="text"
              placeholder="Stock ID"
              value={stockId}
              onChange={(e) => setStockId(e.target.value)}
              className="border px-2 py-1 rounded w-full"
            />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border px-2 py-1 rounded w-full"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="border px-2 py-1 rounded w-full"
            />
            <input
              type="number"
              placeholder="Unit Price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="border px-2 py-1 rounded w-full"
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
              onClick={handleCreateStock}
            >
              Create Stock
            </button>
          </div>

          {stocks.length > 0 && (
            <div className="mt-6">
              <h2 className="font-bold text-lg mb-2">Created Stocks</h2>
              <ul className="space-y-1">
                {stocks.map((s) => (
                  <li key={s.stockId} className="border px-2 py-1 rounded">
                    <strong>ID:</strong> {s.stockId} | <strong>Name:</strong> {s.name} | <strong>Qty:</strong> {s.quantity} | <strong>Price:</strong> {s.unitPrice}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FarmerDashboard
