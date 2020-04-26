const countyObject = {
  state: async (county, _, { dataSources }) => {
    return await dataSources.ncapi.getStatebyName(county.statename);
  },
  timeline: async (county, _, { dataSources }) => {
    return await dataSources.ncapi.getCountyTimeLineByState(county);
  },
};
module.exports = countyObject;
