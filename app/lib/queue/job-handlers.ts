import { Job } from 'bullmq';
import { GraphqlClient } from '@shopify/shopify-api';

type JobHandlerArgs = {
  job: Job;
  graphql?: GraphqlClient;
};

export type JobHandler = ({ job, graphql }: JobHandlerArgs) => Promise<void>;

export const jobHandlers: Record<string, JobHandler> = {};
