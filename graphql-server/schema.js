const {gql} = require('apollo-server');
const typeDefs = gql`
   scalar Date
   directive @resolveAs(name: String) on FIELD_DEFINITION

   type Query {
    AllCountries: [Country]!
    CountryByID(id: Int!) : Country!
    CountryByIDs(ids: [Int]!) : [Country]!
    CountryByName(name: String!) : Country!
    CountryByNames(names: [String]!) : [Country]!
    AllStates: [State]!
    State(name: String): State!
  }
  type CountryInfo{
      id: ID @resolveAs(name: "_id")
      iso2: String
      iso3: String
      lat: Float
      long: Float
      flag: String
  }
  type Country {
      name: ID @resolveAs(name: "country")
      date: Date @resolveAs(name: "updated"),
      datereadable: String,
      info: CountryInfo @resolveAs(name: "countryInfo") 
      cummulativeCases: Int @resolveAs(name: "cases")
      todayCases: Int,
      cummulativeDeaths: Int @resolveAs(name: "deaths")
      todayDeaths: Int,
      recovered: Int,
      active: Int,
      critical: Int,
      casesPerOneMillion: Int,
      deathsPerOneMillion: Int,
      tests: Int,
      testsPerOneMillion: Int,
      continent: String
      timeline: [TimeLine]
  }

  type State{
    name: ID @resolveAs(name: "state")
    cummulativeCases : Int @resolveAs(name: "cases")
    todayCases: Int,
    cummulativeDeaths: Int @resolveAs(name:"deaths")
    todayDeaths: Int,
    activeCases: Int @resolveAs(name:"active")
    cummulativeTests: Int @resolveAs(name:"tests")
    testsPerOneMillion: Int
    timeline:[TimeLine]
  }
  type TimeLine{
      date: Date
      datereadable: String
      cases: Int
      deaths: Int
      recovered: Int
      fips: Int
      countryInfo: CountryInfo
      
  }
`;
module.exports = typeDefs;
