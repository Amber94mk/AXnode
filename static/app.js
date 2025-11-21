/************************************************************
 *  STATE 레이어: 프로젝트 / 평가 결과 데이터 관리
 ************************************************************/
const State = {
  projects: [],
  evaluations: {}, // evaluations[projectId] = { ... }

  init() {
    // 초기 샘플 프로젝트
    this.projects = [
      {
        id: "p1",
        name: "샘플 프로젝트 A",
        description: "에너지·환경 프로젝트 PoC 예시",
      },
    ];
  },

  addProject(name, description) {
    const id = "p" + Date.now();
    const project = { id, name, description };
    this.projects.push(project);
    return project;
  },

  getProject(id) {
    return this.projects.find((p) => p.id === id);
  },

  upsertEvaluation(projectId, partial) {
    if (!this.evaluations[projectId]) {
      this.evaluations[projectId] = { projectId };
    }
    this.evaluations[projectId] = {
      ...this.evaluations[projectId],
      ...partial,
    };
    return this.evaluations[projectId];
  },

  getEvaluation(projectId) {
    return this.evaluations[projectId];
  },

    removeProject(id) {
    this.projects = this.projects.filter((p) => p.id !== id);
    delete this.evaluations[id];
  },
};

/************************************************************
 *  SERVICE 레이어: 나중에 백엔드/AI API 붙일 자리
 *  지금은 더미 Promise 로직만 있음
 ************************************************************/
const Service = {
  async analyzeRfp({ projectId, file }) {
    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("file", file);

    const res = await fetch("/api/analyze-rfp", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("RFP 분석 API 호출 실패");
    }
    return await res.json();
  },

  async analyzeProposal({ projectId, file, clientName }) {
    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("file", file);
    if (clientName) formData.append("clientName", clientName);

    const res = await fetch("/api/analyze-proposal", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("제안서 분석 API 호출 실패");
    }
    return await res.json();
  },
};

/************************************************************
 *  UI 레이어: DOM 업데이트 전담
 ************************************************************/
