export async function onRequestPost(context) {
  const { request, env } = context;
  const formData = await request.formData();

  const file = formData.get("file");
  const projectId = formData.get("projectId");
  const clientName = formData.get("clientName") || "클라이언트";

  // 1) 파일 텍스트 추출 (지금 단계에서는 dummy)
  const proposalText = "여기에 제안서 텍스트 추출 결과 들어감";

  // 2) OpenAI 호출
  const apiKey = env.OPENAI_API_KEY;
  const openaiRes = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: `여기 AI 프롬프트 넣기...`,
      response_format: { type: "json_object" }
    }),
  });

  if (!openaiRes.ok) {
    return new Response("AI 분석 오류 발생", { status: 500 });
  }

  const json = await openaiRes.json();
  const parsed = JSON.parse(json.output_text);

  // 3) 실제 결과
  const data = {
    projectId,
    proposalFileName: file ? file.name : "proposal.pdf",
    matchingScore: parsed.matchingScore,
    strengths: parsed.strengths,
    gaps: parsed.gaps,
    risks: parsed.risks,
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
