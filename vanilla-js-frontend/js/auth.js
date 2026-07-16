// ==============================
// 회원가입 요청
// ==============================
// 회원가입 함수
async function signup() {
  const email = signupEmailInput.value;
  const password = signupPasswordInput.value;
  const nickname = signupNicknameInput.value;

  markAllSignupFieldsTouched();

  // 회원가입 요청 보내기 전에 프론트에서 먼저 형식 검사를 함
  if (!validateSignupForm()) {
    showMessage("Join 정보를 다시 확인하세요.", "error");
    return;
  }

  // 실제 이미지는 localStorage에 저장하고 서버에는 이미지 key만 보냄
  const profileImageKey = "signup-profile-image-" + email.trim();

  const body = {
    email: email.trim(),
    password: password,
    nickname: nickname.trim(),
    profileImage: profileImageKey
  };

  try {
    await apiRequest("/users/register", {
      method: "POST",
      body: body,
      skipAuth: true,
      errorMessage: "Join에 실패하였습니다."
    });

    // 실제 이미지 문자열은 길어서 DB에 바로 넣지 않고 브라우저 저장소에 저장
    if (signupProfileImage.trim() !== "") {
      saveProfileImage(profileImageKey, signupProfileImage);
    }

    signupEmailInput.value = "";
    signupPasswordInput.value = "";
    signupPasswordCheckInput.value = "";
    signupNicknameInput.value = "";
    resetSignupProfileImage();
    clearSignupErrors();

    showMessage("Join 완료. Login 해주세요.", "success");
    showSection("login");
  } catch (error) {
    showSignupServerError(error.message);
  }
}

// ==============================
// 회원가입 입력값 검증
// ==============================
// 회원가입 입력값이 조건에 맞는지 확인하는 함수
// 하나라도 조건이 안 맞으면 false를 반환해서 회원가입 요청을 막음
function validateSignupForm() {
  const email = signupEmailInput.value.trim();
  const password = signupPasswordInput.value;
  const passwordCheck = signupPasswordCheckInput.value;
  const nickname = signupNicknameInput.value.trim();
  let valid = true;

  clearSignupErrors();

  if (!isValidEmail(email)) {
    if (signupTouched.email === true) {
      setFieldError(signupEmailError, signupEmailInput, "* valid email format required. (ex: dev@example.com)");
    }
    valid = false;
  }

  if (!isValidPassword(password)) {
    if (signupTouched.password === true) {
      setFieldError(signupPasswordError, signupPasswordInput, "* secret must be 8-20 chars with lowercase, number, and special char.");
    }
    valid = false;
  }

  if (passwordCheck.trim() === "") {
    if (signupTouched.passwordCheck === true) {
      setFieldError(signupPasswordCheckError, signupPasswordCheckInput, "* confirm secret is required.");
    }
    valid = false;
  } else if (password !== passwordCheck) {
    if (signupTouched.passwordCheck === true) {
      setFieldError(signupPasswordCheckError, signupPasswordCheckInput, "* secret does not match.");
    }
    valid = false;
  }

  if (nickname === "") {
    if (signupTouched.nickname === true) {
      setFieldError(signupNicknameError, signupNicknameInput, "* handle is required.");
    }
    valid = false;
  } else if (nickname.length > 10) {
    if (signupTouched.nickname === true) {
      setFieldError(signupNicknameError, signupNicknameInput, "* handle can be up to 10 chars.");
    }
    valid = false;
  }

  signupButton.disabled = !valid;
  return valid;
}

