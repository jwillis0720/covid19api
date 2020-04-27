const countyObject = {
  state: async (county, _, { dataSources }) => {
    return await dataSources.ncapi.getStatebyName(county.statename);
  },
  timeline: async (county, _, { dataSources }) => {
    const countyTimeLine = await dataSources.ncapi.getCountyTimeLineByState(
      county
    );
    const daterequested = county.daterequested;
    console.log(countyTimeLine);
    if (daterequested === undefined) {
      return countyTimeLine;
    }
    //because these are updated with local times we have to convert the datereadable bakc into a time
    return countyTimeLine.filter((key) => {
      return new Date(key.datereadable).getTime() == daterequested.getTime();
    });
  },
};
module.exports = countyObject;
