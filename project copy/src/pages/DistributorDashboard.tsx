import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Truck, Send, ArrowLeft, Package } from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import toast from 'react-hot-toast'

interface Batch {
  id: number
  productType: string
  quantity: number
  location: string
  timestamp: number
  farmer: string
}

const DistributorDashboard = () => {
  const { account, contract, connectWallet, isConnected } = useWeb3()
  const [batches, setBatches] = useState<Batch[]>([])
  const [showTransferModal, setShowTransferModal] = useState<Batch | null>(null)
  const [loading, setLoading] = useState(false)

  const [transferData, setTransferData] = useState({
    retailerAddress: '',
    otp: ''
  })

  useEffect(() => {
    if (isConnected && contract) {
      loadBatches()
    }
  }, [isConnected, contract])

  const loadBatches = async () => {
    try {
      if (!contract || !account) return
      
      const batchIds = await contract.getBatchesByOwner(account)
      const batchDetails = await Promise.all(
        batchIds.map(async (id: bigint) => {
          const details = await contract.getBatchDetails(id)
          return {
            id: Number(id),
            productType: details.productType,
            quantity: Number(details.quantity),
            location: details.location,
            timestamp: Number(details.timestamp),
            farmer: details.farmer
          }
        })
      )
      setBatches(batchDetails)
    } catch (error) {
      console.error('Error loading batches:', error)
      toast.error('Failed to load batches')
    }
  }

  const handleTransferBatch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contract || !showTransferModal) return

    setLoading(true)
    try {
      const tx = await contract.transferBatch(
        showTransferModal.id,
        transferData.retailerAddress,
        transferData.otp
      )
      await tx.wait()
      
      toast.success('Batch transferred successfully!')
      setTransferData({ retailerAddress: '', otp: '' })
      setShowTransferModal(null)
      loadBatches()
    } catch (error) {
      console.error('Error transferring batch:', error)
      toast.error('Failed to transfer batch')
    }
    setLoading(false)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md w-full text-center">
          <Truck className="h-16 w-16 text-sage-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-earth-900 mb-4">Connect Your Wallet</h2>
          <p className="text-earth-700 mb-6">Please connect your MetaMask wallet to access the distributor dashboard</p>
          <button onClick={connectWallet} className="btn-primary w-full">
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-earth-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-earth-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-earth-600 hover:text-earth-800">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-3">
                <Truck className="h-8 w-8 text-sage-600" />
                <h1 className="text-2xl font-bold text-earth-900">Distributor Dashboard</h1>
              </div>
            </div>
            <span className="text-sm text-earth-600">
              {account?.slice(0, 6)}...{account?.slice(-4)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-earth-900 mb-2">Your Inventory</h2>
          <p className="text-earth-700">Manage and transfer product batches to retailers</p>
        </div>

        {batches.length === 0 ? (
          <div className="card text-center py-12">
            <Package className="h-16 w-16 text-earth-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-earth-900 mb-2">No batches in inventory</h3>
            <p className="text-earth-700">Batches transferred from farmers will appear here</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch) => (
              <div key={batch.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-earth-900">{batch.productType}</h3>
                    <p className="text-earth-600">Batch #{batch.id}</p>
                  </div>
                  <span className="badge-info">In Transit</span>
                </div>
                
                <div className="space-y-2 mb-6">
                  <p className="text-earth-700"><span className="font-medium">Quantity:</span> {batch.quantity} kg</p>
                  <p className="text-earth-700"><span className="font-medium">Origin:</span> {batch.location}</p>
                  <p className="text-earth-700"><span className="font-medium">Farmer:</span> {batch.farmer.slice(0, 6)}...{batch.farmer.slice(-4)}</p>
                  <p className="text-earth-700"><span className="font-medium">Received:</span> {new Date(batch.timestamp * 1000).toLocaleDateString()}</p>
                </div>

                <button 
                  onClick={() => setShowTransferModal(batch)}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Transfer to Retailer
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <h3 className="text-xl font-bold text-earth-900 mb-6">Transfer to Retailer</h3>
            <div className="bg-earth-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-earth-900 mb-2">{showTransferModal.productType}</h4>
              <p className="text-earth-700 text-sm">Batch #{showTransferModal.id} • {showTransferModal.quantity} kg</p>
            </div>
            <form onSubmit={handleTransferBatch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">Retailer Address</label>
                <input
                  type="text"
                  value={transferData.retailerAddress}
                  onChange={(e) => setTransferData({...transferData, retailerAddress: e.target.value})}
                  className="input-field"
                  placeholder="0x..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">OTP Code</label>
                <input
                  type="text"
                  value={transferData.otp}
                  onChange={(e) => setTransferData({...transferData, otp: e.target.value})}
                  className="input-field"
                  placeholder="Enter 6-digit OTP"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? 'Transferring...' : 'Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DistributorDashboard