import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SITE_URL = process.env.SITE_URL || 'https://nour-az.pages.dev';
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD || '';

async function readJSON(file: string) {
  const data = await fs.readFile(path.join('cms', file), 'utf8');
  return JSON.parse(data);
}

async function getApiKey() {
  const res = await fetch(`${SITE_URL}/api/admin/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error('Failed to authenticate');
  const { apiKey } = await res.json();
  return apiKey;
}

async function upload(endpoint: string, apiKey: string, data: any) {
  const res = await fetch(`${SITE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to upload to ${endpoint}: ${err}`);
  }
  console.log(`✓ Uploaded to ${endpoint}`);
}

async function main() {
  console.log('🚀 Starting CMS migration to Cloudflare KV...\n');
  
  // Read all CMS files
  console.log('📖 Reading CMS files...');
  const bio = await readJSON('bio.json');
  const projects = await readJSON('projects.json');
  const experiences = await readJSON('experiences.json');
  const education = await readJSON('education.json');
  const skills = await readJSON('skills.json');
  const settings = await readJSON('settings.json');
  console.log('✓ All CMS files read successfully\n');

  // Authenticate
  console.log('🔐 Authenticating with admin API...');
  const apiKey = await getApiKey();
  console.log('✓ Authentication successful\n');

  // Upload Bio
  console.log('📝 Uploading bio...');
  await upload('/api/cms/bio', apiKey, bio);
  console.log('✓ Bio uploaded\n');

  // Upload Projects
  console.log('📦 Uploading projects...');
  for (const project of projects) {
    await upload('/api/cms/projects', apiKey, project);
  }
  console.log(`✓ All ${projects.length} projects uploaded\n`);

  // Upload Experiences
  console.log('💼 Uploading experiences...');
  for (const experience of experiences) {
    await upload('/api/cms/experiences', apiKey, experience);
  }
  console.log(`✓ All ${experiences.length} experiences uploaded\n`);

  // Upload Education
  console.log('🎓 Uploading education...');
  for (const edu of education) {
    await upload('/api/cms/education', apiKey, edu);
  }
  console.log(`✓ All ${education.length} education entries uploaded\n`);

  // Upload Skills
  console.log('🛠️  Uploading skills...');
  for (const skill of skills) {
    await upload('/api/cms/skills', apiKey, skill);
  }
  console.log(`✓ All ${skills.length} skills uploaded\n`);

  // Upload Settings
  console.log('⚙️  Uploading settings...');
  await upload('/api/cms/settings', apiKey, settings);
  console.log('✓ Settings uploaded\n');

  console.log('✅ Migration complete!');
  console.log(`Total items migrated:`);
  console.log(`  • 1 bio`);
  console.log(`  • ${projects.length} projects`);
  console.log(`  • ${experiences.length} experiences`);
  console.log(`  • ${education.length} education entries`);
  console.log(`  • ${skills.length} skills`);
  console.log(`  • 1 settings`);
}

main().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});