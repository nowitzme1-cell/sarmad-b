
import React, { useState } from 'react';
import { SimulationService } from './services/gemini';

const App: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  
  const simService = new SimulationService();

  const handleTestBridge = async () => {
    if (!testMessage.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const result = await simService.simulateConnect(testMessage);
      setResponse(result);
    } catch (err) {
      setResponse({ error: "Bridge failed to respond." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-900/20">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              n8n Bridge <span className="text-emerald-500 font-light">Dashboard</span>
            </h1>
            <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-bold">Secure Webhook Proxy Configuration</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-mono text-emerald-500">SYSTEM LIVE</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section 1: Connection Map */}
          <div className="space-y-8">
            <section className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-emerald-500">1.</span> Frontend Integration
              </h2>
              <p className="text-slate-400 text-sm mb-6">Call this URL from your React application to send data through the bridge.</p>
              
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 group relative">
                <div className="text-xs font-bold text-slate-600 uppercase mb-2">Target Endpoint URL</div>
                <div className="text-emerald-400 font-mono text-sm break-all">
                  https://your-flask-app.railway.app/connect
                </div>
                <div className="mt-4 pt-4 border-t border-slate-900">
                  <code className="text-[11px] text-slate-500">
                    POST {"{ \"message\": \"...\" }"}
                  </code>
                </div>
              </div>
            </section>

            <section className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-emerald-500">2.</span> n8n Workflow Config
              </h2>
              <p className="text-slate-400 text-sm mb-6">The bridge will forward all requests to this n8n webhook URL.</p>
              
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-500 uppercase">n8n Webhook URL</label>
                <input
                  type="text"
                  placeholder="https://n8n.your-domain.com/webhook/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                />
                <p className="text-[11px] text-slate-600 italic">This URL is stored in your N8N_WEBHOOK_URL environment variable.</p>
              </div>
            </section>
          </div>

          {/* Section 2: Test Bridge */}
          <section className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-emerald-500">3.</span> Test the Connection
            </h2>
            <p className="text-slate-400 text-sm mb-6">Send a test message to verify the end-to-end flow from bridge to n8n.</p>

            <div className="space-y-6 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Payload Message</label>
                <textarea
                  rows={4}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Example: {'event': 'customer_signup', 'email': 'user@example.com'}"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-all resize-none"
                />
              </div>

              <button
                onClick={handleTestBridge}
                disabled={loading || !testMessage.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 py-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> Forwarding...</>
                ) : (
                  'Trigger Bridge'
                )}
              </button>

              {response && (
                <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className={`p-4 rounded-xl border ${response.error ? 'bg-red-900/10 border-red-500/20' : 'bg-emerald-900/10 border-emerald-500/20'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${response.error ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                      <span className={`text-xs font-bold uppercase ${response.error ? 'text-red-400' : 'text-emerald-400'}`}>
                        {response.error ? 'Error' : 'Success'}
                      </span>
                    </div>
                    <pre className="text-xs font-mono text-slate-300 overflow-x-auto">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-800">
              <div className="flex items-center gap-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                <span className="text-[10px] font-bold tracking-tighter uppercase">Powered By</span>
                <div className="flex gap-4">
                  <span className="text-xs font-black">PYTHON</span>
                  <span className="text-xs font-black">FLASK</span>
                  <span className="text-xs font-black">N8N</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default App;
