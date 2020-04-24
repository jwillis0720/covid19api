const { ApolloServer, gql } = require('apollo-server');
const fetch = require("node-fetch");
const { RESTDataSource } = require('apollo-datasource-rest');


const typeDefs = `
  type Query {
    hello(name: String): String!
    People(id: Int): [Person]!
  }
  type Person {
    name: String
    height: String
    mass: String
    hair_color: String
    skin_color: String
    eye_color: String
    birth_year: String
    gender: String
  }
`;


class StarWarsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://swapi.py4e.com/api/';
  }

  async getPersons(id) {
    //We have told our schema that we will return an array, so no matter what, we have to return one
    const results = []
    if (id == null) {
      //if no id is preovided, lets just iterate through all the next urls
      let url = this.baseURL.concat('people')
      do {
        ///use fetch instead of RestDataSource.get since we need to reset
        const data = await fetch(url).then(res => res.json());
        //We have some json data along with a next: field that tells us where to go
        url = data.next;
        //push back in our array
        //... means take all the values we have and add them first
        //i.e
        //const numbers1 = [1, 2, 3, 4, 5];
        //const numbers2 = [ ...numbers1, 1, 2, 6,7,8]; // this will be [1, 2, 3, 4, 5, 1, 2, 6, 7, 8]
        results.push(...data.results);
      } while (url)
    } else {
      //if we were provided and id we can simply use the get method which uses fetch and awaits the object
      results.push(this.get(`/people/${id}`))
      console.log(results)
    }
    return results
  }
}



const resolvers = {
  Query: {
    hello: (_, { name }) => {
      console.log(name)
      return `Hello ${name || "World"}`
    },
    People: async (_parent, { id }, { dataSources }) => {
      return dataSources.swapi.getPersons(id)
    }
  }
}

// Pass schema definition and resolvers to the
// ApolloServer constructor
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      swapi: new StarWarsAPI(),
    };
  },
});

// Launch the server
server.listen(4002).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});