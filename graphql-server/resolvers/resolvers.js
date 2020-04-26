const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const queryObject = require('./query');
const countryObject = require('./country');
const stateObject = require('./state');
const countyObject = require('./county');
const countyInfoObject = require('./countyinfo');
const resolvers = {
  Query: queryObject,
  Country: countryObject,
  State: stateObject,
  County: countyObject,
  CountyInfo: countyInfoObject,
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

module.exports = { resolvers };
