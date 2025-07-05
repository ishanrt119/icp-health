import { HttpAgent, Actor } from '@dfinity/agent';
import { idlFactory } from '../../../declarations/icp_health_backend';

const canisterId = import.meta.env.VITE_CANISTER_ID_ICP_HEALTH_BACKEND;

const agent = new HttpAgent();

const icp_health_backend = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});

export default icp_health_backend;
