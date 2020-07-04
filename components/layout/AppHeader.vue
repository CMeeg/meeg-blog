<template>
  <header>
    <nav>
      <max-width-container>
        <template v-if="$fetchState.pending">
          <content-placeholders class="h-24 py-4">
            <content-placeholders-heading :img="true" />
          </content-placeholders>
        </template>
        <template v-else-if="$fetchState.error">
          <message-box type="error">
            <div class="content-block">
              <p>
                <em>{{ $fetchState.error.message }}</em>
              </p>
            </div>
          </message-box>
        </template>
        <template v-else>
          <div class="relative flex items-center justify-between h-24">
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <!-- Mobile menu button -->
              <button
                :aria-expanded="
                  mainNav.state === mainNavState.open ? 'true' : 'false'
                "
                class="inline-flex items-center justify-center p-2 text-gray-300 rounded-md duration-150 ease-in-out transition focus:text-green-400 focus:bg-gray-800 focus:outline-none hover:text-green-400 hover:bg-gray-800"
                aria-label="Main menu"
                @click="toggleMainNavState"
              >
                <!-- Icon when menu is closed -->
                <svg
                  v-if="mainNav.state === mainNavState.closed"
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
                  v-if="mainNav.state === mainNavState.open"
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
                    :field="logo"
                    options="140x0/filters:quality(70)"
                    class="inline h-12 w-12 rounded-full sm:inline-block sm:h-16 sm:w-16"
                    alt="Chris Meagher"
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
                  <li v-for="item in mainNav.items" :key="item._uid">
                    <nuxt-link
                      :to="item.link.cached_url | rootRelative"
                      class="inline-block ml-4 px-3 py-2 font-medium leading-5 text-gray-300 text-sm rounded-md duration-300 ease-in-out transition focus:text-green-400 focus:bg-gray-800 focus:outline-none hover:text-green-400 hover:bg-gray-800"
                    >
                      {{ item.name }}
                    </nuxt-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </template>
      </max-width-container>

      <template v-if="!$fetchState.pending">
        <div
          :class="mainNav.state === mainNavState.open ? 'block' : 'hidden'"
          class="bg-gray-800 sm:hidden"
        >
          <ul class="main-nav px-6 py-2">
            <li v-for="item in mainNav.items" :key="item._uid">
              <nuxt-link
                :to="item.link.cached_url | rootRelative"
                class="block mt-1 px-3 py-2 font-medium text-base text-gray-300 rounded-md duration-300 ease-in-out transition hover:text-green-400 hover:bg-gray-900 focus:text-green-400 focus:bg-gray-900 focus:outline-none"
                @click.native="toggleMainNavState"
              >
                {{ item.name }}
              </nuxt-link>
            </li>
          </ul>
        </div>
      </template>
    </nav>
  </header>
</template>

<script>
const mainNavState = {
  open: 'open',
  closed: 'closed'
}

export default {
  fetch() {
    const global = this.$store.state.global

    this.logo = global.logo
    this.mainNav.items = global.main_nav
  },
  data() {
    return {
      logo: null,
      mainNav: {
        items: [],
        state: mainNavState.closed
      }
    }
  },
  created() {
    // Expose to template
    this.mainNavState = mainNavState
  },
  methods: {
    toggleMainNavState() {
      this.mainNav.state =
        this.mainNav.state === mainNavState.closed
          ? mainNavState.open
          : mainNavState.closed
    }
  }
}
</script>
