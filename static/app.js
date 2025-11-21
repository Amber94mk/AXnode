// ----------------------
// 전역 상태 (브라우저 메모리 내 프로젝트 목록)
// ----------------------
let projects = [];

// 샘플 프로젝트 한 개로 초기화
function initProjects() {
  projects = [
    {
      id: "p1",
      name: "샘플 프로젝트 A",
      description: "자동화 테스트 예시",
    },
  ];
  renderProjects();
}

// 프로젝트 목록 + 셀렉트 박스 그리기
function renderProjects() {
  const listEl = document.getElementById("projects-list");

  if (!projects.length) {
    listEl.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <p>아직 생성된 프로젝트가 없습니다.</p>
        <p class="text-sm mt-1">오른쪽 상단의 <b>새 프로젝트</b> 버튼으로 시작해 보세요.</p>
      </div>
    `;
  } else {
    listEl.innerHTML = projects
      .map(
        (p) => `
      <div class="project-card border px-4 py-3 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 cursor-pointer">
        <p class="font-semibold text-gray-800">${p.name}</p>
        <p class="text-sm text-gray-500">${p.description || "설명 없음"}</p>
      </div>
    `
      )
      .join("");
  }

  // 업로드 / 평가 탭의 프로젝트 셀렉트 갱신
  ["upload-project-select", "eval-project-select"].forEach((id) => {
    const sel = document.getElementById(id);
    if (!sel) return;

    sel.innerHTML = `<option value="">프로젝트를 선택하세요</option>`;

    projects.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      sel.appendChild(opt);
    });
  });
}

// ----------------------
// 탭 전환 (PwC 스타일 클래스용)
// ----------------------
function switchTab(tab) {
  const tabs = ["projects", "upload", "evaluation"];

  tabs.forEach((id) => {
    const content = document.getElementById(`content-${id}`);
    const tabBtn = document.getElementById(`tab-${id}`);
    if (!content || !tabBtn) return;

    content.classList.remove("active");
    tabBtn.classList.remove("tab-active");
    tabBtn.classList.add("tab-inactive");
  });

  const activeContent = document.getElementById(`content-${tab}`);
  const activeTab = document.getElementById(`tab-${tab}`);

  if (activeContent && activeTab) {
    activeContent.classList.add("active");
    activeTab.classList.add("tab-active");
    activeTab.classList.remove("tab-inactive");
  }
}

// ----------------------
// 모달
// ----------------------
function showCreateProjectModal() {
  document.getElementById("create-project-modal").classList.remove("hidden");
}

function hideCreateProjectModal() {
  document.getElementById("create-project-modal").classList.add("hidden");
}

// ----------------------
// 새 프로젝트 생성
// ----------------------
function createProject() {
  const nameInput = document.getElementById("new-project-name");
  const descInput = document.getElementById("new-project-description");

  const name = nameInput.value.trim();
  const description = descInput.value.trim();

  if (!name) {
    alert("프로젝트명을 입력하세요!");
    nameInput.focus();
    return;
  }

  const id = "p" + Date.now(); // 간단 ID

  projects.push({
    id,
    name,
    description,
  });

  renderProjects();
  hideCreateProjectModal();

  // 입력값 초기화
  nameInput.value = "";
  descInput.value = "";
}

// ----------------------
// 초기 로딩
// ----------------------
window.onload = () => {
  initProjects();       // 샘플 프로젝트 + 셀렉트 옵션 세팅
  switchTab("projects"); // 기본 탭
};
