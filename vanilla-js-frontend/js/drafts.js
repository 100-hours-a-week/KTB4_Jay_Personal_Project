// ==============================
// 임시저장 저장
// ==============================
// 임시저장 함수
async function saveDraft() {
  if (!requireLogin()) {
    return;
  }

  const title = createTitleInput.value;
  const content = createContentInput.value;

  if (title.trim() === "" && content.trim() === "") {
    showMessage("Stash할 commit title이나 body를 입력하세요.", "error");
    return;
  }

  const body = {
    title: title,
    content: content
  };

  try {
    await apiRequest("/posts/draft", {
      method: "POST",
      body: body,
      errorMessage: "Stash에 실패했습니다."
    });

    draftExists = true;

    showMessage("Stash에 저장했습니다.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// ==============================
// 임시저장 불러오기
// ==============================
// 임시저장 불러오기 함수
async function loadDraft() {
  if (!requireLogin()) {
    return;
  }

  try {
    const result = await apiRequest(
      "/posts/draft",
      {
        errorMessage: "Stash 불러오기에 실패했습니다."
      }
    );

    if (!result?.data) {
      showMessage("저장된 Stash가 없습니다.", "error");
      return;
    }

    createTitleInput.value = result.data.title ?? "";
    createContentInput.value = result.data.content ?? "";

    draftExists = true;

    showSection("create");
    showMessage("Stash를 불러왔습니다.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
}
