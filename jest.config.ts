import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  testMatch: [
    '**/__tests__/**/*.ts?(x)'
  ],
  testPathIgnorePatterns: [
    'dist'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};

export default config;
