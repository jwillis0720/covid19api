# covid19api
Backend for COVID19 App


##Next steps:

I want to define a Graphql schema with all the data I need. Each of the locations will come from various sources like the New York times or JHU. All of these different datasources will come from a collection of APIs. PostMan has done us a great service and collected a list of RESTFUL APIs.

[The PostMan COVID19 APIS](https://covid-19-apis.postman.com/)

So we can now define a schema and when we access data, GraphQL will need to figure out where that data is coming from. To do that you have to write a resolver. In that way, you wrap a RESTful query in a resolvder and then graphql will figure out the rest. 

[Ben Awad has a great tutorial about how to do this](https://www.youtube.com/watch?v=RDQyAcvmbpM). He uses Yoga-graphql. I want to use Apollo Server to define my schema since it seems the most stable. Apollo Server has such great documentation. But Ben shows how to link multiple REST definitions. 

## Resources
[Building Apollo V2 - Another awesome guide to build a full stack app](https://www.apollographql.com/docs/tutorial/introduction/)

[Building Apollo V2 - Use this awesome guid](https://www.apollographql.com/docs/apollo-server/)

[End to End server wiht Apollo blog](https://www.apollographql.com/blog/tutorial-building-a-graphql-server-cddaa023c035)

[Ben Awad Video](https://www.youtube.com/watch?v=RDQyAcvmbpM)

[Full Course](https://www.youtube.com/watch?v=ed8SzALpx1Q)