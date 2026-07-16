// ==============================
// HTML 조각 불러오기
// ==============================
// 기능별로 나눈 HTML 파일을 기존 JS 실행 전에 한 화면으로 조립하는 함수
function includeHtml() {
  const includeElements = document.querySelectorAll("[data-include]");

  includeElements.forEach(function (element) {
    const filePath = element.dataset.include;
    const request = new XMLHttpRequest();

    request.open("GET", filePath, false);
    request.send();

    if ((request.status >= 200 && request.status < 300) || request.status === 0) {
      element.outerHTML = request.responseText;
      return;
    }

    throw new Error(filePath + " 파일을 불러오지 못했습니다.");
  });
}
