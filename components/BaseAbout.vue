<template>
  <section class="about">
    <h2 class="about-title">
      <img src="/images/logo01.svg" alt="邦画の予告を、朝まで" />
    </h2>
    <div class="about-body">
      <p class="about-text">今日はなんだか邦画が観たい。</p>
      <p class="about-text">
        そう思って探し始めたものの、<br
          class="pc"
        />これだ！と思える映画になかなか出会えない。
      </p>
      <p class="about-text">
        映画館で流れる予告は悪く言われがちだけど、<br
          class="pc"
        />案外、あの時間が好きなんだよなぁ。
      </p>
      <p class="about-text">
        そんな気持ちの人が、どれほどいるかはわかりませんが、<br
          class="pc"
        />邦画を探すのが楽しくなる、おもしろい予告を集めました。
      </p>
      <p class="about-text">
        このサイトにない、おすすめの邦画などがありましたら、<br class="pc" /><a
          href="mailto:lawson.and.7.11@gmail.com"
          >メール</a
        >でご連絡をいただけたら嬉しいです。
      </p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.about {
  display: flex;
  padding: 3.5rem 2rem;
  @include desktop {
    max-width: $width-large;
    padding: 6rem 3rem 6rem 6rem;
  }
  a {
    @include link($color-link);
  }
  &-title {
    width: 2.5rem;
    margin-right: 2rem;
    flex: none;
    @include desktop {
      width: 3.5rem;
      margin-right: 5.8rem;
    }
    img {
      width: 100%;
      height: auto;
    }
  }
  &-body {
    min-width: 0;
    flex-grow: 1;
    margin-top: -0.6rem;
  }
  &-text {
    line-height: 1.8;
    text-align: justify;
    @include font-m;
    + .about-text {
      margin-top: 1em;
    }
  }
  &-list {
    margin-top: 1em;
    line-height: 1.8;
    @include font-s;
  }
}
</style>
