<!--
Copyright (c) 2018 inSpace Technologies Ltd
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->
<template>
  <div class="navbar">
    <router-link
      :to="{ name: 'home' }"
      exact
      class="navbar-button logo-link"
    >
      <img
        class="logo-img"
        src="../images/inspace-logo.png"
      >
    </router-link>
    <router-link
      :to="{name: 'home'}"
      exact
      class="navbar-button"
    >
      <font-awesome-icon icon="home" />
      Home
    </router-link>
    <router-link
      v-if="this.$store.state.iscoin.balance !== null"
      :to="{name: 'iscoin'}"
      exact
      class="navbar-button"
    >
      <font-awesome-icon icon="coins" />
      {{ this.$store.state.iscoin.balance + ' ' + currencySymbol }}
    </router-link>
    <router-link
      :to="{name: 'eos-setup'}"
      exact
      class="navbar-button"
    >
      <EOSLogo />
      EOS setup
    </router-link>
  </div>
</template>
<style scoped>
.navbar {
  display: flex;
  background-color: #404040;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 0 0.5rem;
}
.navbar-button {
  color: rgba(255,255,255,0.5);
  fill: rgba(255,255,255,0.5);
  padding: 0.5rem;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
}
.navbar-button:hover:not(.router-link-exact-active) {
  color: rgba(255,255,255,0.75);
  fill: rgba(255,255,255,0.75);
}
.navbar > .router-link-exact-active {
  color: rgba(255,255,255,1.0);
  fill: rgba(255,255,255,1.0);
}
.logo-link {
  flex-grow: 1;
}
.logo-img {
  height: 2.45rem;
  width: auto;
}
svg {
  height: 1em;
}
</style>
<script>
import EOSLogo from '../images/Chestahedron-Fat-Black.svg';

export default {
  components: {
    EOSLogo,
  },
  data() {
    return {
      currencySymbol: process.env.CURRENCY_SYMBOL, // can't have this in {{ }} because webpack deals with setting it
    };
  },
};
</script>
