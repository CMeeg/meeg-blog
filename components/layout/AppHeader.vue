<template>
  <header>
    <nav>
      <max-width-container>
        <div class="relative flex items-center justify-between h-24">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <!-- Mobile menu button -->
            <button
              :aria-expanded="mainNavIsOpen ? 'true' : 'false'"
              class="inline-flex items-center justify-center p-2 text-gray-300 rounded-md duration-150 ease-in-out transition focus:text-green-400 focus:bg-gray-800 focus:outline-none hover:text-green-400 hover:bg-gray-800"
              aria-label="Main menu"
              @click="toggleMainNav"
            >
              <!-- Icon when menu is closed -->
              <svg
                v-if="mainNavIsClosed"
                class="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <!-- Icon when menu is open -->
              <svg
                v-if="mainNavIsOpen"
                class="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"
          >
            <div class="flex-shrink-0">
              <nuxt-link to="/" class="block text-center sm:inline-block">
                <field-image-asset
                  :field="$store.state.global.logo"
                  options="filters:quality(70)"
                  class="inline h-12 w-12 rounded-full sm:inline-block sm:h-16 sm:w-16"
                  alt=""
                />
              </nuxt-link>
              <nuxt-link
                to="/"
                class="block align-middle font-cursive text-white text-xl sm:inline-block sm:px-3 sm:text-2xl"
              >
                Chris Meagher
              </nuxt-link>
            </div>
            <div class="hidden sm:block sm:ml-6 sm:py-4">
              <ul class="main-nav flex">
                <li v-for="(navitem, index) in mainNavItems" :key="index">
                  <nuxt-link
                    :to="navitem.link.cached_url | rootRelative"
                    class="inline-block ml-4 px-3 py-2 font-medium leading-5 text-gray-300 text-sm rounded-md duration-300 ease-in-out transition focus:text-green-400 focus:bg-gray-800 focus:outline-none hover:text-green-400 hover:bg-gray-800"
                  >
                    {{ navitem.name }}
                  </nuxt-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </max-width-container>

      <div
        :class="mainNavIsOpen ? 'block' : 'hidden'"
        class="bg-gray-800 sm:hidden"
      >
        <ul class="main-nav px-6 py-2">
          <li v-for="(navitem, index) in mainNavItems" :key="index">
            <nuxt-link
              :to="navitem.link.cached_url | rootRelative"
              class="block mt-1 px-3 py-2 font-medium text-base text-gray-300 rounded-md duration-300 ease-in-out transition hover:text-green-400 hover:bg-gray-900 focus:text-green-400 focus:bg-gray-900 focus:outline-none"
              @click.native="toggleMainNav"
            >
              {{ navitem.name }}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  data() {
    return {
      mainNavIsOpen: false
    }
  },
  computed: {
    mainNavItems() {
      return this.$store.state.global.main_nav
    },
    mainNavIsClosed() {
      return !this.mainNavIsOpen
    }
  },
  methods: {
    toggleMainNav() {
      this.mainNavIsOpen = this.mainNavIsClosed
    }
  }
}
</script>
