// this file is to create the abis so we dont have to compile the contract everytime

const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// creating path for build directory
const buildPath = path.resolve(__dirname, 'build');
// making sure that the build directory should be new one by deleting the exsisting if it exsist
fs.removeSync(buildPath);

// compiling the contract
const campaignPath = path.resolve(__dirname,'contracts', 'Election.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts;

// console.log(output);

// creating the directory
fs.ensureDirSync(buildPath);


// remove ':' from the file name otherwise it will give error
// creating saprate file for each contract and adding it compiled contract in it
for(let contract in output){
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '')+'.json'),
        output[contract]
    );
} 