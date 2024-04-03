const envOverrides = {};

const envDefaults = {
  apiUri: 'https://api.peanutgallery.taylorlaekeman.com',
};

export const env = {
  ...envDefaults,
  ...envOverrides,
};

export default env;
