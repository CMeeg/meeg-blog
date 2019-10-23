<template>
  <div>
    <header class="relative top-0 flex justify-between md:justify-center px-4 py-2 border-red-600 border-t-4 bg-white shadow-md md:py-4">
      <g-link to="/" class="flex text-black hover:no-underline focus:no-underline">
        <g-image src="~/assets/img/cmeeg.jpg" width="200" alt="Chris Meagher" class="w-16 h-16 rounded-full border border-gray-400 mr-2" />
        <p class="self-center leading-none pt-3 pr-4 pb-1 border-b-2 border-white hover:border-gray-400 focus:border-gray-400">
          <strong class="font-serif text-xl font-normal">Chris Meagher</strong><br>
          <span class="font-mono italic text-gray-600">{{ siteName }}</span>
        </p>
      </g-link>
      <p class="flex-shrink self-center md:flex-none md:absolute md:right-0 md:pr-4">
        <a :href="`https://twitter.com/${ twitterUser }`"><g-image src="~/assets/img/twitter.svg" alt="Twitter" class="w-6 h-6 m-1" /></a>
        <a :href="`https://github.com/${ gitHubUser }`"><g-image src="~/assets/img/github.png" alt="GitHub" class="w-6 h-6 m-1" /></a>
      </p>
    </header>
    <main class="p-4 pb-2 bg-gray-100">
      <slot />
    </main>
    <footer class="p-4 pt-0 bg-gray-100 font-serif flex justify-center">
      <p class="pr-4">&copy; {{ currentYear }}</p>
      <nav class="text-red-600">
        <ul>
          <li class="inline-block pr-4"><g-link to="/about/">About me</g-link></li>
          <li class="inline-block"><g-link to="/thanks/">Thanks!</g-link></li>
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