// ==============================
// 공통 입력값 검증 유틸
// ==============================
// 이메일 형식인지 정규식으로 확인하는 함수
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 비밀번호가 소문자, 숫자, 특수문자를 포함하고 8~20자인지 확인하는 함수
function isValidPassword(password) {
  return /^(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/.test(password);
}

// 검증 실패 시 빨간 문구랑 input 에러 스타일을 같이 넣어주는 함수
function setFieldError(errorElement, inputElement, message) {
  errorElement.textContent = message;

  if (inputElement !== null) {
    inputElement.classList.add("input-error");
  }
}

// 회원가입 검증 문구와 빨간 테두리를 전부 초기화하는 함수
function clearSignupErrors() {
  signupProfileImageError.textContent = "";
  signupEmailError.textContent = "";
  signupPasswordError.textContent = "";
  signupPasswordCheckError.textContent = "";
  signupNicknameError.textContent = "";

  signupEmailInput.classList.remove("input-error");
  signupPasswordInput.classList.remove("input-error");
  signupPasswordCheckInput.classList.remove("input-error");
  signupNicknameInput.classList.remove("input-error");
  signupButton.disabled = true;
}

// 회원가입 화면을 처음 열거나 취소할 때는 빨간 문구가 바로 보이지 않도록 초기화
function resetSignupTouched() {
  signupTouched.profileImage = false;
  signupTouched.email = false;
  signupTouched.password = false;
  signupTouched.passwordCheck = false;
  signupTouched.nickname = false;
}

// 회원가입 버튼을 누르면 비어 있는 모든 항목을 한 번에 보여줘야 하므로 전부 건드린 상태로 바꿈
function markAllSignupFieldsTouched() {
  signupTouched.profileImage = true;
  signupTouched.email = true;
  signupTouched.password = true;
  signupTouched.passwordCheck = true;
  signupTouched.nickname = true;
}

// 서버가 중복 이메일이나 중복 닉네임을 알려주면 해당 입력칸 아래에 보여주는 함수
function showSignupServerError(message) {
  const lowerMessage = message.toLowerCase();

  if (message.includes("이메일") || lowerMessage.includes("email")) {
    signupTouched.email = true;
    setFieldError(signupEmailError, signupEmailInput, "* duplicated email.");
    signupButton.disabled = true;
    return;
  }

  if (message.includes("닉네임") || lowerMessage.includes("nickname")) {
    signupTouched.nickname = true;
    setFieldError(signupNicknameError, signupNicknameInput, "* duplicated handle.");
    signupButton.disabled = true;
    return;
  }

  showMessage(message, "error");
}

// ==============================
// 회원가입 프로필 이미지
// ==============================
// 회원가입에서 프로필 사진을 선택했을 때 미리보기로 바꿔주는 함수
function readSignupProfileImage(file) {
  signupTouched.profileImage = true;

  if (!file) {
    resetSignupProfileImage();
    validateSignupForm();
    return;
  }

  if (!file.type.startsWith("image/")) {
    setFieldError(signupProfileImageError, null, "* 이미지 파일만 선택할 수 있습니다.");
    resetSignupProfileImage();
    validateSignupForm();
    return;
  }

  resizeProfileImage(file, function (imageData) {
    signupProfileImage = imageData;
    signupProfilePreview.src = signupProfileImage;
    signupProfilePreview.classList.remove("hidden");
    signupProfilePlus.classList.add("hidden");
    signupProfileImageError.textContent = "";
    validateSignupForm();
  }, function () {
    setFieldError(signupProfileImageError, null, "* 프로필 사진을 읽지 못했습니다.");
  });
}

// 회원가입 프로필 사진 선택 상태를 처음 상태로 돌리는 함수
function resetSignupProfileImage() {
  signupProfileImage = "";
  signupProfileImageInput.value = "";
  signupProfilePreview.src = "";
  signupProfilePreview.classList.add("hidden");
  signupProfilePlus.classList.remove("hidden");
}

// ==============================
// 로그인 / 로그아웃
// ==============================
// 로그인 함수
async function login() {
  clearMessage();
  markAllLoginFieldsTouched();

  if (!validateLoginInputs()) {
    return;
  }

  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;

  const body = {
    email: email,
    password: password
  };

  try {
    const result = await apiRequest("/users/login", {
      method: "POST",
      body: body,
      skipAuth: true,
      errorMessage: "Login에 실패했습니다."
    });

    currentUserId = Number(result.data.userId ?? result.data.user_id ?? result.data.id);
    accessToken = result.data.accessToken ?? result.data.access_token ?? null;
    refreshToken = result.data.refreshToken ?? result.data.refresh_token ?? null;

    if (accessToken !== null) {
      localStorage.setItem("accessToken", accessToken);
    }
    if (refreshToken !== null) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    loginEmailInput.value = "";
    loginPasswordInput.value = "";
    resetLoginTouched();
    clearLoginErrors();

    renderLoginStatus();
    // 로그인 후 닉네임과 프로필 이미지를 보여주기 위해 현재 회원정보도 불러옴
    loadCurrentUser(false, null);
    loadPosts(0);
  } catch (error) {
    clearLoginErrors();
    loginHelperText.textContent = "* email 또는 secret을 확인해주세요.";
  }
}
async function refreshAccessToken() {
  if (refreshToken === null) {
    throw new Error("Login이 필요합니다.");
  }

  const response = await fetch(API_BASE_URL + "/users/token/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      refreshToken: refreshToken
    })
  });

  if (!response.ok) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    accessToken = null;
    refreshToken = null;
    currentUserId = null;
    currentUser = null;

    throw new Error("세션이 만료되었습니다.");
  }

  const result = await response.json();

  accessToken = result.data.accessToken;
  localStorage.setItem("accessToken", accessToken);

  return accessToken;
}

