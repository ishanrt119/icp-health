import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as backendIdlFactory } from '../../../declarations/icp-health-backend';
const canisterId = import.meta.env.VITE_CANISTER_ID_ICP_HEALTH_BACKEND;

export const createStudyActorWithIdentity = async (identity) => {
  const agent = new HttpAgent({ identity, host: 'https://ic0.app' });

  

  const actor = Actor.createActor(backendIdlFactory, {
    agent,
    canisterId,
  });

  return actor;
};
