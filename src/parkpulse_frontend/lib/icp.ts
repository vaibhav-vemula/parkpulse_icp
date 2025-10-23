import { Actor, HttpAgent } from '@dfinity/agent';
import { getIdentity } from './auth';

interface CommunityVoting {
  createProposal: (
    parkName: string,
    parkId: string,
    description: string,
    endDate: bigint,
    environmentalData: EnvironmentalData,
    demographics: Demographics,
    creator: string
  ) => Promise<bigint>;

  vote: (
    proposalId: bigint,
    voteChoice: boolean,
    voter: string
  ) => Promise<boolean>;

  getProposal: (proposalId: bigint) => Promise<[Proposal] | []>;
  hasUserVoted: (proposalId: bigint, user: string) => Promise<boolean>;
  getAllActiveProposals: () => Promise<bigint[]>;
  getTotalProposals: () => Promise<bigint>;
}

interface EnvironmentalData {
  ndviBefore: number;
  ndviAfter: number;
  pm25Before: number;
  pm25After: number;
  pm25IncreasePercent: number;
  vegetationLossPercent: number;
}

interface Demographics {
  children: bigint;
  adults: bigint;
  seniors: bigint;
  totalAffectedPopulation: bigint;
}

interface Proposal {
  id: bigint;
  parkName: string;
  parkId: string;
  description: string;
  endDate: bigint;
  status: { Active: null } | { Accepted: null } | { Declined: null };
  yesVotes: bigint;
  noVotes: bigint;
  environmentalData: EnvironmentalData;
  demographics: Demographics;
  creator: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const idlFactory = ({ IDL }: { IDL: any }) => {
  const EnvironmentalData = IDL.Record({
    ndviBefore: IDL.Float64,
    ndviAfter: IDL.Float64,
    pm25Before: IDL.Float64,
    pm25After: IDL.Float64,
    pm25IncreasePercent: IDL.Float64,
    vegetationLossPercent: IDL.Float64,
  });

  const Demographics = IDL.Record({
    children: IDL.Nat64,
    adults: IDL.Nat64,
    seniors: IDL.Nat64,
    totalAffectedPopulation: IDL.Nat64,
  });

  const ProposalStatus = IDL.Variant({
    Active: IDL.Null,
    Accepted: IDL.Null,
    Declined: IDL.Null,
  });

  const Proposal = IDL.Record({
    id: IDL.Nat64,
    parkName: IDL.Text,
    parkId: IDL.Text,
    description: IDL.Text,
    endDate: IDL.Int,
    status: ProposalStatus,
    yesVotes: IDL.Nat64,
    noVotes: IDL.Nat64,
    environmentalData: EnvironmentalData,
    demographics: Demographics,
    creator: IDL.Text,
  });

  return IDL.Service({
    createProposal: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Int, EnvironmentalData, Demographics, IDL.Text],
      [IDL.Nat64],
      []
    ),
    vote: IDL.Func([IDL.Nat64, IDL.Bool, IDL.Text], [IDL.Bool], []),
    getProposal: IDL.Func([IDL.Nat64], [IDL.Opt(Proposal)], ['query']),
    hasUserVoted: IDL.Func([IDL.Nat64, IDL.Text], [IDL.Bool], ['query']),
    getUserVote: IDL.Func([IDL.Nat64, IDL.Text], [IDL.Opt(IDL.Bool)], ['query']),
    isProposalActive: IDL.Func([IDL.Nat64], [IDL.Bool], ['query']),
    getAllActiveProposals: IDL.Func([], [IDL.Vec(IDL.Nat64)], ['query']),
    getAllClosedProposals: IDL.Func([], [IDL.Vec(IDL.Nat64)], ['query']),
    getTotalProposals: IDL.Func([], [IDL.Nat64], ['query']),
    updateProposalStatus: IDL.Func([IDL.Nat64], [IDL.Bool], []),
  });
};

export async function getCanisterActor(): Promise<CommunityVoting> {
  const canisterId = process.env.NEXT_PUBLIC_ICP_CANISTER_ID || '';
  const host = process.env.NEXT_PUBLIC_ICP_HOST || 'http://127.0.0.1:4943';

  console.log('ICP Config:', {
    canisterId,
    host,
    network: process.env.NEXT_PUBLIC_ICP_NETWORK,
  });

  const identity = await getIdentity();

  const agent = new HttpAgent({
    host,
    identity,
    verifyQuerySignatures: false,
  });

  const isLocal = process.env.NEXT_PUBLIC_ICP_NETWORK === 'local';
  const isLocalHost = host.includes('localhost') || host.includes('127.0.0.1');

  console.log('Should fetch root key?', { isLocal, isLocalHost });

  if (isLocal || isLocalHost) {
    try {
      await agent.fetchRootKey();
      console.log('✅ Root key fetched successfully for local development');
    } catch (error) {
      console.error('❌ Failed to fetch root key:', error);
    }
  }

  const actor = Actor.createActor<CommunityVoting>(idlFactory, {
    agent,
    canisterId,
  });

  return actor;
}

