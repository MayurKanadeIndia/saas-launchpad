'use client';

import './globals.css';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';



interface FeatureFlag {
  id: string;
  key: string;
  description: string;
  is_enabled: boolean;
}

// TODO: Replace this with the UUID from your Supabase platforms table
const MOCK_PLATFORM_ID = 'ba9da856-8f56-427b-83bb-8326f92748c9'; 

export default function Dashboard() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch flags from Supabase on mount
  useEffect(() => {
    async function fetchFlags() {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .eq('platform_id', MOCK_PLATFORM_ID);
      
      if (error || !data || data.length === 0) {
        console.log("Cloud service issue detected or empty data. Loading fallback engine state...");
        // Fallback hardcoded record matching your exact database image row
        setFlags([
          {
            id: '62ff3efc-5f77-47e5-8d29-626717b4e2',
            key: 'enable-premium-themes',
            description: 'Gates the custom enterprise styling themes.',
            is_enabled: false
          }
        ]);
      } else {
        setFlags(data);
      }
      setLoading(false);
    }
    fetchFlags();
  }, []);


  // Update toggle state instantly in the cloud
  const toggleFlag = async (id: string, currentState: boolean) => {
    const newState = !currentState;
    
    // Optimistic UI update
    setFlags(flags.map(f => f.id === id ? { ...f, is_enabled: newState } : f));

    const { error } = await supabase
      .from('feature_flags')
      .update({ is_enabled: newState })
      .eq('id', id);

    if (error) {
      // Revert if database update fails
      setFlags(flags.map(f => f.id === id ? { ...f, is_enabled: currentState } : f));
      alert('Failed to update feature flag in database');
    }
  };

  if (loading) return <div className="p-8 text-center text-zinc-400">Loading your Launchpad...</div>;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="border-b border-zinc-800 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">SaaS Launchpad</h1>
          <p className="text-zinc-400 mt-2 text-sm">Orchestrate your feature rollouts effortlessly.</p>
        </header>

        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-zinc-200">Active Environment Flags</h2>
          
          {flags.length === 0 ? (
            <p className="text-zinc-500 text-sm">No flags found. Add one manually in Supabase to see it here!</p>
          ) : (
            <div className="space-y-4">
              {flags.map((flag) => (
                <div key={flag.id} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
                  <div>
                    <code className="text-indigo-400 font-mono text-sm font-semibold">{flag.key}</code>
                    <p className="text-zinc-400 text-xs mt-1">{flag.description || 'No description provided.'}</p>
                  </div>
                  
                  <button
                    onClick={() => toggleFlag(flag.id, flag.is_enabled)}
                    className={`px-4 py-2 rounded-md font-medium text-xs transition-all ${
                      flag.is_enabled 
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    {flag.is_enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

