// ==============================
// 게시글 목록 조회
// ==============================
// 게시글 목록을 서버에서 불러오는 함수
async function loadPosts(page = 0) {
  try {
    const result = await apiRequest(
      "/posts?page=" + page + "&size=" + pageSize,
      {
        errorMessage: "Feed를 불러오지 못했습니다."
      }
    );

    // 백엔드가 Page 형태로 응답하므로 게시글 배열은 result.data.content에 있음
    const pageData = result.data;
    const posts = pageData.content;

    // 현재 페이지 번호 저장
    currentPage = pageData.number;

    renderPostSortButtons();

    // 화면에 게시글 목록 출력
    renderPosts(posts);

    // 페이지 정보 출력
    renderPageInfo(pageData);

    showSection("list");
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// ==============================
// 게시글 목록 렌더링
// ==============================
// 게시글 목록을 화면에 그리는 함수
function renderPosts(posts) {
  // 기존 목록 비우기
  postList.innerHTML = "";

  if (!posts || posts.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.classList.add("post-empty");
    emptyMessage.textContent = "No logs yet. Push the first anonymous commit.";
    postList.appendChild(emptyMessage);
    return;
  }

  posts.forEach(function (post) {
    const postCard = document.createElement("div");
    postCard.classList.add("post-card");
    postCard.dataset.postId = post.postId;

    if (post.blinded === true) {
      postCard.classList.add("blinded");
    }

    const title = document.createElement("h3");
    title.textContent = post.title;

    const cardTop = document.createElement("div");
    cardTop.classList.add("post-card-top");

    const cardMeta = document.createElement("div");
    cardMeta.classList.add("post-card-meta");

    const author = document.createElement("p");
    author.classList.add("post-author");
    author.textContent = getAuthorName(post);

    const counts = document.createElement("p");
    counts.classList.add("post-counts");
    counts.textContent =
      "★ Star " + (post.likeCount ?? 0) +
      "   Thread " + (post.commentCount ?? 0) +
      "   View " + (post.viewCount ?? 0);

    const createdAt = document.createElement("p");
    createdAt.classList.add("post-date");
    createdAt.textContent = formatDate(post.createdAt);

    cardMeta.appendChild(counts);
    cardMeta.appendChild(createdAt);
    cardTop.appendChild(title);
    cardTop.appendChild(cardMeta);
    postCard.appendChild(cardTop);
    postCard.appendChild(author);

    // 클릭 이벤트는 postList 부모에서 한 번만 처리함
    if (post.blinded === true) {
      postCard.style.cursor = "not-allowed";
    }

    postList.appendChild(postCard);
  });
}

function renderPostSortButtons() {
  sortLatestButton.classList.toggle("active", postSortType === "latest");
  sortPopularButton.classList.toggle("active", postSortType === "popular");
}

// 페이지 정보를 화면에 보여주는 함수
function renderPageInfo(pageData) {
  const current = pageData.number + 1;
  const total = pageData.totalPages === 0 ? 1 : pageData.totalPages;

  pageInfo.textContent = current + " / " + total;

  prevPageButton.disabled = pageData.first;
  nextPageButton.disabled = pageData.last;
}

// ==============================
// 게시글 작성
// ==============================
// 게시글 작성 함수
async function createPost() {
  // 로그인 필요한 기능이니깐 확인
  if (!requireLogin()) {
    return;
  }

  if (createPostButton.disabled) {
    return;
  }


  // 제목이랑 내용 받아와서 저장
  const title = createTitleInput.value;
  const content = createContentInput.value;

  if (title.trim() === "") {
    showMessage("commit.title을 입력하세요.", "error");
    return;
  }

  if (content.trim() === "") {
    showMessage("commit.body를 입력하세요.", "error");
    return;
  }

  const body = {
    title: title,
    content: content
  };

  createPostButton.disabled = true;

  try {
    await apiRequest("/posts", {
      method: "POST",
      body: body,
      errorMessage: "Commit 배포에 실패했습니다."
    });

    createTitleInput.value = "";
    createContentInput.value = "";
    draftExists = false;

    await loadPosts(0);
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    createPostButton.disabled = false;
  }
}

// ==============================
// 게시글 상세 조회
// ==============================
// 게시글 상세조회 함수
async function loadPostDetail(postId, showSuccessMessage = true) {
  try {
    const result = await apiRequest(
      "/posts/" + postId,
      {
        errorMessage: "Log 상세 조회에 실패했습니다."
      }
    );
    const post = result.data;

    currentPostId = post.postId;

    renderPostDetail(post);

    showSection("detail");
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// ==============================
// 게시글 상세 렌더링
// ==============================
// 게시글 상세 화면을 그리는 함수
function renderPostDetail(post) {
  detailTitle.textContent = post.title;
  detailAuthor.textContent = getAuthorName(post);
  detailCreatedAt.textContent = formatDate(post.createdAt);

  if (post.edited === true) {
    detailEdited.textContent = "amended";
    detailEdited.classList.remove("hidden");
  } else {
    detailEdited.textContent = "";
    detailEdited.classList.add("hidden");
  }

  if (post.blinded === true) {
    detailContent.textContent = "This log was hidden by issue reports.";
  } else {
    detailContent.textContent = post.content ?? "";
  }

  detailViewCount.textContent = post.viewCount ?? "-";
  detailLikeCount.textContent = post.likeCount ?? "-";
  detailCommentCount.textContent = post.commentCount ?? "-";
  
  currentPostLiked = post.liked === true;
  if (currentPostLiked) {
    likePostButton.textContent = "★ Unstar";
  } else {
    likePostButton.textContent = "★ Star";
  }
  // 수정 화면으로 넘어갈 때 기존 제목과 내용을 미리 넣어두기
  editTitleInput.value = post.title ?? "";
  editContentInput.value = post.content ?? "";
  // 현재 로그인한 사용자와 게시글 작성자가 같을 때만 수정/삭제 버튼 보여주기
  if (Number(post.userId) === currentUserId) {
    showEditButton.classList.remove("hidden");
    deletePostButton.classList.remove("hidden");
    showReportButton.classList.add("hidden");
  } else {
    showEditButton.classList.add("hidden");
    deletePostButton.classList.add("hidden");
    showReportButton.classList.remove("hidden");
  }
  // 상세조회에 들어올 때마다 신고 입력창은 닫아두기
  reportBox.classList.add("hidden");
  reportReasonInput.value = "";
  renderComments(post.comments);
}

// ==============================
// 게시글 수정
// ==============================
// 게시글 수정 함수
async function updatePost() {
    // 로그인했는지 확인
  if (!requireLogin()) {
    return;
  }


  if (currentPostId === null) {
    showMessage("Amend할 commit이 없습니다.", "error");
    return;
  }

  const title = editTitleInput.value;
  const content = editContentInput.value;

  if (title.trim() === "") {
    showMessage("commit.title을 입력하세요.", "error");
    return;
  }

  if (content.trim() === "") {
    showMessage("commit.body를 입력하세요.", "error");
    return;
  }

  const body = {
    title: title,
    content: content
  };

  try {
    await apiRequest("/posts/" + currentPostId, {
      method: "PATCH",
      body: body,
      errorMessage: "Commit amend에 실패했습니다."
    });

    loadPostDetail(currentPostId);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// ==============================
// 게시글 삭제
// ==============================
// 게시글 삭제 함수
async function deletePost() {
  if (!requireLogin()) {
    return;
  }

  if (currentPostId === null) {
    showMessage("Drop할 commit이 없습니다.", "error");
    return;
  }

  const confirmed = confirm("이 Commit을 Drop 하시겠습니까?");

  if (!confirmed) {
    return;
  }


  try {
    await apiRequest("/posts/" + currentPostId, {
      method: "DELETE",
      errorMessage: "Commit Drop에 실패했습니다."
    });

    currentPostId = null;

    loadPosts(currentPage);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// ==============================
// 게시글 좋아요
// ==============================
// 게시글 좋아요 함수
async function likePost() {
  if (!requireLogin()) {
    return;
  }

  if (likePostButton.disabled) {
    return;
  }

  if (currentPostId === null) {
    showMessage("Star할 로그가 없습니다.", "error");
    return;
  }

  likePostButton.disabled = true;

  try {
    const method = currentPostLiked ? "DELETE" : "POST";

    await apiRequest("/posts/" + currentPostId + "/likes", {
      method: method,
      errorMessage: "Star 처리에 실패했습니다."
    });

    await loadPostDetail(currentPostId, false);
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    likePostButton.disabled = false;
  }
}

// ==============================
// 게시글 신고
// ==============================
// 게시글 신고 함수
async function reportPost() {
  if (!requireLogin()) {
    return;
  }

  if (currentPostId === null) {
    showMessage("Issue를 생성할 로그가 없습니다.", "error");
    return;
  }

  const reason = reportReasonInput.value;

  if (reason.trim() === "") {
    showMessage("Issue reason을 입력하세요.", "error");
    return;
  }

  const body = {
    reason: reason
  };

  try {
    const result = await apiRequest(
      "/posts/" + currentPostId + "/reports",
      {
        method: "POST",
        body: body,
        errorMessage: "Issue 생성에 실패했습니다."
      }
    );

    reportReasonInput.value = "";
    reportBox.classList.add("hidden");

    
    if (result?.data?.blinded === true){
        loadPosts(0);
        return;
    } 

    loadPostDetail(currentPostId, false);
    
    
  } catch (error) {
    showMessage(error.message, "error");
  }
}
