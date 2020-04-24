const { ApolloServer, gql } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');

class MoviesAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://movies-api.example.com/';
  }

  async getMovie(id) {
    return this.get(`movies/${id}`);
  }

  async getMostViewedMovies(limit = 10) {
    const data = await this.get('movies', {
      per_page: limit,
      order_by: 'most_viewed',
    });
    return data.results;
  }
}


const typeDefs = `
  type Query {
    movie(id: Int): String
  }
`;



const resolvers = {
  Query: {
    movie: async (_source, { id }, { dataSources }) => {
      return dataSources.moviesAPI.getMovie(id);
    },
    // mostViewedMovies: async (_source, _args, { dataSources }) => {
    //   return dataSources.moviesAPI.getMostViewedMovies();
    // },
    // favorites: async (_source, _args, { dataSources }) => {
    //   return dataSources.personalizationAPI.getFavorites();
    // },
  },
};



// Pass schema definition and resolvers to the
// ApolloServer constructor
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      moviesAPI: new MoviesAPI(),
    };
  },
});

// Launch the server
server.listen(4001).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});