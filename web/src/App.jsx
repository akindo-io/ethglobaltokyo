import * as React from 'react'

// Import the extendTheme function
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { extendTheme } from "@chakra-ui/react";

/// Import pages
import Home from './pages/Home.jsx';
import CreateHackathon from './pages/CreateHackathon.jsx';
import SubmitProduct from './pages/SubmitProduct.jsx';
import Voting from './pages/Voting.jsx';
import ProductList from './pages/ProductList.jsx';
import Header from './components/Header.jsx';
import HackathonList from './pages/HackathonList.jsx';
import HackathonDetail from './pages/HackathonDetail.jsx';

/// Import RainbowKit
import '@rainbow-me/rainbowkit/styles.css';
import {
    getDefaultWallets,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, goerli, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
    [mainnet, goerli, polygon, polygonMumbai],
    [
        publicProvider()
    ]
);

const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    chains
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
})

export const theme = extendTheme({
    styles: {
        global: {
            body: {
                backgroundColor: '#0095D9',
            },
        }
    }
});



function App() {
    // 2. Wrap ChakraProvider at the root of your app
    return (
        <BrowserRouter>
            <ChakraProvider
                theme={theme}
            >
                <WagmiConfig client={wagmiClient}>
                    <RainbowKitProvider chains={chains}>

                        <Header />
                        <Routes>
                            <Route path="/" element={<HackathonList />} />
                            <Route path="/hackathons/create" element={<CreateHackathon />} />
                            <Route path="/submit" element={<SubmitProduct />} />
                            <Route path="/vote" element={<Voting />} />
                            <Route path="/hackathons" element={<HackathonList />} />
                            <Route path="/hackathons/:hackathonId" element={<HackathonDetail />} />
                            <Route path="/products" element={<ProductList />} />
                            <Route path="*" element={<h1>404</h1>} />
                        </Routes>
                    </RainbowKitProvider>
                </WagmiConfig>
            </ChakraProvider>
        </BrowserRouter>
    )
}

export default App