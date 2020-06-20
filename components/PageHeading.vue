<template>
  <div class="mx-auto px-6 py-8 max-w-2xl text-center">
    <h1 class="font-serif leading-tight text-4xl sm:text-5xl">
      <slot name="title" />
    </h1>
    <div>
      <slot name="intro" />
    </div>
    <div>
      <slot name="metadata" />
    </div>
  </div>
</template>
