const countryObject = {
  timeline: async (country, _, { dataSources }) => {
    const countryInfo = country.countryInfo;
    return dataSources.ncapi.getTimeLinebyCountry(countryInfo);
  },
  state: async (country, _, { dataSources }) => {
    // right here we only have USA
    // console.log(country.country)
    const statesArray = await dataSources.ncapi.getStates();
    return statesArray.filter((state) => {
      console.log(state.parentcountry);
      return state.parentcountry === country.country;
    });
  },
};
module.exports = countryObject;
