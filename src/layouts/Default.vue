<template>
  <div>
    <header>
      <strong>
        <g-link to="/">{{ $static.metaData.siteName }}</g-link>
      </strong>
      <nav>
        <ul>
          <li><g-link to="/">Home</g-link></li>
          <li><g-link to="/about">About</g-link></li>
          <li><g-link to="/search">Search</g-link></li>
        </ul>
      </nav>
      <p><a href="https://twitter.com/cmeeg">Twitter</a></p>
      <p><a href="https://github.com/cmeeg">GitHub</a></p>
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

<static-query>
query {
  metaData {
    siteName
  }
}
</static-query>

<script>
export default {
  data: function() {
    return {
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