// ==============================
// 로그인 입력값 검증
// ==============================
function validateLoginInputs() {
  const email = loginEmailInput.value.trim();
  const password = loginPasswordInput.value.trim();
  let valid = true;

  clearLoginErrors();

  if (email === "") {
    if (loginTouched.email === true) {
      setFieldError(loginEmailInputError, loginEmailInput, "* email is required.");
    }
    valid = false;
  } else if (!isValidEmail(email)) {
    if (loginTouched.email === true) {
      setFieldError(loginEmailInputError, loginEmailInput, "* valid email format required. (ex: dev@example.com)");
    }
    valid = false;
  }

  if (password === "") {
    if (loginTouched.password === true) {
      setFieldError(loginPasswordInputError, loginPasswordInput, "* secret is required.");
    }
    valid = false;
  } else if (!isValidPassword(password)) {
    if (loginTouched.password === true) {
      setFieldError(loginPasswordInputError, loginPasswordInput, "* secret must be 8-20 chars with lowercase, number, and special char.");
    }
    valid = false;
  }

  loginButton.disabled = !valid;
  return valid;
}

// 로그인 검증 문구와 빨간 테두리를 전부 초기화하는 함수
function clearLoginErrors() {
  loginEmailInputError.textContent = "";
  loginPasswordInputError.textContent = "";
  loginHelperText.textContent = "";
  loginEmailInput.classList.remove("input-error");
  loginPasswordInput.classList.remove("input-error");
  loginButton.disabled = true;
}

// 로그인 화면을 처음 열 때는 빨간 문구가 바로 보이지 않도록 초기화
function resetLoginTouched() {
  loginTouched.email = false;
  loginTouched.password = false;
}

// 로그인 버튼을 누르면 비어 있는 항목을 한 번에 보여줘야 하므로 전부 건드린 상태로 바꿈
function markAllLoginFieldsTouched() {
  loginTouched.email = true;
  loginTouched.password = true;
}

// 로그아웃 함수
function logout() {
  currentUserId = null;
  accessToken = null;
  refreshToken = null;
  currentUser = null;
  selectedProfileImage = "";
  selectedProfileImageChanged = false;

  // 브라우저에 저장된 로그인 정보도 같이 지워야 새로고침해도 로그아웃 상태가 됨
  localStorage.removeItem("userId");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  renderLoginStatus();
  showSection("welcome");
}

