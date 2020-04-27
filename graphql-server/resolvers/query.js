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
  CountyByNames: async (_parent, { names, states }, { dataSources }) => {
    ///this is tricky since we are returning an array of promises
    ///see here https://medium.com/@antonioval/making-array-iteration-easy-when-using-async-await-6315c3225838
    if (names.length != states.length) {
      throw new Error(`${states},${names}  must be same length`);
    }
    const results = names.map(async (name, index) => {
      let state = states[index];
      let countyByName = await dataSources.ncapi.getCountyByName(name, state);
      if (countyByName.length > 1) {
        throw new Error(`${state},${name} returns ambiguous query`);
      }
      if (countyByName[0] === undefined) {
        console.error(`${state},${name} returns nothing`);
        // throw new Error(`${state},${name} returns nothing`);
      }
      return countyByName[0];
    });
    return await Promise.all(results);
  },
};
module.exports = queryObject;
