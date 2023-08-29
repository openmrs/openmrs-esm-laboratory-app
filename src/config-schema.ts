import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  casualGreeting: {
    _type: Type.Boolean,
    _default: false,
    _description: 'Whether to use a casual greeting (or a formal one).',
  },
};

export type Config = {
  casualGreeting: boolean;
  whoToGreet: Array<string>;
};
