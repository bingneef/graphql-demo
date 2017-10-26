import pubsub from '../../pubsub'
import { withFilter } from 'graphql-subscriptions'

import { facts } from '../../../../data/facts'

export default {
  Query: {
    facts: async (root, { size, offset }) => {
      return {
        totalCount: facts.length,
        feed: facts.slice(offset, offset + size),
      }
    },
    delayFacts: async (root, { size, offset }) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({
          totalCount: facts.length,
          feed: facts.slice(offset, offset + size),
        }), 5000)
      })
      return {
        totalCount: facts.length,
        feed: facts.slice(offset, offset + size),
      }
    },
  },
  Mutation: {
    addFact: async (root, { fact }) => {
      const newFact = {
        ...fact,
        id: facts.length + 1,
      }
      facts.unshift(newFact)
      return newFact
    }
  },
  Subscription: {
    factSubscription: {
      subscribe:
        withFilter(
          () => pubsub.asyncIterator('factSubscription'),
          (payload, variables) => true,
        )
    }
  },
  Fact: {
    excerpt: (fact, { size }) => fact.content.substring(0, size),
  },
}
