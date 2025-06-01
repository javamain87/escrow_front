<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-900">
    <Header />
    <main class="flex-1 container mx-auto px-4 py-6">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>
