const { ApolloServer, gql } = require('apollo-server');
const fetch = require("node-fetch");

const typeDefs = `
  type Query {
    hello(name: String): String!
    getPerson(id: Int!): Person
  }
  type Planet {
    name: String
    rotation_period: String
    orbital_period: String
    films: [Film]
  }
  type Film {
    title: String
    episode_id: Int
    opening_crawl: String
    director: String
    producer: String
    release_date: String
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
    films: [Film]
    homeworld: Planet
  }
`;

const resolveFilms = parent => {
  const promises = parent.films.map(async url => {
    const response = await fetch(url);
    return response.json();
  });
  console.log(promises)
  return Promise.all(promises);
};

const resolvers = {
  Planet: {
    films: resolveFilms
  },
  Person: {
    homeworld: async parent => {
      const response = await fetch(parent.homeworld);
      return response.json();
    },
    films: resolveFilms
  },
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`,
    getPerson: async (_, { id }) => {
      const response = await fetch(`https://swapi.py4e.com/api/people/${id}/`);
      return response.json().results;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Launch the server
server.listen(4001).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});