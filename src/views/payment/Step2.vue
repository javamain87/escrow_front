<template>
  <section
    class="min-h-screen bg-gradient-to-b from-[#f8f9ff] to-[#e0eaff] text-[#1c1e21] px-6 py-10"
  >
    <div class="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <h2 class="text-2xl font-bold mb-6 text-center">거래 정보 입력</h2>

      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- 역할 선택 -->
        <div>
          <label class="block font-medium mb-1">역할 선택</label>
          <select
            v-model="form.role"
            class="w-full border p-2 rounded"
            required
          >
            <option disabled value="">-- 선택하세요 --</option>
            <option value="buyer">구매자</option>
            <option value="seller">판매자</option>
          </select>
        </div>

        <!-- 구매자 전용 -->
        <template v-if="form.role === 'buyer'">
          <div>
            <label class="block font-medium mb-1">이름</label>
            <input
              v-model="form.requesterName"
              type="text"
              class="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label class="block font-medium mb-1">이메일</label>
            <input
              v-model="form.requesterEmail"
              type="email"
              class="w-full border p-2 rounded"
            />
          </div>

          <label class="block font-medium mb-1 mt-2">전화번호</label>
          <input
            v-model="form.phone"
            type="tel"
            class="w-full border p-2 rounded"
          />

          <div>
            <label class="block font-medium mb-1">결제 방식</label>
            <select
              v-model="form.payment"
              class="w-full border p-2 rounded"
              required
            >
              <option value="bank">계좌이체</option>
              <option value="coin">코인</option>
            </select>
          </div>

          <div>
            <label class="block font-medium mb-1">거래금액</label>
            <input
              v-model="form.amount"
              type="number"
              class="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label class="block font-medium mb-1">거래내용</label>
            <textarea
              v-model="form.description"
              class="w-full border p-2 rounded"
              rows="3"
              required
            ></textarea>
          </div>

          <div>
            <label class="block font-medium mb-1"
              >배송 예상 시간 (예: 3일)</label
            >
            <input
              v-model="form.deliveryTime"
              type="text"
              class="w-full border p-2 rounded"
              required
            />
          </div>
        </template>

        <!-- 판매자 전용 -->
        <template v-if="form.role === 'seller'">
          <div>
            <label class="block font-medium mb-1">거래 ID</label>
            <input
              v-model="form.tradeCode"
              type="text"
              class="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label class="block font-medium mb-1">이름</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label class="block font-medium mb-1">이메일</label>
            <input
              v-model="form.requesterEmail"
              type="email"
              class="w-full border p-2 rounded"
            />
          </div>

          <label class="block font-medium mb-1 mt-2">전화번호</label>
          <input
            v-model="form.phone"
            type="tel"
            class="w-full border p-2 rounded"
          />

          <div>
            <label class="block font-medium mb-1">상호명</label>
            <input
              v-model="form.company"
              type="text"
              class="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label class="block font-medium mb-1">비밀번호 설정</label>
            <input
              v-model="form.approvalPassword"
              type="password"
              class="w-full border p-2 rounded"
              required
            />
          </div>
        </template>

        <!-- reCAPTCHA -->
        <div>
          <label class="block font-medium mb-1"
            >로봇이 아님을 확인해주세요</label
          >
          <div
            ref="recaptchaRef"
            class="g-recaptcha"
            :data-sitekey="siteKey"
          ></div>
        </div>

        <button
          type="submit"
          class="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          {{ form.role === "buyer" ? "거래 등록" : "비밀번호 등록" }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { apiPost } from "@/common/utils/axios";

const router = useRouter();

const form = ref({
  role: "",
  payment: "",
  company: "", // 판매자용 상호명
  amount: "",
  description: "",
  deliveryTime: "",
  requesterName: "",
  requesterPhone: "",
  tradeCode: "",
  approvalPassword: "",
  name: "", // 판매자 이름
  requesterEmail: "", // 판매자 연락처
  phone: "",
  recaptchaToken: "",
});

const siteKey = "6Lf8SFArAAAAABrbWbSWhIdi39T96jcq_tgiweED";
const recaptchaRef = ref(null);

const submitForm = async () => {
  if (!form.value.recaptchaToken) {
    alert("reCAPTCHA 인증이 필요합니다.");
    return;
  }

  try {
    let payload = { ...form.value };
    let returnVal = {};

    if (form.value.role === "buyer") {
      if (payload.phone === "" && payload.requesterEmail === "") {
        alert("Email 또는 전화번호는 필수로 입력 해주셔야 합니다.");
        return;
      }
      await apiPost("/api/payment/register", payload).then((res) => {
        returnVal = res.data;
      });
    } else if (form.value.role === "seller") {
      if (payload.phone === "" && payload.requesterEmail === "") {
        alert("Email 또는 전화번호는 필수로 입력 해주셔야 합니다.");
        return;
      }
      payload = {
        tradeCode: form.value.tradeCode,
        approvalPassword: form.value.approvalPassword,
        name: form.value.name,
        phone: form.value.phone,
        requesterEmail: form.value.requesterEmail,
        company: form.value.company,
      };

      await apiPost("/api/payment/set-password", payload).then((res) => {
        returnVal = res.data;
      });
    }

    alert("정상적으로 처리되었습니다.");
    router.push({
      path: "/success",
      query: {
        transactionId: returnVal.tradeCode,
        transactionPassword: returnVal.password,
        role: returnVal.role,
      },
    });
  } catch (err) {
    console.error(err);
    alert("에러가 발생했습니다.");
  }
};

onMounted(() => {
  if (window.grecaptcha) {
    renderRecaptcha();
  } else {
    window.onloadCallback = renderRecaptcha;
  }
});

const renderRecaptcha = () => {
  window.grecaptcha.render(recaptchaRef.value, {
    sitekey: siteKey,
    callback: (token) => {
      form.value.recaptchaToken = token;
    },
  });
};
</script>
