import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import queryObject from "./query";
import countryObject from "./country";
import stateObject from "./state";
import countyObject from "./county";
import countryInfoObject from "./countryinfo";
import countyInfoObject from "./countyinfo";
const resolvers = {
  Query: queryObject,
  Country: countryObject,
  State: stateObject,
  County: countyObject,
  CountryInfo: countryInfoObject,
  CountyInfo: countyInfoObject,
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      ///If an int or number comes in, we can parse it as a value
      // We could do lots of stuff here but lets play it by ear
      const date = new Date(parseInt(value));
      // console.log("From Client", date);
      return date;
    },
    serialize(value) {
      //This is what we get from client
      //both parse literal and value get changed into time integers so we will just send that
      return value;
    },
    parseLiteral(ast) {
      // console.log(ast);
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      if (ast.kind === Kind.INT) {
        return this.parseValue(ast.value);
      }
      return null;
    },
  }),
};

export { resolvers };
