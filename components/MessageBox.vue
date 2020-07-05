<template>
  <div
    :class="messageTypeCssClass"
    class="message-box flex items-start mb-6 p-6 pb-3 pl-3 text-sm rounded-lg"
  >
    <svg
      v-if="type === 'info'"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      class="flex-shrink-0 h-6 w-6 mr-3 fill-current text-white"
    >
      <path
        d="M10 .4C4.697.4.399 4.698.399 10A9.6 9.6 0 0 0 10 19.601c5.301 0 9.6-4.298 9.6-9.601 0-5.302-4.299-9.6-9.6-9.6zm.896 3.466c.936 0 1.211.543 1.211 1.164 0 .775-.62 1.492-1.679 1.492-.886 0-1.308-.445-1.282-1.182 0-.621.519-1.474 1.75-1.474zM8.498 15.75c-.64 0-1.107-.389-.66-2.094l.733-3.025c.127-.484.148-.678 0-.678-.191 0-1.022.334-1.512.664l-.319-.523c1.555-1.299 3.343-2.061 4.108-2.061.64 0 .746.756.427 1.92l-.84 3.18c-.149.562-.085.756.064.756.192 0 .82-.232 1.438-.719l.362.486c-1.513 1.512-3.162 2.094-3.801 2.094z"
      />
    </svg>
    <svg
      v-if="type === 'error'"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      class="flex-shrink-0 h-6 w-6 mr-3 fill-current text-grey-800"
    >
      <path
        d="M10.001.4C4.698.4.4 4.698.4 10a9.6 9.6 0 0 0 9.601 9.601c5.301 0 9.6-4.298 9.6-9.601-.001-5.302-4.3-9.6-9.6-9.6zM10 17.599a7.6 7.6 0 1 1 0-15.2 7.6 7.6 0 0 1 0 15.2zm2.501-7.849c.828 0 1.5-.783 1.5-1.75s-.672-1.75-1.5-1.75-1.5.783-1.5 1.75.671 1.75 1.5 1.75zm-5 0c.828 0 1.5-.783 1.5-1.75s-.672-1.75-1.5-1.75-1.5.783-1.5 1.75.671 1.75 1.5 1.75zm2.501 1.5c-3.424 0-4.622 2.315-4.672 2.414a.75.75 0 0 0 1.342.672c.008-.017.822-1.586 3.33-1.586 2.463 0 3.298 1.527 3.328 1.585a.75.75 0 1 0 1.342-.67c-.049-.099-1.246-2.415-4.67-2.415z"
      />
    </svg>

    <slot />
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    messageTypeCssClass() {
      const cssClass = `message-box--${this.type}`

      if (this.type === 'error') {
        return cssClass + ' text-white bg-red-300'
      }

      return cssClass + ' text-gray-300 bg-blue-900'
    }
  }
}
</script>
