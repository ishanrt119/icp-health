// src/utils/actorUtils.js
import { HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../../../declarations/icp-health-backend';

const canisterId = import.meta.env.VITE_CANISTER_ID_ICP_HEALTH_BACKEND;

export const getActor = async () => {
  const authClient = await AuthClient.create();
  const identity = await authClient.getIdentity();
  const agent = new HttpAgent({ identity });

  if (window.location.hostname === 'localhost') {
    await agent.fetchRootKey();
  }

  return createActor(canisterId, { agent });
};
