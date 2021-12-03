import { AxiosResponse } from 'axios';

// load our test.json file. This can be copied to the local 
// folder. Can be a short version of your actual data set.
// const testJson = require('../../test.json');

// Our mocked response
const axiosResponse = {
  data: {},
  status: 200,
  statusText: 'OK',
  config: {},
  headers: {},
};

// axios mocked
export default {
  // Typescript requires a 'default'
  default: {
    get: jest.fn().mockImplementation(() => Promise.resolve(axiosResponse)),
  },
  get: jest.fn(() => Promise.resolve(axiosResponse)),
};
