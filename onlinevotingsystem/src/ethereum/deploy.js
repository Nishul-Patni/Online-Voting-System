const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/ElectionFactory.json');

const provider = new HDWalletProvider(
    //mnemonic for unlocking account
    "stool situate marriage opinion girl unknown rifle distance black fatal arch mercy",
    // link to connect to the network
    "https://sepolia.infura.io/v3/7a6d6992b305476cb33202a9a3e8d020"
);

const web3 = new Web3(provider);

const deploy = async () =>{
    accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy from account ", accounts[0]);

    let result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data:'0x'+compiledFactory.bytecode})
    .send({gas:"3000000", from: accounts[0]});
    
    console.log("Contract Deployed to ", result.options.address);
    return
};


deploy();
