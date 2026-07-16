// ==============================
// 댓글 목록 렌더링
// ==============================
// 댓글 목록을 화면에 그리는 함수
function renderComments(comments) {
  commentList.innerHTML = "";

  if (!comments || comments.length === 0) {
    commentList.textContent = "No thread yet.";
    return;
  }

  comments.forEach(function (comment) {
    const commentItem = createCommentElement(comment, false);
    commentList.appendChild(commentItem);
  });
}

// ==============================
// 댓글 아이템 생성
// ==============================
// 댓글 또는 대댓글 하나를 만드는 함수
function createCommentElement(comment, isReply) {
  const commentItem = document.createElement("div");
  commentItem.classList.add("comment-item");
  commentItem.dataset.commentId = comment.commentId;

  if (isReply === true) {
    commentItem.classList.add("reply-item");
  }

  if (comment.deleted === true) {
    commentItem.classList.add("deleted");
  }

  const meta = document.createElement("div");
  meta.classList.add("comment-meta");
  meta.textContent =
    (comment.authorNickname ?? "anonymous") + " · " + formatDate(comment.createdAt);

  const content = document.createElement("p");
  content.textContent = comment.content ?? "";

  commentItem.appendChild(meta);
  commentItem.appendChild(content);

  const commentAuthorId = Number(comment.authorId ?? comment.userId);

  // 삭제되지 않은 댓글이고, 현재 로그인 사용자가 댓글 작성자일 때만 삭제 버튼 보여주기
  if (comment.deleted !== true && commentAuthorId === currentUserId) {
    const buttonRow = document.createElement("div");
    buttonRow.classList.add("comment-button-row");

    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");
    deleteButton.classList.add("danger");
    deleteButton.textContent = "Drop";
    deleteButton.dataset.commentAction = "delete";
    editButton.classList.add("secondary");
    editButton.textContent = "Amend";
    editButton.dataset.commentAction = "edit";
    
    buttonRow.appendChild(editButton);
    buttonRow.appendChild(deleteButton);
    commentItem.appendChild(buttonRow);
  }

  // 대댓글이 있으면 아래에 렌더링
  if (comment.replies && comment.replies.length > 0) {
    const replyList = document.createElement("div");
    replyList.classList.add("reply-list");

    comment.replies.forEach(function (reply) {
      const replyItem = createCommentElement(reply, true);
      replyList.appendChild(replyItem);
    });

    commentItem.appendChild(replyList);
  }

  return commentItem;
}

// ==============================
// 댓글 작성
// ==============================
// 댓글 작성 함수
async function createComment() {
  if (!requireLogin()) {
    return;
  }

  if (createCommentButton.disabled) {
    return;
  }

  if (currentPostId === null) {
    showMessage("Thread를 남길 로그가 없습니다.", "error");
    return;
  }

  const comment = commentInput.value;

  if (comment.trim() === "") {
    showMessage("Code review 내용을 입력하세요.", "error");
    return;
  }

  const body = {
    comment: comment
  };

  createCommentButton.disabled = true;

  try {
    await apiRequest("/posts/" + currentPostId + "/comments", {
      method: "POST",
      body: body,
      errorMessage: "Code Review 작성에 실패했습니다."
    });

    commentInput.value = "";

    showMessage("Code review를 남겼습니다.", "success");
    await loadPostDetail(currentPostId, false);
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    createCommentButton.disabled = false;
  }
}

// ==============================
// 댓글 삭제
// ==============================
// 댓글 삭제 함수
async function deleteComment(commentId) {
  if (!requireLogin()) {
    return;
  }

  const confirmed = confirm("Thread를 Drop 하시겠습니까?");

  if (!confirmed) {
    return;
  }

  try {
    await apiRequest("/comments/" + commentId, {
      method: "DELETE",
      errorMessage: "Thread Drop에 실패했습니다."
    });

    showMessage("Thread를 Drop 했습니다.", "success");
    loadPostDetail(currentPostId, false);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// ==============================
// 댓글 수정 폼
// ==============================
// 댓글 수정 버튼을 눌렀을 때 수정 입력창을 보여주는 함수
function showCommentEditForm(commentItem) {
  // 이미 수정 폼이 열려 있으면 다시 누를 때 닫기
  const oldForm = commentItem.querySelector(".comment-edit-form");

  if (oldForm !== null) {
    oldForm.remove();
    return;
  }

  // 수정 폼 div 만들기
  const editForm = document.createElement("div");
  editForm.classList.add("comment-edit-form");

  // 수정할 내용을 입력할 input 만들기
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.classList.add("comment-edit-input");
  editInput.value = "";
  editInput.placeholder = "amend this code review";

  // 수정 완료 버튼 만들기
  const submitButton = document.createElement("button");
  submitButton.textContent = "Deploy Patch";
  submitButton.dataset.commentAction = "submit-edit";

  // 취소 버튼 만들기
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.dataset.commentAction = "cancel-edit";

  // 수정 폼 안에 input, 수정 완료 버튼, 취소 버튼 넣기
  editForm.appendChild(editInput);
  editForm.appendChild(submitButton);
  editForm.appendChild(cancelButton);

  // 댓글 박스 아래에 수정 폼 붙이기
  commentItem.appendChild(editForm);
}

// ==============================
// 댓글 수정 요청
// ==============================
// 댓글 수정 함수
async function updateComment(commentId, comment) {
  if (!requireLogin()) {
    return;
  }

  if (comment.trim() === "") {
    showMessage("Amend할 Code Review 내용을 입력하세요.", "error");
    return;
  }

  const body = {
    comment: comment
  };

  try {
    await apiRequest("/comments/" + commentId, {
      method: "PATCH",
      body: body,
      errorMessage: "Code Review 수정에 실패했습니다."
    });

    showMessage("Code Review를 수정했습니다.", "success");
    loadPostDetail(currentPostId, false);
    
    
  } catch (error) {
    showMessage(error.message, "error");
  }
}
