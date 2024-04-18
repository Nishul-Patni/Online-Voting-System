import Web3 from 'web3';

let web3;

async function initWeb3() {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({method : "eth_requestAccounts"});
        web3 = new Web3(window.ethereum);
    } else {
        const provider = new Web3.providers.HttpProvider(
            "https://sepolia.infura.io/v3/7a6d6992b305476cb33202a9a3e8d020"
        );
        web3 = new Web3(provider);
    }
}

async function main() {
    await initWeb3();
    return web3;
}

export default main;
