import matchSorter from 'match-sorter'
import * as React from 'react'
import { Emoji, emojis } from '../../../../../modules/styled-elements/Emoji/emojiMap'

import { Description, Icon, Name } from '../elements'

// Get suggestions for a query
export const getSuggestions = (query: string) =>
  matchSorter(emojis, query, {
    keys: [
      {
        minRanking: matchSorter.rankings.STRING_CASE_ACRONYM,
        maxRanking: matchSorter.rankings.STARTS_WITH,
        threshold: matchSorter.rankings.STARTS_WITH,
        key: 'keywords'
      }
    ]
  })

// Extract the emoji name from a query
export const extract = (query: string) =>
  query.length > 2 && query[0] === ':' && query[1] !== ':' && query.substring(1)

// Convert the emoji to a string
export const toString = ({ keywords: [keyword] }: Emoji) => `:${keyword}:`

// Render a description for a query
export const description = (query: string) => (
  <Description>
    Emoji matching <strong>{`:${query}`}</strong>
  </Description>
)

// Render a suggestion for an emoji
export const suggestion = ({ emoji, keywords: [keyword] }: Emoji) => (
  <React.Fragment>
    <Icon>{emoji}</Icon>
    <Name>{`:${keyword}:`}</Name>
  </React.Fragment>
)
