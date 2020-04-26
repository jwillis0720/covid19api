const queryObject = {
  AllCountries: (_parent, _args, { dataSources }) => {
    return dataSources.ncapi.getCountries();
  },
  CountryByID: (_, { id }, { dataSources }) => {
    return dataSources.ncapi.getCountrybyID(id);
  },
  CountryByIDs: (_, { ids }, { dataSources }) => {
    // no reseaon to return promise.all since get country by id is not returning promises
    return ids.map((id) => dataSources.ncapi.getCountrybyID(id));
  },
  CountryByName: (_, { name }, { dataSources }) => {
    return dataSources.ncapi.getCountryByName(name);
  },
  CountryByNames: (_, { names }, { dataSources }) => {
    return names.map((name) => dataSources.ncapi.getCountryByName(name));
  },

  AllStates: (_parent, _args, { dataSources }) => {
    return dataSources.ncapi.getStates();
  },
  StateByName: (_parent, { name }, { dataSources }) => {
    // console.log(name)
    return dataSources.ncapi.getStatebyName(name);
  },
  StateByNames: (_parent, { names }, { dataSources }) => {
    // console.log(name)
    return names.map((name) => dataSources.ncapi.getStatebyName(name));
  },
  AllCounties: (_parent, _args, { dataSources }) => {
    return dataSources.ncapi.getCounties();
  },
  CountyByName: async (_parent, { name, state }, { dataSources }) => {
    // console.log('here');
    // Because the rest query returns an array and we are making sure we only return a single object
    const countyByName = await dataSources.ncapi.getCountyByName(name, state);
    // return countyByName
    // console.log(countyByName);
    if (countyByName.length > 1) {
      throw new Error(`${state},${name} returns ambiguous query`);
    }
    return countyByName[0];
  },
};
module.exports = queryObject;
