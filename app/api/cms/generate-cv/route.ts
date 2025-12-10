import { NextRequest } from "next/server";
import { verifyApiKey, createErrorResponse, createSuccessResponse } from "@/lib/auth";
import { getKVValue } from "@/lib/kv-direct-api";
import { Ollama } from "ollama";

export const runtime = "edge";

// Using smaller/faster model - change to llama3.1:8b for better quality but slower speed
const OLLAMA_BASE_URL = "http://localhost:11434";

interface GenerateRequest {
  jobPosting: string;
  model?: "fast" | "slow"; // fast = llama3.2:3b, slow = llama3.1:8b
  documentType?: "both" | "cv" | "cover-letter"; // What to generate
}

// Check if Ollama is running and model is available
async function checkOllamaHealth(modelName: string): Promise<{ ok: boolean; error?: string }> {
  try {
    // Check if Ollama server is running
    const healthResponse = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: "GET",
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!healthResponse.ok) {
      return {
        ok: false,
        error: "Ollama server is not responding. Please start Ollama with 'ollama serve'.",
      };
    }

    const data = await healthResponse.json();
    const models = data.models || [];

    // Check if the required model is available
    const modelExists = models.some((m: any) => m.name === modelName);

    if (!modelExists) {
      return {
        ok: false,
        error: `Model '${modelName}' is not installed. Please run: ollama pull ${modelName}`,
      };
    }

    return { ok: true };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        ok: false,
        error: "Ollama server connection timeout. Please ensure Ollama is running with 'ollama serve'.",
      };
    }
    return {
      ok: false,
      error: `Could not connect to Ollama at ${OLLAMA_BASE_URL}. Please ensure Ollama is running.`,
    };
  }
}

// Note: Ollama client doesn't work in Edge runtime, so we'll use fetch directly
async function generateWithOllama(prompt: string, modelName: string, maxTokens: number = 2000): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: maxTokens,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response.trim();
  } catch (error) {
    console.error("Ollama generation error:", error);
    throw error;
  }
}

