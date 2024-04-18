pragma solidity ^0.4.17;

contract ElectionFactory{

    address [] elections;
    uint count = 0;

    function createElection(string email, string electionName, string description) public returns(address){
        Election newElection = new Election(msg.sender, email, electionName, description);
        elections.push(newElection);
        count++;
        return elections[count-1];
    }

    function getElections() public view returns(address []){
        return elections;
    }

    function getElectionsByIndex(uint index) public view returns(address){
        return elections[index];
    }

}

contract Election{
    struct Candidate{
        string candidateName;
        string description;
        uint votes;
        string email;
        string imgLink;
    }

    address authority;
    string electionName;
    string authorityEmail;
    string description;
    uint status;               // 0 election ended, 1 candidate registration, 2 voting started
    Candidate [] candidates;
    uint8 candidatesCount;
    mapping(string=>bool) voted;
    mapping(string=>bool) voter;
    mapping(string=>string) voterPass;
    mapping(string=>bool) candidateMap;
    uint totalVoters;
    uint totalVotes;

    constructor(address _authority, string _email, string _electionName, string _description) public{
        authority = _authority;
        authorityEmail = _email;
        electionName = _electionName;
        description = _description;
        status = 1;                     // for registration phase
        candidatesCount = 0;
        totalVoters = 0;
        totalVotes = 0;
    }

    modifier owner(){
        require(msg.sender == authority, "Error : Only Election authority have access to this action");
        _;
    }

    modifier isActive(){
        require(status!=0, "Error : Election is ended");
        _;
    }

    function addCandidate(string candidateName, string candidateDescription, string email, string imgLink) public isActive owner{
        // candidates can be added only before the voting stated otherwise not
        // if status == 1 then its registration phase
        require(status==1, "Error : Registration phase is over");
        require(!candidateMap[email], "Error : Candidate email should be unique");
        candidatesCount++;
        Candidate memory c = Candidate({
            candidateName : candidateName,
            description : candidateDescription,
            votes : 0,
            email : email,
            imgLink : imgLink
        });
        candidates.push(c);
        candidateMap[email]=true;
    }

    function addVoter(string email, string password) public isActive owner{
        require(status==1, "Error : Registration Phase is over");
        require(!voter[email], "Error : Voter is Already Registered");
        voter[email] = true;
        voterPass[email] = password;
        totalVoters++;
    }

    function startElection() public owner{
        require(status==1, "Error : Election may have ended");
        status = 2;
    }

    function vote(string email, uint id, string password) public isActive{
        require(status==2, "Error : voting is not started yet or election is ended");
        require(voter[email], "You are not authorised to vote in this eletion");
        require(!voted[email], "You have already voted");
        string storage voterPassword = voterPass[email];
        require( keccak256(abi.encodePacked(voterPassword)) == keccak256(abi.encodePacked(password)), "Wrong password");
        totalVotes++;
        voted[email] = true;
        candidates[id].votes++;
    }

    function endElection() public{
        require(status==2, "Error : Election may have already ended");
        status = 0;
    }

    function pickWinner() public view owner returns(int){
        // winner can be picked after election ends
        require(status==0, "Error : Election is not ended yet");
        uint winner = 0;
        uint maxVotes = 0;
        bool isDraw = false;
        for(uint i=0; i<candidatesCount; i++){
            if(candidates[i].votes>maxVotes){
                winner = i;
                maxVotes = candidates[i].votes;
                isDraw = false;
            }else if(candidates[i].votes!=0 && candidates[i].votes==maxVotes){
                isDraw = true;
            }
        }

        if(isDraw){
            return -1;
        }else{
            return int(winner);
        }
    }

    // getters

    function getAuthority() public view returns(address){
        return authority;
    }

    function getElectionName() public view returns(string){
        return electionName;
    }

    function getDescription() public view returns(string){
        return description;
    }

    function getStatus() public view returns(uint){
        return status;
    }

    function getCandidatesCount() public view returns(uint){
        return candidatesCount;
    }

    function getTotalVoters() public view returns(uint){
        return totalVoters;
    }

    function getAuthorityEmail() public view returns(string){
        return authorityEmail;
    }

    function getElectionDetails() public view returns(address, string, string, string, uint, uint, uint, uint){
        return (authority,
            electionName,
            authorityEmail,
            description,
            status,
            candidatesCount,
            totalVoters,
            totalVotes
        );
    }

    function getCandidate(uint id) public view owner returns(string, string, uint, string, string){
        Candidate storage c = candidates[id];
        return (c.candidateName, c.description, c.votes, c.email, c.imgLink);
    }

    function getCandidateNotOwner(uint id) public view returns(string, string, string, string){
        Candidate storage c = candidates[id];
        return (c.candidateName, c.description, c.email, c.imgLink);
    }

    function getCandidateElectionEnd(uint id) public view returns(string, string, uint, string, string){
        require(status==0, "Error : Election are not over yet");
        Candidate storage c = candidates[id];
        return (c.candidateName, c.description, c.votes, c.email, c.imgLink);
    }

    function isVoter(string email) public view returns(bool){
        return voter[email];
    }

    function hasVoted(string email) public view returns(bool){
        return voted[email];
    }
}