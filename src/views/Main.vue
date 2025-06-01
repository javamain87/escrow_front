<template>
  <div
    class="min-h-32 bg-gradient-to-b from-[#f8f9ff] to-[#e0eaff] text-[#1c1e21]"
  >
    <section
      class="text-center py-20 px-6 bg-gradient-to-br from-[#e4efff] to-[#f8f9ff] animate-fade-in"
    >
      <h1 class="text-4xl font-bold text-[#3949ab] mb-4">
        투명하고 안전한 디지털 거래
      </h1>
      <p class="text-lg mb-6">
        SecureTrade는 신뢰를 기반으로 한 프리미엄 거래 보호 서비스를 제공합니다.
      </p>
      <router-link
        to="/step1"
        class="inline-block bg-[#5c6ac4] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#4751a3] transition"
      >
        지금 거래 시작하기
      </router-link>
    </section>

    <section
      id="steps"
      class="flex flex-wrap justify-center gap-6 py-12 bg-white px-4"
    >
      <div
        class="step bg-[#f4f6fc] p-6 rounded-xl w-full sm:w-[300px] text-center shadow-md"
      >
        <h2 class="text-xl font-bold mb-2">1단계</h2>
        <p>거래 정보 입력</p>
      </div>
      <div
        class="step bg-[#f4f6fc] p-6 rounded-xl w-full sm:w-[300px] text-center shadow-md"
      >
        <h2 class="text-xl font-bold mb-2">2단계</h2>
        <p>판매자 승인</p>
      </div>
      <div
        class="step bg-[#f4f6fc] p-6 rounded-xl w-full sm:w-[300px] text-center shadow-md"
      >
        <h2 class="text-xl font-bold mb-2">3단계</h2>
        <p>구매자 입금</p>
      </div>
    </section>

    <section class="bg-[#eef2fb] py-12 text-center">
      <h3 class="text-2xl font-semibold mb-4">
        SecureTrade는 이런 기술을 사용합니다
      </h3>
      <ul class="space-y-2 text-lg">
        <li>✅ SSL 암호화 통신</li>
        <!-- <li>✅ 블록체인 해시 인증</li> -->
        <li>✅ 실시간 거래 추적</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
// 별도의 로직 없음
</script>

<style>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-in;
}
</style>
