import { SkillLevel, AnalysisResult, Challenge, ChallengeResult, ValidationResult } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const MODEL_NAME = 'llama-3.3-70b-versatile'; // Fast and powerful for code

const getSystemInstruction = (skillLevel: SkillLevel): string => {
  const baseInstruction = `You are SOCA (Smart Optimized Code Auditor), an expert AI code review assistant. Your mission is to analyze, debug, and optimize code like a senior software engineer and mentor. Review the user's code for syntax errors, runtime issues, security flaws, and performance bottlenecks. Suggest clean, optimized, and idiomatic solutions. Always provide a fully rewritten, production-ready version of the code. Your output MUST be a valid JSON object.`;

  if (skillLevel === SkillLevel.Junior) {
    return `${baseInstruction} Adapt your tone for a junior developer. Use simple language, metaphors, and provide step-by-step explanations for your suggestions. Be encouraging and focus on fundamental concepts.`;
  }
  return `${baseInstruction} Adapt your tone for a senior engineer. Be concise, technical, and direct. Focus on high-level architecture, design patterns, and subtle performance optimizations.`;
};

const callGroq = async (prompt: string, systemPrompt: string): Promise<string> => {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key is missing. Please add VITE_GROQ_API_KEY to your .env file.\n\nGet your free API key from: https://console.groq.com/keys');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 4096,
      response_format: { type: 'json_object' }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Groq API error:', errorText);
    
    if (response.status === 401) {
      throw new Error('Invalid Groq API key. Please check your VITE_GROQ_API_KEY.\n\nGet a new key from: https://console.groq.com/keys');
    }
    
    throw new Error(`Groq API error: ${response.status} ${response.statusText}\nDetails: ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export const analyzeCode = async (code: string, skillLevel: SkillLevel): Promise<AnalysisResult> => {
  const prompt = `
Analyze the following code snippet based on my skill level (${skillLevel}).

Code:
\`\`\`
${code}
\`\`\`

Your response MUST be a single, valid JSON object. Do not include any text or markdown formatting outside of the JSON object.
The JSON object must have the following structure:
{
  "errors": [{ "title": "...", "explanation": "...", "codeSnippet": "..." }],
  "warnings": [{ "title": "...", "explanation": "...", "codeSnippet": "..." }],
  "optimizations": [{ "title": "...", "explanation": "...", "codeSnippet": "..." }],
  "bestPractices": [{ "title": "...", "explanation": "...", "codeSnippet": "..." }],
  "rewrittenCode": "..."
}

- "errors": List critical issues that will cause failures. If none, return an empty array [].
- "warnings": List potential issues or bad practices. If none, return an empty array [].
- "optimizations": Suggest improvements for performance or readability. If none, return an empty array [].
- "bestPractices": Mention alignment with industry standards (e.g., SOLID, DRY). If none, return an empty array [].
- "rewrittenCode": Provide a complete, corrected, and production-ready version of the code. If no changes are needed, return the original code.
`;

  try {
    const jsonText = await callGroq(prompt, getSystemInstruction(skillLevel));
    const parsedResult = JSON.parse(jsonText) as AnalysisResult;
    
    if (!parsedResult.rewrittenCode) {
      parsedResult.rewrittenCode = "// AI response did not include rewritten code.";
    }
    return parsedResult;
  } catch (error) {
    console.error('Error analyzing code:', error);
    throw new Error('Failed to get analysis from Groq AI. Please check the console for more details.');
  }
};

export const generateChallenge = async (skillLevel: SkillLevel): Promise<Challenge> => {
  const prompt = `Generate a short, buggy code snippet in JavaScript or React for a ${skillLevel}-level developer to fix. The code should have 2-3 clear issues. Provide the buggy code and a concise description of the task. The JSON object should have the following structure: { "buggyCode": "", "description": "" }.`;

  try {
    const jsonText = await callGroq(prompt, getSystemInstruction(skillLevel));
    return JSON.parse(jsonText) as Challenge;
  } catch (error) {
    console.error('Error generating challenge:', error);
    throw new Error('Failed to generate a challenge from Groq AI.');
  }
};

export const compareSolutions = async (buggyCode: string, userSolution: string, skillLevel: SkillLevel): Promise<ChallengeResult> => {
  const prompt = `
Original Buggy Code:
\`\`\`
${buggyCode}
\`\`\`

User's Submitted Solution:
\`\`\`
${userSolution}
\`\`\`

Please perform the following tasks and respond with a JSON object with the structure { "aiSolution": "", "feedback": "" }:
1. Provide your own corrected, optimized version of the original buggy code in the 'aiSolution' field.
2. Provide constructive feedback on the user's solution in the 'feedback' field. Analyze their code, explain what they fixed correctly, and point out any remaining issues or areas for improvement by comparing their approach to the optimal solution.
`;

  try {
    const jsonText = await callGroq(prompt, getSystemInstruction(skillLevel));
    return JSON.parse(jsonText) as ChallengeResult;
  } catch (error) {
    console.error('Error comparing solutions:', error);
    throw new Error('Failed to get comparison from Groq AI.');
  }
};

export const validateSolution = async (buggyCode: string, userSolution: string): Promise<ValidationResult> => {
  const prompt = `
I am running a coding challenge. A user was given this buggy code:
\`\`\`
${buggyCode}
\`\`\`

They submitted this solution:
\`\`\`
${userSolution}
\`\`\`

Does the user's solution correctly fix the primary bugs? The solution doesn't have to be perfect, but it must be functional and solve the main issues. 
Answer with only a JSON object with the structure { "isCorrect": boolean, "feedback": "one-sentence explanation" }.
`;

  const systemPrompt = "You are an automated code judge. Be strict but fair. Your only job is to determine if the submitted code fixes the core issues of the buggy code. Your output MUST be a valid JSON object.";

  try {
    const jsonText = await callGroq(prompt, systemPrompt);
    return JSON.parse(jsonText) as ValidationResult;
  } catch (error) {
    console.error('Error validating solution:', error);
    throw new Error('Failed to validate solution.');
  }
};
