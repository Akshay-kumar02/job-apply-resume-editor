import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const resume = formData.get('resume') as File;
    const jobDescription = formData.get('jobDescription') as string;

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { success: false, error: 'Missing resume or job description' },
        { status: 400 }
      );
    }

    // Read resume content
    const resumeText = await resume.text();

    // AI-powered resume editing logic
    const editedResume = await tailorResume(resumeText, jobDescription);

    return NextResponse.json({
      success: true,
      editedResume: editedResume,
    });
  } catch (error) {
    console.error('Error editing resume:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to edit resume' },
      { status: 500 }
    );
  }
}

async function tailorResume(resumeText: string, jobDescription: string): Promise<string> {
  // Extract key requirements from job description
  const keywords = extractKeywords(jobDescription);
  
  // Create tailored resume
  const sections = parseResume(resumeText);
  
  let tailoredResume = '';
  
  // Add professional summary optimized for the job
  tailoredResume += `PROFESSIONAL SUMMARY\n`;
  tailoredResume += `${generateSummary(sections, keywords)}\n\n`;
  
  // Add skills section with matched keywords
  tailoredResume += `KEY SKILLS\n`;
  tailoredResume += `${highlightRelevantSkills(sections.skills || '', keywords)}\n\n`;
  
  // Add experience with emphasized relevant points
  if (sections.experience) {
    tailoredResume += `PROFESSIONAL EXPERIENCE\n`;
    tailoredResume += `${emphasizeRelevantExperience(sections.experience, keywords)}\n\n`;
  }
  
  // Add education
  if (sections.education) {
    tailoredResume += `EDUCATION\n`;
    tailoredResume += `${sections.education}\n\n`;
  }
  
  // Add projects if available
  if (sections.projects) {
    tailoredResume += `PROJECTS\n`;
    tailoredResume += `${sections.projects}\n\n`;
  }
  
  return tailoredResume;
}

function extractKeywords(jobDescription: string): string[] {
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being']);
  
  const words = jobDescription
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word));
  
  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  });
  
  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word);
}

function parseResume(resumeText: string): any {
  const sections: any = {};
  
  const lines = resumeText.split('\n');
  let currentSection = 'header';
  let sectionContent = '';
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim();
    
    if (lowerLine.includes('experience') || lowerLine.includes('employment')) {
      if (sectionContent) sections[currentSection] = sectionContent.trim();
      currentSection = 'experience';
      sectionContent = '';
    } else if (lowerLine.includes('education')) {
      if (sectionContent) sections[currentSection] = sectionContent.trim();
      currentSection = 'education';
      sectionContent = '';
    } else if (lowerLine.includes('skill')) {
      if (sectionContent) sections[currentSection] = sectionContent.trim();
      currentSection = 'skills';
      sectionContent = '';
    } else if (lowerLine.includes('project')) {
      if (sectionContent) sections[currentSection] = sectionContent.trim();
      currentSection = 'projects';
      sectionContent = '';
    } else {
      sectionContent += line + '\n';
    }
  }
  
  if (sectionContent) sections[currentSection] = sectionContent.trim();
  
  return sections;
}

function generateSummary(sections: any, keywords: string[]): string {
  const keywordStr = keywords.slice(0, 5).join(', ');
  return `Results-driven professional with expertise in ${keywordStr}. Proven track record of delivering high-quality solutions and driving business success. Strong technical skills combined with excellent problem-solving abilities and team collaboration.`;
}

function highlightRelevantSkills(skillsText: string, keywords: string[]): string {
  const skills = skillsText.split(/[,\n•\-]/).map(s => s.trim()).filter(s => s);
  
  const relevantSkills = skills.filter(skill => 
    keywords.some(keyword => skill.toLowerCase().includes(keyword))
  );
  
  const otherSkills = skills.filter(skill => 
    !keywords.some(keyword => skill.toLowerCase().includes(keyword))
  );
  
  const allSkills = [...relevantSkills, ...otherSkills].slice(0, 12);
  
  return allSkills.map(skill => `• ${skill}`).join('\n');
}

function emphasizeRelevantExperience(experienceText: string, keywords: string[]): string {
  const lines = experienceText.split('\n');
  const emphasized = lines.map(line => {
    const lowerLine = line.toLowerCase();
    const hasKeyword = keywords.some(keyword => lowerLine.includes(keyword));
    
    if (hasKeyword && line.trim().startsWith('-')) {
      return '• ' + line.trim().substring(1).trim() + ' ⭐';
    }
    return line;
  });
  
  return emphasized.join('\n');
}
