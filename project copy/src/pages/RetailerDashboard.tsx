import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Store, DollarSign, Upload, ArrowLeft, Package, FileText } from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import toast from 'react-hot-toast'

interface Batch {
  id: number
  productType: string
  quantity: number
  location: string
  timestamp: number
  farmer: string
  finalPrice: number
  certificateHash: string
}

const RetailerDashboard = () => {
  const { account, contract, connectWallet, isConnected } = useWeb3()
  const [batches, setBatches] = useState<Batch[]>([])
  const [showPriceModal, setShowPriceModal] = useState<Batch | null>(null)
  const [showCertModal, setShowCertModal] = useState<Batch | null>(null)
  const [loading, setLoading] = useState(false)

  const [priceData, setPriceData] = useState({
    price: ''
  })

  const [certData, setCertData] = useState({
    file: null as File | null,
    uploading: false
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
            farmer: details.farmer,
            finalPrice: Number(details.finalPrice),
            certificateHash: details.certificateHash
          }
        })
      )
      setBatches(batchDetails)
    } catch (error) {
      console.error('Error loading batches:', error)
      toast.error('Failed to load batches')
    }
  }

  const handleAddPrice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contract || !showPriceModal) return

    setLoading(true)
    try {
      const priceInWei = Math.floor(parseFloat(priceData.price) * 100) // Convert to cents
      const tx = await contract.addFinalPrice(showPriceModal.id, priceInWei)
      await tx.wait()
      
      toast.success('Price added successfully!')
      setPriceData({ price: '' })
      setShowPriceModal(null)
      loadBatches()
    } catch (error) {
      console.error('Error adding price:', error)
      toast.error('Failed to add price')
    }
    setLoading(false)
  }

  const handleUploadCertificate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contract || !showCertModal || !certData.file) return

    setCertData(prev => ({ ...prev, uploading: true }))
    
    try {
      // Mock IPFS upload - in production, use actual IPFS client
      const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}`
      
      const tx = await contract.uploadCertificateHash(showCertModal.id, mockHash)
      await tx.wait()
      
      toast.success('Certificate uploaded successfully!')
      setCertData({ file: null, uploading: false })
      setShowCertModal(null)
      loadBatches()
    } catch (error) {
      console.error('Error uploading certificate:', error)
      toast.error('Failed to upload certificate')
      setCertData(prev => ({ ...prev, uploading: false }))
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md w-full text-center">
          <Store className="h-16 w-16 text-earth-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-earth-900 mb-4">Connect Your Wallet</h2>
          <p className="text-earth-700 mb-6">Please connect your MetaMask wallet to access the retailer dashboard</p>
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
                <Store className="h-8 w-8 text-earth-600" />
                <h1 className="text-2xl font-bold text-earth-900">Retailer Dashboard</h1>
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
          <p className="text-earth-700">Add final pricing and quality certificates for consumer sales</p>
        </div>

        {batches.length === 0 ? (
          <div className="card text-center py-12">
            <Package className="h-16 w-16 text-earth-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-earth-900 mb-2">No batches in inventory</h3>
            <p className="text-earth-700">Batches transferred from distributors will appear here</p>
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
                  <span className={`badge ${batch.finalPrice > 0 && batch.certificateHash ? 'badge-success' : 'badge-warning'}`}>
                    {batch.finalPrice > 0 && batch.certificateHash ? 'Ready for Sale' : 'Pending Setup'}
                  </span>
                </div>
                
                <div className="space-y-2 mb-6">
                  <p className="text-earth-700"><span className="font-medium">Quantity:</span> {batch.quantity} kg</p>
                  <p className="text-earth-700"><span className="font-medium">Origin:</span> {batch.location}</p>
                  <p className="text-earth-700"><span className="font-medium">Farmer:</span> {batch.farmer.slice(0, 6)}...{batch.farmer.slice(-4)}</p>
                  {batch.finalPrice > 0 && (
                    <p className="text-earth-700"><span className="font-medium">Price:</span> ${(batch.finalPrice / 100).toFixed(2)}/kg</p>
                  )}
                  {batch.certificateHash && (
                    <p className="text-earth-700"><span className="font-medium">Certificate:</span> ✓ Uploaded</p>
                  )}
                </div>

                <div className="space-y-2">
                  {batch.finalPrice === 0 && (
                    <button 
                      onClick={() => setShowPriceModal(batch)}
                      className="btn-primary w-full flex items-center justify-center"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Add Price
                    </button>
                  )}
                  {!batch.certificateHash && (
                    <button 
                      onClick={() => setShowCertModal(batch)}
                      className="btn-secondary w-full flex items-center justify-center"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Certificate
                    </button>
                  )}
                  {batch.finalPrice > 0 && batch.certificateHash && (
                    <Link 
                      to={`/trace/${batch.id}`}
                      className="btn-primary w-full flex items-center justify-center"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Consumer QR
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Price Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <h3 className="text-xl font-bold text-earth-900 mb-6">Add Final Price</h3>
            <div className="bg-earth-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-earth-900 mb-2">{showPriceModal.productType}</h4>
              <p className="text-earth-700 text-sm">Batch #{showPriceModal.id} • {showPriceModal.quantity} kg</p>
            </div>
            <form onSubmit={handleAddPrice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">Price per kg ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={priceData.price}
                  onChange={(e) => setPriceData({...priceData, price: e.target.value})}
                  className="input-field"
                  placeholder="5.99"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPriceModal(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? 'Adding...' : 'Add Price'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <h3 className="text-xl font-bold text-earth-900 mb-6">Upload Quality Certificate</h3>
            <div className="bg-earth-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-earth-900 mb-2">{showCertModal.productType}</h4>
              <p className="text-earth-700 text-sm">Batch #{showCertModal.id} • {showCertModal.quantity} kg</p>
            </div>
            <form onSubmit={handleUploadCertificate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">Certificate File</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setCertData({...certData, file: e.target.files?.[0] || null})}
                  className="input-field"
                  required
                />
                <p className="text-xs text-earth-600 mt-1">Supported formats: PDF, JPG, PNG</p>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCertModal(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={certData.uploading || !certData.file}
                  className="btn-primary flex-1"
                >
                  {certData.uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RetailerDashboard