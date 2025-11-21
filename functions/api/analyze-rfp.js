export async function onRequestPost(context) {
  const { request } = context;
  const formData = await request.formData();

  const file = formData.get("file");
  const projectId = formData.get("projectId");

  const data = {
    projectId,
    rfpFileName: file ? file.name : "RFP.pdf",
    rfpSummary:
      "RFP에서 12개의 평가 항목과 3개의 주요 리스크(일정, 인허가, 성능보증)를 추출했습니다.",
    categories: [
      { name: "기술·설계 적정성", weight: 40 },
      { name: "사업수행·인력 구성", weight: 30 },
      { name: "일정·리스크 관리", weight: 20 },
      { name: "ESG·사회적 가치", weight: 10 },
    ],
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
