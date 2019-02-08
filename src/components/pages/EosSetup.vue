<!--
Copyright (c) 2018 inSpace Technologies Ltd
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->
<template>
  <div class="central">
    <div class="card">
      <div class="card-header">
        <span class="card-title">
          EOS setup
        </span>
      </div>
      <div class="card-content">
        <scatter-setup @identity-set="identitySet()" />
        <div class="card">
          <div class="card-header">
            <span class="card-title">
              Using the inSpace client
            </span>
          </div>
          <div class="card-content">
            <p>Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>
<script>
export default {
  methods: {
    identitySet() {
      if (this.$route.query && this.$route.query.redirect) {
        this.$router.push({ path: this.$route.query.redirect });
      }
    },
  },
};
</script>
