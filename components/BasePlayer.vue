<template>
  <div
    class="player"
    :class="{ 'is-active': isPlaying && canPlay }"
    ref="playerContainer"
  >
    <div class="player-frame" ref="frame">
      <div ref="playerYoutube" />
    </div>
    <div class="player-control">
      <h2 class="player-control-title" ref="titleElement">
        <transition name="player-control-title">
          <BasePlayerTitle
            v-if="currentMovie"
            :key="currentMovie.id"
            :title="currentMovie.title"
            :wrap-width="titleWidth"
          />
        </transition>
      </h2>
      <div class="player-control-actions">
        <div class="player-control-action">
          <button
            class="player-control-action-button player-control-action-prev"
            aria-label="前の動画を再生する"
            @click="prev"
          ></button>
        </div>
        <div class="player-control-action">
          <button
            class="player-control-action-button player-control-action-next"
            aria-label="次の動画を再生する"
            @click="next"
          ></button>
        </div>
        <div class="player-control-action">
          <button
            class="player-control-action-button player-control-action-close"
            aria-label="プレイヤーを閉じる"
            @click="unselect"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { lock, unlock } from 'tua-body-scroll-lock'

let player = null

const playerContainer = ref()
const canPlay = ref(false)
const intervalId = ref(null)
const titleElement = ref()
const titleWidth = ref(0)
const playerYoutube = ref(null)

const {
  state,
  selectedTrailerIds,
  isPlaying,
  currentMovie,
  lastIndex,
  unselect,
  setCurrentIndex,
  setPreviousIndex
} = useStore()

const movies = computed(() => state.movies.value)
const selectedMovies = computed(() => state.selectedMovies.value)
const order = computed(() => state.order.value)
const currentIndex = computed(() => state.currentIndex.value)
const previousIndex = computed(() => state.previousIndex.value)
const isLast = computed(() => lastIndex.value !== 0 && currentIndex.value === lastIndex.value)

onMounted(() => {
  watchTitleWidth()
  createPlayer(movies.value[0].trailerId)
})

const createPlayer = (trailerId) => {
  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player(playerYoutube.value, {
      width: '1280',
      height: '720',
      videoId: trailerId,
      playerVars: {
        controls: 2,
        playsinline: 1
      },
      events: {
        onReady: () => {
          canPlay.value = true
        },
        onStateChange: ({ data }) => {
          switch (data) {
            case YT.PlayerState.ENDED:
              setCurrentIndex({
                index: player.getPlaylistIndex()
              })
              nextTick(() => {
                if (currentIndex.value === previousIndex.value) {
                  unselect()
                }
              })
              break
            case YT.PlayerState.PLAYING:
              setPreviousIndex({
                index: player.getPlaylistIndex()
              })
              break
          }
        }
      }
    })
  }

  const tag = document.createElement('script')
  tag.src = 'https://www.youtube.com/iframe_api'

  const firstScriptTag = document.getElementsByTagName('script')[0]
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
}

const loadPlaylist = (movies, index) => {
  player.loadPlaylist(movies, index)
}

const play = () => {
  if (canPlay.value) {
    loadPlaylist(selectedTrailerIds.value, currentIndex.value)
  } else {
    unselect()
    return
  }

  lock()

  intervalId.value = setInterval(() => {
    if (player && player.getPlaylistIndex) {
      const index = player.getPlaylistIndex()

      if (index !== currentIndex.value) {
        setPreviousIndex(index)
        setCurrentIndex(index)
      }
    }
  }, 200)
}

const stop = () => {
  unlock()

  if (intervalId.value) {
    clearInterval(intervalId.value)
  }

  if (canPlay.value) {
    player.stopVideo()
  }
}

const toggle = () => {
  switch (player.getPlayerState()) {
    case YT.PlayerState.PLAYING: {
      return player.pauseVideo()
    }
    case YT.PlayerState.PAUSED: {
      return player.playVideo()
    }
  }
}

