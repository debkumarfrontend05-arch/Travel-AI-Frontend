import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Keyboard, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

// API BASE URL
const API_URL = "http://localhost:3000/api";

const CreatePackage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [flow, setFlow] = useState(null); // 'manual', 'ai', 'md'
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [copyStatus, setCopyStatus] = useState(false);

  // Form States
  const [baseInfo, setBaseInfo] = useState({
    title: '',
    state: '',
    city: '',
    days: 3
  });

  const [itinerary, setItinerary] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [mdFileContent, setMdFileContent] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (baseInfo.state && baseInfo.city) {
      fetchMasterData(baseInfo.state, baseInfo.city);
    }
  }, [baseInfo.state, baseInfo.city]);

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API_URL}/master-data/locations`);
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      console.error("Failed to fetch locations", err);
    }
  };

  const fetchMasterData = async (state, city) => {
    try {
      const res = await fetch(`${API_URL}/master-data?state=${state}&city=${city}`);
      const data = await res.json();
      setMasterData(data);
    } catch (err) {
      console.error("Failed to fetch master data", err);
    }
  };

  const handleBaseInfoChange = (e) => {
    setBaseInfo({ ...baseInfo, [e.target.name]: e.target.value });
  };

  const startFlow = (type) => {
    setFlow(type);
    setStep(2);
    if (type === 'manual') {
      const initial = Array.from({ length: baseInfo.days }, (_, i) => ({
        day: i + 1,
        hotel: '',
        transfer: '',
        sightseeing: [],
        meals: [],
        activities: [],
        info: ''
      }));
      setItinerary(initial);
    }
  };

  const handleAIGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/packages/generate-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baseInfo)
      });
      const data = await res.json();
      setItinerary(data.itinerary);
      setStep(3);
    } catch (err) {
      alert("AI Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleMDUpload = async () => {
    if (!mdFileContent) return alert("Please paste markdown content");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/packages/parse-md`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...baseInfo, markdown: mdFileContent })
      });
      const data = await res.json();
      setItinerary(data.itinerary);
      if (data.title) setBaseInfo({...baseInfo, title: data.title});
      setStep(3);
    } catch (err) {
      alert("Parsing failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetPrompt = async () => {
    try {
      const res = await fetch(`${API_URL}/packages/get-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baseInfo)
      });
      const data = await res.json();
      setGeneratedPrompt(data.prompt);
    } catch (err) {
      alert("Failed to generate prompt.");
    }
  };

  const handleSavePackage = async () => {
    setLoading(true);
    try {
      const payload = {
        title: baseInfo.title,
        state: baseInfo.state,
        city: baseInfo.city,
        duration: { days: baseInfo.days, nights: Math.max(0, baseInfo.days - 1) },
        itinerary,
        createdVia: flow
      };
      const res = await fetch(`${API_URL}/packages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) navigate('/');
      else alert("Failed to save package.");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateDay = (dayIndex, field, value) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex][field] = value;
    setItinerary(newItinerary);
  };

  const toggleArrayItem = (dayIndex, field, value) => {
    const newItinerary = [...itinerary];
    const arr = newItinerary[dayIndex][field];
    if (arr.includes(value)) {
      newItinerary[dayIndex][field] = arr.filter(i => i !== value);
    } else {
      newItinerary[dayIndex][field] = [...arr, value];
    }
    setItinerary(newItinerary);
  };

  const addManualActivity = (dayIndex) => {
    const act = prompt("Enter activity:");
    if (act) toggleArrayItem(dayIndex, 'activities', act);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-outfit">
      <Sidebar />
      <main className="flex-1 px-8 py-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Package Creator</h1>
            <p className="text-slate-500">Build professional itineraries in minutes using our multi-flow system.</p>
            
            {/* Steps Indicator */}
            <div className="flex justify-center items-center gap-6 mt-10">
              {[1, 2, 3].map(s => (
                <React.Fragment key={s}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all shadow-sm ${
                    step >= s ? 'bg-violet-600 text-white shadow-violet-200' : 'bg-white text-slate-400 border border-slate-200'
                  }`}>
                    {s}
                  </div>
                  {s < 3 && <div className={`w-20 h-[2px] rounded-full ${step > s ? 'bg-violet-600' : 'bg-slate-200'}`}></div>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Wizard Content */}
          <div className="animate-fade-in">
            {step === 1 && (
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Package Title</label>
                        <input 
                            type="text" name="title" placeholder="e.g. Exotic Bali Adventure"
                            className="w-full px-5 py-3 rounded-2xl border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium"
                            value={baseInfo.title} onChange={handleBaseInfoChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Duration (Days)</label>
                        <div className="relative">
                            <input 
                                type="number" name="days" min="1"
                                className="w-full px-5 py-3 rounded-2xl border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium"
                                value={baseInfo.days} onChange={handleBaseInfoChange}
                            />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">DAYS</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">State</label>
                        <select 
                            name="state" 
                            className="w-full px-5 py-3 rounded-2xl border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium appearance-none bg-white"
                            value={baseInfo.state} onChange={handleBaseInfoChange}
                        >
                            <option value="">Select State</option>
                            {[...new Set(locations.map(l => l.state))].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">City</label>
                        <select 
                            name="city" 
                            className="w-full px-5 py-3 rounded-2xl border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium appearance-none bg-white disabled:bg-slate-50"
                            value={baseInfo.city} onChange={handleBaseInfoChange} disabled={!baseInfo.state}
                        >
                            <option value="">Select City</option>
                            {locations.filter(l => l.state === baseInfo.state).map(l => <option key={l.city} value={l.city}>{l.city}</option>)}
                        </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6 px-2">How would you like to build it?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button 
                      onClick={() => startFlow('manual')}
                      disabled={!baseInfo.title || !baseInfo.city}
                      className="group bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:border-violet-500 hover:shadow-xl hover:shadow-violet-200/50 transition-all text-left disabled:opacity-50"
                    >
                      <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-violet-600 group-hover:text-white transition-all">
                        <Keyboard size={28} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">Manual Flow</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">Full control. Hand-pick hotels and activities from your master data.</p>
                    </button>

                    <button 
                      onClick={() => startFlow('ai')}
                      disabled={!baseInfo.title || !baseInfo.city}
                      className="group bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-200/50 transition-all text-left disabled:opacity-50"
                    >
                      <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <Sparkles size={28} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">AI Generator</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">Smart & fast. Let Gemini build an itinerary based on your assets.</p>
                    </button>

                    <button 
                      onClick={() => startFlow('md')}
                      disabled={!baseInfo.title || !baseInfo.city}
                      className="group bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-xl hover:shadow-blue-200/50 transition-all text-left disabled:opacity-50"
                    >
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <FileText size={28} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">Markdown Flow</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">External workflow. Paste an MD itinerary or use our prompt tool.</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 mb-8 transition-colors">
                  <ArrowLeft size={18} /> Back to setup
                </button>

                {flow === 'manual' && (
                  <div className="text-center py-10 space-y-6">
                    <div className="w-20 h-20 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center mx-auto">
                        <Keyboard size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Manual Itinerary Ready</h3>
                    <p className="text-slate-500 max-w-md mx-auto">Click below to start hand-picking the best hotels and services for your {baseInfo.days}-day trip.</p>
                    <button onClick={() => setStep(3)} className="bg-violet-600 hover:bg-violet-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-violet-200 flex items-center gap-2 mx-auto">
                      Go to Builder <ArrowRight size={20} />
                    </button>
                  </div>
                )}

                {flow === 'ai' && (
                  <div className="text-center py-10 space-y-6">
                    <Sparkles size={64} className="mx-auto text-emerald-500 animate-pulse" />
                    <h3 className="text-2xl font-bold text-slate-900">Ready to Generate?</h3>
                    <p className="text-slate-500 max-w-md mx-auto">Our AI will intelligently match your {masterData.length} master data points with {baseInfo.city}'s best attractions.</p>
                    <button 
                      onClick={handleAIGenerate} 
                      disabled={loading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-200 flex items-center gap-2 mx-auto"
                    >
                      {loading ? <><Loader2 className="animate-spin" size={20} /> Generating...</> : 'Launch AI Builder'}
                    </button>
                  </div>
                )}

                {flow === 'md' && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2"><FileText size={20} className="text-blue-500" /> Paste Markdown Content</h4>
                      <textarea 
                        rows="12" 
                        className="w-full p-6 rounded-[2rem] bg-slate-50 border-slate-200 focus:border-blue-500 transition-all font-mono text-sm leading-relaxed" 
                        placeholder="# Title\n\n## Day 1\n- Hotel: Name\n- Activity: Details..."
                        value={mdFileContent}
                        onChange={(e) => setMdFileContent(e.target.value)}
                      ></textarea>
                      <button onClick={handleMDUpload} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Parse & Review'}
                      </button>
                    </div>

                    <div className="pt-8 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-900">Need a starting point?</h4>
                      </div>
                      <p className="text-sm text-slate-500 mb-6">Generate a perfectly structured prompt containing your master data list to use in any external LLM.</p>
                      {!generatedPrompt ? (
                        <button onClick={handleGetPrompt} className="text-blue-600 font-bold hover:underline">Generate System Prompt →</button>
                      ) : (
                        <div className="bg-slate-900 text-white p-6 rounded-2xl relative group overflow-hidden">
                            <pre className="text-xs font-mono overflow-auto max-h-[300px] whitespace-pre-wrap leading-relaxed opacity-80">{generatedPrompt}</pre>
                            <button 
                                onClick={() => copyToClipboard(generatedPrompt)}
                                className="absolute top-4 right-4 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all backdrop-blur-md"
                            >
                                {copyStatus ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                            </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 pb-20">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                   <div>
                     <h2 className="text-2xl font-bold text-slate-900">{baseInfo.title}</h2>
                     <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500"><MapPin size={14}/> {baseInfo.city}, {baseInfo.state}</span>
                        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                        <span className="text-sm font-bold text-violet-600 uppercase tracking-wider">{baseInfo.days} DAYS ITINERARY</span>
                     </div>
                   </div>
                   <div className="flex gap-3 w-full md:w-auto">
                     <button onClick={() => setStep(flow === 'manual' ? 1 : 2)} className="flex-1 md:flex-none px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm">Back</button>
                     <button onClick={handleSavePackage} disabled={loading} className="flex-1 md:flex-none bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-violet-200 transition-all flex items-center justify-center gap-2">
                       {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Finalize & Save</>}
                     </button>
                   </div>
                </div>

                <div className="space-y-6">
                    {itinerary.map((day, idx) => (
                    <div key={idx} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-fade-in" style={{animationDelay: `${idx * 0.1}s`}}>
                        <div className="px-8 py-5 bg-slate-50 flex justify-between items-center border-b border-slate-200/50">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                                <div className="w-8 h-8 bg-violet-600 text-white rounded-lg flex items-center justify-center text-sm font-black italic">D{day.day}</div>
                                Day {day.day} Overview
                            </h3>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Left: Dropdowns & Selections */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2"><div className="w-1 h-1 bg-violet-500 rounded-full"></div> Main Accommodation</label>
                                <select 
                                    className="w-full px-5 py-3 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-sm font-semibold"
                                    value={day.hotel} 
                                    onChange={(e) => updateDay(idx, 'hotel', e.target.value)}
                                >
                                    <option value="">Select Hotel</option>
                                    {masterData.filter(d => d.type === 'hotel').map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                                    {day.hotel && !masterData.some(m => m.name === day.hotel) && <option value={day.hotel}>{day.hotel} (Manual Entry)</option>}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full"></div> Transport / Transfer</label>
                                <select 
                                    className="w-full px-5 py-3 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-sm font-semibold"
                                    value={day.transfer} 
                                    onChange={(e) => updateDay(idx, 'transfer', e.target.value)}
                                >
                                    <option value="">Select Transfer</option>
                                    {masterData.filter(d => d.type === 'transfer').map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                                    {day.transfer && !masterData.some(m => m.name === day.transfer) && <option value={day.transfer}>{day.transfer} (Manual Entry)</option>}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full"></div> Meals Included</label>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {masterData.filter(d => d.type === 'meal').map(m => (
                                    <button 
                                        key={m.name}
                                        onClick={() => toggleArrayItem(idx, 'meals', m.name)}
                                        className={`text-xs font-bold py-2 px-4 rounded-xl transition-all border ${day.meals.includes(m.name) ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-white border-slate-200 text-slate-400 hover:border-amber-300'}`}
                                    >
                                        {m.name}
                                    </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Activities & Info */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full"></div> Sightseeing & Landmarks</label>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {masterData.filter(d => d.type === 'sightseeing').map(m => (
                                    <button 
                                        key={m.name}
                                        onClick={() => toggleArrayItem(idx, 'sightseeing', m.name)}
                                        className={`text-xs font-bold py-2 px-4 rounded-xl transition-all border ${day.sightseeing.includes(m.name) ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-300'}`}
                                    >
                                        {m.name}
                                    </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2"><div className="w-1 h-1 bg-slate-900 rounded-full"></div> Custom Activities</label>
                                <div className="space-y-2 min-h-[40px]">
                                    {day.activities.map((act, actIdx) => (
                                        <div key={actIdx} className="flex items-center justify-between bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 group/item">
                                            <span>{act}</span>
                                            <button onClick={() => toggleArrayItem(idx, 'activities', act)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => addManualActivity(idx)} className="text-[11px] font-black text-violet-600 uppercase tracking-tighter flex items-center gap-1.5 hover:gap-2 transition-all mt-2 ml-1">
                                        <Plus size={14} strokeWidth={3} /> Add Manual Action
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2"><div className="w-1 h-1 bg-slate-300 rounded-full"></div> Daily Narrative</label>
                                <textarea 
                                    rows="3" 
                                    className="w-full px-5 py-4 rounded-2xl bg-white border-slate-200 focus:border-violet-500 text-xs font-medium leading-relaxed"
                                    value={day.info}
                                    onChange={(e) => updateDay(idx, 'info', e.target.value)}
                                    placeholder="Write a brief story or instructions for this day..."
                                ></textarea>
                            </div>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePackage;