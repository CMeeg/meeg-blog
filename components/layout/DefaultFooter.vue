<template>
  <footer>
    <p>&copy; {{ currentYear }}</p>
  </footer>
</template>

<script>
export default {
  data: function() {
    return {
      currentYear: new Date().getFullYear()
    }
  }
}
</script>
