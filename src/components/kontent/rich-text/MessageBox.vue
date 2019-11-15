<template>
  <message-box>
    <div slot="message" v-html="node.message" />
  </message-box>
</template>

<script>
import MessageBox from '@/components/MessageBox.vue';

export default {
  components: {
    MessageBox
  },
  props: {
    node: {
      type: Object,
      required: true
    }
  }
};
</script>
