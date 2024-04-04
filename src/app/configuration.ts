const defaultConfiguration = {
  apiUri: 'https://api.peanutgallery.taylorlaekeman.com',
};

const configurationOverrides = {
  // apiUri: 'http://localhost:4000',
};

export const configuration = {
  ...defaultConfiguration,
  ...configurationOverrides,
};

export default configuration;
