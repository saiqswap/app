import {Route, Routes, BrowserRouter as Router} from 'react-router-dom'
import {WalletProvider, SuiTestnetChain, Chain} from '@suiet/wallet-kit'
import '@suiet/wallet-kit/style.css'

import Home from './pages/home';
import About from './pages/about'
import Coinflip from './pages/coinflip';
import Empty from './pages/empty';
import Staking from './pages/staking'
import Header from './components/header';
import SideBar from './components/sidebar';

import './assets/styles.scss'
import { ProgramProvider } from './utils/ProgramProvider';

function App() {
  const customChain : Chain = {
    id: "testnet",
    name: "testnet",
    rpcUrl: "https://testnet.suiet.app/"
  }  

  return (
    <WalletProvider chains={[SuiTestnetChain, customChain]}>
      <ProgramProvider>
        <Header/>
        <SideBar/>
        <Router>
          <Routes>
            <Route path="/" element={<Empty/>}/>
            <Route path="/home" element={<Empty/>}/>
            <Route path="/staking" element={<Staking/>} />
            <Route path="/about" element={<Empty/>} />
            <Route path="/coinflip" element={<Empty/>}/>
          </Routes>
        </Router>
      </ProgramProvider>
    </WalletProvider>
  );
}

export default App;
