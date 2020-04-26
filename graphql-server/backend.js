/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

const {RESTDataSource} = require('apollo-datasource-rest');
const {GraphQLScalarType} = require('graphql');
const {Kind} = require('graphql/language');


class NovelCovidAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://corona.lmao.ninja/v2/';
  }

  async getCountries() {
    const response = await this.get('countries');
    return response.map((obj) => {
      return {...obj, datereadable: new Date(obj.updated).toDateString()};
    });
  }

  async getCountrybyID(id) {
    const response = await this.get(`countries/${id}`);
    return {...response, datereadable: new Date(response.updated).toDateString()};
  }

  async getCountryByName(name) {
    const response = await this.get(`countries/${name}?strict=false`);
    return {...response, datereadable: new Date(response.updated).toDateString()};
  }

  async getTimeLinebyCountry2(countryInfo) {
    // console.log(countryInfo.iso3);
    let response = [];
    try {
      response = await this.get(`historical/${countryInfo.iso3}?lastdays=all`);
    } catch (err) {
      console.error(`iso3 ${countryInfo.iso3} failed, trying _id`);
      try {
        response = await this.get(`historical/${countryInfo._id}?lastdays=all`);
      } catch (err) {
        console.error(`error with _id- ${countryInfo._id} returning nothing`);
        return response;
      }
    }
    // .catch(await this.get(`historical/${countryInfo._id}?lastdays=all`))
    // .catch(
    // console.log(response);
    const {cases, deaths, recovered} = response.timeline;
    const result = Object.keys(cases).map((date) => ({
      date: new Date(date).getTime(),
      datereadable: new Date(date).toDateString(),
      cases: cases[date],
      deaths: deaths[date],
      recovered: recovered[date],
      countryInfo: [countryInfo],
    }));
    return result;
  }
  async getTimeLinebyCountry(countryInfo) {
    // console.log(countryInfo.iso3);
    const potentialIds = [
      countryInfo._id,
      countryInfo.iso3,
      countryInfo.iso2,
    ];

    let response = Object();
    for (const index of potentialIds) {
      // console.log(index);
      try {
        response = await this.get(`historical/${index}?lastdays=all`);
        break;
      } catch (err) {
        console.log(err);
      }
    }

    if (Object.keys(response).length===0) {
      return [];
    }

    // console.log(response);
    const {cases, deaths, recovered} = response.timeline;
    const result = Object.keys(cases).map((date) => ({
      date: new Date(date).getTime(),
      datereadable: new Date(date).toDateString(),
      cases: cases[date],
      deaths: deaths[date],
      recovered: recovered[date],
      countryInfo: [countryInfo],
    }));
    return result;
  }

  async getStates() {
    // /Everything from this API comes from the USA
    const response = await this.get('states/');
    return response.map((state) => {
      return {...state, 'parentcountry': 'USA'};
    });
  }

  async getStatebyName(name) {
    // /Everything from this API comes from the USA
    const res = await this.get(`states/${name}`);
    return {...res, 'parentcountry': 'USA'};
  }

  async getTimeLinebyState(name) {
    const response = await this.get('nyt/states');
    return response.filter((states) => {
      return states.state === name;
    }).map((filtered) => {
      return {
        ...filtered,
        date: new Date(filtered.date).getTime(),
        datereadable: new Date(filtered.date).toDateString(),
      };
    });
  }

  async getYesterday(name) {
    // console.log(name);
    const response = await this.get(`states/${name}?yesterday=true`);
    return response;
  }

  reduceCounty(key) {
    return {statename: key.province,
      cummulativeCases: key.stats.confirmed,
      cummulativeDeaths: key.stats.deaths,
      cummulativeRecovered: key.stats.recovered,
      activeCases: key.stats.confirmed - key.stats.recovered - key.stats.deaths,
      info: {lat: key.coordinates.latitude, lon: key.coordinates.longitude},
      ...key};
  }


  async getCounties() {
    const response = await this.get('jhucsse/counties');
    const counties = response.map((key) => {
      return this.reduceCounty(key);
    });

    return counties;
  }

  async getCountyByName(name, state) {
    const response = await this.get(`jhucsse/counties/${name}`);
    const filtedResponse = response.filter((key) => key.province === state);
    const reducedResponse = filtedResponse.map((key) => {
      return this.reduceCounty(key);
    });
    return await reducedResponse;
    // console.log(reducedResponse);
  }


  async getCountyTimeLineByState(county) {
    console.log(county.statename);
    const stateName = county.statename.toLowerCase();
    const response = await this.get(`historical/usacounties/${stateName}`);
    const filtedResponse = response.filter((key) => key.county === county.county.toLowerCase());
    console.log(filtedResponse);
    // recovered on found in the counties, we should find a way to check that
    const {cases, deaths, recovered} = filtedResponse[0].timeline;
    console.log(cases);
    const result = Object.keys(cases).map((date) => {
      const dataObject = {
        date: new Date(date).getTime(),
        datereadable: new Date(date).toDateString(),
        cases: cases[date],
        deaths: deaths[date]};
      if (recovered != undefined) {
        dataObject.recovered = recovered[date];
      } else {
        dataObject.recovered = null;
      }
      return dataObject;
    });
    return result;
  }
  // }
}

