import {Route, Routes, BrowserRouter as Router} from 'react-router-dom'
import {WalletProvider, SuiMainnetChain, SuiTestnetChain, Chain} from '@suiet/wallet-kit'
import '@suiet/wallet-kit/style.css'

import Home from './pages/home';
import About from './pages/about'
import Coinflip from './pages/coinflip';
import DiceGame from './pages/dice';
import Staking from './pages/staking'
import Header from './components/header';
import SideBar from './components/sidebar';
import Empty from './pages/empty';

import './assets/styles.scss'
import { ProgramProvider } from './utils/ProgramProvider';
import { DatabaseProvider } from './utils/DatabaseProvider';

function App() {
  const suietChain : Chain = {
    id: "testnet",
    name: "testnet",
    rpcUrl: "https://testnet.suiet.app/"
  }  

  const brightChain : Chain = {
    id: "testnet",
    name: "testnet",
    rpcUrl: "https://sui.testnet.brightlystake.com"
  }

  return (
      <WalletProvider chains={[SuiTestnetChain]} autoConnect={true}>
        <ProgramProvider>
          <Header/>
          <SideBar/>
          <DatabaseProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/staking" element={<Staking/>} />
                <Route path="/coinflip" element={<Coinflip/>}/>
                <Route path="/dice" element={<DiceGame/>}/>
                <Route path="/tower" element={<Empty/>}/>
                <Route path="/roulette" element={<Empty/>}/>
                <Route path="/about" element={<Empty/>} />
              </Routes>
            </Router>
          </DatabaseProvider>
        </ProgramProvider>
      </WalletProvider>
  );
}

export default App;
