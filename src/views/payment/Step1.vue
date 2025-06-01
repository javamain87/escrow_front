<template>
  <section
    class="min-h-screen bg-gradient-to-b from-[#f8f9ff] to-[#e0eaff] text-[#1c1e21] px-6 py-10"
  >
    <div class="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <h2 class="text-2xl font-bold mb-6 text-center">
        SecureTrade 거래 이용 약관
      </h2>
      <p class="mb-4 leading-7">
        본 서비스는 거래의 안전을 위해 제공되며, 판매자와 구매자의 상호
        동의하에만 거래가 성사됩니다. SecureTrade는 상품의 품질 또는 배송에 대한
        책임을 지지 않습니다.
      </p>
      <p class="mb-4 leading-7">
        거래를 시작하려면 아래의 약관에 동의하셔야 하며, 거래 ID와 비밀번호는
        반드시 안전하게 보관해주시기 바랍니다.
      </p>
      <div class="flex items-center mb-6">
        <input
          type="checkbox"
          id="agree"
          v-model="agreed"
          class="mr-2 w-5 h-5"
        />
        <label for="agree" class="text-sm"
          >위 내용을 모두 읽었으며, 거래 약관에 동의합니다.</label
        >
      </div>
      <button
        :disabled="!agreed"
        @click="goNext"
        class="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        거래 시작
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const agreed = ref(false);
const router = useRouter();

const generateId = () => {
  return "id" + Math.random().toString(36).substr(2, 16);
};

const generatePassword = () => {
  return (
    Math.random().toString(36).substr(2, 8) +
    "_" +
    Math.random().toString(36).substr(2, 8) +
    "_" +
    Math.random().toString(36).substr(2, 8) +
    "_" +
    Math.random().toString(36).substr(2, 8)
  );
};

const goNext = () => {
  if (agreed.value) {
    const transactionId = generateId();
    const transactionPassword = generatePassword();
    alert(
      `거래 ID는 판매자와 구매자 이외 누구에게도 공유하면 안됩니다.\n거래 비밀번호는 본인만 알고있어야 합니다.\n거래 ID와 거래 비밀번호를 저장해두세요.`
    );
    router.push("/step2");
  }
};
</script>
