import {Route, Routes, BrowserRouter as Router} from 'react-router-dom'
import {WalletProvider} from '@suiet/wallet-kit'
import '@suiet/wallet-kit/style.css'

import Home from './pages/home';
import About from './pages/about'
import Staking from './pages/staking'
import Header from './components/header';
import SideBar from './components/sidebar';

import './assets/styles.scss'
import { ProgramProvider } from './utils/ProgramProvider';

function App() {
  return (
    <WalletProvider>
      <ProgramProvider>
        <Header/>
        <SideBar/>
        <Router>
          <Routes>
            <Route path="/" element={<Staking/>} />
            <Route path="/about" element={<About/>} />
          </Routes>
        </Router>
      </ProgramProvider>
    </WalletProvider>
  );
}

export default App;
