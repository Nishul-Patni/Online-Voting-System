import main from "./web3";
import Election from './build/Election.json';

export default async (address)=>{
    const web3 = await main();
    const instance = new web3.eth.Contract(
        JSON.parse(Election.interface),
        address
    );
    return instance;
}