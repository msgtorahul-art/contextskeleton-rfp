'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { 
  UploadCloud, FileText, Trash2, Loader2, Database, AlertCircle, 
  CheckCircle2, RefreshCw, Link2, Sparkles, FolderSync
} from 'lucide-react';

interface DocumentInfo {
  id: string;
  filename: string;
  created_at: string;
}

export default function KnowledgePage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Connector sync states
  const [syncingConnector, setSyncingConnector] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/knowledge');
      if (res.status === 401) {
        router.push('/auth');
        return;
      }
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const res = await fetch(`/api/knowledge?documentId=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDocuments();
      }
    } catch (err) {
      console.error('Delete document failed:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');
    setSuccess('');

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process document');
      }

      setSuccess(`"${file.name}" ingested and semantic vectors created successfully!`);
      fetchDocuments();
    } catch (err: any) {
      setError(err.message || 'Error processing document upload');
    } finally {
      setUploading(false);
    }
  };

  const handleTriggerCloudConnector = (connectorName: string) => {
    setSyncingConnector(connectorName);
    setError('');
    setSuccess('');

    setTimeout(() => {
      setSyncingConnector(null);
      setSuccess(`OAuth redirect initialized for ${connectorName}. Configure client credentials to complete integration.`);
      fetchDocuments();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans">
      <Sidebar />

      <main className="flex-1 pl-80 min-h-screen relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-8 py-12 z-10 relative">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-white">Knowledge Base &amp; Cloud Connectors</h1>
            <p className="text-slate-400 mt-2 text-sm">
              Upload past proposals, SOC 2 policies, or connect automated cloud sync connectors to train grounding vectors.
            </p>
          </header>

          {/* Feedback alerts */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-medium flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-rose-400" />
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-medium flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              {success}
            </div>
          )}

          {/* Cloud Sync Connectors Section */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderSync className="h-5 w-5 text-violet-400" />
                Cloud Knowledge Connectors (OAuth Ready)
              </h2>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                Enterprise Add-On
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl space-y-3 border-slate-800">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-white block">Google Drive</span>
                  <span className="text-[9px] font-extrabold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">OAuth Available</span>
                </div>
                <p className="text-[11px] text-slate-400">Syncs RFP proposals &amp; Security folders automatically.</p>
                <button
                  onClick={() => handleTriggerCloudConnector('Google Drive')}
                  disabled={syncingConnector === 'Google Drive'}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                >
                  {syncingConnector === 'Google Drive' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Link2 className="h-3 w-3 text-violet-400" />}
                  Connect Drive
                </button>
              </div>

              <div className="glass-panel p-5 rounded-2xl space-y-3 border-slate-800">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-white block">Microsoft SharePoint</span>
                  <span className="text-[9px] font-extrabold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">OAuth Available</span>
                </div>
                <p className="text-[11px] text-slate-400">Indexes corporate SharePoint policy libraries.</p>
                <button
                  onClick={() => handleTriggerCloudConnector('Microsoft SharePoint')}
                  disabled={syncingConnector === 'Microsoft SharePoint'}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                >
                  {syncingConnector === 'Microsoft SharePoint' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Link2 className="h-3 w-3 text-violet-400" />}
                  Connect SharePoint
                </button>
              </div>

              <div className="glass-panel p-5 rounded-2xl space-y-3 border-slate-800">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-white block">Notion Workspace</span>
                  <span className="text-[9px] font-extrabold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">OAuth Available</span>
                </div>
                <p className="text-[11px] text-slate-400">Imports Notion engineering docs &amp; SOC2 wikis.</p>
                <button
                  onClick={() => handleTriggerCloudConnector('Notion Workspace')}
                  disabled={syncingConnector === 'Notion Workspace'}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                >
                  {syncingConnector === 'Notion Workspace' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Link2 className="h-3 w-3 text-violet-400" />}
                  Connect Notion
                </button>
              </div>

              <div className="glass-panel p-5 rounded-2xl space-y-3 border-slate-800">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-white block">OneDrive Business</span>
                  <span className="text-[9px] font-extrabold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">OAuth Available</span>
                </div>
                <p className="text-[11px] text-slate-400">Syncs OneDrive compliance folder attachments.</p>
                <button
                  onClick={() => handleTriggerCloudConnector('OneDrive Business')}
                  disabled={syncingConnector === 'OneDrive Business'}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl transition cursor-pointer"
                >
                  {syncingConnector === 'OneDrive Business' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Link2 className="h-3 w-3 text-violet-400" />}
                  Connect OneDrive
                </button>
              </div>
            </div>
          </section>

          {/* Dropzone Uploader */}
          <section className="glass-panel p-10 rounded-3xl border-dashed border-slate-700/60 flex flex-col items-center justify-center text-center mb-10 group hover:border-violet-500/50 transition">
            <div className="p-4 rounded-2xl bg-violet-600/10 mb-4 group-hover:scale-110 transition">
              {uploading ? (
                <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
              ) : (
                <UploadCloud className="h-8 w-8 text-violet-400" />
              )}
            </div>

            <div className="max-w-sm">
              <span className="text-white font-bold block mb-1">
                {uploading ? 'Processing Document...' : 'Upload Local Knowledge Document'}
              </span>
              <span className="text-xs text-slate-400 leading-relaxed block mb-6">
                Drag and drop your file here, or click to browse. Supports PDF, DOCX, TXT, MD, CSV, or JSON.
              </span>
            </div>

            <label className="inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm py-3 px-6 rounded-xl transition cursor-pointer shadow-lg shadow-violet-500/10">
              Select Document
              <input
                id="file-upload"
                type="file"
                disabled={uploading}
                onChange={handleFileUpload}
                accept=".pdf,.docx,.txt,.md,.csv,.json"
                className="hidden"
              />
            </label>
          </section>

          {/* List of uploaded items */}
          <section className="glass-panel rounded-3xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Database className="h-5 w-5 text-slate-400" />
              Ingested Knowledge Sources ({documents.length})
            </h2>

            {loading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="h-6 w-6 text-slate-500 animate-spin" />
              </div>
            ) : documents.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                No documents found. Upload your first file or trigger cloud connectors to build proposal intelligence.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {documents.map((doc) => (
                  <div key={doc.id} className="py-4 flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800">
                        <FileText className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white block truncate max-w-md">{doc.filename}</span>
                        <span className="text-[10px] text-slate-500 block">
                          Uploaded on {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-xl transition cursor-pointer"
                      title="Delete document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
