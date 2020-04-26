const countyInfoObject = {
  population: async (countyInfo, _, { dataSources }) => {
    const response = await dataSources.csv.getCountyInfo(countyInfo);
    return response[0]['pop'];
  },

  FIPS: async (countyInfo, _, { dataSources }) => {
    const response = await dataSources.csv.getCountyInfo(countyInfo);
    return response[0]['FIPS'];
  },
  landarea: async (countyInfo, _, { dataSources }) => {
    const response = await dataSources.csv.getCountyInfo(countyInfo);
    return response[0]['LandAreami2'];
  },
};
module.exports = countyInfoObject;
