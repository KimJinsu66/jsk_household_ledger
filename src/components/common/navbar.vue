<template>
  <div class="navbar">
    <div class="navbar__logo">
    </div>

    <div class="navbar__links">
      <router-link to="/" class="navbar__link">HOME</router-link>
      <router-link to="about" class="navbar__link">ABOUT</router-link>
      <router-link to="signin" class="navbar__link">Sign In</router-link>
      <router-link to="signup" class="navbar__link">Sign Up</router-link>
      <router-link to="withdrawal" class="navbar__link">WithDrawal</router-link>
    </div>
  </div>
</template>

<style land="scss">
.navbar {
  width: 100%;
  height: 50px;
  display: flex;
}
.navbar__link {
  margin-left: 15px;
}
</style>
