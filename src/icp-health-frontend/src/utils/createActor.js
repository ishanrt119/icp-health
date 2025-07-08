// src/actors/createActor.js
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../declarations/icp-health-backend';

export function createActor(canisterId, options = {}) {
  const agent = options.agent || new HttpAgent();
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
}
