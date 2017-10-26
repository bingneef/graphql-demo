import { facts } from './data/facts'
import pubsub from './services/graphql/pubsub'

const init = async () => {
  return new Promise(async (resolve) => {
    do {
      await sendMessage()
    } while (true)


    if (!module.parent) process.exit(1)
    resolve(true)
  })
}

const sendMessage = async () => {
  await pubsub.publish('factSubscription', {factSubscription: facts[Math.floor(Math.random() * facts.length - 1)]})
  await sleep(sendMessage)
}

const sleep = (fn, args) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fn(args)), 3000)
  })
}

export default {
  init
}
