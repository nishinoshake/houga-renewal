import { createClient } from 'contentful'

export const fetchMovies = async () => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID || '',
    accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN || ''
  })

  const { items } = await client.getEntries({
    content_type: 'post',
    order: '-fields.releaseDate',
    limit: 1000
  })
  const movies = items.map(item => ({
    id: item.sys.id,
    title: item.fields.title,
    releaseDate: item.fields.releaseDate.replace(/-/g, '.').slice(2),
    trailerId: item.fields.trailerId
  }))

  return movies
}