export async function voteOnProposal(proposalId: number, vote: boolean): Promise<string> {
  try {
    const actor = await getCanisterActor();
    const { getPrincipal } = await import('./auth');
    const voter = await getPrincipal();

    const result = await actor.vote(
      BigInt(proposalId),
      vote,
      voter
    );

    if (result) {
      return 'success';
    } else {
      throw new Error('Vote failed');
    }
  } catch (error) {
    console.error('Error voting on proposal:', error);
    throw error;
  }
}

export async function hasUserVoted(proposalId: number): Promise<boolean> {
  try {
    const actor = await getCanisterActor();
    const { getPrincipal } = await import('./auth');
    const userPrincipal = await getPrincipal();

    return await actor.hasUserVoted(BigInt(proposalId), userPrincipal);
  } catch (error) {
    console.error('Error checking vote status:', error);
    return false;
  }
}

export async function getAllProposals() {
  try {
    const actor = await getCanisterActor();
    const totalProposals = await actor.getTotalProposals();

    const proposals = [];

    for (let i = BigInt(1); i <= totalProposals; i++) {
      const proposalOpt = await actor.getProposal(i);
      if (proposalOpt.length > 0) {
        const proposal = proposalOpt[0];

        if (proposal) {
          proposals.push({
            id: Number(proposal.id),
            parkName: proposal.parkName,
            parkId: proposal.parkId,
            description: proposal.description,
            status: getProposalStatus(proposal.status),
            yesVotes: Number(proposal.yesVotes),
            noVotes: Number(proposal.noVotes),
            totalVotes: Number(proposal.yesVotes) + Number(proposal.noVotes),
            endDate: Number(proposal.endDate) / 1_000_000_000,
            creator: proposal.creator,
            environmentalData: proposal.environmentalData,
            demographics: {
              children: Number(proposal.demographics.children),
              adults: Number(proposal.demographics.adults),
              seniors: Number(proposal.demographics.seniors),
              totalAffectedPopulation: Number(proposal.demographics.totalAffectedPopulation),
            },
          });
        }
      }
    }

    return proposals;
  } catch (error) {
    console.error('Error fetching proposals from ICP:', error);
    throw error;
  }
}

export async function getProposalById(proposalId: number) {
  try {
    const actor = await getCanisterActor();
    const proposalOpt = await actor.getProposal(BigInt(proposalId));

    if (proposalOpt.length === 0) {
      return null;
    }

    const proposal = proposalOpt[0];

    return {
      id: Number(proposal.id),
      parkName: proposal.parkName,
      parkId: proposal.parkId,
      description: proposal.description,
      status: getProposalStatus(proposal.status),
      yesVotes: Number(proposal.yesVotes),
      noVotes: Number(proposal.noVotes),
      totalVotes: Number(proposal.yesVotes) + Number(proposal.noVotes),
      endDate: Number(proposal.endDate) / 1_000_000_000, // Convert nanoseconds to seconds
      creator: proposal.creator,
      environmentalData: proposal.environmentalData,
      demographics: {
        children: Number(proposal.demographics.children),
        adults: Number(proposal.demographics.adults),
        seniors: Number(proposal.demographics.seniors),
        totalAffectedPopulation: Number(proposal.demographics.totalAffectedPopulation),
      },
    };
  } catch (error) {
    console.error('Error fetching proposal from ICP:', error);
    throw error;
  }
}

function getProposalStatus(status: { Active: null } | { Accepted: null } | { Declined: null }): 'active' | 'passed' | 'rejected' {
  if ('Active' in status) return 'active';
  if ('Accepted' in status) return 'passed';
  if ('Declined' in status) return 'rejected';
  return 'active';
}

export async function getContractInfo() {
  return {
    blockchain: 'icp',
    canisterId: process.env.NEXT_PUBLIC_ICP_CANISTER_ID,
    host: process.env.NEXT_PUBLIC_ICP_HOST,
    network: process.env.NEXT_PUBLIC_ICP_NETWORK || 'local',
  };
}
