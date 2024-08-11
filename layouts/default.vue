<template>
  <div>
    <slot />
  </div>
</template>

<script setup>
import '~/assets/scss/base/_reset.scss'
import { fetchMovies } from '~/lib/api'

useSeoMeta({
  title: '邦画の予告を、朝まで',
  ogTitle: '邦画の予告を、朝まで',
  ogImage: 'https://houga.cc/images/og.png',
  twitterCard: 'summary_large_image',
})

const { setMovies} = useStore()
const { data } = await useAsyncData(() => fetchMovies())

setMovies(data)
</script>
<style lang="scss">
html {
  font-size: 12px;
  @include phablet {
    font-size: 14px;
  }
  @include desktop {
    font-size: 16px;
  }
}

* {
  -webkit-tap-highlight-color: rgba($color-darker, 0.5);
}

html,
body,
#__nuxt,
#__nuxt > div {
  height: 100%;
}

body {
  color: $color-dark;
  line-height: 1.6;
  letter-spacing: 0.06em;
  font-family: YakuHanMP_Noto, 'Noto Serif JP', serif;
  font-weight: 200;
  background-color: $color-snow;
}

button {
  font-family: inherit;
}

.pc {
  @include max($width-large) {
    display: none;
  }
}

.sp {
  @include min($width-large + 1px) {
    display: none;
  }
}
</style>