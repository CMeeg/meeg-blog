<template>
  <div>
    <header>
      <strong>
        <g-link to="/">{{ siteName }}</g-link>
      </strong>
      <nav>
        <ul>
          <li><g-link to="/">Home</g-link></li>
          <li><g-link to="/about">About</g-link></li>
          <li><g-link to="/search">Search</g-link></li>
        </ul>
      </nav>
      <p><a :href="`https://twitter.com/${ twitterUser }`">Twitter</a></p>
      <p><a :href="`https://github.com/${ gitHubUser }`">GitHub</a></p>
    </header>
    <transition name="fade" appear>
      <main>
        <slot />
      </main>
    </transition>
    <footer>
      &copy; {{ currentYear }}
    </footer>
  </div>
</template>

<script>
const appConfig = require('~/app.config.js');

export default {
  data: function() {
    return {
      siteName: appConfig.siteName,
      twitterUser: appConfig.siteTwitterUser,
      gitHubUser: appConfig.siteGitHubUser,
      currentYear: new Date().getFullYear()
    }
  }
};
</script>

<style>
.fade-enter-active {
  transition: opacity .5s;
}

.fade-enter {
  opacity: 0;
}
</style>
