import contentful from 'contentful'

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchMovies = async () => {
  const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID || 'pf2aflscqgg2',
    accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN || '672f6ef9cd1792652afa415fb353482f43f7267fd191ff488869528a70ed0ed1'
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