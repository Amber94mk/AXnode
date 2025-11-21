function switchTab(tab) {
  const tabs = ["projects", "upload", "evaluation"];

  tabs.forEach(id => {
    document.getElementById(`content-${id}`).classList.remove("active");
    document.getElementById(`tab-${id}`).classList.remove("border-blue-600", "text-blue-600");
    document.getElementById(`tab-${id}`).classList.add("text-gray-600");
  });

  document.getElementById(`content-${tab}`).classList.add("active");
  document.getElementById(`tab-${tab}`).classList.add("border-blue-600", "text-blue-600");
}

// 모달
function showCreateProjectModal() {
  document.getElementById("create-project-modal").classList.remove("hidden");
}

function hideCreateProjectModal() {
  document.getElementById("create-project-modal").classList.add("hidden");
}

function createProject() {
  const name = document.getElementById("new-project-name").value;
  const desc = document.getElementById("new-project-description").value;

  if (!name) {
    alert("프로젝트명을 입력하세요!");
    return;
  }

  alert(`프로젝트 생성됨:\n${name}\n${desc}`);

  hideCreateProjectModal();
}

// 초기 로딩 (임시 데이터)
window.onload = () => {
  document.getElementById("projects-list").innerHTML = `
    <div class="border px-4 py-3 rounded-lg shadow-sm bg-gray-50">
      <p class="font-semibold text-gray-800">샘플 프로젝트 A</p>
      <p class="text-sm text-gray-500">자동화 테스트 예시</p>
    </div>
  `;
  
  const selects = ["upload-project-select", "eval-project-select"];

  selects.forEach(id => {
    const sel = document.getElementById(id);
    sel.innerHTML += `
      <option value="1">샘플 프로젝트 A</option>
      <option value="2">샘플 프로젝트 B</option>
    `;
  });
};
