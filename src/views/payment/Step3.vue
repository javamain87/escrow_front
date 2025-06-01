<template>
  <section
    class="min-h-screen bg-gradient-to-b from-[#f8f9ff] to-[#e0eaff] text-[#1c1e21] px-6 py-10"
  >
    <div class="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <h2 class="text-2xl font-bold mb-6 text-center">거래 진행 상황</h2>

      <!-- 탭 영역 -->
      <div class="flex gap-4 mb-4 justify-center">
        <button
          :class="
            activeTab === 'status'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          "
          class="px-4 py-2 rounded"
          @click="activeTab = 'status'"
        >
          배송 현황
        </button>
        <button
          :class="
            activeTab === 'history'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          "
          class="px-4 py-2 rounded"
          @click="activeTab = 'history'"
        >
          배송 내역
        </button>
      </div>

      <div class="space-y-6">
        <!-- 상태 표시 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 border rounded-lg bg-gray-50">
            <h3 class="text-lg font-semibold mb-2">판매자 승인 상태</h3>
            <p :class="sellerApproved ? 'text-green-600' : 'text-yellow-600'">
              {{
                sellerApproved
                  ? "✅ 판매자 승인 완료"
                  : "⏳ 판매자 승인 대기 중"
              }}
            </p>
          </div>
          <div class="p-4 border rounded-lg bg-gray-50">
            <h3 class="text-lg font-semibold mb-2">구매자 입금 상태</h3>
            <p :class="buyerPaid ? 'text-green-600' : 'text-yellow-600'">
              {{ buyerPaid ? "✅ 입금 완료" : "⏳ 입금 대기 중" }}
            </p>
          </div>
        </div>

        <!-- 배송 현황 탭 -->
        <!-- 배송 현황 탭 -->
        <div v-if="activeTab === 'status'">
          <div v-if="role === 'buyer'">
            <h3 class="text-lg font-bold mb-3">배송 상태</h3>
            <div class="flex justify-around text-center">
              <div
                v-for="(step, idx) in deliverySteps"
                :key="idx"
                class="flex flex-col items-center"
              >
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center mb-1"
                  :class="{
                    'bg-blue-600 text-white': step.active,
                    'bg-gray-300 text-gray-600': !step.active,
                  }"
                >
                  {{ idx + 1 }}
                </div>
                <span class="text-sm">{{ step.label }}</span>
              </div>
            </div>
          </div>

          <div v-if="role === 'seller' && buyerPaid && status !== 'COMPLETED'">
            <label class="block font-semibold mb-2">배송 상태 선택</label>
            <select v-model="deliveryStatus" class="w-full border p-2 rounded">
              <option value="SHIPPING_PREP">배송 준비중</option>
              <option value="SHIPPING">배송 시작</option>
              <option value="DELIVERED">배송 완료</option>
            </select>

            <label class="block font-semibold mt-4 mb-2">특이사항 입력</label>
            <textarea
              v-model="specialNote"
              placeholder="예: 상품 박스가 훼손되었습니다"
              class="w-full border p-2 rounded"
            ></textarea>

            <button
              @click="submitDeliveryStatus"
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              배송 상태 업데이트
            </button>
          </div>

          <!-- ✅ 구매자 수령 확인 버튼 -->
          <div
            v-if="
              role === 'buyer' &&
              deliveryStatus === 'DELIVERED' &&
              status !== 'COMPLETED'
            "
            class="mt-4 text-center"
          >
            <button
              @click="confirmReceipt"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              상품 수령 완료
            </button>
          </div>
        </div>

        <!-- 배송 내역 탭 -->
        <div v-if="activeTab === 'history'">
          <div v-if="workHistory.length">
            <h3 class="text-lg font-semibold mb-2">판매자 특이사항 이력</h3>
            <ul class="space-y-2">
              <li
                v-for="item in workHistory"
                :key="item.id"
                class="text-sm text-gray-700 border p-3 rounded-md"
              >
                <div class="font-medium text-gray-600">
                  🕒 {{ item.createdAt }}
                </div>
                <div>{{ item.content }}</div>
              </li>
            </ul>
          </div>
          <div v-else class="text-center text-sm text-gray-500">
            등록된 내역이 없습니다.
          </div>
        </div>

        <!-- 버튼 영역 -->
        <div class="flex gap-4 mt-6 justify-center">
          <button
            v-if="role === 'seller' && !sellerApproved"
            @click="toggleSellerApproval"
            class="py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            판매자 승인
          </button>

          <button
            v-if="role === 'buyer' && !buyerPaid"
            @click="toggleBuyerPayment"
            class="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
          >
            구매자 입금
          </button>
        </div>

        <div v-if="status === 'COMPLETED'" class="mt-8 text-center">
          <p class="text-lg font-semibold text-blue-600 mb-4">
            🎉 거래가 성공적으로 완료되었습니다!
          </p>
          <button
            @click="finish"
            class="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiPost, apiGet } from "@/common/utils/axios";

