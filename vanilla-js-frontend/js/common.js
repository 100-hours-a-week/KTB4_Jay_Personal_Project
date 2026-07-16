// ==============================
// 화면 전환
// ==============================
// 보여지는 화면 설정하기 
// 1. 처음에 모든 화면 hidden 설정 (클래스 추가를 통해)
// 2. 보고 싶은 화면만 hidden 제거
function showSection(sectionName) {
  welcomeSection.classList.add("hidden");
  loginSection.classList.add("hidden");
  signupSection.classList.add("hidden");

  if (profileViewSection !== null) {
    profileViewSection.classList.add("hidden");
  }

  profileEditSection.classList.add("hidden");
  passwordEditSection.classList.add("hidden");

  postListSection.classList.add("hidden");
  postCreateSection.classList.add("hidden");
  postDetailSection.classList.add("hidden");
  postEditSection.classList.add("hidden");

  if (sectionName === "welcome") {
    welcomeSection.classList.remove("hidden");
  }

  if (sectionName === "login") {
    loginSection.classList.remove("hidden");
  }

  if (sectionName === "signup") {
    signupSection.classList.remove("hidden");
  }

  if (sectionName === "profileView" && profileViewSection !== null) {
    profileViewSection.classList.remove("hidden");
  }

  if (sectionName === "profileEdit") {
    profileEditSection.classList.remove("hidden");
  }

  if (sectionName === "passwordEdit") {
    passwordEditSection.classList.remove("hidden");
  }

  if (sectionName === "list") {
    postListSection.classList.remove("hidden");
  }

  if (sectionName === "create") {
    postCreateSection.classList.remove("hidden");
  }

  if (sectionName === "detail") {
    postDetailSection.classList.remove("hidden");
  }

  if (sectionName === "edit") {
    postEditSection.classList.remove("hidden");
  }

  if (sectionName === "welcome" || sectionName === "login" || sectionName === "signup" || currentUserId === null) {
    profileMenu.classList.add("hidden");
    profileDropdown.classList.add("hidden");
  } else {
    profileMenu.classList.remove("hidden");
  }
}

// ==============================
// 전역 메시지
// ==============================
// showMessage 함수를 통해 성공, 실패 시에 globalMessage 안에 클래스를 추가하였습니다.
// 추가 하기 전에 깔끔하게 비워줘야 확실히 표시가 됩니다. 
function showMessage(message, type) {
  globalMessage.classList.remove("success");
  globalMessage.classList.remove("error");

  globalMessage.textContent = MESSAGE_MAP[message] ?? message;

  if (type === "success") {
    globalMessage.classList.add("success");
  }

  if (type === "error") {
    globalMessage.classList.add("error");
  }
}
// 전역 메시지가 너무 길어져서 매핑 객체 만듦
const MESSAGE_MAP = {
  already_reported: "이미 Issue가 생성된 로그입니다.",
  wrong_current_password: "current secret이 일치하지 않습니다.",
  already_exist_email: "이미 사용 중인 email입니다.",
  already_exist_nickname: "이미 사용 중인 handle입니다.",
  login_failed: "email 또는 secret을 확인해주세요.",
  password_not_matched: "secret이 일치하지 않습니다.",
  deleted_user: "deleted account입니다.",
  invalid_user: "Login이 필요합니다.",
  expired_access_token: "세션이 만료되었습니다. 다시 Login 해주세요.",
  draft_not_found: "저장된 Stash가 없습니다."
};

// 화면을 이동할 때 이전 성공/실패 문구가 남지 않도록 지우는 함수
function clearMessage() {
  globalMessage.textContent = "";
  globalMessage.classList.remove("success");
  globalMessage.classList.remove("error");
}

function refreshPostTitleContent() {
  createTitleInput.value = "";
  createContentInput.value = "";
}

// ==============================
// 로그인 상태 표시 / 로그인 필요 검사
// ==============================
// 로그인 상태 위에 출력해주는 함수
function renderLoginStatus() {
  if (currentUserId === null) {
    profileMenu.classList.add("hidden");
    profileDropdown.classList.add("hidden");
    profileToggleImage.src = DEFAULT_PROFILE_IMAGE;
    showListLoginButton.classList.remove("hidden");

    return;
  }

  renderProfileToggleImage(currentUser);
  showListLoginButton.classList.add("hidden");
}
async function restoreLoginState() {
  if (accessToken === null) {
    currentUserId = null;
    currentUser = null;
    renderLoginStatus();
    showSection("welcome");
    return;
  }

  try {
    const result = await apiRequest("/users/me", {
      errorMessage: "Profile 조회에 실패했습니다."
    });

    currentUser = result.data;
    currentUserId = Number(result.data.userId ?? result.data.id);

    renderLoginStatus();
    loadPosts(0);
  } catch (error) {
    accessToken = null;
    refreshToken = null;
    currentUserId = null;
    currentUser = null;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId"); // 기존 찌꺼기 제거용

    renderLoginStatus();
    showSection("welcome");
  }
}
// 로그인 필요한지 확인하는 함수
function requireLogin() {
  if (accessToken === null) {
    showSection("login");
    showMessage("Login이 필요합니다.", "error");
    return false;
  }

  return true;
}

