import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';

let authClient: AuthClient | null = null;

async function getAuthClient(): Promise<AuthClient> {
  if (authClient) return authClient;

  authClient = await AuthClient.create({
    idleOptions: {
      disableIdle: true,
    },
  });

  return authClient;
}

export async function login(): Promise<void> {
  const client = await getAuthClient();
  const isLocal = process.env.NEXT_PUBLIC_ICP_NETWORK === 'local';
  const II_CANISTER_ID = 'uzt4z-lp777-77774-qaabq-cai';
  const identityProvider = isLocal
    ? `http://${II_CANISTER_ID}.localhost:4943`
    : 'https://identity.ic0.app';

  console.log('Using Internet Identity provider:', identityProvider, '(network:', process.env.NEXT_PUBLIC_ICP_NETWORK, ')');

  return new Promise((resolve, reject) => {
    client.login({
      identityProvider,
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), 
      onSuccess: () => {
        console.log('Successfully logged in with Internet Identity');
        resolve();
      },
      onError: (error) => {
        console.error('Login failed:', error);
        reject(error);
      },
    });
  });
}

export async function logout(): Promise<void> {
  const client = await getAuthClient();
  await client.logout();
  authClient = null;
  console.log('Logged out from Internet Identity');
}

export async function isAuthenticated(): Promise<boolean> {
  const client = await getAuthClient();
  return await client.isAuthenticated();
}

export async function getIdentity(): Promise<Identity> {
  const client = await getAuthClient();
  return client.getIdentity();
}

export async function getPrincipal(): Promise<string> {
  const identity = await getIdentity();
  return identity.getPrincipal().toString();
}

export function shortenPrincipal(principal: string): string {
  if (principal.length < 15) return principal;
  return `${principal.slice(0, 6)}...${principal.slice(-4)}`;
}

export async function isAnonymous(): Promise<boolean> {
  const principal = await getPrincipal();
  return principal === '2vxsx-fae';
}
