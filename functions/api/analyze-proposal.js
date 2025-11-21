// functions/api/analyze-proposal.js

export async function onRequestPost(context) {
  const { request } = context;
  const formData = await request.formData();

  const file = formData.get("file");
  const projectId = formData.get("projectId");
  const clientName = formData.get("clientName") || "클라이언트";

  const fileName = file && file.name ? file.name : "proposal.pdf";

  // -------------------------------
  // 1. 평가 항목 템플릿 (질문에 준 표 기준)
  // -------------------------------
  const factorsTemplate = [
    {
      category: "기술·지식능력",
      factor: "제안내용의 우수성 및 경쟁력",
      maxScore: 15,
      key: "content",
    },
    {
      category: "기술·지식능력",
      factor: "투입인력의 전문성 및 경험도",
      maxScore: 15,
      key: "expertise",
    },
    {
      category: "인력·조직·관리기술",
      factor: "참여인력의 적정성",
      maxScore: 10,
      key: "staffAdequacy",
    },
    {
      category: "인력·조직·관리기술",
      factor: "사업수행조직체계의 적정성",
      maxScore: 10,
      key: "orgStructure",
    },
    {
      category: "사업 수행 계획",
      factor: "추진목표 이해도 및 사업추진 전략",
      maxScore: 10,
      key: "strategy",
    },
    {
      category: "사업 수행 계획",
      factor: "수행일정의 합리성 및 수행절차의 적정성",
      maxScore: 10,
      key: "schedule",
    },
    {
      category: "수행실적",
      factor: "최근 3년간 동 분야 연구 실적",
      maxScore: 10,
      key: "trackRecord",
    },
  ];

  const totalMaxScore = factorsTemplate.reduce(
    (sum, f) => sum + f.maxScore,
    0
  ); // = 80점

  // -------------------------------
  // 2. 간단한 "규칙 기반" 점수 계산 로직
  //    - 파일명, 프로젝트ID, 클라명 길이를 이용해
  //      매번 비슷하지만 살짝씩 다른 점수
  // -------------------------------
  const seed =
    (fileName.length || 10) +
    (projectId ? String(projectId).length : 0) +
    (clientName ? String(clientName).length : 0);

  let totalScore = 0;

  const factorsScored = factorsTemplate.map((f, idx) => {
    // 기본은 75% 근처에서 시작 + 항목마다 약간씩 가중
    const baseRatio = 0.75; // 75%
    const variation = ((seed + idx * 7) % 7) / 20; // 0 ~ 0.3
    const ratio = Math.min(1, baseRatio + variation); // 최대 100%

    const score = Math.round(f.maxScore * ratio);
    totalScore += score;

    return {
      ...f,
      score,
      ratio, // 0~1 사이, 달성률
    };
  });

  // 총점을 100점 만점으로 환산 → matchingScore
  const matchingScore = Math.round((totalScore / totalMaxScore) * 100);

  // -------------------------------
  // 3. 강점 / 보완 / 리스크 문구 생성
  //    - 항목 점수(ratio)에 따라 자동으로 문구 구성
  // -------------------------------
  const strengths = [];
  const gaps = [];
  const risks = [];

  const highFactors = factorsScored.filter((f) => f.ratio >= 0.85);
  const lowFactors = factorsScored.filter((f) => f.ratio < 0.8);

  // 강점: 점수 높은 항목 위주
  highFactors.slice(0, 2).forEach((f) => {
    strengths.push(
      `[${f.category}] ${f.factor} 항목에서 ${f.score}/${f.maxScore}점으로 평가되어 상대적인 강점으로 보입니다.`
    );
  });

  if (strengths.length === 0) {
    strengths.push(
      `${clientName} 제안서는 전 항목에서 균형 잡힌 수준을 보이며, 특히 제안 내용의 구조화와 사업수행 전략이 안정적인 것으로 평가됩니다.`
    );
  }

  // 보완 필요: 낮은 항목 위주
  lowFactors.slice(0, 2).forEach((f) => {
    gaps.push(
      `[${f.category}] ${f.factor} 항목은 ${f.score}/${f.maxScore}점으로 다른 항목 대비 낮게 평가되어 추가적인 보완이 필요합니다.`
    );
  });

  if (gaps.length === 0) {
    gaps.push(
      "주요 평가 항목에서 모두 높은 점수를 받았으나, 세부 실행계획(리스크 관리, 성과지표 등)을 좀 더 구체화하면 경쟁력을 더 높일 수 있습니다."
    );
  }

  // 리스크: 가장 낮은 항목 중심으로 1~2개
  if (lowFactors.length > 0) {
    const weakest = lowFactors[0];
    risks.push(
      `[${weakest.category}] ${weakest.factor} 항목의 상대적으로 낮은 점수로 인해 실제 사업 수행 시 리스크가 발생할 수 있습니다. 사전 보완 전략 수립이 필요합니다.`
    );
  }
  risks.push(
    "제안서 상에서 리스크 관리·대응 계획 및 정량 KPI를 보다 명확히 제시하면 평가자의 신뢰도를 크게 높일 수 있습니다."
  );

  // -------------------------------
  // 4. 프론트엔드로 반환하는 최종 데이터
  //    - 기존 구조 + factors(항목별 점수) 추가
  // -------------------------------
  const data = {
    projectId,
    proposalFileName: fileName,
    matchingScore, // 100점 환산 점수
    strengths,
    gaps,
    risks,
    // 아래는 나중에 상세 화면 만들 때 쓸 수 있는 정보들
    totalScore, // 80점 만점 중 실제 점수
    totalMaxScore, // 항상 80
    factors: factorsScored, // 각 평가 항목별 점수/달성률
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