function createCVPrompt(data: {
  jobPosting: string;
  bio: any;
  projects: any[];
  skills: any[];
  experiences: any[];
}): string {
  const { jobPosting, bio, projects, skills, experiences } = data;

  // Format projects with rich details
  const projectsSection = projects
    .slice(0, 8)
    .map(
      (p) =>
        `Project: ${p.title || "Untitled Project"}\n` +
        `Description: ${p.description || "No description"}\n` +
        `Technologies: ${(p.stack || []).join(", ")}\n` +
        `${p.link ? `Link: ${p.link}` : ""}\n` +
        `${p.featured ? "[Featured Project]" : ""}`
    )
    .join("\n\n");

  // Format skills with categorization if available
  const skillsSection = Array.isArray(skills)
    ? skills.map((s) => {
        if (typeof s === "string") return s;
        return `${s.name || s}${s.level ? ` (${s.level})` : ""}`;
      }).join(" • ")
    : "Various technical skills";

  // Format experience with rich details - sort by current first, then by start date descending
  const sortedExperiences = Array.isArray(experiences) && experiences.length > 0
    ? [...experiences].sort((a, b) => {
        // Current jobs first
        if (a.current && !b.current) return -1;
        if (!a.current && b.current) return 1;
        
        // Then sort by start date descending (most recent first)
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return dateB - dateA;
      })
    : [];
  
  const experienceSection = sortedExperiences.length > 0
    ? sortedExperiences
        .map((exp) => {
          // Parse dates properly
          const startDate = exp.startDate ? new Date(exp.startDate) : null;
          const endDate = exp.endDate ? new Date(exp.endDate) : null;
          
          const formatDate = (date: Date | null) => {
            if (!date) return null;
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
          };
          
          const dateRange = startDate
            ? `[ ${formatDate(startDate)} – ${endDate ? formatDate(endDate) : 'Current'} ]`
            : '[ Date not specified ]';
          
          const location = exp.location && exp.country 
            ? `City: ${exp.location} | Country: ${exp.country}`
            : 'Location not specified';
          
          const achievementsList = Array.isArray(exp.achievements) && exp.achievements.length > 0
            ? exp.achievements.map((a: string) => `• ${a}`).join('\n')
            : '• Contributed to company projects and initiatives';
          
          const techStack = Array.isArray(exp.technologies) && exp.technologies.length > 0
            ? `Technologies: ${exp.technologies.join(', ')}`
            : '';
          
          return `EXPERIENCE ENTRY:
Company: ${exp.company || 'Company'}
Position: ${exp.position || exp.role || 'Position'}
Date Range: ${dateRange}
Location: ${location}
Achievements:
${achievementsList}
${techStack}`;
        })
        .join('\n\n---\n\n')
    : "No experience data available";

  return `You are an expert ATS-optimized CV writer specializing in technical roles. Create a professional, achievement-focused CV in clean HTML format.

JOB POSTING:
${jobPosting}

CANDIDATE DATA:
Name: ${bio.name || "Candidate"}
Current Title: ${bio.title || "Software Engineer"}
Email: ${bio.email || ""}
Phone: ${bio.phone || ""}
Location: ${bio.location || ""}
LinkedIn: ${bio.linkedin || ""}
GitHub: ${bio.github || ""}
Website: ${bio.website || ""}

ABOUT ME:
${bio.about || bio.intro || ""}

TECHNICAL SKILLS:
${skillsSection}

WORK EXPERIENCE DATA (${Array.isArray(experiences) ? experiences.length : 0} entries):
${experienceSection}

KEY PROJECTS:
${projectsSection}

EDUCATION DATA:
${Array.isArray(bio.education) && bio.education.length > 0 
  ? bio.education.map((edu: any) => {
      const eduStartDate = edu.startDate ? new Date(edu.startDate) : null;
      const eduEndDate = edu.endDate ? new Date(edu.endDate) : null;
      const formatDate = (date: Date | null) => {
        if (!date) return null;
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${year}`;
      };
      const dateRange = eduStartDate && eduEndDate
        ? `[ ${formatDate(eduStartDate)} – ${formatDate(eduEndDate)} ]`
        : 'Dates not specified';
      
      return `Degree: ${edu.degree}
Institution: ${edu.institution}
Location: ${edu.location}
Date Range: ${dateRange}
Field: ${edu.field || ''}`;
    }).join('\n\n')
  : "Not specified"}

LANGUAGES:
${Array.isArray(bio.languages) && bio.languages.length > 0
  ? bio.languages.map((lang: any) => `${lang.language} (${lang.level})`).join(' | ')
  : "Not specified"}

CRITICAL REQUIREMENTS:

0. **ENHANCEMENT MANDATE - MAKE THE CANDIDATE PERFECT FOR THIS SPECIFIC JOB**:
   - Your PRIMARY goal is to make this candidate appear as the PERFECT FIT for the job posting above
   - TAILOR EVERYTHING to match the job requirements, skills, and keywords in the posting
   - Frame ALL experience data to highlight relevance to THIS specific role
   - Use strong action verbs and achievement-oriented language
   - Quantify impact where the data supports it (use metrics naturally)
   - Emphasize the skills, technologies, and experience the job posting asks for
   - Make accomplishments sound substantial, valuable, and DIRECTLY RELEVANT
   - You MAY enhance phrasing to sound more professional and impactful
   - You MAY add industry-standard context that makes achievements clearer
   - Stay grounded in the actual roles/companies/dates provided
   - DO NOT combine or merge different job entries - keep them separate
   - The experience entries are ALREADY SORTED CORRECTLY - maintain the order provided

