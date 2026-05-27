import Message, { messages } from '../../types/message'

/**
 * Compares whether a message should go in a group
 */
function compare(a: Message, b: Message) {
  return (
    a.type === 7 ||
    // If the ID is not equal to the previous message
    a.author.id !== b.author.id ||
    // If the name is not equal to the previous message
    a.author.name !== b.author.name ||
    // If the interval between the previous message is greater than 5 mins
    b.timestamp - a.timestamp > 5 * 60 * 1000
  )
}

/**
 * Groups messages into their array form.
 * @example
 * // Demo input
 * [{ author: 1 }, { author: 2 }, { author: 1 }, { author: 1 }]
 * // Output
 * [[{ author: 1 }], [{ author: 2 }], [{ author: 1 }, { author: 1 }]]
 * @param messages The messages to group
 */
const Group = (messages: messages): messages[] => {
  const result = []
  let group = null
  let previous: Message

  messages.forEach((message, i) => {
    if (group === null || compare(previous, message) || message.reference) {
      group = result.push([]) - 1
    }
    result[group].push(message)
    previous = message
  })

  return result
}

export default Group
