// eslint-disable-next-line
module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@mock/(.*)$': '<rootDir>/tests/mock/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@config': '<rootDir>/src/config/',
  },
};
