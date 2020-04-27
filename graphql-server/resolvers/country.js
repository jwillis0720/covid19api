const countryObject = {
  timeline: async (country, _, { dataSources }) => {
    const countryInfo = country.countryInfo;
    const daterequested = country.daterequested;
    const timeLine = await dataSources.ncapi.getTimeLinebyCountry(countryInfo);
    if (daterequested === undefined) {
      return timeLine;
    } else {
      const miliseconds = daterequested.getTime();
      return timeLine.filter((key) => key.date === miliseconds);
      // return timeLine.filter((key) => key.date === miliseconds);
    }
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
