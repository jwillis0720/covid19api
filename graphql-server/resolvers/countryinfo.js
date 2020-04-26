const countryInfoObject = {
  population: async (countryInfo, _, { dataSources }) => {
    const response = await dataSources.csv.getCountryInfo(countryInfo);
    console.log(response);
    return response['pop_est'];
  },

  //Have lots of other stuff to choose from in this dataobject
};

module.exports = countryInfoObject;
