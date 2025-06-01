
<template>
  <section
    class="min-h-screen bg-gradient-to-b from-[#f8f9ff] to-[#e0eaff] text-[#1c1e21] px-6 py-10"
  >
    <div
      class="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 text-center"
    >
      <h2 class="text-2xl font-bold mb-6">
        🎉 거래가 성공적으로 생성되었습니다!
      </h2>

      <p class="mb-4 text-gray-700">
        아래 정보는 반드시 안전하게 저장해두세요.
      </p>

      <div class="bg-gray-100 p-4 rounded mb-4">
        <p><span class="font-semibold">거래 ID:</span> {{ transactionId }}</p>
        <p>
          <span class="font-semibold">비밀번호:</span> {{ transactionPassword }}
        </p>
      </div>

      <ul class="text-sm text-left text-gray-600 mb-6 list-disc list-inside">
        <li>거래 ID는 판매자와 구매자 이외에는 공유하지 마세요.</li>
        <li>거래 비밀번호는 본인만 알고 있어야 합니다.</li>
        <li>반드시 해당 정보를 저장해두세요.</li>
      </ul>

      <button
        @click="goHome"
        class="py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        홈으로 돌아가기
      </button>
    </div>
  </section>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const transactionId = route.query.transactionId || "";
const transactionPassword = route.query.transactionPassword || "";

const goHome = () => {
  router.push("/");
};
</script>
