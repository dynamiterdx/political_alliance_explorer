
import React, { useEffect, useState } from 'react';
import { X, MapPin, Users, Globe2, Loader2, Info } from 'lucide-react';
import { CountryGeopoliticalData } from '../types';
import { getCountryGeopoliticalInfo } from '../services/geminiService';

interface CountryDetailModalProps {
  countryName: string;
  iso: string;
  memberships: string[];
  onClose: () => void;
}

const CountryDetailModal: React.FC<CountryDetailModalProps> = ({ countryName, iso, memberships, onClose }) => {
  const [data, setData] = useState<Partial<CountryGeopoliticalData> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getCountryGeopoliticalInfo(countryName);
      if (res) {
        setData({
          ...res,
          name: countryName,
          memberships
        });
      }
      setLoading(false);
    };
    fetchData();
  }, [countryName, memberships]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="relative p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              {countryName} <span className="text-xl opacity-75">{iso}</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p>Analyzing geopolitical data...</p>
            </div>
          ) : data ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                  <div className="text-slate-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MapPin size={12} /> Capital
                  </div>
                  <div className="text-lg font-medium text-slate-100">{data.capital}</div>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                  <div className="text-slate-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Users size={12} /> Population
                  </div>
                  <div className="text-lg font-medium text-slate-100">{data.population}</div>
                </div>
              </div>

              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Globe2 size={12} /> Alliance Memberships
                </div>
                <div className="flex flex-wrap gap-2">
                  {memberships.length > 0 ? (
                    memberships.map(m => (
                      <span key={m} className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-sm font-medium">
                        {m}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-sm italic">No major alliance memberships found in our database.</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-slate-500 text-xs uppercase tracking-wider flex items-center gap-1">
                  <Info size={12} /> Geopolitical Stance
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed text-slate-300">
                  {data.geopoliticalStance}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-red-400">
              Failed to load country insights.
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-950/50 text-center">
          <p className="text-[10px] text-slate-600 uppercase tracking-tighter">Powered by Gemini AI • Geopolitical Explorer 2024</p>
        </div>
      </div>
    </div>
  );
};

export default CountryDetailModal;
