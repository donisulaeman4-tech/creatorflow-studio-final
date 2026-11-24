const MODEL = "@cf/google/gemma-4-26b-a4b-it";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
const json = (data, status=200) => new Response(JSON.stringify(data), {
  status, headers: {...CORS, "Content-Type":"application/json"}
});
export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, {headers:CORS});
    if (request.method === "GET") return new Response("CreatorFlow AI Worker Ready", {headers:CORS});
    if (request.method !== "POST") return json({success:false,error:"Gunakan POST."},405);
    try {
      if (!env.AI) return json({success:false,error:"AI binding 'AI' belum tersedia di Worker Settings."},500);
      const body = await request.json();
      const task = body.task || "content_generation";
      const input = body.input ?? {};
      const prompt = task === "connection_test"
        ? "Reply with exactly these words: AI ENGINE READY"
        : (typeof input === "string" ? input : JSON.stringify(input));
      const taskGuide = {
        niche_research: "Recommend and rank suitable YouTube niches. Include audience, demand signals, competition, monetization, content pillars, risks, and a practical validation plan.",
        video_ideas: "Generate the requested number of distinct YouTube video ideas. For each include title, angle, format, hook, outline, and thumbnail concept.",
        script_writer: "Write a complete production-ready YouTube script with opening hook, structured sections, retention resets, transitions, ending and CTA. Respect the requested format and tone.",
        storyboard: "Convert the supplied script into a detailed scene-by-scene storyboard with timestamps, visuals, B-roll or image prompts, on-screen text, narration reference and editing notes.",
        thumbnail_brief: "Create a thumbnail design brief with composition, focal subject, emotion, background, contrast, short text overlay, color direction and a detailed image-generation prompt.",
        seo_package: "Create a publishing package with multiple title options, description, chapters if possible, keywords, tags, hashtags, pinned comment and a pre-publish checklist."
      };
      const system = `You are CreatorFlow AI, an expert YouTube strategist and production assistant. Output in ${body.language || "English"}. Target audience: ${body.audience || "Global English-speaking audience"}. Task instructions: ${taskGuide[task] || "Help the creator with a detailed, useful YouTube production task."} Be specific, structured, original and practical. Do not invent factual sources or guarantee views or rankings.`;
      const user = task === "connection_test" ? prompt : `Task: ${task}\nUser inputs:\n${prompt}\n\nReturn a complete, clearly structured result.`;
      const completion = await env.AI.run(MODEL, {
        messages: [{role:"system",content:system},{role:"user",content:user}],
        max_tokens: 1800
      });
      const text = completion?.choices?.[0]?.message?.content
        ?? completion?.response
        ?? completion?.result
        ?? completion?.output
        ?? completion;
      return json({success:true,task,model:MODEL,result:text});
    } catch (error) {
      return json({success:false,error:error?.message || "AI Worker error."},500);
    }
  }
};