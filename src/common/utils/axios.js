import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // ✅ 백엔드 API URL ==> .env 로 세팅 하여 local , dev , prod 일떄 변경되도록 세팅 필요
  withCredentials: true, // ✅ 쿠키 기반 인증 또는 세션 연동 시 필요
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    // 필요 시 토큰 추가 등
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API 오류:", error);
    return Promise.reject(error);
  }
);

// ✅ 공통 get/post 함수
export const apiGet = (url, params = {}) => instance.get(url, { params });
export const apiPost = (url, data = {}) => instance.post(url, data);

export default instance;
