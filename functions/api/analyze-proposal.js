// functions/api/analyze-proposal.js

export async function onRequestPost(context) {
  const { request } = context;
  const formData = await request.formData();

  const file = formData.get("file");
  const projectId = formData.get("projectId");
  const clientName = formData.get("clientName") || "클라이언트";

  const fileName = file && file.name ? file.name : "proposal.pdf";

  // 1. 평가 항목 템플릿 (질문에서 준 표 기준)
  const factorsTemplate = [
    {
      category: "기술·지식능력",
      factor: "제안내용의 우수성 및 경쟁력",
      maxScore: 15
    },
    {
      category: "기술·지식능력",
      factor: "투입인력의 전문성 및 경험도",
      maxScore: 15
    },
    {
      category: "인력·조직·관리기술",
      factor: "참여인력의 적정성",
      maxScore: 10
    },
    {
      category: "인력·조직·관리기술",
      factor: "사업수행조직체계의 적정성",
      maxScore: 10
    },
    {
      category: "사업 수행 계획",
      factor: "추진목표 이해도 및 사업추진 전략",
      maxScore: 10
    },
    {
      category: "사업 수행 계획",
      factor: "수행일정의 합리성 및 수행절차의 적정성",
      maxScore: 10
    },
    {
      category: "수행실적",
      factor: "최근 3년간 동 분야 연구 실적",
      maxScore: 10
    }
  ];

  // 총 배점 (15+15+10+10+10+10+10 = 80)
  let totalMaxScore = 0;
  for (const f of factorsTemplate) {
    totalMaxScore += f.maxScore;
  }

  // 2. 파일명/프로젝트ID/클라이언트명을 이용한 간단한 seed
  let seed = 0;
  const baseString = fileName + "|" + (projectId || "") + "|" + clientName;
  for (let i = 0; i < baseString.length; i++) {
    seed += baseString.charCodeAt(i);
  }

  // 3. 각 항목 점수 계산 (대략 70~100% 사이)
  let totalScore = 0;
  const factorsScored = [];

  for (let i = 0; i < factorsTemplate.length; i++) {
    const f = factorsTemplate[i];

    // 0.70 ~ 1.00 사이의 달성률 비슷하게 나오도록
    const raw = (seed + i * 13) % 31; // 0 ~ 30
    let ratio = 0.7 + raw / 100;      // 0.70 ~ 1.00
    if (ratio > 1) ratio = 1;

    const score = Math.round(f.maxScore * ratio);
    totalScore += score;

    factorsScored.push({
      category: f.category,
      factor: f.factor,
      maxScore: f.maxScore,
      score: score,
      ratio: ratio
    });
  }

  // 4. 총점을 100점 환산
  const matchingScore = Math.round((totalScore / totalMaxScore) * 100);

  // 5. 강점 / 보완 / 리스크 문구
  const strengths = [];
  const gaps = [];
  const risks = [];

  const highFactors = factorsScored.filter(f => f.ratio >= 0.85);
  const lowFactors = factorsScored.filter(f => f.ratio < 0.8);

  // 강점
  if (highFactors.length > 0) {
    for (let i = 0; i < Math.min(2, highFactors.length); i++) {
      const f = highFactors[i];
      strengths.push(
        `[${f.category}] ${f.factor} 항목에서 ${f.score}/${f.maxScore}점으로 평가되어 상대적인 강점으로 보입니다.`
      );
    }
  } else {
    strengths.push(
      `${clientName} 제안서는 전반적으로 균형 잡힌 수준을 보이며, 특히 제안 내용의 구조화와 사업추진 전략 측면에서 안정적인 것으로 평가됩니다.`
    );
  }

  // 보완 필요
  if (lowFactors.length > 0) {
    for (let i = 0; i < Math.min(2, lowFactors.length); i++) {
      const f = lowFactors[i];
      gaps.push(
        `[${f.category}] ${f.factor} 항목은 ${f.score}/${f.maxScore}점으로 다른 항목 대비 낮게 평가되어 추가적인 보완이 필요합니다.`
      );
    }
  } else {
    gaps.push(
      "주요 평가 항목에서 모두 높은 점수를 받았으나, 리스크 관리 계획과 정량 KPI를 보다 명확히 제시하면 경쟁력을 더 높일 수 있습니다."
    );
  }

  // 리스크
  if (lowFactors.length > 0) {
    const weakest = lowFactors[0];
    risks.push(
      `[${weakest.category}] ${weakest.factor} 항목의 상대적으로 낮은 점수로 인해 실제 사업 수행 시 리스크가 발생할 수 있습니다. 사전 보완 전략 수립이 필요합니다.`
    );
  }
  risks.push(
    "제안서 상에서 리스크 관리·대응 계획, 성과지표 및 모니터링 체계를 구체화하면 평가자의 신뢰도를 크게 높일 수 있습니다."
  );

  // 6. 프론트로 보낼 최종 데이터
  const data = {
    projectId: projectId,
    proposalFileName: fileName,
    matchingScore: matchingScore,
    strengths: strengths,
    gaps: gaps,
    risks: risks,
    totalScore: totalScore,
    totalMaxScore: totalMaxScore,
    factors: factorsScored
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
