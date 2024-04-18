import ElectionFactory from './build/ElectionFactory.json';
import main from './web3';

async function getInstance() {
  const web3 = await main(); // Get the web3 instance from the main() function
  const instance = new web3.eth.Contract(
    JSON.parse(ElectionFactory.interface),
    "0xD34597eF0f1fCefA3a471DF366caA4b05903f67d"
  );
  return { web3, instance }; // Return an object containing both the web3 instance and contract instance
}

export default getInstance;