1. STRUCTURE - Follow this EXACT layout:
   <div class="cv-container">
     <header class="cv-header">
       <h1>[Name]</h1>
       <div class="contact-info">Email | Phone | Website | LinkedIn</div>
     </header>
     
     <section class="cv-section">
       <h2>ABOUT ME</h2>
       <p>[Write a compelling 5-6 sentence paragraph that:]
       - Opens with years of experience and core expertise
       - Highlights 2-3 specific technical skills/technologies from job posting
       - Mentions leadership/collaboration experience if relevant
       - Shows passion for technology and continuous learning
       - Connects your background to the specific role requirements
       - Demonstrates value you'll bring to their team
       [Make it personal, specific, and tailored to THIS job posting. Use concrete examples from candidate's background.]</p>
     </section>
     
     <section class="cv-section">
       <h2>WORK EXPERIENCE</h2>
       [For EACH experience entry provided in the WORK EXPERIENCE DATA section above, create ONE experience-item div:]
       [CRITICAL: Include ALL experiences - do NOT skip any entries]
       [CRITICAL: MAINTAIN THE EXACT ORDER provided - they are already sorted correctly (current jobs first, then by date)]
       [CRITICAL: Use the date range, company name, position, and location from the data]
       [CRITICAL: DO NOT reorder, sort, or rearrange - use the order given]
       
       <div class="experience-item">
         <div class="experience-header">
           <span class="date-range">[Use EXACT date range from data - already formatted as [ DD/MM/YYYY - Current/DD/MM/YYYY ]]</span>
           <span class="company">[Use EXACT company name from data]</span>
         </div>
         <div class="location">[Use EXACT location from data format: "City: X | Country: Y"]</div>
         <div class="job-title">[Use position from data]</div>
         <ul class="achievements">
           [For each achievement in the data, create an impressive, ATS-optimized bullet point]
           [Use strong action verbs and highlight impact]
           [Quantify results where the context supports it]
           [Frame achievements to demonstrate value and technical excellence]
           [Include all major achievements from the data]
         </ul>
       </div>
       
       [Repeat the above structure for EVERY experience entry in the data]
       [DO NOT merge entries - each job should be separate]
     </section>
     
     <section class="cv-section">
       <h2>EDUCATION AND TRAINING</h2>
       [For each education entry in EDUCATION DATA:]
       <div class="education-item">
         <div class="education-header">
           <span class="date-range">[Date range from data]</span>
         </div>
         <div class="degree"><strong>[Degree name]</strong></div>
         <div class="institution">[Institution name]</div>
         <div class="location">[Location]</div>
         <div class="field">[Field of study if provided]</div>
       </div>
     </section>
     
     <section class="cv-section">
       <h2>SKILLS</h2>
       <div class="skills-grid">
         <div><strong>Core Proficiencies:</strong> [Top 8-10 relevant skills]</div>
         <div><strong>Additional Skills:</strong> [Other relevant skills]</div>
         <div><strong>Tools & Platforms:</strong> [Development tools]</div>
       </div>
     </section>
   </div>

2. WORK EXPERIENCE RULES:
   - **CRITICAL**: Include ALL experience entries from the WORK EXPERIENCE DATA section (should be ${sortedExperiences.length} entries total)
   - **CRITICAL**: MAINTAIN THE EXACT ORDER provided in the data - DO NOT reorder or sort
   - **CRITICAL**: Create a SEPARATE experience-item div for EACH entry - DO NOT merge or combine entries
   - Use the date ranges, company names, positions, and locations provided as the foundation
   - Transform each achievement into a compelling statement that highlights impact
   - Use strong action verbs and achievement-oriented language
   - Emphasize technical depth, leadership, and business value
   - TAILOR achievements to match the job posting requirements
   - Each experience-item must be complete and separate
   
3. ACHIEVEMENT BULLET POINTS (within each experience):
   - Transform each achievement into a powerful, ATS-optimized statement
   - **CRITICAL**: Frame achievements to highlight skills/tech mentioned in the job posting
   - Use strong action verbs: Led, Architected, Developed, Optimized, Delivered, Spearheaded
   - Highlight impact, scale, and technical complexity relevant to the target role
   - Quantify results where context supports it (%, user counts, performance gains)
   - Emphasize technologies, frameworks, and practices mentioned in job posting
   - Connect achievements to what THIS employer needs
   - Make each bullet demonstrate clear value for THIS specific role
   - Include all major achievements for each role
   - Keep the • bullet character at the start of each <li>

4. ABOUT ME SECTION:
   - Write 5-6 sentences (150-200 words)
   - **CRITICAL**: Tailor HEAVILY to the specific job posting - this should feel custom-written for THIS role
   - Mirror keywords and requirements from the job posting
   - Highlight years of experience and core expertise that match what they're looking for
   - Mention 2-3 key technologies/skills from job posting that candidate has experience with
   - Include leadership/mentorship experience if relevant to the role
   - Show passion for the specific domain/industry mentioned in the job posting
   - Demonstrate understanding of THEIR specific role requirements and challenges
   - Make it conversational but professional
   - Use first person ("I" statements)

5. SKILLS ORGANIZATION:
   - Prioritize skills mentioned in job posting
   - Group by proficiency level
   - Include specific frameworks/tools, not just languages

5. ATS OPTIMIZATION:
   - Use standard section headings (no creative names)
   - Include exact keywords from job posting
   - Use semantic HTML (h1, h2, ul, li, strong)
   - No tables, no columns (ATS can't parse them well)
   - Keep formatting simple and clean

6. STYLE & TONE:
   - Professional but confident
   - Action-oriented language
   - Present tense for current roles, past tense for previous
   - Specific and technical, not generic
   - Show progression and growth

7. OUTPUT: Generate ONLY the HTML content (no markdown, no backticks, no explanations). Start directly with the HTML.

8. **FINAL REMINDER - TAILOR THIS CV TO THE JOB**:
   - Your PRIMARY goal is to make this candidate the PERFECT match for the job posting
   - EVERY section should highlight skills/experience relevant to the job requirements
   - Include ALL ${sortedExperiences.length} experience entries in the EXACT ORDER provided
   - Transform achievements to emphasize what THIS employer is looking for
   - Mirror language and keywords from the job posting throughout the CV
   - Make it clear why this candidate is EXACTLY what they need
   - The response MUST be comprehensive - include everything
   - Make recruiters say "This is THE candidate we've been looking for!"

**CRITICAL OUTPUT RULE**: 
Generate ONLY the HTML code. NO explanations, NO commentary, NO descriptions of what you did.
STOP immediately after closing </div> tag. Do NOT add any text after the HTML.
Your response should start with <div and end with </div> - NOTHING ELSE.

Generate the CV now:`;
}

function createCoverLetterPrompt(data: {
  jobPosting: string;
  bio: any;
  projects: any[];
  skills: any[];
}): string {
  const { jobPosting, bio, projects, skills } = data;

  // Get top 3 featured or recent projects with details
  const topProjects = projects
    .slice(0, 3)
    .map((p) => `${p.title || "Project"}${p.description ? `: ${p.description.slice(0, 100)}` : ""}`)
    .filter(Boolean);
  const projectsText = topProjects.length > 0 ? topProjects.join("\n") : "various innovative projects";

  // Get key skills with context
  const keySkills = Array.isArray(skills)
    ? skills
        .slice(0, 8)
        .map((s) => (typeof s === "string" ? s : s.name))
        .join(", ")
    : "various technical skills";

  return `You are an expert cover letter writer specializing in technical roles. Create a compelling, personalized cover letter in HTML format.

JOB POSTING:
${jobPosting}

CANDIDATE INFORMATION:
Name: ${bio.name || "Candidate"}
Current Title: ${bio.title || "Software Engineer"}
Email: ${bio.email || ""}
Phone: ${bio.phone || ""}
Location: ${bio.location || ""}

PROFESSIONAL BACKGROUND:
${bio.about || bio.intro || ""}

KEY TECHNICAL SKILLS: ${keySkills}

NOTABLE PROJECTS & ACHIEVEMENTS:
${projectsText}

CRITICAL REQUIREMENTS:

1. STRUCTURE (350-400 words, 4 paragraphs):
   
   <div class="cover-letter">
     <p class="greeting">Dear Hiring Manager,</p>
     
     <p class="opening">
       [HOOK: Express genuine enthusiasm for THIS specific role]
       [STATE: Position you're applying for]
       [PREVIEW: Brief statement of why you're perfect fit (X years experience in Y, specializing in Z)]
     </p>
     
     <p class="body-1">
       [TECHNICAL DEPTH: Discuss 2-3 most relevant technical skills from job posting]
       [SPECIFICS: Reference actual technologies, frameworks, methodologies mentioned in job posting]
       [EVIDENCE: Brief example of how you've used these skills with impact/results]
     </p>
     
     <p class="body-2">
       [ACHIEVEMENTS: Highlight 1-2 concrete achievements relevant to this role]
       [QUANTIFY: Include metrics (improved by X%, managed team of Y, delivered Z)]
       [CONNECT: Explicitly tie your experience to their needs from job posting]
     </p>
     
     <p class="closing">
       [STRONG CLOSING - 3 specific elements:]
       [1. VALUE PROPOSITION: One sentence stating the specific value you'll bring to THIS role/company]
       [2. CALL TO ACTION: Clear, confident statement about next steps - "I'd love to discuss how my experience with [specific tech from posting] can help [company achieve X goal]" or "I'm eager to explore how I can contribute to [specific project/challenge mentioned in posting]"]
       [3. AVAILABILITY: Specific, actionable statement - "I'm available for a conversation at your convenience" with contact method]
       [NO generic "thank you for your time" - be direct and action-oriented]
     </p>
     
     <p class="signature">
       Sincerely,<br>
       ${bio.name || "Candidate"}
     </p>
   </div>

2. WRITING STYLE:
   - Professional but conversational
   - Confident, not arrogant
   - Specific and technical when needed
   - Show you researched the role
   - Use "I" statements showing ownership
   - Active voice, strong action verbs

3. KEYWORD INTEGRATION:
   - Mirror language from job posting
   - Include 3-5 key technical terms from posting
   - Reference company technologies/stack if mentioned
   - Don't force keywords - use naturally

4. PERSONALIZATION RULES:
   - Reference specific job requirements
   - Connect your experience directly to their needs
   - If company name is in posting, mention it by name
   - Show understanding of role challenges
   - **CRITICAL**: Research signals - mention specific technologies, challenges, or goals from the posting

5. QUANTIFICATION:
   - Include at least 2-3 metrics/numbers
   - Use percentages, team sizes, project scales, user counts
   - Show impact, not just responsibilities
   - Examples: "Led team of 8", "Improved performance by 40%", "Handled 10k+ daily transactions"

6. TECHNICAL DEPTH:
   - Mention specific frameworks/technologies from the job posting
   - Show understanding of technical challenges they face
   - Demonstrate hands-on, production experience
   - Balance technical detail with readability
   - Use their terminology

7. CLOSING PARAGRAPH - MAKE IT STRONG:
   - **DO NOT use**: "Thank you for your time/consideration" (too passive)
   - **DO NOT use**: Generic statements like "I look forward to hearing from you"
   - **DO USE**: Confident value proposition tied to their specific needs
   - **DO USE**: Clear call to action with specific reference to role requirements
   - **DO USE**: Direct availability statement
   - **EXAMPLE STRONG CLOSINGS**:
     * "I'm confident my experience scaling React applications can help [Company] achieve [specific goal from posting]. Let's discuss how I can contribute to your team's success - I'm available this week for a conversation at ${bio.phone || "your convenience"}."
     * "My track record with [tech from posting] positions me to make an immediate impact on [specific challenge mentioned]. I'd welcome the opportunity to explore this role further - feel free to reach me at ${bio.email || "email"}."
     * "I'm eager to bring my expertise in [relevant skill] to help [Company] [achieve X]. I'm available for a conversation to discuss how we can work together - let's connect at ${bio.phone || bio.email || "your convenience"}."

8. **CRITICAL OUTPUT RULE**: 
Generate ONLY the HTML code. NO explanations, NO commentary, NO descriptions.
STOP immediately after closing </div> tag. Do NOT add any text after the HTML.
Your response should start with <div and end with </div> - NOTHING ELSE.
Do NOT include markdown code blocks, backticks, or explanatory text.

Generate the cover letter now:`;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyApiKey();
    if (!auth.authenticated) {
      return createErrorResponse(auth.error || "Unauthorized", 401);
    }

    const body: GenerateRequest = await request.json();
    const { jobPosting, model = "fast", documentType = "both" } = body;

    if (!jobPosting || !jobPosting.trim()) {
      return createErrorResponse("Job posting is required", 400);
    }

    // Determine which model to use
    const ollamaModel = model === "slow" ? "llama3.1:8b" : "llama3.2:3b";
    const tokenLimits = model === "slow" ? { cv: 2500, coverLetter: 1000 } : { cv: 1800, coverLetter: 800 };
    
    console.log(`Using ${model} mode with model: ${ollamaModel}, generating: ${documentType}`);

    // Check Ollama health before proceeding
    console.log("Checking Ollama status...");
    const healthCheck = await checkOllamaHealth(ollamaModel);
    if (!healthCheck.ok) {
      console.error("Ollama health check failed:", healthCheck.error);
      return createErrorResponse(
        healthCheck.error || "Ollama is not available",
        503
      );
    }
    console.log("✅ Ollama is ready");

    // Fetch user's bio, projects, skills, and experience from KV directly
    const [bioValue, projectsValue, skillsValue, experiencesValue] = await Promise.all([
      getKVValue("cms:bio"),
      getKVValue("cms:projects"),
      getKVValue("cms:skills"),
      getKVValue("cms:experiences"),
    ]);

    if (!bioValue) {
      return createErrorResponse("Bio data not found. Please complete your bio first.", 404);
    }

    const bio = JSON.parse(bioValue);
    const projects = projectsValue ? JSON.parse(projectsValue) : [];
    const skills = skillsValue ? JSON.parse(skillsValue) : [];
    const experiences = experiencesValue ? JSON.parse(experiencesValue) : [];

    // Generate based on documentType
    console.log(`Generating ${documentType} with Ollama...`);
    
    let cv = "";
    let coverLetter = "";

    if (documentType === "both") {
      // Generate both in parallel for speed
      const cvPrompt = createCVPrompt({
        jobPosting,
        bio,
        projects,
        skills,
        experiences,
      });

      const coverLetterPrompt = createCoverLetterPrompt({
        jobPosting,
        bio,
        projects,
        skills,
      });

      [cv, coverLetter] = await Promise.all([
        generateWithOllama(cvPrompt, ollamaModel, tokenLimits.cv),
        generateWithOllama(coverLetterPrompt, ollamaModel, tokenLimits.coverLetter),
      ]);
    } else if (documentType === "cv") {
      // Generate CV only
      const cvPrompt = createCVPrompt({
        jobPosting,
        bio,
        projects,
        skills,
        experiences,
      });
      cv = await generateWithOllama(cvPrompt, ollamaModel, tokenLimits.cv);
    } else if (documentType === "cover-letter") {
      // Generate cover letter only
      const coverLetterPrompt = createCoverLetterPrompt({
        jobPosting,
        bio,
        projects,
        skills,
      });
      coverLetter = await generateWithOllama(coverLetterPrompt, ollamaModel, tokenLimits.coverLetter);
    }

    // Clean up AI commentary if present (remove anything after closing </div>)
    if (cv) {
      const cvEndIndex = cv.lastIndexOf('</div>');
      if (cvEndIndex !== -1) {
        cv = cv.substring(0, cvEndIndex + 6).trim();
      }
    }
    
    if (coverLetter) {
      const clEndIndex = coverLetter.lastIndexOf('</div>');
      if (clEndIndex !== -1) {
        coverLetter = coverLetter.substring(0, clEndIndex + 6).trim();
      }
    }

    return createSuccessResponse({
      cv: cv || undefined,
      coverLetter: coverLetter || undefined,
    });
  } catch (error) {
    console.error("Error generating CV:", error);
    
    // Check if it's an Ollama connection error
    if (error instanceof Error && error.message.includes("fetch")) {
      return createErrorResponse(
        "Could not connect to Ollama. Please make sure Ollama is running (ollama serve) and the model is installed.",
        503
      );
    }
    
    return createErrorResponse(
      error instanceof Error
        ? error.message
        : "Internal server error generating CV",
      500
    );
  }
}