// I think that maybe these should not be async functions since
// some of them don't return promises and we resolve them in the RESTAPI
// while this probably doesn't matter, I just want to be a good programmer
const resolvers = {
  Query: {
    AllCountries: (_parent, _args, {dataSources}) => {
      return dataSources.ncapi.getCountries();
    },
    CountryByID: (_, {id}, {dataSources}) => {
      return dataSources.ncapi.getCountrybyID(id);
    },
    CountryByIDs: (_, {ids}, {dataSources}) => {
      // no reseaon to return promise.all since get country by id is not returning promises
      return ids.map((id) => dataSources.ncapi.getCountrybyID(id));
    },
    CountryByName: (_, {name}, {dataSources}) => {
      return dataSources.ncapi.getCountryByName(name);
    },
    CountryByNames: (_, {names}, {dataSources}) => {
      return names.map((name) => dataSources.ncapi.getCountryByName(name));
    },

    AllStates: (_parent, _args, {dataSources}) => {
      return dataSources.ncapi.getStates();
    },
    StateByName: (_parent, {name}, {dataSources}) => {
      // console.log(name)
      return dataSources.ncapi.getStatebyName(name);
    },
    StateByNames: (_parent, {names}, {dataSources}) => {
      // console.log(name)
      return names.map((name) => dataSources.ncapi.getStatebyName(name));
    },
    AllCounties: (_parent, _args, {dataSources}) => {
      return dataSources.ncapi.getCounties();
    },
    CountyByName: async (_parent, {name, state}, {dataSources}) => {
      // Because the rest query returns an array and we are making sure we only return a single object
      const countyByName = await dataSources.ncapi.getCountyByName(name, state);
      // return countyByName
      // console.log(countyByName);
      if (countyByName.length > 1) {
        throw new Error(`${state},${name} returns ambiguous query`);
      }
      return countyByName[0];
    },
  },

  State: {
    timeline: async (state, _, {dataSources}) => {
      return dataSources.ncapi.getTimeLinebyState(state.state);
    },
    yesterdayCases: async (state, _, {dataSources}) =>{
      const response = await dataSources.ncapi.getYesterday(state.state);
      // console.log(response)
      return response.todayCases;
    },
    yesterdayDeaths: async (state, _, {dataSources}) =>{
      const response = await dataSources.ncapi.getYesterday(state.state);
      return response.todayDeaths;
    },
    county: async (state, __, {dataSources}) =>{
      const response = await dataSources.ncapi.getCounties();
      const filtedResponse = response.filter((county) => {
        return county.province === state.state;
      }).map((key) => dataSources.ncapi.reduceCounty(key));
      // console.log(filtedResponse);
      return filtedResponse;
    },
  },

  Country: {
    timeline: async (country, _, {dataSources}) => {
      const countryInfo = country.countryInfo;
      return dataSources.ncapi.getTimeLinebyCountry(countryInfo);
    },
    state: async (country, _, {dataSources}) => {
      // right here we only have USA
      // console.log(country.country)
      const statesArray = await dataSources.ncapi.getStates();
      return statesArray.filter((state) => {
        console.log(state.parentcountry);
        return state.parentcountry === country.country;
      });
    },
  },
  County: {
    state: async (county, _, {dataSources}) => {
      return await dataSources.ncapi.getStatebyName(county.statename);
    },
    timeline: async (county, _, {dataSources}) => {
      return await dataSources.ncapi.getCountyTimeLineByState(county);
    },
  },


  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      // We could do lots of stuff here but lets play it by ear
      console.log('From Client', value);
      return new Date(value).getTime(); // value from the client
    },
    serialize(value) {
      return value;
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
};

module.exports = {resolvers, NovelCovidAPI};
