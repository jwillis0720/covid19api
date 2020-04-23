const { gql } = require('apollo-server');


const typeDefs = gql`
   directive @resolveAs(name: String) on FIELD_DEFINITION
   type Query {
    Countries: [Country]!
    Country(id: Int!): Country!
    States: [State]!
    State(name: String): State!
  }
  type CountryInfo{
      id: Int @resolveAs(name: "_id")
      iso2: String
      iso3: String
      lat: Float
      long: Float
      flag: String
  }
  type Country {
      name: String @resolveAs(name: "country")
      updated: Float,
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
    name: String @resolveAs(name: "state")
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
      date: String
      cases: Int
      deaths: Int
      recovered: Int
      fips: Int
  }
`;

module.exports = typeDefs;