const UI = {
  renderProjects() {
    const listEl = document.getElementById("projects-list");
    const projects = State.projects;

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
    <div class="project-card border px-4 py-3 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="font-semibold text-gray-800">${p.name}</p>
              <p class="text-sm text-gray-500">${p.description || "설명 없음"}</p>
            </div>
            <button
              onclick="deleteProject('${p.id}')"
              class="text-xs text-gray-400 hover:text-red-500 mt-1"
              title="프로젝트 삭제"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `
      )
      .join("");
    }

    // 셀렉트 갱신
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
  },

  setStatus(elementId, html) {
    const el = document.getElementById(elementId);
    if (el) el.innerHTML = html;
  },

  renderDocuments(projectId) {
    const container = document.getElementById("documents-table");
    const data = State.getEvaluation(projectId);
    if (!container) return;

    if (!data || (!data.rfpFileName && !data.proposalFileName)) {
      container.innerHTML = `
        <p class="text-sm text-gray-500">
          선택한 프로젝트에 대해 아직 업로드된 문서가 없습니다.
        </p>
      `;
      return;
    }

    const project = State.getProject(projectId);
    const projectName = project ? project.name : projectId;

    let rows = "";

    if (data.rfpFileName) {
      rows += `
        <tr class="border-b">
          <td class="px-3 py-2 text-sm text-gray-600">제안요청서 (RFP)</td>
          <td class="px-3 py-2 text-sm font-medium text-gray-800">${data.rfpFileName}</td>
        </tr>
      `;
    }

    if (data.proposalFileName) {
      rows += `
        <tr>
          <td class="px-3 py-2 text-sm text-gray-600">제안서</td>
          <td class="px-3 py-2 text-sm font-medium text-gray-800">${data.proposalFileName}</td>
        </tr>
      `;
    }

    container.innerHTML = `
      <div class="border rounded-lg bg-white shadow-sm">
        <div class="px-4 py-3 border-b flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-gray-800">${projectName}</p>
            <p class="text-xs text-gray-500">RFP · 제안서 업로드 현황</p>
          </div>
        </div>
        <table class="w-full">
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  },

  renderEvaluation(projectId) {
    const container = document.getElementById("evaluation-results");
    const data = State.getEvaluation(projectId);
    if (!container) return;

    if (!data || !data.matchingScore) {
      container.innerHTML = `
        <div class="border rounded-lg bg-white px-4 py-5 text-sm text-gray-600">
          선택한 프로젝트에 대해 아직 RFP와 제안서가 모두 업로드/분석되지 않았습니다.<br>
          <span class="text-gray-500">
            문서 업로드 탭에서 RFP와 제안서를 업로드한 후 다시 확인해 주세요.
          </span>
        </div>
      `;
      return;
    }

    const project = State.getProject(projectId);
    const projectName = project ? project.name : projectId;
    const score = data.matchingScore;
    const scoreColor =
      score >= 90 ? "bg-green-600" : score >= 80 ? "bg-emerald-500" : "bg-amber-500";

    const strengths = (data.strengths || [])
      .map((s) => `<li class="mb-1">• ${s}</li>`)
      .join("");
    const gaps = (data.gaps || [])
      .map((g) => `<li class="mb-1">• ${g}</li>`)
      .join("");
    const risks = (data.risks || [])
      .map((r) => `<li class="mb-1">• ${r}</li>`)
      .join("");

    container.innerHTML = `
      <div class="grid md:grid-cols-3 gap-6">
        <!-- 매칭도 카드 -->
        <div class="md:col-span-1 border rounded-lg bg-white p-5 shadow-sm">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">프로젝트</p>
          <p class="text-sm font-bold text-gray-800 mb-4">${projectName}</p>

          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">RFP 대비 매칭도</p>
          <div class="mt-1 mb-2 flex items-end justify-between">
            <span class="text-3xl font-extrabold text-gray-900">${score}%</span>
            <span class="text-xs text-gray-500">커버리지 기준 정성평가</span>
          </div>

          <div class="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
            <div class="h-full ${scoreColor}" style="width: ${Math.min(score, 100)}%;"></div>
          </div>

          <p class="text-xs text-gray-500 mt-3">
            RFP에서 정의된 주요 평가 항목 대비 제안서 내용 커버리지 수준을 정성적으로 환산한 지표입니다.
          </p>
        </div>

        <!-- 강점 -->
        <div class="md:col-span-1 border rounded-lg bg-white p-5 shadow-sm">
          <p class="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">
            강점 (Strengths)
          </p>
          <ul class="text-sm text-gray-700">
            ${strengths || "<li class='text-gray-400'>등록된 강점 내역이 없습니다.</li>"}
          </ul>
        </div>

        <!-- 보완 / 리스크 -->
        <div class="md:col-span-1 border rounded-lg bg-white p-5 shadow-sm">
          <p class="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
            보완 필요 (Gaps)
          </p>
          <ul class="text-sm text-gray-700 mb-4">
            ${gaps || "<li class='text-gray-400'>등록된 보완 내역이 없습니다.</li>"}
          </ul>

          <p class="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">
            리스크 포인트 (Risks)
          </p>
          <ul class="text-sm text-gray-700">
            ${risks || "<li class='text-gray-400'>등록된 리스크 내역이 없습니다.</li>"}
          </ul>
        </div>
      </div>
    `;
  },
};

/************************************************************
 *  CONTROLLER 레이어: 이벤트 핸들러
 ************************************************************/

// 탭 전환 (HTML onclick에서 직접 호출)
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

// 모달 열고 닫기 (HTML onclick에서 호출)
function showCreateProjectModal() {
  document.getElementById("create-project-modal").classList.remove("hidden");
}

function hideCreateProjectModal() {
  document.getElementById("create-project-modal").classList.add("hidden");
}

// 새 프로젝트 생성
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

  State.addProject(name, description);
  UI.renderProjects();
  hideCreateProjectModal();

  nameInput.value = "";
  descInput.value = "";
}

