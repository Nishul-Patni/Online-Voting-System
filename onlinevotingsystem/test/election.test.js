const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const compiledFactory = require('../src/ethereum/build/ElectionFactory.json');
const compiledElection = require('../src/ethereum/build/Election.json');

let accounts;
let factory;
let electionAddress;
let Election;

beforeEach(async ()=>{
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data : compiledFactory.bytecode})
    .send({from : accounts[0], gas : '3000000'});

    let response = await factory.methods.createElection('authority@gov.in', 'test election', 'this is a test election')
    .send({from : accounts[0], gas : '3000000'});
    console.log(response);

    let addresses = await factory.methods.getElections().call();
    let election = addresses[0];
    Election = new web3.eth.Contract(JSON.parse(compiledElection.interface), election);
});

describe('elections', ()=>{

    it('deploys factory and an eletion', async ()=>{
        assert.ok(factory.options.address);
        assert.ok(Election.options.address);
    });

    it('authority check', async ()=>{
        let electionDetails = await Election.methods.getElectionDetails().call();
        let authEmail = await Election.methods.getAuthorityEmail().call();
        assert(electionDetails['0']==accounts[0]);
    })


});

describe('Registration Phase', ()=>{
    it('is a registration phase', async ()=>{
        let status = await Election.methods.getStatus().call();
        assert(status==1);
    });
    
    it('can add candidates', async ()=>{
        await Election.methods.addCandidate('c1', 'this is first candidate', 'c1@candidate.com', "this is an img link")
        .send({from:accounts[0], gas:'2000000'});

        const c1 = await Election.methods.getCandidate(0).call();
        assert(c1['0'] == 'c1');
        assert(c1['3'] == 'c1@candidate.com');

        await Election.methods.addCandidate('c2', 'this is second candidate', 'c2@candidate.com', "this is an img link")
        .send({from:accounts[0], gas:'2000000'});

        const c2 = await Election.methods.getCandidate(1).call();
        assert(c2['0'] == 'c2');
        assert(c2['3'] == 'c2@candidate.com');

        const candidates = await Election.methods.getCandidatesCount().call();
        // console.log(candidates);
        assert(candidates==2);
    });

    it('only authority can add a candidate', async ()=>{
        try{
            let res = await Election.methods.getElectionDetails().call();
            console.log(res);
            await Election.methods.addCandidate('c1', 'this is first candidate', 'c1@candidate.com', "this is an img link")
            .send({from:accounts[1], gas:'2000000'});
            assert(false);
        }catch(err){
            assert(true);
        }
    })

    it('can add voters', async ()=>{
        await Election.methods.addVoter('v1@voter.com', "abcd")
        .send({from : accounts[0]});
        const v1 = await Election.methods.isVoter('v1@voter.com').call();
        assert(v1);

        await Election.methods.addVoter('v2@voter.com', "abcd")
        .send({from : accounts[0]});
        const v2 = await Election.methods.isVoter('v2@voter.com').call();
        assert(v2);

        const notVoter = await Election.methods.isVoter('v3@notVoter.com').call();
        assert(!notVoter)

        const totalVoters = await Election.methods.getTotalVoters().call();
        // console.log(totalVoters);
        assert(totalVoters==2);
    });

    it('only authority can add a voters', async ()=>{
        try{
            await Election.methods.addVoter('v1@voter.com', "abcd")
            .send({from : accounts[1]});
            assert(false);
        }catch(err){
            assert(true)
        }
    })

    it('authority can start the election', async ()=>{
        try{
            await Election.methods.startElection().send({from : accounts[0]})
            assert(true);
        }catch(err){
            assert(false);
        }
    });

    it('only authority can start the election', async ()=>{
        try{
            await Election.methods.startElection().send({from : accounts[1]})
            assert(false);
        }catch(err){
            assert(true);
        }
    });

    it('cant add candidates after starting elections', async ()=>{
        await Election.methods.startElection().send({from : accounts[0]});
        try{
            await Election.methods.addCandidate('c1', 'this is first candidate', 'c1@candidate.com', "this is an img link")
            .send({from:accounts[0], gas:'2000000'});
            assert(false);
        }catch(err){
            assert(true);
        }
    });

    it('cant add voters after starting elections', async ()=>{
        await Election.methods.startElection().send({from : accounts[0]});
        try{
            await Election.methods.addVoter('v1@voter.com', "abcd")
            .send({from : accounts[0]});
            assert(false);
        }catch(err){
            assert(true);
        }
    });

    it('can vote', async ()=>{
        await Election.methods.addCandidate('c1', 'this is first candidate', 'c1@candidate.com', "this is an img link")
        .send({from:accounts[0], gas:'2000000'});
        await Election.methods.addVoter('v1@voter.com', "abcd")
        .send({from : accounts[0]});

        await Election.methods.startElection().send({from : accounts[0]});
        // voting from c1 from v1
        await Election.methods.vote('v1@voter.com', 0, "abcd").send({from : accounts[0], gas:'2000000'});
        let c1 = await Election.methods.getCandidate(0).call();
        assert(c1['2']==1);
    });
});