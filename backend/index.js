
const dotenv = require('dotenv');
dotenv.config();

const { createServer } = require('http');
const { subscribe, execute } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { PubSub } = require('graphql-subscriptions');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');

const resolvers = require('./graphql');
const typeDefs = require('./graphql/typeDefs');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const PORT = process.env.PORT || 5000;


const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)



  mongoose.connect(MONGODB_URI).then(() => {
    console.log('DB connected!!');
}).catch(err => console.log(err));




(async (typeDefs, resolvers) => {
    const app = express();
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const httpServer = createServer(app);
    const pubSub = new PubSub();
    app.use(cors());

    const server = new ApolloServer({ 
        schema,
        context: ({req}) => ({ req, pubSub }),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), {
            async serverWillStart() {
                return {
                    async drainServer() {
                        subscriptionServer.close();
                    }
                }
            }
        }],
    });

    const subscriptionServer = SubscriptionServer.create({
        schema,
        execute,
        subscribe,
        async onConnect() {
            console.log('Connected!');
            return {
                pubSub
            }
        },
        onDisconnect() {
            console.log('Disconnected!');
        }
    }, {
        server: httpServer,
        path: server.graphqlPath,
        pubSub // Pass the pubSub instance here
    })

    await server.start();
    server.applyMiddleware({ app });

    await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
    console.log(`Server ready at  http://localhost:${PORT}${server.graphqlPath}`);
})(typeDefs, resolvers);











/*



*/



























/*
const { ApolloServer } = require('@apollo/server')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { expressMiddleware } = require('@apollo/server/express4')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { subscribe, execute } = require('graphql');
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql');

require('dotenv').config()
const { GraphQLError } = require('graphql');

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


// setup is now within a function
const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
  
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    introspection:true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {


        const auth = req ? req.headers.authorization : null
        
        if (auth && auth.startsWith('Bearer ')) {
            const token=auth.split(' ')[1]
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
          console.log(`decoded id after authorization is ${decodedToken.id}`)

          const currentUser = await User.findById(decodedToken.id)
          return { currentUser }
        }
        
        
      },
    }),
  )

  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()

*/