function deleteProject(projectId) {
  const project = State.getProject(projectId);
  const name = project ? project.name : projectId;

  const ok = confirm(
    `정말 이 프로젝트를 삭제할까요?\n\n- 프로젝트명: ${name}\n- 관련된 평가 결과도 함께 삭제됩니다.`
  );
  if (!ok) return;

  // 상태에서 제거
  State.removeProject(projectId);
  UI.renderProjects();

  // 업로드 탭 선택 초기화
  const uploadSel = document.getElementById("upload-project-select");
  if (uploadSel && uploadSel.value === projectId) {
    uploadSel.value = "";
    UI.setStatus("tech-spec-status", "");
    UI.setStatus("bid-spec-status", "");
    const docs = document.getElementById("documents-table");
    if (docs) docs.innerHTML = "";
  }

  // 평가 탭 선택 초기화
  const evalSel = document.getElementById("eval-project-select");
  if (evalSel && evalSel.value === projectId) {
    evalSel.value = "";
    const evalCont = document.getElementById("evaluation-results");
    if (evalCont) evalCont.innerHTML = "";
  }
}


// 문서 업로드 (RFP / 제안서) – HTML에서 uploadDocument('tech_spec' | 'bid_spec') 호출
async function uploadDocument(kind) {
  const projectId = document.getElementById("upload-project-select").value;
  if (!projectId) {
    alert("먼저 상단에서 프로젝트를 선택하세요!");
    return;
  }

  const isRfp = kind === "tech_spec";
  const fileInput = document.getElementById(isRfp ? "tech-spec-file" : "bid-spec-file");
  const statusId = isRfp ? "tech-spec-status" : "bid-spec-status";

  if (!fileInput.files || !fileInput.files.length) {
    alert("업로드할 파일을 선택하세요!");
    return;
  }

  const file = fileInput.files[0];

  // 제안서일 때만 클라이언트명 같이 보냄
  let clientName = "";
  if (!isRfp) {
    const clientNameInput = document.getElementById("client-name");
    clientName = clientNameInput ? clientNameInput.value.trim() : "";
  }

  UI.setStatus(
    statusId,
    `<span class="text-gray-600">
      <i class="fas fa-spinner fa-spin mr-2"></i>
      AI가 문서를 분석 중입니다...
     </span>`
  );

  try {
    let result;
    if (isRfp) {
      // RFP 분석 API 호출 (또는 더미 Service)
      result = await Service.analyzeRfp({ projectId, file });
      State.upsertEvaluation(projectId, result);

      UI.setStatus(
        statusId,
        `<span class="text-green-700">
          <i class="fas fa-check-circle mr-1"></i>
          RFP 분석 완료 · 평가 항목 구조가 생성되었습니다.
        </span>`
      );
    } else {
      // 제안서 분석 API 호출 (또는 더미 Service)
      result = await Service.analyzeProposal({ projectId, file, clientName });
      State.upsertEvaluation(projectId, result);

      UI.setStatus(
        statusId,
        `<span class="text-green-700">
          <i class="fas fa-check-circle mr-1"></i>
          제안서 분석 완료 · RFP 대비 매칭도 ${result.matchingScore}%로 계산되었습니다.
        </span>`
      );
    }

    // 업로드된 문서 섹션 갱신
    UI.renderDocuments(projectId);

    // 평가 탭에서 현재 같은 프로젝트가 선택되어 있다면, 결과도 함께 갱신
    const evalSelected = document.getElementById("eval-project-select").value;
    if (evalSelected === projectId) {
      UI.renderEvaluation(projectId);
    }
  } catch (e) {
    console.error(e);
    UI.setStatus(
      statusId,
      `<span class="text-red-700">
        <i class="fas fa-exclamation-circle mr-1"></i>
        분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
       </span>`
    );
  }
}



// 평가 탭에서 프로젝트 선택 변경 시
function loadEvaluations() {
  const projectId = document.getElementById("eval-project-select").value;
  const container = document.getElementById("evaluation-results");

  if (!projectId) {
    container.innerHTML = "";
    return;
  }
  UI.renderEvaluation(projectId);
}

/************************************************************
 *  UTILS
 ************************************************************/
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/************************************************************
 *  초기 로딩
 ************************************************************/
window.onload = () => {
  State.init();
  UI.renderProjects();
  switchTab("projects");
};
