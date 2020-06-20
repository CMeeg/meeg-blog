<template>
  <div
    class="overflow-hidden p-6 border border-gray-700 bg-gray-800 rounded-lg"
  >
    <div>
      <slot name="header" />
    </div>
    <div>
      <slot name="body" />
    </div>
  </div>
</template>
