// ==============================
// 공통 화면 이동 이벤트
// ==============================

if (homeTitleButton !== null) {
  homeTitleButton.addEventListener("click", function () {
    clearMessage();
    loadPosts(0);
  });
}


// ==============================
// 로그인 / 회원가입 이벤트
// ==============================

welcomeSignupButton.addEventListener("click", function () {
  clearMessage();
  showSection("signup");
  resetSignupTouched();
  clearSignupErrors();
  validateSignupForm();
});

welcomeLoginButton.addEventListener("click", function () {
  clearMessage();
  resetLoginTouched();
  clearLoginErrors();
  showSection("login");
  validateLoginInputs();
});

goSignupButton.addEventListener("click", function () {
  clearMessage();
  showSection("signup");
  resetSignupTouched();
  clearSignupErrors();
  validateSignupForm();
});

showPasswordEditButton.addEventListener("click", function () {
  profileDropdown.classList.add("hidden");
  showSection("passwordEdit");
});


connectLoginValidation(loginEmailInput, "email");
connectLoginValidation(loginPasswordInput, "password");

showListLoginButton.addEventListener("click", function () {
  clearMessage();
  resetLoginTouched();
  clearLoginErrors();
  showSection("login");
  validateLoginInputs();
});

signupButton.addEventListener("click", function () {
  signup();
});

signupBackButton.addEventListener("click", function () {
  clearMessage();
  resetLoginTouched();
  clearLoginErrors();
  resetSignupTouched();
  clearSignupErrors();
  showSection("welcome");
});

signupProfileImageInput.addEventListener("click", function () {
  signupTouched.profileImage = true;
  validateSignupForm();
});

// 회원가입 프로필 사진을 선택하면 미리보기로 보여줌
signupProfileImageInput.addEventListener("change", function () {
  readSignupProfileImage(signupProfileImageInput.files[0]);
});

connectSignupValidation(signupEmailInput, "email");
connectSignupValidation(signupPasswordInput, "password");
connectSignupValidation(signupPasswordCheckInput, "passwordCheck");
connectSignupValidation(signupNicknameInput, "nickname");

loginButton.addEventListener("click", function () {
  login();
});

cancelSignupButton.addEventListener("click", function () {
  clearMessage();
  resetLoginTouched();
  clearLoginErrors();
  resetSignupTouched();
  clearSignupErrors();
  showSection("login");
});

// ==============================
// 프로필 / 회원정보 이벤트
// ==============================
// 오른쪽 위 프로필 동그라미를 누르면 메뉴가 열리고 닫히게 하는 이벤트
profileToggleButton.addEventListener("click", function () {
  profileDropdown.classList.toggle("hidden");
});


// 회원정보 수정 메뉴를 누르면 최신 회원정보를 불러오고 수정 화면으로 이동
showProfileEditButton.addEventListener("click", function () {
  profileDropdown.classList.add("hidden");
  loadCurrentUser(false, "profileEdit");
});

// 회원정보 보기 화면 안에 있는 수정하기 버튼 이벤트
profileViewEditButton.addEventListener("click", function () {
  loadCurrentUser(false, "profileEdit");
});

profileBackToListButton.addEventListener("click", function () {
  clearMessage();
  loadPosts(0);
});

passwordBackToListButton.addEventListener("click", function () {
  clearMessage();
  loadPosts(0);
});

// 회원 탈퇴 버튼을 누르면 바로 삭제하지 않고 확인 모달을 먼저 보여줌
deleteUserButton.addEventListener("click", function () {
  profileDropdown.classList.add("hidden");
  openDeleteUserModal();
});

cancelDeleteUserButton.addEventListener("click", function () {
  closeDeleteUserModal();
});

confirmDeleteUserButton.addEventListener("click", function () {
  deleteUser();
});

profileImageInput.addEventListener("change", function () {
  readProfileImage(profileImageInput.files[0]);
});

// 회원정보 수정 완료 버튼 이벤트
updateProfileButton.addEventListener("click", function () {
  updateProfile();
});

// 비밀번호 변경 버튼 이벤트
updatePasswordButton.addEventListener("click", function () {
  updatePassword();
});

// 비밀번호 변경 입력값도 입력할 때마다 다시 검사
currentPasswordInput.addEventListener("input", function(){
  validateProfilePasswordForm();
});
newPasswordInput.addEventListener("input", function () {
  validateProfilePasswordForm();
});

newPasswordCheckInput.addEventListener("input", function () {
  validateProfilePasswordForm();
});

logoutButton.addEventListener("click", function () {
  logout();
});

// ==============================
// 게시글 목록 / 작성 이벤트
// ==============================
showCreateButton.addEventListener("click", function () {
  if (!requireLogin()) {
    return;
  }

  clearMessage();
  refreshPostTitleContent();
  showSection("create");
});

