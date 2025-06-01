<template>
  <section
    class="min-h-screen bg-gradient-to-b from-[#f8f9ff] to-[#e0eaff] text-[#1c1e21] px-6 py-10"
  >
    <div class="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-8">
      <h2 class="text-2xl font-bold mb-6 text-center">거래 정보 인증</h2>

      <!-- 조회 영역 -->
      <div class="space-y-4">
        <!-- 역할 선택 먼저 -->
        <div>
          <label class="block font-medium mb-1">역할 선택</label>
          <select
            v-model="form.role"
            class="w-full border p-2 rounded"
            required
            :disabled="accessChecked"
          >
            <option disabled value="">-- 선택 --</option>
            <option value="buyer">구매자</option>
            <option value="seller">판매자</option>
          </select>
        </div>

        <!-- 거래 ID 입력 -->
        <div>
          <label class="block font-medium mb-1">거래 ID</label>
          <input
            v-model="form.tradeCode"
            type="text"
            class="w-full border p-2 rounded"
            required
          />
        </div>

        <!-- 조회 버튼 -->
        <button
          @click="checkTradeCode"
          class="w-full py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          조회
        </button>
      </div>

      <!-- 인증 입력 폼 -->
      <form
        v-if="accessGranted"
        @submit.prevent="submitAccess"
        class="space-y-4 mt-6"
      >
        <!-- 판매자 로직 -->
        <div v-if="form.role === 'seller'">
          <div v-if="sellerPasswordExists">
            <label class="block font-medium mb-1">판매자 비밀번호</label>
            <input
              v-model="form.password"
              type="password"
              class="w-full border p-2 rounded"
              required
            />
          </div>
          <div v-else>
            <label class="block font-medium mb-1">이름</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full border p-2 rounded"
              required
            />
            <label class="block font-medium mb-1">상호명</label>
            <input
              v-model="form.company"
              type="text"
              class="w-full border p-2 rounded"
              required
            />
            <label class="block font-medium mb-1 mt-2">전화번호</label>
            <input
              v-model="form.phone"
              type="tel"
              class="w-full border p-2 rounded"
            />
            <label class="block font-medium mb-1 mt-2">이메일</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full border p-2 rounded"
            />
            <label class="block font-medium mb-1 mt-2">비밀번호 생성</label>
            <input
              v-model="form.password"
              type="password"
              class="w-full border p-2 rounded"
              required
            />
          </div>
        </div>

        <!-- 구매자 로직 -->
        <div v-if="form.role === 'buyer'">
          <label class="block font-medium mb-1">구매자 비밀번호</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full border p-2 rounded"
            required
          />
        </div>

        <!-- 제출 -->
        <button
          type="submit"
          class="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          진행하기
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { apiPost } from "@/common/utils/axios";

const router = useRouter();

const form = ref({
  tradeCode: "",
  password: "",
  role: "",
  name: "",
  phone: "",
  email: "",
});

const accessGranted = ref(false);
const sellerPasswordExists = ref(false);
const accessChecked = ref(false);

const checkTradeCode = async () => {
  if (!form.value.role) {
    alert("역할을 먼저 선택해주세요.");
    return;
  }

  try {
    const res = await apiPost("/api/payment/check-trade-code", {
      tradeCode: form.value.tradeCode,
      role: form.value.role,
    });

    if (form.value.role === "buyer") {
      if (!res.data) throw new Error("데이터를 찾을 수가 없습니다."); // 구매자는 trade 테이블에 등록된 경우만 허용
      accessGranted.value = true;
    } else if (form.value.role === "seller") {
      if (res.data === true) {
        // 판매자 정보가 이미 등록됨 → 비밀번호 입력만
        sellerPasswordExists.value = true;
        accessGranted.value = true;
      } else if (res.data === false) {
        // 판매자 정보가 없음 → 추가 입력 받기
        sellerPasswordExists.value = false;
        accessGranted.value = true;
      } else {
        throw new Error(); // 응답 형식이 예상과 다르면 에러 처리
      }
    }

    accessChecked.value = true;
  } catch (err) {
    alert("거래 코드가 존재하지 않거나, 역할에 맞는 정보가 없습니다.");
    accessGranted.value = false;
    accessChecked.value = false;
  }
};

const submitAccess = async () => {
  try {
    let payload = {
      tradeCode: form.value.tradeCode,
      tradePassword: form.value.password,
      role: form.value.role,
    };

    // 판매자 최초 등록일 경우 정보 추가
    if (form.value.role === "seller" && !sellerPasswordExists.value) {
      if (form.value.email === "" && form.value.phone === "") {
        alert("Email 또는 전화번호는 필수로 입력 해주셔야 합니다.");
        return;
      }
      payload = {
        ...payload,
        approvalPassword: form.value.password, // password 필드를 그대로 보냄
        name: form.value.name,
        phone: form.value.phone,
        email: form.value.email,
        company: form.value.company,
      };
    }

    await apiPost("/api/payment/access", payload);

    router.push({
      path: "/step3",
      query: {
        tradeCode: form.value.tradeCode,
        tradePassword: form.value.password,
        role: form.value.role,
      },
    });
  } catch (err) {
    alert("거래 정보가 올바르지 않거나 접근 권한이 없습니다.");
  }
};
</script>
