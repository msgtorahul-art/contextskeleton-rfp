import fs from 'fs';
import path from 'path';

const STORE_PATH = path.join('/tmp', 'contextskeleton_rfp_data.json');

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
      console.error('Persistent store load warning:', e);
    }
  }
  return globalStore.__cs_rfp_store!;
}

function saveStore(store: StoreSchema) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (e) {
    console.error('Persistent store save warning:', e);
  }
}

export function saveProjectToPersistentStore(project: ProjectRecord, questions: QuestionRecord[]) {
  const store = getStore();
  store.projects[project.id] = project;
  store.questions[project.id] = questions;
  saveStore(store);
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
      saveStore(store);
      break;
    }
  }
}

export function deleteProjectFromPersistentStore(projectId: string) {
  const store = getStore();
  delete store.projects[projectId];
  delete store.questions[projectId];
  saveStore(store);
}