// ==============================
// API 에러 메시지
// ==============================
// 서버가 내려준 에러 메시지를 꺼내는 함수
// 실패 응답 body에 message가 있으면 그걸 사용하고, 없으면 기본 메시지를 사용
async function getErrorMessage(response, fallbackMessage) {
  try {
    const errorResult = await response.json();
    return errorResult.message || fallbackMessage;
  } catch (error) {
    return fallbackMessage;
  }
}

// ==============================
// 게시글 표시 유틸
// ==============================
// 작성자 이름을 상황에 따라 다르게 보여주는 함수
function getAuthorName(post) {
  if (post.blinded === true) {
    return "블라인드 처리된 사용자입니다.";
  }

  if (post.authorDeleted === true) {
    return "알 수 없음";
  }

  return post.authorNickname ?? "알 수 없음";
}

// 날짜 형식을 보기 좋게 바꿔주는 함수
function formatDate(dateText) {
  if (!dateText) {
    return "";
  }

  return dateText.replace("T", " ").slice(0, 19);
}

// ==============================
// api, fetch 공통 처리
// ==============================
// 주소, 헤더, JSON 변환, 에러 처리, 응답 파싱을 한 곳에서 처리
async function apiRequest(path, options = {}) {
  return apiRequestInternal(path, options, true);
}

async function apiRequestInternal(path, options = {}, canRetry) {
  const headers = {
    ...(options.headers ?? {})
  };

  if (options.skipAuth !== true && accessToken !== null) {
    headers["Authorization"] = "Bearer " + accessToken;
  }

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(API_BASE_URL + path, {
    method: options.method ?? "GET",
    headers: headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });

  if (response.ok) {
    return parseApiResponse(response);
  }

  const message = await getErrorMessage(
    response,
    options.errorMessage ?? "요청에 실패했습니다."
  );

  if (
    response.status === 401 &&
    message === "expired_access_token" &&
    canRetry === true
  ) {
    await refreshAccessToken();
    return apiRequestInternal(path, options, false);
  }

  throw new Error(message);
}
async function parseApiResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const responseText = await response.text();

  if (responseText.trim() === "") {
    return null;
  }

  const contentType = response.headers.get("Content-Type") ?? "";

  if (contentType.includes("application/json")) {
    return JSON.parse(responseText);
  }

  return responseText;
}

// ==============================
// 프로필 이미지 / 회원정보 렌더링
// ==============================
// 프로필 이미지를 화면에 보여줄 수 있는 주소로 바꿔주는 함수
// 서버에는 이미지 key만 저장되어 있을 수 있으니깐 localStorage에서 실제 이미지를 찾아줌
function getProfileImageUrl(profileImage) {
  if (!profileImage || profileImage.trim() === "") {
    return DEFAULT_PROFILE_IMAGE;
  }

  if (profileImage === DEFAULT_PROFILE_IMAGE_KEY) {
    return DEFAULT_PROFILE_IMAGE;
  }

  if (profileImage.startsWith("local-profile-image-") || profileImage.startsWith("signup-profile-image-")) {
    return localStorage.getItem(profileImage) || DEFAULT_PROFILE_IMAGE;
  }

  return profileImage;
}

// 회원정보 보기 화면에 현재 사용자 정보를 넣어주는 함수
function renderProfileView(user) {
  profileViewImage.src = getProfileImageUrl(user.profileImage);
  renderProfileToggleImage(user);
  profileViewUserId.textContent = user.userId ?? "-";
  profileViewEmail.textContent = user.email ?? "-";
  profileViewNickname.textContent = user.nickname ?? "-";
}

// 오른쪽 위 동그라미 프로필에도 같은 이미지가 보여야되니깐 따로 갱신하는 함수
function renderProfileToggleImage(user) {
  profileToggleImage.src = getProfileImageUrl(user?.profileImage);
}

// 회원정보 수정 화면으로 들어갈 때 기존 정보를 미리 넣어주는 함수
// 비밀번호는 보여주면 안되니깐 항상 비워둠
function renderProfileEdit(user) {
  selectedProfileImage = user.profileImage || DEFAULT_PROFILE_IMAGE_KEY;
  selectedProfileImageChanged = false;
  profileEditPreview.src = getProfileImageUrl(selectedProfileImage);
  profileNicknameInput.value = user.nickname ?? "";
  newPasswordInput.value = "";
  newPasswordCheckInput.value = "";
  profileImageInput.value = "";
  newPasswordError.textContent = "";
  newPasswordCheckError.textContent = "";
  newPasswordInput.classList.remove("input-error");
  newPasswordCheckInput.classList.remove("input-error");
  profileEditEmail.textContent = user.email ?? "-";
}
