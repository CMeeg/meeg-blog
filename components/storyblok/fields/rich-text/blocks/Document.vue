<template>
  <div class="content-block"><slot /></div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'SbDocument'
})
</script>