const route = useRoute();
const router = useRouter();
const tradeCode = route.query.tradeCode;
const password = route.query.tradePassword;
const role = route.query.role;

const sellerApproved = ref(false);
const buyerPaid = ref(false);
const status = ref("");
const deliveryStatus = ref("");
const specialNote = ref("");
const workHistory = ref([]);
const activeTab = ref("status");

const deliverySteps = ref([
  { label: "배송 준비중", value: "SHIPPING_PREP", active: false },
  { label: "배송 시작", value: "SHIPPING", active: false },
  { label: "배송 완료", value: "DELIVERED", active: false },
]);

const fetchTradeStatus = async () => {
  if (!tradeCode || !password || !role) {
    alert("접근 정보가 누락되었습니다.");
    router.push("/step3_login");
    return;
  }
  try {
    const res = await apiPost("/api/payment/access", {
      tradeCode,
      tradePassword: password,
      role,
    });
    const { trade, tradeDetail } = res.data;
    status.value = trade.status;
    sellerApproved.value = [
      "SELLER_APPROVED",
      "BUYER_PAID",
      "SHIPPING_PREP",
      "SHIPPING",
      "DELIVERED",
      "COMPLETED",
    ].includes(trade.status);
    buyerPaid.value = [
      "BUYER_PAID",
      "SHIPPING_PREP",
      "SHIPPING",
      "DELIVERED",
      "COMPLETED",
    ].includes(trade.status);

    if (tradeDetail) {
      deliveryStatus.value = tradeDetail.deliveryStatus || "";
      specialNote.value = tradeDetail.specialNote || "";
    }
    updateDeliverySteps();
  } catch (err) {
    alert("접근 권한이 없거나 거래 정보를 찾을 수 없습니다.");
    router.push("/step3_login");
  }
};

const updateDeliverySteps = () => {
  const currentIdx = deliverySteps.value.findIndex(
    (step) => step.value === deliveryStatus.value
  );
  deliverySteps.value.forEach((step, idx) => {
    step.active = currentIdx >= idx;
  });
};

const fetchWorkHistory = async () => {
  try {
    const res = await apiGet(`/api/payment/history?tradeCode=${tradeCode}`);
    workHistory.value = res.data || [];
  } catch (err) {
    console.error("📛 특이사항 이력 조회 실패", err);
  }
};

const toggleSellerApproval = async () => {
  if (role !== "seller") return;
  await apiPost("/api/payment/approve-seller", { tradeCode });
  fetchTradeStatus();
};

const toggleBuyerPayment = async () => {
  if (role !== "buyer") return;
  await apiPost("/api/payment/confirm-payment", { tradeCode });
  fetchTradeStatus();
};

const submitDeliveryStatus = async () => {
  await apiPost("/api/payment/update-status", {
    tradeCode,
    role,
    status: deliveryStatus.value,
    deliveryStatus: deliveryStatus.value,
    specialNote: specialNote.value,
  });
  alert("특이사항이 정상적으로 저장되었습니다.");
  fetchTradeStatus();
  fetchWorkHistory();
};

const confirmReceipt = async () => {
  await apiPost("/api/payment/update-status", {
    tradeCode,
    role,
    status: "COMPLETED",
  });
  fetchTradeStatus();
  fetchWorkHistory();
};

const finish = () => {
  router.push("/");
};

onMounted(() => {
  fetchTradeStatus();
  fetchWorkHistory();
});
</script>

<style scoped>
</style>