const stateObject = {
  timeline: async (state, _, { dataSources }) => {
    const stateTimeLine = await dataSources.ncapi.getTimeLinebyState(
      state.state
    );
    const daterequested = state.daterequested;
    if (daterequested === undefined) {
      return stateTimeLine;
    }
    //because these are updated with local times we have to convert the datereadable bakc into a time
    return stateTimeLine.filter((key) => {
      return new Date(key.datereadable).getTime() == daterequested.getTime();
    });
  },
  yesterdayCases: async (state, _, { dataSources }) => {
    const response = await dataSources.ncapi.getYesterday(state.state);
    // console.log(response)
    return response.todayCases;
  },
  yesterdayDeaths: async (state, _, { dataSources }) => {
    const response = await dataSources.ncapi.getYesterday(state.state);
    return response.todayDeaths;
  },
  county: async (state, __, { dataSources }) => {
    const response = await dataSources.ncapi.getCounties();
    const filtedResponse = response
      .filter((county) => {
        return county.province === state.state;
      })
      .map((key) => dataSources.ncapi.reduceCounty(key));
    // console.log(filtedResponse);
    return filtedResponse;
  },
  info: async (state, _, { dataSources }) => {
    const stateName = state.state;
    const stateObj = await dataSources.csv
      .getStateInfo()
      .then((info) => JSON.parse(info));
    const filteredStateObj = stateObj.filter(
      (obj) => obj.State.toLowerCase() === stateName.toLowerCase()
    );
    if (filteredStateObj.length > 1) {
      throw new Error(`${state},returns ambiguous for info query`);
    }
    console.log(filteredStateObj);
    const mappedObj = {
      lat: filteredStateObj[0].Latitude,
      lon: filteredStateObj[0].Longitude,
      population: filteredStateObj[0].pop,
      landarea: filteredStateObj[0].LandAreami2,
    };
    return mappedObj;
    // console.log(stateObj.filter((obj) => obj.StateLong.toLowerCase() === stateName.toLowerCase()));
    // console.log(csvObj.filter((locationobj) => {
    //   return location.
  },
};
module.exports = stateObject;
