<template>
  <span class="player-control-title-text" :class="{ 'is-long': isLong }">
    <a
      class="player-control-title-link"
      :href="`https://www.google.co.jp/search?q=${encodeURIComponent(title)}`"
      target="_blank"
      rel="noopener"
      :aria-label="`Googleで${title}を検索する`"
    >
      <span ref="titleElement" :style="{ animationDuration }">{{ title }}</span>
      <span v-if="isLong" :style="{ animationDuration }">{{ title }}</span>
    </a>
  </span>
</template>

<script setup>
const props = defineProps({
  title: String,
  wrapWidth: Number
})
const titleElement = ref(null)
const titleWidth = ref(0)

const isLong = computed(() => {
  if (titleWidth.value === 0 || props.wrapWidth === 0) {
      return false
    }

    return titleWidth.value > props.wrapWidth
})

const animationDuration = computed(() => {
  if (!isLong.value) {
    return 0
  }

  return `${(4000 * titleWidth.value) / 100}ms`
})

watch(() => props.wrapWidth, () => {
  if (!titleElement.value) {
    return
  }

  titleWidth.value = titleElement.value.clientWidth
}, {
  immediate: true
})

onMounted(() => {
  titleWidth.value = titleElement.value.clientWidth
})

</script>

<style lang="scss" scoped>
.player-control-title {
  &-text {
    line-height: 1;
    display: flex;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    align-items: center;
    letter-spacing: 0.18em;
    will-change: transform;
    @include fit-full;
    @include font-m;
    &.is-long {
      span {
        animation: ticker 100s 2.5s linear infinite;
        will-change: transform;
      }
    }
  }
  &-link {
    display: flex;
    @include focus-visible {
      color: $color-link;
    }
    @include desktop {
      padding: 0 2rem 0.1rem;
      &:hover {
        color: $color-link;
      }
    }
    span {
      padding: 0 1.6rem;
    }
  }
}

@keyframes ticker {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50%,
  100% {
    transform: translate3d(-100%, 0, 0);
  }
}
</style>
