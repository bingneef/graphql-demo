import Koa from 'koa'

import { execute, subscribe } from 'graphql'
import { createServer } from 'http'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import Router from 'koa-router'
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'
import koaBody from 'koa-bodyparser'

import schema from './services/graphql/schema/index'
import subscriptions from './subscriptions'

const port = 5000

const app = new Koa()
app.use(koaBody())

const router = new Router()

router.all('/graphql',
  (ctx, next) => graphqlKoa({
    schema,
    rootValue: {
      ctx,
    },
  })(ctx, next),
);

router.get('/graphiql', graphiqlKoa({
  schema,
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`
}));

app.use(router.routes()).use(router.allowedMethods())

if (!module.parent) {
  subscriptions.init()
  const ws = createServer(app.callback())
  ws.listen(port, () => {
    new SubscriptionServer({
      execute,
      subscribe,
      schema
    }, {
      server: ws,
      path: '/subscriptions',
    })
  })

  console.log(`GraphQL server running on http://localhost:${port}`)
  console.log(`GraphiQL client running on http://localhost:${port}/graphiql`)
}
