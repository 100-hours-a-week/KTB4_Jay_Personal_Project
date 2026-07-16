// 여기부터는 html에 있는 요소들을 JS에서 가져오기 위해서 변수에 매핑하는 것
// querySelector로 HTML 문서에서 가져옴

// ==============================
// 공통 메시지 / 헤더
// ==============================
const globalMessage = document.querySelector("#global-message");

const homeTitleButton = document.querySelector("#home-title-button");

// ==============================
// 화면 섹션
// ==============================
const welcomeSection = document.querySelector("#welcome-section");
const loginSection = document.querySelector("#login-section");
const signupSection = document.querySelector("#signup-section");
const profileViewSection = document.querySelector("#profile-view-section");
const profileEditSection = document.querySelector("#profile-edit-section");

const postListSection = document.querySelector("#post-list-section");
const postCreateSection = document.querySelector("#post-create-section");
const postDetailSection = document.querySelector("#post-detail-section");
const postEditSection = document.querySelector("#post-edit-section");

// ==============================
// 헤더 / 프로필 메뉴
// ==============================
const showCreateButton = document.querySelector("#show-create-button");
const showListLoginButton = document.querySelector("#show-list-login-button");
const profileMenu = document.querySelector("#profile-menu");
const profileToggleButton = document.querySelector("#profile-toggle-button");
const profileToggleImage = document.querySelector("#profile-toggle-image");
const profileDropdown = document.querySelector("#profile-dropdown");
const showProfileEditButton = document.querySelector("#show-profile-edit-button");
const profileViewEditButton = document.querySelector("#profile-view-edit-button");
const deleteUserButton = document.querySelector("#delete-user-button");
const deleteUserModal = document.querySelector("#delete-user-modal");
const cancelDeleteUserButton = document.querySelector("#cancel-delete-user-button");
const confirmDeleteUserButton = document.querySelector("#confirm-delete-user-button");
const logoutButton = document.querySelector("#logout-button");

// ==============================
// 로그인
// ==============================
const welcomeSignupButton = document.querySelector("#welcome-signup-button");
const welcomeLoginButton = document.querySelector("#welcome-login-button");
const loginHelperText = document.querySelector("#login-helper-text");

// ==============================
// 회원가입
// ==============================
const signupEmailInput = document.querySelector("#signup-email-input");
const signupPasswordInput = document.querySelector("#signup-password-input");
const signupPasswordCheckInput = document.querySelector("#signup-password-check-input");
const signupNicknameInput = document.querySelector("#signup-nickname-input");
const signupProfileImageInput = document.querySelector("#signup-profile-image-input");
const signupProfilePreview = document.querySelector("#signup-profile-preview");
const signupProfilePlus = document.querySelector("#signup-profile-plus");
const signupProfileImageError = document.querySelector("#signup-profile-image-error");
const signupEmailError = document.querySelector("#signup-email-error");
const signupPasswordError = document.querySelector("#signup-password-error");
const signupPasswordCheckError = document.querySelector("#signup-password-check-error");
const signupNicknameError = document.querySelector("#signup-nickname-error");
const signupButton = document.querySelector("#signup-button");
const signupBackButton = document.querySelector("#signup-back-button");
const cancelSignupButton = document.querySelector("#cancel-signup-button");

// ==============================
// 로그인 입력 / 버튼
// ==============================
const loginEmailInput = document.querySelector("#login-email-input");
const loginPasswordInput = document.querySelector("#login-password-input");
const loginEmailInputError = document.querySelector("#login-email-input-error");
const loginPasswordInputError = document.querySelector("#login-password-input-error");
const loginButton = document.querySelector("#login-button");

// ==============================
// 회원정보 / 비밀번호 수정
// ==============================
const passwordEditSection = document.querySelector("#password-edit-section");
const showPasswordEditButton = document.querySelector("#show-password-edit-button");
const profileBackToListButton = document.querySelector("#profile-back-to-list-button");
const passwordBackToListButton = document.querySelector("#password-back-to-list-button");
const profileNicknameError = document.querySelector("#profile-nickname-error");
const profileEditEmail = document.querySelector("#profile-edit-email");

const profileViewImage = document.querySelector("#profile-view-image");
const profileViewUserId = document.querySelector("#profile-view-user-id");
const profileViewEmail = document.querySelector("#profile-view-email");
const profileViewNickname = document.querySelector("#profile-view-nickname");
const profileEditPreview = document.querySelector("#profile-edit-preview");
const profileImageInput = document.querySelector("#profile-image-input");
const profileNicknameInput = document.querySelector("#profile-nickname-input");

const currentPasswordInput = document.querySelector("#current-password-input");
const newPasswordInput = document.querySelector("#new-password-input");
const newPasswordCheckInput = document.querySelector("#new-password-check-input");
const currentPasswordError = document.querySelector("#current-password-error");
const newPasswordError = document.querySelector("#new-password-error");
const newPasswordCheckError = document.querySelector("#new-password-check-error");

const updateProfileButton = document.querySelector("#update-profile-button");
const updatePasswordButton = document.querySelector("#update-password-button");
const cancelProfileEditButton = document.querySelector("#cancel-profile-edit-button");
const goSignupButton = document.querySelector("#go-signup-button");

// ==============================
// 게시글 목록
// ==============================
const refreshPostsButton = document.querySelector("#refresh-posts-button");
const postList = document.querySelector("#post-list");
const sortLatestButton = document.querySelector("#sort-latest-button");
const sortPopularButton = document.querySelector("#sort-popular-button");

const prevPageButton = document.querySelector("#prev-page-button");
const nextPageButton = document.querySelector("#next-page-button");
const pageInfo = document.querySelector("#page-info");

// ==============================
// 게시글 작성
// ==============================
const createTitleInput = document.querySelector("#create-title-input");
const createContentInput = document.querySelector("#create-content-input");
const createPostButton = document.querySelector("#create-post-button");
const cancelCreateButton = document.querySelector("#cancel-create-button");
const saveDraftButton = document.querySelector("#save-draft-button");
const loadDraftButton = document.querySelector("#load-draft-button");

// ==============================
// 게시글 상세
// ==============================
const detailTitle = document.querySelector("#detail-title");
const detailAuthor = document.querySelector("#detail-author");
const detailCreatedAt = document.querySelector("#detail-created-at");
const detailEdited = document.querySelector("#detail-edited");
const detailContent = document.querySelector("#detail-content");
const detailViewCount = document.querySelector("#detail-view-count");
const detailLikeCount = document.querySelector("#detail-like-count");
const detailCommentCount = document.querySelector("#detail-comment-count");

const backToListButton = document.querySelector("#back-to-list-button");
const showEditButton = document.querySelector("#show-edit-button");
const deletePostButton = document.querySelector("#delete-post-button");
const likePostButton = document.querySelector("#like-post-button");

// ==============================
// 게시글 수정 / 신고
// ==============================
const editTitleInput = document.querySelector("#edit-title-input");
const editContentInput = document.querySelector("#edit-content-input");
const updatePostButton = document.querySelector("#update-post-button");
const cancelEditButton = document.querySelector("#cancel-edit-button");

const showReportButton = document.querySelector("#show-report-button");
const reportBox = document.querySelector("#report-box");
const reportReasonInput = document.querySelector("#report-reason-input");
const reportPostButton = document.querySelector("#report-post-button");

// ==============================
// 댓글
// ==============================
const commentList = document.querySelector("#comment-list");
const commentInput = document.querySelector("#comment-input");
const createCommentButton = document.querySelector("#create-comment-button");
