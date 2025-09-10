import React from 'react'
import { Link } from 'react-router-dom'
import { Sprout, Truck, Store, QrCode, Shield, Users, ArrowRight } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-earth-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Sprout className="h-8 w-8 text-forest-600" />
              <h1 className="text-2xl font-bold text-earth-900">FarmChain</h1>
            </div>
            <Link to="/track" className="btn-secondary">
              <QrCode className="h-5 w-5 mr-2" />
              Track Batch
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-forest-50 to-sage-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-earth-900 mb-6">
              Transparent Supply Chain
              <span className="block text-forest-600">From Farm to Table</span>
            </h2>
            <p className="text-xl text-earth-700 mb-12 max-w-3xl mx-auto">
              Track your produce journey with blockchain technology. 
              Ensuring quality, authenticity, and trust at every step.
            </p>
            
            {/* Role Selection Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Link to="/farmer" className="card hover:shadow-lg transition-shadow duration-300 group">
                <Sprout className="h-16 w-16 text-forest-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-2xl font-semibold text-earth-900 mb-3">Farmer</h3>
                <p className="text-earth-700 mb-6">Create and manage your produce batches</p>
                <div className="btn-primary w-full flex items-center justify-center">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              </Link>

              <Link to="/distributor" className="card hover:shadow-lg transition-shadow duration-300 group">
                <Truck className="h-16 w-16 text-sage-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-2xl font-semibold text-earth-900 mb-3">Distributor</h3>
                <p className="text-earth-700 mb-6">Manage and transfer product batches</p>
                <div className="btn-primary w-full flex items-center justify-center">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              </Link>

              <Link to="/retailer" className="card hover:shadow-lg transition-shadow duration-300 group">
                <Store className="h-16 w-16 text-earth-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-2xl font-semibold text-earth-900 mb-3">Retailer</h3>
                <p className="text-earth-700 mb-6">Accept batches and add final pricing</p>
                <div className="btn-primary w-full flex items-center justify-center">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-earth-900 mb-4">How It Works</h3>
            <p className="text-xl text-earth-700">Simple, transparent, and secure supply chain tracking</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-forest-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Sprout className="h-12 w-12 text-forest-600" />
              </div>
              <h4 className="text-xl font-semibold text-earth-900 mb-3">1. Farm Creation</h4>
              <p className="text-earth-700">Farmers create batches with product details and generate QR codes</p>
            </div>

            <div className="text-center">
              <div className="bg-sage-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Truck className="h-12 w-12 text-sage-600" />
              </div>
              <h4 className="text-xl font-semibold text-earth-900 mb-3">2. Distribution</h4>
              <p className="text-earth-700">Secure transfer to distributors using QR codes and OTP verification</p>
            </div>

            <div className="text-center">
              <div className="bg-earth-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Store className="h-12 w-12 text-earth-600" />
              </div>
              <h4 className="text-xl font-semibold text-earth-900 mb-3">3. Retail</h4>
              <p className="text-earth-700">Retailers add final pricing and quality certificates</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-earth-900 mb-3">4. Consumer</h4>
              <p className="text-earth-700">Complete traceability from farm origin to final purchase</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-earth-900 mb-4">Why Choose FarmChain?</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <Shield className="h-12 w-12 text-forest-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-earth-900 mb-3">Blockchain Security</h4>
              <p className="text-earth-700">Immutable records ensure data integrity and prevent fraud</p>
            </div>

            <div className="card text-center">
              <QrCode className="h-12 w-12 text-sage-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-earth-900 mb-3">QR Code Tracking</h4>
              <p className="text-earth-700">Easy scanning and verification at every step</p>
            </div>

            <div className="card text-center">
              <Users className="h-12 w-12 text-earth-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-earth-900 mb-3">Multi-Stakeholder</h4>
              <p className="text-earth-700">Designed for farmers, distributors, retailers, and consumers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-earth-900 text-earth-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Sprout className="h-8 w-8 text-forest-400" />
              <h4 className="text-2xl font-bold">FarmChain</h4>
            </div>
            <p className="text-earth-300">Transparent supply chain tracking with blockchain technology</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage