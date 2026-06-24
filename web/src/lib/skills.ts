import generatedSkillsDataset from '../../data/skills.json';

export interface SkillMetadata {
  metadata: SkillFrontmatterMetadata | null;
  name: string;
  description: string;
  fileCount: number;
  path: string;
  slug: string;
  installName: string;
}

export interface Skill extends SkillMetadata {
  content: string;
}

export interface SkillFrontmatterMetadata {
  name: string;
  description: string;
  author: string;
  created: string;
  version?: string | null;
}

interface SkillsDataset {
  generatedAt: string;
  skills: Skill[];
}

function loadSkillsDataset(): SkillsDataset {
  return generatedSkillsDataset as SkillsDataset;
}

export async function getSkills(): Promise<SkillMetadata[]> {
  return loadSkillsDataset().skills.map((skill) => ({
    metadata: skill.metadata,
    name: skill.name,
    description: skill.description,
    fileCount: skill.fileCount,
    path: skill.path,
    slug: skill.slug,
    installName: skill.installName,
  }));
}

export async function getSkillBySlug(slug: string): Promise<Skill | null> {
  const skill = loadSkillsDataset().skills.find((entry) => entry.slug === slug);

  return skill ?? null;
}
