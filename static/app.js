/************************************************************
 *  STATE 레이어: 프로젝트 / 평가 결과 데이터 관리
 ************************************************************/
const State = {
  projects: [],
  evaluations: {},

  init() {
    // 1) 샘플 프로젝트 두 개
    this.projects = [
      {
        id: "p1",
        name: "TEST 1: 산업통상자원부  연구 용역",
        description: "산업통상자원부 에너지·정책 관련 연구용역 제안 PoC",
      },
      {
        id: "p2",
        name: "TEST 2: 한국수력원자력 중장기 재무 전망 추정 용역",
        description: "한수원 중장기 재무전망·시나리오 분석 제안 PoC",
      },
    ];

    // 2) 각 프로젝트별 미리 계산된 평가 결과
    //    (세부 항목 점수 합계 → matchingScore와 일치하도록 설정)
    this.evaluations = {
      // ✅ TEST 1: 총점 69/80 → 매칭도 86%
      p1: {
        projectId: "p1",
        rfpFileName: "2025_산업통상자원부_에너지정책_연구용역_RFP.pdf",
        proposalFileName: "PwC_산업부_에너지전환_연구용역_제안서_v1.0.pdf",
        matchingScore: 86, // 69/80 ≒ 86%
        totalScore: 69,
        totalMaxScore: 80,
        factors: [
          {
            category: "기술·지식능력",
            factor: "제안내용의 우수성 및 경쟁력",
            maxScore: 15,
            score: 13,
          },
          {
            category: "기술·지식능력",
            factor: "투입인력의 전문성 및 경험도",
            maxScore: 15,
            score: 14,
          },
          {
            category: "인력·조직·관리기술",
            factor: "참여인력의 적정성",
            maxScore: 10,
            score: 9,
          },
          {
            category: "인력·조직·관리기술",
            factor: "사업수행조직체계의 적정성",
            maxScore: 10,
            score: 10,
          },
          {
            category: "사업 수행 계획",
            factor: "추진목표 이해도 및 사업추진 전략",
            maxScore: 10,
            score: 8,
          },
          {
            category: "사업 수행 계획",
            factor: "수행일정의 합리성 및 수행절차의 적정성",
            maxScore: 10,
            score: 7,
          },
          {
            category: "수행실적",
            factor: "최근 3년간 동 분야 연구 실적",
            maxScore: 10,
            score: 8,
          },
        ],
        strengths: [
          "산업통상자원부가 요구하는 에너지전환 정책 방향과 주요 이슈를 정확히 짚고, 이를 기반으로 한 연구 질문과 접근 방법론이 명확하게 제시되어 있습니다.",
          "핵심 투입인력 다수가 산업부·유관기관 연구 경험을 보유하고 있어 이해관계자 인터뷰·정책 제언의 실효성이 높게 평가됩니다.",
        ],
        gaps: [
          "정량 모델링(수요·공급 시나리오, 온실가스 감축 효과 등)에 대한 세부 가정과 민감도 분석 계획이 요약 수준에 그쳐, 추가 설명이 있으면 설득력이 더 높아질 수 있습니다.",
          "성과 확산·정책 반영 전략(워크숍 운영, 브리핑 구조 등)에 대한 로드맵이 상대적으로 간략히 제시되어 있습니다.",
        ],
        risks: [
          "대외 변수(국제 에너지 가격, 규제 변화 등)에 따른 결과 값 변동성과 한계를 어떻게 커뮤니케이션할지에 대한 전략이 보완되지 않으면, 최종 산출물 해석 단계에서 논쟁 여지가 남을 수 있습니다.",
        ],
      },

      // ✅ TEST 2: 배점 구조를 약간 다르게 + 총점 60/80 → 매칭도 75%
      p2: {
        projectId: "p2",
        rfpFileName: "2025_한국수력원자력_중장기_재무전망_추정용역_RFP.pdf",
        proposalFileName: "PwC_한수원_중장기_재무전망_시나리오_분석_제안서.pdf",
        matchingScore: 75, // 60/80 = 75%
        totalScore: 60,
        totalMaxScore: 80,
        factors: [
          {
            category: "기술·지식능력",
            factor: "중장기 재무·재무비율 추정 방법론의 적정성",
            maxScore: 20, // 한수원 과제 특성상 이 항목 비중 상향
            score: 17,
          },
          {
            category: "기술·지식능력",
            factor: "에너지·전력 시장 및 규제 환경에 대한 이해도",
            maxScore: 10,
            score: 8,
          },
          {
            category: "인력·조직·관리기술",
            factor: "재무·전략·에너지 전문가로 구성된 팀의 적정성",
            maxScore: 10,
            score: 7,
          },
          {
            category: "인력·조직·관리기술",
            factor: "사업수행조직체계 및 의사결정 구조의 명확성",
            maxScore: 10,
            score: 8,
          },
          {
            category: "사업 수행 계획",
            factor: "시나리오 설정(원전·신재생·수요전망 등)의 합리성",
            maxScore: 10,
            score: 7,
          },
          {
            category: "사업 수행 계획",
            factor: "프로젝트 일정 및 단계별 산출물 계획의 구체성",
            maxScore: 10,
            score: 6,
          },
          {
            category: "수행실적",
            factor: "발전사·공기업 대상 재무모델링·밸류에이션 수행 경험",
            maxScore: 10,
            score: 7,
          },
        ],
        strengths: [
          "중장기 재무전망을 위한 시나리오 기반 재무모델 구조가 잘 설계되어 있으며, 주요 재무비율(부채비율, 이자보상배율 등)에 대한 모니터링 체계가 포함되어 있습니다.",
          "발전사 및 공기업 대상 재무모델링·밸류에이션 수행 경험을 갖춘 인력이 포함되어 있어, 한수원 특성에 맞춘 해석과 인사이트 도출이 가능해 보입니다.",
        ],
        gaps: [
          "시장제도 변화(전력시장 구조 개편, 탄소중립 정책 강화 등)에 따른 재무전망 시나리오 민감도 분석 범위가 상대적으로 좁게 제시되어 있습니다.",
          "신규 투자·감가상각, 자본조달 전략(채권 발행, 증자 등)에 대한 가정이 고정값으로 제시되어 있어, 실제 경영전략 선택과의 연결성이 더 강조되면 좋습니다.",
        ],
        risks: [
          "중장기 예측 특성상 불확실성이 높음에도 불구하고, ‘베이스라인 시나리오’에 대한 의존도가 크면, 향후 경영진 의사결정에 잘못된 신호를 줄 수 있는 리스크가 존재합니다.",
          "국내외 규제 환경 변화(택소노미, 원전 관련 정책 등)가 급변할 경우, 재무전망의 재검토 주기와 방법론을 사전에 합의해 두지 않으면, 모델의 활용도가 떨어질 수 있습니다.",
        ],
      },
    };
  },

  // 나머지 addProject, getProject, upsertEvaluation, getEvaluation, removeProject 등은 그대로 두면 돼
};


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

  if (!data) {
    container.innerHTML = `
      <div class="border rounded-lg p-6 bg-white text-gray-500 text-sm">
        아직 이 프로젝트에 대한 평가 결과가 없습니다.
        상단에서 프로젝트를 선택하고 RFP·제안서를 업로드해 보세요.
      </div>
    `;
    return;
  }

  const project = State.getProject(projectId);
  const title = project ? project.name : `프로젝트 ${projectId}`;

  const matchingScore = data.matchingScore ?? 0;

  // 세부 항목 점수(backend에서 내려온 factors, totalScore, totalMaxScore)
  const factors = Array.isArray(data.factors) ? data.factors : [];
  const totalScore =
    typeof data.totalScore === "number"
      ? data.totalScore
      : factors.reduce((sum, f) => sum + (f.score || 0), 0);
  const totalMaxScore =
    typeof data.totalMaxScore === "number"
      ? data.totalMaxScore
      : factors.reduce((sum, f) => sum + (f.maxScore || 0), 0);

  const strengths = data.strengths || [];
  const gaps = data.gaps || [];
  const risks = data.risks || [];

  // 세부 항목 점수 테이블 HTML
  const factorsHtml = factors.length
    ? `
    <div class="mt-4 border rounded-lg bg-white p-4 shadow-sm">
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-semibold text-gray-800 text-sm">세부 평가 항목별 점수</h3>
        <span class="text-xs text-gray-500">
          총점 ${totalScore}/${totalMaxScore}점 · 매칭도 ${matchingScore}%
        </span>
      </div>
      <div class="space-y-2 max-h-64 overflow-y-auto pr-1">
        ${factors
          .map((f) => {
            const score = f.score ?? 0;
            const max = f.maxScore ?? 0;
            const ratio = max > 0 ? Math.round((score / max) * 100) : 0;
            return `
              <div class="text-xs">
                <div class="flex justify-between mb-1">
                  <span class="font-medium text-gray-700">
                    [${f.category}] ${f.factor}
                  </span>
                  <span class="text-gray-600">
                    ${score}/${max}점 (${ratio}%)
                  </span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    class="h-1.5 rounded-full bg-[#e57200]"
                    style="width: ${ratio}%;"
                  ></div>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    </div>
  `
    : `
    <div class="mt-4 border rounded-lg bg-white p-4 shadow-sm text-xs text-gray-500">
      세부 항목별 점수 정보는 아직 없습니다.
    </div>
  `;

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-800">${title} · 기술평가 결과</h2>
          ${
            data.proposalFileName
              ? `<p class="text-xs text-gray-500 mt-1">제안서: ${data.proposalFileName}</p>`
              : ""
          }
          ${
            data.rfpFileName
              ? `<p class="text-xs text-gray-400">RFP: ${data.rfpFileName}</p>`
              : ""
          }
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <!-- 왼쪽: 매칭도 + 세부 항목 점수 -->
        <div class="md:col-span-2 space-y-4">
          <!-- 매칭도 카드 -->
          <div class="border rounded-lg bg-white p-6 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-[#8C1D40] mb-1">RFP 대비 매칭도</p>
              <p class="text-4xl font-bold text-gray-900">${matchingScore}<span class="text-2xl">%</span></p>
              <p class="text-xs text-gray-500 mt-1">
                RFP에서 정의한 정성평가 항목을 기준으로 산정된 총합 점수입니다.
              </p>
            </div>
            <div class="w-24 h-24 rounded-full border-4 border-[#8C1D40]/20 flex items-center justify-center">
              <div class="w-20 h-20 rounded-full border-4 border-[#e57200]/80 flex items-center justify-center">
                <span class="text-lg font-semibold text-gray-800">${matchingScore}%</span>
              </div>
            </div>
          </div>

          <!-- 세부 항목별 점수 카드 -->
          ${factorsHtml}
        </div>

        <!-- 오른쪽: 강점 + 보완/리스크 -->
        <div class="space-y-4">
          <!-- 강점 카드 -->
          <div class="border rounded-lg bg-white p-4 shadow-sm">
            <h3 class="text-sm font-semibold text-gray-800 mb-2">
              <i class="fas fa-check-circle text-[#e57200] mr-1"></i>
              강점 (Strengths)
            </h3>
            ${
              strengths.length
                ? `<ul class="list-disc ml-4 space-y-1 text-xs text-gray-700">
                    ${strengths.map((s) => `<li>${s}</li>`).join("")}
                   </ul>`
                : `<p class="text-xs text-gray-500">등록된 강점 정보가 없습니다.</p>`
            }
          </div>

          <!-- 보완 필요 + 리스크 카드 -->
          <div class="border rounded-lg bg-white p-4 shadow-sm space-y-3">
            <div>
              <h3 class="text-sm font-semibold text-gray-800 mb-1">
                <i class="fas fa-exclamation-circle text-[#8C1D40] mr-1"></i>
                보완 필요 항목 (Gaps)
              </h3>
              ${
                gaps.length
                  ? `<ul class="list-disc ml-4 space-y-1 text-xs text-gray-700">
                      ${gaps.map((g) => `<li>${g}</li>`).join("")}
                     </ul>`
                  : `<p class="text-xs text-gray-500">보완 필요 항목이 없습니다.</p>`
              }
            </div>
            <div class="border-t pt-2">
              <h3 class="text-sm font-semibold text-gray-800 mb-1">
                <i class="fas fa-triangle-exclamation text-amber-500 mr-1"></i>
                리스크 (Risks)
              </h3>
              ${
                risks.length
                  ? `<ul class="list-disc ml-4 space-y-1 text-xs text-gray-700">
                      ${risks.map((r) => `<li>${r}</li>`).join("")}
                     </ul>`
                  : `<p class="text-xs text-gray-500">추가로 인지된 리스크가 없습니다.</p>`
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

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