// ==============================
// 현재 회원정보 조회
// ==============================
// 현재 로그인한 회원정보 조회 함수
// 백엔드에 단건 조회가 없어서 목록에서 현재 userId와 같은 사용자를 찾음
// 조회, 수정 페이지 화면 갱신해줌 renderProfileView 랑 Edit이랑
async function loadCurrentUser(showSuccessMessage = false, nextSection = "profileView") {
  if (!requireLogin()) {
    return;
  }

  try {
    const result = await apiRequest("/users/me", {
      errorMessage: "Profile 조회에 실패했습니다."
    });

    const user = result.data;

    currentUser = user;
    currentUserId = Number(user.userId ?? user.id);

    renderLoginStatus();
    renderProfileView(user);
    renderProfileEdit(user);

    if (nextSection === "profileEdit") {
      showSection("profileEdit");
    } else if (nextSection === "profileView") {
      showSection("profileView");
    }

    if (showSuccessMessage === true) {
      showMessage("Profile을 불러왔습니다.", "success");
    }
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// ==============================
// 회원정보 수정
// ==============================
// 회원정보 수정 함수
async function updateProfile() {
  if (!requireLogin()) {
    return;
  }

  const nickname = profileNicknameInput.value;

  if (nickname.trim() === "") {
    setFieldError(profileNicknameError, profileNicknameInput, "* handle is required.");
    return;
  }

  if (nickname.trim().length > 10) {
    setFieldError(profileNicknameError, profileNicknameInput, "* handle can be up to 10 chars.");
    return;
  }

  let profileImageKey = selectedProfileImage;

  // 새 이미지를 선택했으면 실제 이미지는 localStorage에 저장하고 서버에는 짧은 key만 보냄
  if (selectedProfileImageChanged || selectedProfileImage.startsWith("data:image/")) {
    profileImageKey = "local-profile-image-" + currentUser.userId;
    if (!saveProfileImage(profileImageKey, selectedProfileImage)) {
      showMessage("Avatar 저장 공간이 부족합니다. 더 작은 이미지를 선택해주세요.", "error");
      return;
    }
  }

  const body = {
    nickname: nickname,
    profileImage: profileImageKey
  };

  try {
    const result = await apiRequest("/users/me", {
      method: "PATCH",
      body: body,
      errorMessage: "Profile config 저장에 실패했습니다."
    });

    currentUser = {
      ...(currentUser ?? {}),
      userId: currentUserId,
      nickname: result?.data?.nickname ?? nickname,
      profileImage: result?.data?.profileImage ?? profileImageKey
    };
    // 저장이 끝났으니깐 현재 선택 이미지 상태도 서버에 저장된 key 기준으로 정리
    selectedProfileImage = currentUser.profileImage;
    selectedProfileImageChanged = false;

    profileNicknameError.textContent = "";
    profileNicknameInput.classList.remove("input-error");
    renderLoginStatus();
    renderProfileView(currentUser);
    renderProfileEdit(currentUser);
    showMessage("Profile config를 저장했습니다.", "success");
    showSection("profileView");
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// ==============================
// 비밀번호 변경
// ==============================
// 비밀번호 변경 함수
async function updatePassword() {
  if (!requireLogin()) {
    return;
  }

  const currentPassword = currentPasswordInput.value.trim();
  const newPassword = newPasswordInput.value.trim();
  const newPasswordCheck = newPasswordCheckInput.value.trim();

  // 비밀번호 변경도 회원가입이랑 같은 규칙으로 먼저 검사
  if (!validateProfilePasswordForm()) {
    showMessage("Secret rotation 정보를 다시 확인하세요.", "error");
    return;
  }

  const body = {
    currentPassword: currentPassword,
    newPassword: newPassword,
    newPasswordCheck: newPasswordCheck
  };
  try {
    await apiRequest("/users/me/password", {
      method: "PATCH",
      body: body,
      errorMessage: "Secret rotation에 실패했습니다."
    });
    currentPasswordInput.value = "";
    newPasswordInput.value = "";
    newPasswordCheckInput.value = "";

    clearProfilePasswordErrors();

    showMessage("Secret을 rotation 했습니다.", "success");

  } catch (error) {
    showMessage(error.message, "error");
    return;
  }
}

// 회원정보 수정 화면에서 새 비밀번호 조건을 확인하는 함수
function validateProfilePasswordForm() {
  const currentPassword = currentPasswordInput.value.trim();
  const newPassword = newPasswordInput.value;
  const newPasswordCheck = newPasswordCheckInput.value;
  let valid = true;

  clearProfilePasswordErrors();

  if (currentPassword === ""){
    setFieldError(currentPasswordError, currentPasswordInput, "* current secret is required.");
    valid = false;
  }
  if (!isValidPassword(newPassword)) {
    setFieldError(newPasswordError, newPasswordInput, "* secret must be 8-20 chars with lowercase, number, and special char.");
    valid = false;
  }

  if (newPasswordCheck.trim() === "") {
    setFieldError(newPasswordCheckError, newPasswordCheckInput, "* confirm secret is required.");
    valid = false;
  } else if (newPassword !== newPasswordCheck) {
    setFieldError(newPasswordCheckError, newPasswordCheckInput, "* secret does not match.");
    valid = false;
  }

  return valid;
}

// 비밀번호 변경 검증 문구와 빨간 테두리를 초기화하는 함수
function clearProfilePasswordErrors() {
  currentPasswordError.textContent = "";
  newPasswordError.textContent = "";
  newPasswordCheckError.textContent = "";

  currentPasswordInput.classList.remove("input-error");
  newPasswordInput.classList.remove("input-error");
  newPasswordCheckInput.classList.remove("input-error");
}

// ==============================
// 회원 탈퇴
// ==============================
// 회원 탈퇴 함수
async function deleteUser() {
  if (!requireLogin()) {
    return;
  }

  confirmDeleteUserButton.disabled = true;

  try {
    await apiRequest("/users/me", {
      method: "DELETE",
      errorMessage: "Account delete에 실패했습니다."
    });

    closeDeleteUserModal();
    logout();
    showMessage("Account delete가 완료되었습니다.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    confirmDeleteUserButton.disabled = false;
  }
}

// 탈퇴 확인 모달 열기
function openDeleteUserModal() {
  deleteUserModal.classList.remove("hidden");
}

// 탈퇴 확인 모달 닫기
function closeDeleteUserModal() {
  deleteUserModal.classList.add("hidden");
}

// ==============================
// 회원정보 수정 프로필 이미지
// ==============================
// 선택한 프로필 이미지를 문자열로 읽어서 미리보기와 수정 요청에 사용
function readProfileImage(file) {
  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    showMessage("이미지 파일만 선택할 수 있습니다.", "error");
    profileImageInput.value = "";
    return;
  }

  resizeProfileImage(file, function (imageData) {
    selectedProfileImage = imageData;
    selectedProfileImageChanged = true;
    profileEditPreview.src = selectedProfileImage;
  }, function () {
    showMessage("Avatar 이미지를 읽지 못했습니다.", "error");
  });
}

// ==============================
// 프로필 이미지 저장 유틸
// ==============================
// 프로필 이미지를 localStorage에 넣기 전에 작게 줄여서 저장 용량 초과를 막는 함수
function resizeProfileImage(file, successCallback, errorCallback) {
  const reader = new FileReader();

  reader.onload = function () {
    const image = new Image();

    image.onload = function () {
      const maxSize = 240;
      const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);
      const width = Math.round(image.width * ratio);
      const height = Math.round(image.height * ratio);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);

      successCallback(canvas.toDataURL("image/jpeg", 0.72));
    };

    image.onerror = errorCallback;
    image.src = String(reader.result);
  };

  reader.onerror = errorCallback;
  reader.readAsDataURL(file);
}

// 이미지 저장소가 꽉 찬 경우 이전 회원가입 이미지들을 정리하고 다시 저장
function saveProfileImage(key, imageData) {
  try {
    localStorage.removeItem(key);
    localStorage.setItem(key, imageData);
    return true;
  } catch (error) {
    removeOldSignupProfileImages(key);
  }

  try {
    localStorage.setItem(key, imageData);
    return true;
  } catch (error) {
    return false;
  }
}

// 회원가입 과정에서 쌓인 임시 프로필 이미지만 정리
function removeOldSignupProfileImages(currentKey) {
  Object.keys(localStorage).forEach(function (key) {
    if (key !== currentKey && key.startsWith("signup-profile-image-")) {
      localStorage.removeItem(key);
    }
  });
}
