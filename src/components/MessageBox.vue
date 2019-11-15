<template>
  <div class="border-l-4 border-blue-800 mb-8 p-4 pb-2 bg-blue-200 shadow-md text-base text-blue-800 text-sm">
    <div class="flex">
      <div>
        <svg class="stroke-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </div>
      <slot name="message" />
    </div>
  </div>
</template>
