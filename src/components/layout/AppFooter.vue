<template>
  <footer class="mt-6">
    <max-width-container>
      <div
        class="flex items-center justify-between pb-6 pt-5 border-t border-gray-800"
      >
        <p class="text-gray-500 text-sm">
          {{ copyright }} &copy; {{ currentYear }}
        </p>
        <ul class="flex items-center">
          <li v-if="githubUrl" class="ml-2">
            <a :href="githubUrl" title="Find me on GitHub">
              <svg
                class="h-6 w-6 text-gray-500 duration-300 ease-in-out transition fill-current focus:text-white hover:text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M13.18 11.309c-.718 0-1.3.807-1.3 1.799 0 .994.582 1.801 1.3 1.801s1.3-.807 1.3-1.801c-.001-.992-.582-1.799-1.3-1.799zm4.526-4.683c.149-.365.155-2.439-.635-4.426 0 0-1.811.199-4.551 2.08-.575-.16-1.548-.238-2.519-.238-.973 0-1.945.078-2.52.238C4.74 2.399 2.929 2.2 2.929 2.2c-.789 1.987-.781 4.061-.634 4.426C1.367 7.634.8 8.845.8 10.497c0 7.186 5.963 7.301 7.467 7.301l1.734.002 1.732-.002c1.506 0 7.467-.115 7.467-7.301 0-1.652-.566-2.863-1.494-3.871zm-7.678 10.289h-.056c-3.771 0-6.709-.449-6.709-4.115 0-.879.31-1.693 1.047-2.369C5.537 9.304 7.615 9.9 9.972 9.9h.056c2.357 0 4.436-.596 5.664.531.735.676 1.045 1.49 1.045 2.369 0 3.666-2.937 4.115-6.709 4.115zm-3.207-5.606c-.718 0-1.3.807-1.3 1.799 0 .994.582 1.801 1.3 1.801.719 0 1.301-.807 1.301-1.801 0-.992-.582-1.799-1.301-1.799z"
                />
              </svg>
            </a>
          </li>
          <li v-if="twitterUrl" class="ml-2">
            <a :href="twitterUrl" title="Find me on Twitter">
              <svg
                class="h-6 w-6 text-gray-500 duration-300 ease-in-out transition fill-current focus:text-white hover:text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M17.316 6.246c.008.162.011.326.011.488 0 4.99-3.797 10.742-10.74 10.742-2.133 0-4.116-.625-5.787-1.697a7.577 7.577 0 0 0 5.588-1.562 3.779 3.779 0 0 1-3.526-2.621 3.858 3.858 0 0 0 1.705-.065 3.779 3.779 0 0 1-3.028-3.703v-.047a3.766 3.766 0 0 0 1.71.473 3.775 3.775 0 0 1-1.168-5.041 10.716 10.716 0 0 0 7.781 3.945 3.813 3.813 0 0 1-.097-.861 3.773 3.773 0 0 1 3.774-3.773 3.77 3.77 0 0 1 2.756 1.191 7.602 7.602 0 0 0 2.397-.916 3.789 3.789 0 0 1-1.66 2.088 7.55 7.55 0 0 0 2.168-.594 7.623 7.623 0 0 1-1.884 1.953z"
                />
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </max-width-container>
  </footer>
</template>

<script>
export default {
  data() {
    const global = this.$store.state.global

    const githubUrl = global.github_username
      ? `https://github.com/${global.github_username}`
      : null

    const twitterUrl = global.twitter_username
      ? `https://twitter.com/${global.twitter_username}`
      : null

    return {
      copyright: global.copyright,
      currentYear: new Date().getFullYear(),
      githubUrl,
      twitterUrl
    }
  }
}
</script>
