/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const { RESTDataSource } = require("apollo-datasource-rest");
class CSVAPI extends RESTDataSource {
  constructor() {
    super();
    // need to put this on a CDN
    this.baseURL =
      "https://raw.githubusercontent.com/jwillis0720/covid19api/graphql/graphql-server/locationInfo/";
  }

  async getCountryInfo(countryInfo) {
    const response = await this.get("CountryInfo.json");
    const JSONResponse = JSON.parse(response);
    const iso3 = countryInfo.iso3;
    const iso2 = countryInfo.iso2;
    const filteredResponse = JSONResponse.filter((key) => {
      // console.log(key.iso_a3);
      return key["iso_a3"] === iso3;
    });
    if (filteredResponse.length > 1) {
      throw new Error(`${countryInfo},returns ambiguous for info query`);
    }
    return filteredResponse[0];
  }
  async getStateInfo() {
    const response = await this.get("StateInfoPop.json");
    return JSON.parse(response);
  }
  async getCountyInfo(countyInfo) {
    const response = await this.get("CountyInfo.json");
    const responseJSON = JSON.parse(response);
    let filtedResponse = [];
    filtedResponse = responseJSON
      .filter(
        (key) => countyInfo.statename.toLowerCase() == key.State.toLowerCase()
      )
      .filter(
        (key) => countyInfo.name.toLowerCase() == key.County.toLowerCase()
      );
    if (filtedResponse.length > 1) {
      throw new Error(`${countyInfo},returns ambiguous for info query`);
    }
    // console.log(filtedResponse);
    return filtedResponse;
  }
}

class NovelCovidAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://corona.lmao.ninja/v2/";
  }

  async getCountries() {
    const response = await this.get("countries");
    return response.map((obj) => {
      return { ...obj, datereadable: new Date(obj.updated).toDateString() };
    });
  }

  async getCountrybyID(id) {
    const response = await this.get(`countries/${id}`);
    return {
      ...response,
      datereadable: new Date(response.updated).toDateString(),
    };
  }

  async getCountryByName(name) {
    const response = await this.get(`countries/${name}?strict=false`);
    return {
      ...response,
      datereadable: new Date(response.updated).toDateString(),
    };
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
    const { cases, deaths, recovered } = response.timeline;
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
    const potentialIds = [countryInfo._id, countryInfo.iso3, countryInfo.iso2];

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

    if (Object.keys(response).length === 0) {
      return [];
    }

    // console.log(response);
    const { cases, deaths, recovered } = response.timeline;
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
    const response = await this.get("states/");
    return response.map((state) => {
      return { ...state, parentcountry: "USA" };
    });
  }

  async getStatebyName(name) {
    // /Everything from this API comes from the USA
    const res = await this.get(`states/${name}`);
    return { ...res, parentcountry: "USA" };
  }

  async getTimeLinebyState(name) {
    const response = await this.get("nyt/states");
    return response
      .filter((states) => {
        return states.state === name;
      })
      .map((filtered) => {
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
    return {
      statename: key.province,
      cummulativeCases: key.stats.confirmed,
      cummulativeDeaths: key.stats.deaths,
      cummulativeRecovered: key.stats.recovered,
      activeCases: key.stats.confirmed - key.stats.recovered - key.stats.deaths,
      info: {
        lat: key.coordinates.latitude,
        lon: key.coordinates.longitude,
        name: key.county,
        statename: key.province,
      },
      ...key,
    };
  }

  async getCounties() {
    const response = await this.get("jhucsse/counties");
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
    const filtedResponse = response.filter(
      (key) => key.county === county.county.toLowerCase()
    );
    console.log(filtedResponse);
    // recovered on found in the counties, we should find a way to check that
    const { cases, deaths, recovered } = filtedResponse[0].timeline;
    // console.log(cases);
    const result = Object.keys(cases).map((date) => {
      const dataObject = {
        date: new Date(date).getTime(),
        datereadable: new Date(date).toDateString(),
        cases: cases[date],
        deaths: deaths[date],
      };
      if (recovered != undefined) {
        dataObject.recovered = recovered[date];
      } else {
        dataObject.recovered = null;
      }
      return dataObject;
    });
    return await result;
  }
  // }
}

module.exports = { NovelCovidAPI, CSVAPI };
