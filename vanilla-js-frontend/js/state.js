// ==============================
// 서버 주소
// ==============================
// 백엔드 서버 주소는 실행 중 바뀌면 안되니깐 const
const API_BASE_URL = "http://localhost:8080";

// ==============================
// 로그인 상태
// ==============================
// 로그인 로그아웃 등을 통해 현재 사용자 아이디는 변경 가능
// Token값도 마찬가지
// localStorage는 브라우저 안에 저장되는 작은 저장소
let accessToken = localStorage.getItem("accessToken") || null;
let refreshToken = localStorage.getItem("refreshToken") || null;
// ==============================
// 회원 / 프로필 상태
// ==============================
// 현재 로그인한 회원정보는 여러 화면에서 같이 써야되니깐 변수로 저장
// 프로필 이미지는 파일 자체를 서버에 보내는게 아니라 브라우저에서 먼저 들고 있음
let currentUser = null;
let selectedProfileImage = "";
let selectedProfileImageChanged = false;
let signupProfileImage = "";
let signupTouched = {
  profileImage: false,
  email: false,
  password: false,
  passwordCheck: false,
  nickname: false
};

let loginTouched = {
  email: false,
  password: false
};

// ==============================
// 기본 프로필 이미지
// ==============================
// 기본 프로필 이미지는 항상 같아야되니깐 const
// 서버에는 긴 이미지 문자열 대신 key만 보내기 위해서 기본 key도 따로 저장
const DEFAULT_PROFILE_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' rx='80' fill='%23e5e7eb'/%3E%3Ccircle cx='80' cy='62' r='30' fill='%239ca3af'/%3E%3Cpath d='M32 137c7-29 27-44 48-44s41 15 48 44' fill='%239ca3af'/%3E%3C/svg%3E";
const DEFAULT_PROFILE_IMAGE_KEY = "default-profile-image";

// ==============================
// 게시글 상태
// ==============================
// 현재 페이지 또한 변경 가능하지만 페이지 사이즈는 5로 고정
// 게시글 아이디랑 임시저장 변수도 변경 가능해야됨
let currentPage = 0;
const pageSize = 5;
let currentPostId = null;
let draftExists = false;
let currentPostLiked = false;
let postSortType = "latest";
