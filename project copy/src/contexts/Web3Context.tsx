
// declare global {
//   interface Window {
//     ethereum?: any
//   }
// }

// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
// import { ethers } from 'ethers'
// import toast from 'react-hot-toast'

// interface Web3ContextType {
//   account: string | null
//   provider: ethers.BrowserProvider | null
//   signer: ethers.Signer | null
//   contract: ethers.Contract | null
//   connectWallet: () => Promise<void>
//   isConnected: boolean
// }

// const Web3Context = createContext<Web3ContextType | undefined>(undefined)

// // Contract ABI (simplified for demo)
// const CONTRACT_ABI = [
//   "function createBatch(string memory productType, uint256 quantity, string memory location) external returns (uint256)",
//   "function transferBatch(uint256 batchId, address to, string memory otp) external",
//   "function addFinalPrice(uint256 batchId, uint256 price) external",
//   "function uploadCertificateHash(uint256 batchId, string memory ipfsHash) external",
//   "function getBatchDetails(uint256 batchId) external view returns (tuple(uint256 id, address farmer, address currentOwner, string productType, uint256 quantity, string location, uint256 timestamp, uint256 finalPrice, string certificateHash, address[] transferHistory))",
//   "function getBatchesByOwner(address owner) external view returns (uint256[])",
//   "event BatchCreated(uint256 indexed batchId, address indexed farmer, string productType)",
//   "event BatchTransferred(uint256 indexed batchId, address indexed from, address indexed to)",
//   "event FinalPriceAdded(uint256 indexed batchId, uint256 price)",
//   "event CertificateUploaded(uint256 indexed batchId, string ipfsHash)"
// ]

// // const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3" // Hardhat local network
// const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"


// interface Web3ProviderProps {
//   children: ReactNode
// }

// export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
//   const [account, setAccount] = useState<string | null>(null)
//   const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
//   const [signer, setSigner] = useState<ethers.Signer | null>(null)
//   const [contract, setContract] = useState<ethers.Contract | null>(null)

//   const connectWallet = async () => {
//     try {
//       if (typeof window.ethereum !== 'undefined') {
//         const provider = new ethers.BrowserProvider(window.ethereum)
//         await provider.send("eth_requestAccounts", [])
        
//         const signer = await provider.getSigner()
//         const address = await signer.getAddress()
        
//         const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
        
//         setProvider(provider)
//         setSigner(signer)
//         setAccount(address)
//         setContract(contract)
        
//         toast.success('Wallet connected successfully!')
//       } else {
//         toast.error('Please install MetaMask!')
//       }
//     } catch (error) {
//       console.error('Error connecting wallet:', error)
//       toast.error('Failed to connect wallet')
//     }
//   }

//   useEffect(() => {
//     // Auto-connect if previously connected
//     if (typeof window.ethereum !== 'undefined') {
//       window.ethereum.request({ method: 'eth_accounts' })
//         .then((accounts: string[]) => {
//           if (accounts.length > 0) {
//             connectWallet()
//           }
//         })
//     }
//   }, [])

//   const value = {
//     account,
//     provider,
//     signer,
//     contract,
//     connectWallet,
//     isConnected: !!account
//   }

//   return (
//     <Web3Context.Provider value={value}>
//       {children}
//     </Web3Context.Provider>
//   )
// }

// export const useWeb3 = () => {
//   const context = useContext(Web3Context)
//   if (context === undefined) {
//     throw new Error('useWeb3 must be used within a Web3Provider')
//   }
//   return context
// }
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'

// Fix TypeScript error for window.ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

// TypeScript context type
interface Web3ContextType {
  account: string | null
  provider: ethers.BrowserProvider | null
  signer: ethers.Signer | null
  contract: ethers.Contract | null
  connectWallet: () => Promise<void>
  isConnected: boolean
}

// Create context
const Web3Context = createContext<Web3ContextType | undefined>(undefined)

// Contract ABI & address
const CONTRACT_ABI = [
  "function createFarmerStock(string memory stockId, string memory name, uint256 qty, uint256 price) public",
  "function distributorBuy(string memory parentId, string memory newStockId, uint256 qty) public",
  "function sellStock(string memory parentId, string memory newStockId, uint256 qty, uint256 newPrice, address buyer) public",
  "function getStockHistory(string memory stockId) public view returns (string[] memory, uint256[] memory, uint256[] memory)"
]
// const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" // Hardhat deployed address
// const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const CONTRACT_ADDRESS = "0x2d06Aa797B410e113DA4C7b0F6EDE083d68aCa66";
// 0x2d06Aa797B410e113DA4C7b0F6EDE083d68aCa66


// Provider component
interface Web3ProviderProps {
  children: ReactNode
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum)
        await provider.send("eth_requestAccounts", [])

        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

        setProvider(provider)
        setSigner(signer)
        setAccount(address)
        setContract(contract)

        toast.success('Wallet connected successfully!')
      } else {
        toast.error('Please install MetaMask!')
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet')
    }
  }

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            connectWallet()
          }
        })
    }
  }, [])

  const value = {
    account,
    provider,
    signer,
    contract,
    connectWallet,
    isConnected: !!account
  }

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  )
}

// Custom hook
export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}
