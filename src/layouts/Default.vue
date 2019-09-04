<template>
  <div>
    <header class="sticky top-0 flex justify-between px-4 py-2 border-red-600 border-t-4 bg-white shadow-md">
      <g-link to="/" class="flex flex-none">
        <g-image src="~/assets/img/cmeeg.jpg" width="200" alt="Chris Meagher" class="w-16 h-16 rounded-full border-2 border-gray-300 mr-2" />
        <p class="self-center leading-tight">
          <strong class="font-heading text-xl font-normal">Chris Meagher</strong><br>
          <span class="italic">{{ siteName }}</span>
        </p>
      </g-link>
      <p class="flex-shrink self-center">
        <a :href="`https://twitter.com/${ twitterUser }`"><g-image src="~/assets/img/twitter.svg" alt="Twitter" class="w-6 h-6 m-1" /></a>
        <a :href="`https://github.com/${ gitHubUser }`"><g-image src="~/assets/img/github.png" alt="GitHub" class="w-6 h-6 m-1" /></a>
      </p>
    </header>
    <main class="p-4 bg-gray-100">
      <slot />
    </main>
    <footer class="px-4">
      <p>&copy; {{ currentYear }}</p>
      <nav>
        <ul>
          <li><g-link to="/about">About me</g-link></li>
          <li><g-link to="/thanks">Thanks!</g-link></li>
        </ul>
      </nav>
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
