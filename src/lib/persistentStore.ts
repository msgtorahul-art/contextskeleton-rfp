import fs from 'fs';
import path from 'path';

const STORE_PATH = path.join('/tmp', 'contextskeleton_rfp_data.json');
const MAX_MEMORY_PROJECTS = 200; // LRU Memory Safety Cap to prevent OOM process crashes

export interface ProjectRecord {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface QuestionRecord {
  id: string;
  project_id: string;
  user_id: string;
  question_text: string;
  drafted_answer?: string | null;
  status: string;
}

interface StoreSchema {
  projects: Record<string, ProjectRecord>;
  questions: Record<string, QuestionRecord[]>;
}

const globalStore = globalThis as unknown as { __cs_rfp_store?: StoreSchema };

function getStore(): StoreSchema {
  if (!globalStore.__cs_rfp_store) {
    globalStore.__cs_rfp_store = { projects: {}, questions: {} };
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.projects && parsed.questions) {
          globalStore.__cs_rfp_store = parsed;
        }
      }
    } catch (e) {
      console.warn('Persistent store load warning:', e);
    }
  }
  return globalStore.__cs_rfp_store!;
}

// Non-blocking async file writer with memory eviction check
async function saveStoreAsync(store: StoreSchema) {
  try {
    // Memory Cache Eviction Policy: Enforce maximum limit to prevent Node.js OOM
    const projectKeys = Object.keys(store.projects);
    if (projectKeys.length > MAX_MEMORY_PROJECTS) {
      const keysToRemove = projectKeys.slice(0, projectKeys.length - MAX_MEMORY_PROJECTS);
      for (const key of keysToRemove) {
        delete store.projects[key];
        delete store.questions[key];
      }
    }

    const tempPath = `${STORE_PATH}.tmp.${Date.now()}`;
    const payload = JSON.stringify(store, null, 2);
    
    // Async non-blocking write to avoid blocking Node.js event loop
    await fs.promises.writeFile(tempPath, payload, 'utf-8');
    await fs.promises.rename(tempPath, STORE_PATH);
  } catch (e) {
    console.error('Persistent store async save warning:', e);
  }
}

export function saveProjectToPersistentStore(project: ProjectRecord, questions: QuestionRecord[]) {
  const store = getStore();
  store.projects[project.id] = project;
  store.questions[project.id] = questions;
  saveStoreAsync(store);
}

export function getProjectFromPersistentStore(projectId: string): { project?: ProjectRecord; questions?: QuestionRecord[] } {
  const store = getStore();
  return {
    project: store.projects[projectId],
    questions: store.questions[projectId] || [],
  };
}

export function getAllProjectsFromPersistentStore(userId: string): ProjectRecord[] {
  const store = getStore();
  return Object.values(store.projects).filter(p => p.user_id === userId);
}

export function updateQuestionInPersistentStore(questionId: string, draftedAnswer: string, status: string) {
  const store = getStore();
  for (const projectId in store.questions) {
    const qList = store.questions[projectId];
    const found = qList.find(q => q.id === questionId);
    if (found) {
      found.drafted_answer = draftedAnswer;
      found.status = status;
      saveStoreAsync(store);
      break;
    }
  }
}

export function deleteProjectFromPersistentStore(projectId: string) {
  const store = getStore();
  delete store.projects[projectId];
  delete store.questions[projectId];
  saveStoreAsync(store);
}
