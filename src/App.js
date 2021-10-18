import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

const greeterAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
function App() {
  const [greeting, setGreetingValue] = useState('');

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' }).catch(err => console.log('Error: ', err));
  }

  async function getGreeting() {
    if (typeof window.ethereum !== undefined) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      const data = await contract.greet().catch(err => console.log('Error: ', err));
      console.log('data: ', data);
    }
  }

  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting).catch(err => console.log('Error: ', err));
      await transaction.wait().catch(err => console.log('Error: ', err));
      getGreeting();
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <input value={greeting} placeholder='Enter Greeting' onChange={e => setGreetingValue(e.target.value)} />
        <button onClick={getGreeting}>Get Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
      </header>
    </div>
  );
}

export default App;
