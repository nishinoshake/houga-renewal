const PLAYLIST_LENGTH = 30

const shuffleArray = (arr) =>
  arr
    .map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1])

export const useStore = () => {
  const state = {
    movies: useState(() => []),
    selectedMovies: useState(() => []),
    order: useState(() => null),
    currentIndex: useState(() => null),
    previousIndex: useState(() => null)
  }


  const setMovies = (posts) => {
    state.movies.value = posts
  }

  const select = ({ order = 'desc', index = 0 } = {}) => {
    state.order.value = order
    state.currentIndex.value = 0

    if (order === 'random') {
      state.selectedMovies.value = shuffleArray(state.movies.value).slice(
        0,
        PLAYLIST_LENGTH
      )
    } else {
      state.selectedMovies.value = [...state.movies.value].slice(
        index,
        index + PLAYLIST_LENGTH
      )
    }
  }

  const unselect = () => {
    if (state.order.value) {
      state.order.value = null
    }
    if (state.selectedMovies.value.length) {
      state.selectedMovies.value = []
    }
  }

  const setCurrentIndex = (index) => {
    state.currentIndex.value = index
  }

  const setPreviousIndex = (index) => {
    state.previousIndex.value = index
  }

  const selectedTrailerIds = computed(() => {
    if (state.selectedMovies.value) {
      return state.selectedMovies.value.map(movie => movie.trailerId)
    }

    return []
  })

  const isPlaying = computed(() => {
    return !!(state.order.value !== null && selectedTrailerIds.value.length)
  })

  const currentMovie =  computed(() => {
    if (state.selectedMovies.value.length && state.currentIndex.value !== null) {
      return state.selectedMovies.value[state.currentIndex.value]
    }

    return null
  })

  const lastIndex = computed(() => {
    if (state.selectedMovies.value.length) {
      return state.selectedMovies.value.length - 1
    }

    return 0
  })

  return {
    state,
    setMovies,
    select,
    unselect,
    setCurrentIndex,
    setPreviousIndex,
    selectedTrailerIds,
    isPlaying,
    currentMovie,
    lastIndex
  }
}