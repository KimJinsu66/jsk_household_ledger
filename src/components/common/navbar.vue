<template>
  <div class="navbar">
    <div class="navbar__logo">
    </div>

    <div class="navbar__links">
      <router-link to="/" class="navbar__link">HOME</router-link>
      <router-link to="/withdrawal?page=1" class="navbar__link">지출내역</router-link>
      <router-link :to="currentYearMonthToMonthUrl()" class="navbar__link">지출내역(월)</router-link>
      <router-link :to="currentYearMonthToCalendarUrl()" class="navbar__link">지출내역(월)</router-link>
      <router-link to="/withdrawal/new" class="navbar__link">지출기록</router-link>
      <router-link to="/signin" class="navbar__link">로그인</router-link>
      <router-link to="/signup" class="navbar__link">회원가입</router-link>
      <router-link to="/about" class="navbar__link">ABOUT</router-link>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    currentYearMonthToMonthUrl () {
      const now = new Date();

      return `/withdrawal/month?yaer=${now.getFullYear()}&month=${now.getMonth()}`;
    },
    currentYearMonthToCalendarUrl () {
      const now = new Date();

      return `/withdrawal/calendar?yaer=${now.getFullYear()}&month=${now.getMonth()}`;
    },
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 50px;
  display: flex;
  &__link {
    margin-left: 15px;
    text-decoration: none;
  }
}
</style>
