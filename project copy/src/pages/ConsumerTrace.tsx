import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, User, Truck, Store, DollarSign, FileText, Calendar, Package } from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import toast from 'react-hot-toast'

interface BatchDetails {
  id: number
  farmer: string
  currentOwner: string
  productType: string
  quantity: number
  location: string
  timestamp: number
  finalPrice: number
  certificateHash: string
  transferHistory: string[]
}

const ConsumerTrace = () => {
  const { batchId } = useParams<{ batchId: string }>()
  const { contract } = useWeb3()
  const [batch, setBatch] = useState<BatchDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (contract && batchId) {
      loadBatchDetails()
    }
  }, [contract, batchId])

  const loadBatchDetails = async () => {
    try {
      if (!contract || !batchId) return
      
      const details = await contract.getBatchDetails(parseInt(batchId))
      setBatch({
        id: Number(details.id),
        farmer: details.farmer,
        currentOwner: details.currentOwner,
        productType: details.productType,
        quantity: Number(details.quantity),
        location: details.location,
        timestamp: Number(details.timestamp),
        finalPrice: Number(details.finalPrice),
        certificateHash: details.certificateHash,
        transferHistory: details.transferHistory
      })
    } catch (error) {
      console.error('Error loading batch details:', error)
      toast.error('Failed to load batch details')
    }
    setLoading(false)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto mb-4"></div>
          <p className="text-earth-700">Loading batch details...</p>
        </div>
      </div>
    )
  }

  if (!batch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center max-w-md">
          <Package className="h-16 w-16 text-earth-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-earth-900 mb-2">Batch Not Found</h2>
          <p className="text-earth-700 mb-6">The batch you're looking for doesn't exist or hasn't been created yet.</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-earth-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-earth-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link to="/" className="text-earth-600 hover:text-earth-800 mr-4">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-earth-900">Product Traceability</h1>
              <p className="text-earth-600">Batch #{batch.id}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Overview */}
        <div className="card mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-earth-900 mb-2">{batch.productType}</h2>
              <div className="flex items-center text-earth-700 mb-2">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Origin: {batch.location}</span>
              </div>
              <div className="flex items-center text-earth-700">
                <Package className="h-5 w-5 mr-2" />
                <span>Quantity: {batch.quantity} kg</span>
              </div>
            </div>
            {batch.finalPrice > 0 && (
              <div className="text-right">
                <p className="text-2xl font-bold text-forest-600">${(batch.finalPrice / 100).toFixed(2)}</p>
                <p className="text-earth-600">per kg</p>
              </div>
            )}
          </div>

          {batch.certificateHash && (
            <div className="bg-forest-50 border border-forest-200 rounded-lg p-4">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-forest-600 mr-2" />
                <span className="font-medium text-forest-800">Quality Certificate Available</span>
                <button className="ml-auto text-forest-600 hover:text-forest-800 text-sm font-medium">
                  View Certificate
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Supply Chain Journey */}
        <div className="card">
          <h3 className="text-xl font-bold text-earth-900 mb-6">Supply Chain Journey</h3>
          
          <div className="space-y-6">
            {/* Farm Origin */}
            <div className="flex items-start space-x-4">
              <div className="bg-forest-100 rounded-full p-3 flex-shrink-0">
                <User className="h-6 w-6 text-forest-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-earth-900">Farm Origin</h4>
                  <span className="text-sm text-earth-600">
                    {new Date(batch.timestamp * 1000).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-earth-700 mb-1">Farmer: {formatAddress(batch.farmer)}</p>
                <p className="text-earth-700">Location: {batch.location}</p>
                <div className="mt-2">
                  <span className="badge-success">✓ Verified Origin</span>
                </div>
              </div>
            </div>

            {/* Distribution Chain */}
            {batch.transferHistory.length > 1 && (
              <div className="flex items-start space-x-4">
                <div className="bg-sage-100 rounded-full p-3 flex-shrink-0">
                  <Truck className="h-6 w-6 text-sage-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-earth-900 mb-2">Distribution Network</h4>
                  <div className="space-y-2">
                    {batch.transferHistory.slice(1, -1).map((address, index) => (
                      <div key={index} className="flex items-center justify-between bg-earth-50 p-3 rounded-lg">
                        <span className="text-earth-700">Distributor: {formatAddress(address)}</span>
                        <span className="badge-info">Transferred</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Retail */}
            <div className="flex items-start space-x-4">
              <div className="bg-earth-100 rounded-full p-3 flex-shrink-0">
                <Store className="h-6 w-6 text-earth-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-earth-900 mb-2">Retail Point</h4>
                <p className="text-earth-700 mb-2">Retailer: {formatAddress(batch.currentOwner)}</p>
                {batch.finalPrice > 0 && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-forest-600 mr-1" />
                      <span className="text-earth-700">Final Price: ${(batch.finalPrice / 100).toFixed(2)}/kg</span>
                    </div>
                  </div>
                )}
                <div className="mt-2 space-x-2">
                  <span className="badge-success">✓ Quality Assured</span>
                  {batch.certificateHash && (
                    <span className="badge-success">✓ Certified</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blockchain Verification */}
        <div className="card mt-8 bg-gradient-to-r from-forest-50 to-sage-50 border-forest-200">
          <div className="text-center">
            <div className="bg-forest-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">⛓</span>
            </div>
            <h3 className="text-xl font-bold text-earth-900 mb-2">Blockchain Verified</h3>
            <p className="text-earth-700 mb-4">
              This product's journey has been recorded on the blockchain, ensuring complete transparency and authenticity.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-earth-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Immutable Records</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                <span>Verified Transfers</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>Authenticated Parties</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ConsumerTrace