const next = () => {
  if (isPlaying.value && player && player.nextVideo) {
    if (isLast.value) {
      unselect()
    } else {
      player.nextVideo()
    }
  }
}

const prev = () => {
  if (isPlaying.value && player && player.previousVideo) {
    player.previousVideo()
  }
}

const handleKeydown = ({ key }) => {
  switch (key) {
    case 'ArrowLeft': {
      return prev()
    }
    case 'ArrowRight': {
      return next()
    }
    case 'Backspace':
    case 'Delete':
    case 'Escape': {
      return unselect()
    }
  }
}

const watchTitleWidth = () => {
  titleWidth.value = titleElement.value.clientWidth

  window.addEventListener('resize', () => {
    titleWidth.value = titleElement.value.clientWidth

    console.log(titleWidth.value)
  })
}

watch(isPlaying, (val) => {
  if (val) {
    play()

    document.addEventListener('keydown', handleKeydown)
  } else {
    stop()

    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style lang="scss" scoped>
.player {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  visibility: hidden;
  display: flex;
  flex-direction: column;
  &:before {
    content: '';
    background-color: $color-black;
    transform-origin: left center;
    transform: scaleX(0);
    will-change: transform;
    @include fit-full;
  }
  &.is-active {
    visibility: visible;
    &:before {
      transform: scaleX(1);
      transition: transform 0.8s $easeInOutQuart;
    }
    .player-frame:deep(iframe) {
      opacity: 1;
      transition: opacity 0.5s linear 1s;
    }
    .player-control {
      transform: translate3d(0, 0, 0);
      transition: transform 0.5s $easeOutQuart 0.9s;
    }
  }
  &-frame {
    flex-grow: 1;
    position: relative;
    &:deep(iframe) {
      opacity: 0;
      z-index: 1;
      will-change: opacity;
      @include fit-full;
    }
  }
  &-control {
    height: 4.5rem;
    display: flex;
    background-color: $color-white;
    transform: translate3d(0, 100%, 0);
    will-change: transform;
    &-title {
      flex-grow: 1;
      position: relative;
      overflow: hidden;
      &:after {
        content: '';
        width: 1.6rem;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        pointer-events: none;
        background: linear-gradient(
          to right,
          rgba($color-white, 0),
          rgba($color-white, 1)
        );
        @include desktop {
          width: 2rem;
        }
      }
      &-enter-active {
        transition: transform 0.6s $easeOutQuart 0.5s;
      }
      &-leave-active {
        transition: transform 0.6s $easeInQuart;
      }
      &-enter-from {
        transform: translate3d(0, 100%, 0);
      }
      &-leave-to {
        transform: translate3d(0, -100%, 0);
      }
    }
    &-actions {
      display: flex;
    }
    &-action {
      width: 4.5rem;
      height: 4.5rem;
      &:nth-child(n + 2) {
        border-left: 1px solid $color-gray-dark;
      }
      &-button {
        width: 100%;
        height: 100%;
        position: relative;
        background-color: $color-gray;
        @include desktop {
          &:hover {
            background-color: $color-gray-dark;
          }
        }
      }
      &-prev,
      &-next {
        &:before {
          content: '';
          width: 30%;
          height: 30%;
          position: absolute;
          top: 50%;
          left: 50%;
          border-top: 1px solid $color-dark;
          border-right: 1px solid $color-dark;
        }
      }
      &-prev:before {
        transform: translate(-17%, -50%) rotate(-135deg);
      }
      &-next:before {
        transform: translate(-77%, -50%) rotate(45deg);
      }
      &-close {
        &:before,
        &:after {
          content: '';
          width: 50%;
          height: 1px;
          position: absolute;
          top: 50%;
          left: 50%;
          background-color: $color-dark;
        }
        &:before {
          transform: translate(-50%, -50%) rotate(45deg);
        }
        &:after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }
      }
    }
  }
}
</style>
