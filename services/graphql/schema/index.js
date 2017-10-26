import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'
import typeDefs from './type-defs'

module.exports = makeExecutableSchema({ typeDefs, resolvers });
