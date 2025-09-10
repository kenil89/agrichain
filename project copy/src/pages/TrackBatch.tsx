import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, QrCode, Search } from 'lucide-react'

const TrackBatch = () => {
  const navigate = useNavigate()
  const [batchId, setBatchId] = useState('')
  const [showScanner, setShowScanner] = useState(false)

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (batchId.trim()) {
      navigate(`/trace/${batchId.trim()}`)
    }
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
              <h1 className="text-2xl font-bold text-earth-900">Track Your Product</h1>
              <p className="text-earth-600">Enter batch ID or scan QR code</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card text-center">
          <QrCode className="h-16 w-16 text-forest-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-earth-900 mb-4">Track Product Journey</h2>
          <p className="text-earth-700 mb-8">
            Enter the batch ID or scan the QR code to see the complete supply chain journey of your product.
          </p>

          {/* Manual Entry */}
          <form onSubmit={handleTrack} className="mb-6">
            <div className="flex space-x-3">
              <input
                type="text"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder="Enter Batch ID (e.g., 12345)"
                className="input-field flex-1"
              />
              <button type="submit" className="btn-primary flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Track
              </button>
            </div>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-earth-300"></div>
            <span className="px-4 text-earth-600">or</span>
            <div className="flex-1 border-t border-earth-300"></div>
          </div>

          {/* QR Scanner */}
          <button
            onClick={() => setShowScanner(true)}
            className="btn-secondary w-full flex items-center justify-center"
          >
            <QrCode className="h-5 w-5 mr-2" />
            Scan QR Code
          </button>

          {showScanner && (
            <div className="mt-6 p-4 border-2 border-dashed border-earth-300 rounded-lg">
              <p className="text-earth-600 mb-4">QR Scanner would appear here</p>
              <p className="text-sm text-earth-500">
                In a production environment, this would use the device camera to scan QR codes
              </p>
              <button
                onClick={() => setShowScanner(false)}
                className="btn-secondary mt-4"
              >
                Close Scanner
              </button>
            </div>
          )}
        </div>

        {/* Example Batches */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-earth-900 mb-4">Try These Example Batches:</h3>
          <div className="grid gap-3">
            {[1, 2, 3].map((id) => (
              <button
                key={id}
                onClick={() => navigate(`/trace/${id}`)}
                className="card text-left hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-earth-900">Batch #{id}</p>
                    <p className="text-earth-600 text-sm">Sample organic produce batch</p>
                  </div>
                  <ArrowLeft className="h-5 w-5 text-earth-400 rotate-180" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default TrackBatch