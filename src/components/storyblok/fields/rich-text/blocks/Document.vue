<template>
  <div class="max-w-none prose"><slot /></div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'SbDocument'
})
</script>
