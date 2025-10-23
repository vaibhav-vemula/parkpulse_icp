import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";

persistent actor CommunityVoting {
  type ProposalId = Nat64;
  type Address = Text;

  type ProposalStatus = {
    #Active;
    #Accepted;
    #Declined;
  };

  type EnvironmentalData = {
    ndviBefore: Float;
    ndviAfter: Float;
    pm25Before: Float;
    pm25After: Float;
    pm25IncreasePercent: Float;
    vegetationLossPercent: Float;
  };

  type Demographics = {
    children: Nat64;
    adults: Nat64;
    seniors: Nat64;
    totalAffectedPopulation: Nat64;
  };

  type Proposal = {
    id: ProposalId;
    parkName: Text;
    parkId: Text;
    description: Text;
    endDate: Int;
    status: ProposalStatus;
    yesVotes: Nat64;
    noVotes: Nat64;
    environmentalData: EnvironmentalData;
    demographics: Demographics;
    creator: Address;
  };

  func hashNat64(n: Nat64) : Hash.Hash {
    var hash : Nat32 = 0;
    var remaining = n;
    var shift : Nat64 = 0;
    while (remaining > 0) {
      let byte = Nat64.toNat32(remaining & 0xFF);
      hash := hash ^ (byte << Nat32.fromNat(Nat64.toNat(shift % 32)));
      remaining := remaining >> 8;
      shift += 8;
    };
    hash
  };

  var proposalsEntries : [(ProposalId, Proposal)] = [];
  var userVotesEntries : [(ProposalId, [(Address, Bool)])] = [];
  var hasVotedEntries : [(ProposalId, [(Address, Bool)])] = [];
  var proposalCounter: Nat64 = 0;

  transient var proposals = HashMap.HashMap<ProposalId, Proposal>(10, Nat64.equal, hashNat64);
  transient var userVotes = HashMap.HashMap<ProposalId, HashMap.HashMap<Address, Bool>>(10, Nat64.equal, hashNat64);
  transient var hasVoted = HashMap.HashMap<ProposalId, HashMap.HashMap<Address, Bool>>(10, Nat64.equal, hashNat64);

  system func preupgrade() {
    proposalsEntries := Iter.toArray(proposals.entries());

    let userVotesBuffer = Buffer.Buffer<(ProposalId, [(Address, Bool)])>(userVotes.size());
    for ((proposalId, votesMap) in userVotes.entries()) {
      userVotesBuffer.add((proposalId, Iter.toArray(votesMap.entries())));
    };
    userVotesEntries := Buffer.toArray(userVotesBuffer);

    let hasVotedBuffer = Buffer.Buffer<(ProposalId, [(Address, Bool)])>(hasVoted.size());
    for ((proposalId, votedMap) in hasVoted.entries()) {
      hasVotedBuffer.add((proposalId, Iter.toArray(votedMap.entries())));
    };
    hasVotedEntries := Buffer.toArray(hasVotedBuffer);
  };

  system func postupgrade() {
    proposals := HashMap.fromIter<ProposalId, Proposal>(proposalsEntries.vals(), 10, Nat64.equal, hashNat64);
    proposalsEntries := [];

    userVotes := HashMap.HashMap<ProposalId, HashMap.HashMap<Address, Bool>>(10, Nat64.equal, hashNat64);
    for ((proposalId, votes) in userVotesEntries.vals()) {
      let votesMap = HashMap.fromIter<Address, Bool>(votes.vals(), 10, Text.equal, Text.hash);
      userVotes.put(proposalId, votesMap);
    };
    userVotesEntries := [];

    hasVoted := HashMap.HashMap<ProposalId, HashMap.HashMap<Address, Bool>>(10, Nat64.equal, hashNat64);
    for ((proposalId, voted) in hasVotedEntries.vals()) {
      let votedMap = HashMap.fromIter<Address, Bool>(voted.vals(), 10, Text.equal, Text.hash);
      hasVoted.put(proposalId, votedMap);
    };
    hasVotedEntries := [];
  };

  public func createProposal(
    parkName: Text,
    parkId: Text,
    description: Text,
    endDate: Int,
    environmentalData: EnvironmentalData,
    demographics: Demographics,
    creator: Address
  ) : async ProposalId {

    assert(Text.size(parkName) > 0);
    assert(Text.size(parkId) > 0);
    assert(endDate > Time.now());

    proposalCounter += 1;
    let proposalId = proposalCounter;

    let proposal : Proposal = {
      id = proposalId;
      parkName = parkName;
      parkId = parkId;
      description = description;
      endDate = endDate;
      status = #Active;
      yesVotes = 0;
      noVotes = 0;
      environmentalData = environmentalData;
      demographics = demographics;
      creator = creator;
    };

    proposals.put(proposalId, proposal);
    userVotes.put(proposalId, HashMap.HashMap<Address, Bool>(10, Text.equal, Text.hash));
    hasVoted.put(proposalId, HashMap.HashMap<Address, Bool>(10, Text.equal, Text.hash));

    proposalId
  };

  public func vote(proposalId: ProposalId, voteChoice: Bool, voter: Address) : async Bool {
    switch (proposals.get(proposalId)) {
      case null { return false; };
      case (?proposal) {
        switch (hasVoted.get(proposalId)) {
          case null { return false; };
          case (?votedMap) {
            switch (votedMap.get(voter)) {
              case (?true) { return false; };
              case _ {
                let currentTime = Time.now();
                if (proposal.status != #Active or currentTime > proposal.endDate) {
                  return false;
                };

                switch (userVotes.get(proposalId)) {
                  case null { return false; };
                  case (?votes) {
                    votes.put(voter, voteChoice);
                  };
                };

                votedMap.put(voter, true);

                let updatedProposal : Proposal = {
                  id = proposal.id;
                  parkName = proposal.parkName;
                  parkId = proposal.parkId;
                  description = proposal.description;
                  endDate = proposal.endDate;
                  status = proposal.status;
                  yesVotes = if (voteChoice) { proposal.yesVotes + 1 } else { proposal.yesVotes };
                  noVotes = if (voteChoice) { proposal.noVotes } else { proposal.noVotes + 1 };
                  environmentalData = proposal.environmentalData;
                  demographics = proposal.demographics;
                  creator = proposal.creator;
                };

                proposals.put(proposalId, updatedProposal);
                return true;
              };
            };
          };
        };
      };
    };
  };

  public query func getProposal(proposalId: ProposalId) : async ?Proposal {
    proposals.get(proposalId)
  };

  public query func getVoteCounts(proposalId: ProposalId) : async ?{yesVotes: Nat64; noVotes: Nat64} {
    switch (proposals.get(proposalId)) {
      case null { null };
      case (?proposal) {
        ?{
          yesVotes = proposal.yesVotes;
          noVotes = proposal.noVotes;
        }
      };
    };
  };

  public query func hasUserVoted(proposalId: ProposalId, user: Address) : async Bool {
    switch (hasVoted.get(proposalId)) {
      case null { false };
      case (?votedMap) {
        switch (votedMap.get(user)) {
          case null { false };
          case (?voted) { voted };
        };
      };
    };
  };

  public query func getUserVote(proposalId: ProposalId, user: Address) : async ?Bool {
    switch (userVotes.get(proposalId)) {
      case null { null };
      case (?votes) { votes.get(user) };
    };
  };

  public query func isProposalActive(proposalId: ProposalId) : async Bool {
    switch (proposals.get(proposalId)) {
      case null { false };
      case (?proposal) {
        let currentTime = Time.now();
        proposal.status == #Active and currentTime <= proposal.endDate
      };
    };
  };

  public query func getAllActiveProposals() : async [ProposalId] {
    let activeProposals = Buffer.Buffer<ProposalId>(0);

    for ((id, proposal) in proposals.entries()) {
      if (proposal.status == #Active) {
        activeProposals.add(id);
      };
    };

    Buffer.toArray(activeProposals)
  };

  public query func getAllClosedProposals() : async [ProposalId] {
    let closedProposals = Buffer.Buffer<ProposalId>(0);

    for ((id, proposal) in proposals.entries()) {
      switch (proposal.status) {
        case (#Accepted or #Declined) {
          closedProposals.add(id);
        };
        case _ {};
      };
    };

    Buffer.toArray(closedProposals)
  };

  public query func getTotalProposals() : async Nat64 {
    proposalCounter
  };
  
  public func updateProposalStatus(proposalId: ProposalId) : async Bool {
    switch (proposals.get(proposalId)) {
      case null { false };
      case (?proposal) {
        let currentTime = Time.now();

        if (currentTime <= proposal.endDate or proposal.status != #Active) {
          return false;
        };

        let newStatus = if (proposal.yesVotes > proposal.noVotes) {
          #Accepted
        } else {
          #Declined
        };

        let updatedProposal : Proposal = {
          id = proposal.id;
          parkName = proposal.parkName;
          parkId = proposal.parkId;
          description = proposal.description;
          endDate = proposal.endDate;
          status = newStatus;
          yesVotes = proposal.yesVotes;
          noVotes = proposal.noVotes;
          environmentalData = proposal.environmentalData;
          demographics = proposal.demographics;
          creator = proposal.creator;
        };

        proposals.put(proposalId, updatedProposal);
        true
      };
    };
  };
};