cancelCreateButton.addEventListener("click", function () {
  clearMessage();
  showSection("list");
});

refreshPostsButton.addEventListener("click", function () {
  loadPosts(currentPage);
});

sortLatestButton.addEventListener("click", function () {
  postSortType = "latest";
  renderPostSortButtons();
  loadPosts(0);
});

sortPopularButton.addEventListener("click", function () {
  postSortType = "popular";
  renderPostSortButtons();
});

prevPageButton.addEventListener("click", function () {
  if (currentPage > 0) {
    loadPosts(currentPage - 1);
  }
});

nextPageButton.addEventListener("click", function () {
  loadPosts(currentPage + 1);
});

// 게시글 카드마다 이벤트를 붙이지 않고 목록 부모에서 클릭을 한 번만 처리
postList.addEventListener("click", function (event) {
  const postCard = event.target.closest(".post-card");

  if (
    postCard === null ||
    !postList.contains(postCard) ||
    postCard.classList.contains("blinded")
  ) {
    return;
  }

  const postId = Number(postCard.dataset.postId);

  if (!Number.isNaN(postId)) {
    commentInput.value = "";
    loadPostDetail(postId);
  }
});

createPostButton.addEventListener("click", function() {
  createPost();
});

saveDraftButton.addEventListener("click", function () {
  saveDraft();
});

loadDraftButton.addEventListener("click", function () {
  loadDraft();
});

// ==============================
// 게시글 상세 / 수정 / 신고 이벤트
// ==============================
backToListButton.addEventListener("click", function () {
  clearMessage();
  loadPosts(currentPage);
});

showEditButton.addEventListener("click", function () {
  if (!requireLogin()) {
    return;
  }

  showSection("edit");
});

showReportButton.addEventListener("click", function () {
  if (!requireLogin()) {
    return;
  }

  reportBox.classList.toggle("hidden");
});

cancelEditButton.addEventListener("click", function () {
  showSection("detail");
});

updatePostButton.addEventListener("click", function () {
  updatePost();
});

deletePostButton.addEventListener("click", function () {
  deletePost();
});

likePostButton.addEventListener("click", function () {
  likePost();
});

reportPostButton.addEventListener("click", function () {
  reportPost();
});

// ==============================
// 댓글 이벤트
// ==============================
createCommentButton.addEventListener("click", function () {
  createComment();
});

// 댓글의 수정/삭제/수정완료/취소를 commentList 부모에서 한 번만 처리
commentList.addEventListener("click", function (event) {
  const actionButton = event.target.closest("[data-comment-action]");

  if (actionButton === null || !commentList.contains(actionButton)) {
    return;
  }

  const commentItem = actionButton.closest(".comment-item");

  if (commentItem === null) {
    return;
  }

  const action = actionButton.dataset.commentAction;
  const commentId = Number(commentItem.dataset.commentId);

  if (action === "delete" && !Number.isNaN(commentId)) {
    deleteComment(commentId);
    return;
  }

  if (action === "edit") {
    showCommentEditForm(commentItem);
    return;
  }

  if (action === "cancel-edit") {
    actionButton.closest(".comment-edit-form")?.remove();
    return;
  }

  if (action === "submit-edit" && !Number.isNaN(commentId)) {
    const editInput = commentItem.querySelector(".comment-edit-input");

    if (editInput !== null) {
      updateComment(commentId, editInput.value);
    }
  }
});

// ==============================
// 새로고침 후 처음 실행되는 코드
// ==============================

validateLoginInputs();
restoreLoginState();

setTimeout(function () {
  validateLoginInputs();
}, 300);

// 로그인 input마다 같은 검증 이벤트를 붙이기 위해 만든 함수
function connectLoginValidation(inputElement, touchedKey) {
  inputElement.addEventListener("focus", function () {
    loginTouched[touchedKey] = true;
    validateLoginInputs();
  });

  inputElement.addEventListener("click", function () {
    loginTouched[touchedKey] = true;
    validateLoginInputs();
  });

  inputElement.addEventListener("input", function () {
    loginTouched[touchedKey] = true;
    validateLoginInputs();
  });
}

// 회원가입 input마다 같은 검증 이벤트를 붙이기 위해 만든 함수
function connectSignupValidation(inputElement, touchedKey) {
  inputElement.addEventListener("focus", function () {
    signupTouched[touchedKey] = true;
    validateSignupForm();
  });

  inputElement.addEventListener("click", function () {
    signupTouched[touchedKey] = true;
    validateSignupForm();
  });

  // 회원가입 입력값은 입력할 때마다 다시 검사해서 빨간 문구를 바로 갱신
  inputElement.addEventListener("input", function () {
    signupTouched[touchedKey] = true;
    validateSignupForm();
  });
}
