'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const ShaderGradient = dynamic(() => import('./components/ShaderGradient'), { ssr: false });

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Gradient */}
      <section className="relative h-screen overflow-hidden">
        <ShaderGradient />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            <div className="inline-block mb-10 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
              <p className="text-sm text-white/80">
                Welcome to the Next Generation
              </p>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">
              <div>Advanced AI</div>
              <div className="relative">
                <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded border border-white/10">Solutions</span> 
                <span className="ml-4">for</span>
              </div>
              <div className="text-[#ff9c75] mt-4">Modern Workflows</div>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-white/80 mt-8 max-w-2xl mx-auto">
              Enhance your productivity with state-of-the-art AI tools designed for creative professionals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="bg-white/90 backdrop-blur-sm text-[#6d1c1c] px-6 py-3 rounded-full font-medium hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#ff9c75]/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57.7 1 1.52 1 2.43 0 1.65-.67 3.13-1.76 4.2"/><path d="M5.76 17.4C4.7 16.36 4 14.87 4 13c0-2.07 1.34-3.94 3.36-4.74.96-.32 2-.32 3 0 .17-.82.47-1.63.89-2.38-1.89-.5-3.22.3-3.22.3C5.5 6.94 4.69 8.5 4.22 10"/><path d="M20 11c-.41-1.74-1.92-3.04-4.5-4C13.82 6.47 12 5.5 12 5.5c-.49.46-1 1.22-1 3.5"/><path d="M12 16a4 4 0 0 1-4-4 6.5 6.5 0 0 0-1-.77C5.73 10.24 6 8.5 6 8.5c.65.13 1.25.33 1.8.6"/><path d="M10.97 9.33c-.4.52-.63 1.11-.69 1.75A3.97 3.97 0 0 1 12 11c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3c0-.09 0-.19.01-.28"/><path d="m9.45 6.32.14-.17C14 2.5 17.5 5 17.5 5l.23.26"/><path d="M15.24 12.45c.15.28.43.57.82.82.75.47 1.47.58 1.87.44"/></svg>
                Try Codavra Free
              </a>
              <a
                href="#"
                className="bg-[#6d1c1c]/30 backdrop-blur-md border border-[#ff9c75]/20 text-white px-6 py-3 rounded-full font-medium hover:bg-[#6d1c1c]/50 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-2"/><path d="m9 18 6-6"/><path d="M15 18v-6h-6"/></svg>
                Explore Features
              </a>
            </div>
          </motion.div>
        </div>

        {/* Enhanced transition area with multiple gradient layers */}
        <div className="absolute bottom-0 left-0 right-0 h-48 z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent"></div>
          <div className="absolute inset-0 bg-[#6d1c1c]/5 backdrop-blur-sm"></div>

          {/* Floating glassmorphism elements */}
          <div className="absolute top-8 left-1/4 w-40 h-12 bg-white/5 backdrop-blur-xl rounded-full transform rotate-12 opacity-30"></div>
          <div className="absolute top-16 right-1/3 w-32 h-8 bg-[#ff9c75]/5 backdrop-blur-xl rounded-full transform -rotate-6 opacity-20"></div>
          <div className="absolute top-4 right-1/4 w-28 h-10 bg-white/5 backdrop-blur-xl rounded-full transform rotate-3 opacity-25"></div>
        </div>
      </section>

      {/* Features Section with Enhanced Glassmorphism Cards */}
      <section className="bg-[#080808] text-white py-24 px-4 relative">
        {/* Additional glassmorphism elements in the background */}
        <div className="absolute top-0 left-0 right-0 h-40 overflow-hidden">
          <div className="absolute -top-20 left-1/5 w-64 h-64 rounded-full bg-[#6d1c1c]/10 backdrop-blur-3xl opacity-30"></div>
          <div className="absolute -top-10 right-1/4 w-80 h-80 rounded-full bg-[#ff9c75]/5 backdrop-blur-3xl opacity-20"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Codavra Offers True <span className="text-[#ff9c75]">Intelligence</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 - Enhanced */}
            <motion.div 
              className="bg-[#101022]/70 backdrop-blur-xl rounded-xl overflow-hidden border border-[#222244]/70 transition-all duration-300 hover:border-[#ff9c75]/40 hover:shadow-lg hover:shadow-[#ff9c75]/5 card-transition relative group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Glassmorphism highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold">Smart Coding</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff9c75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
                </div>
                <p className="text-gray-300 mb-4">
                  AI-powered code suggestions that understand your codebase context for higher productivity.
                </p>
                <div className="bg-[#080818]/70 backdrop-blur-sm p-4 rounded-lg border border-[#222244]/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-sm text-blue-400">Analyzing code structure...</span>
                  </div>
                  <div className="font-mono text-sm text-gray-400">
                    <div>function <span className="text-blue-400">calculateMetrics</span>(data) {"{"}</div>
                    <div className="pl-4">const results = data.<span className="text-green-400">map</span>((item) {"=>"} {"{"}</div>
                    <div className="pl-6 text-yellow-400">// AI suggestion: optimize with memoization</div>
                    <div className="pl-4">{"});"}</div>
                    <div>{"}"}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2 - Enhanced */}
            <motion.div 
              className="bg-[#101022]/70 backdrop-blur-xl rounded-xl overflow-hidden border border-[#222244]/70 transition-all duration-300 hover:border-[#ff9c75]/40 hover:shadow-lg hover:shadow-[#ff9c75]/5 card-transition relative group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Glassmorphism highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold">Visual Analysis</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff9c75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" x2="12" y1="8" y2="8"/><line x1="3.95" x2="8.54" y1="6.06" y2="14"/><line x1="10.88" x2="15.46" y1="21.94" y2="14"/></svg>
                </div>
                <p className="text-gray-300 mb-4">
                  Advanced visualization tools that break down complex data into intuitive insights.
                </p>
                <div className="bg-[#080818]/70 backdrop-blur-sm p-4 rounded-lg border border-[#222244]/50">
                  <div className="flex justify-between mb-2">
                    <div className="h-24 w-2 bg-[#151530] rounded-full overflow-hidden relative">
                      <div className="absolute bottom-0 w-full bg-purple-500 h-[60%]"></div>
                    </div>
                    <div className="h-24 w-2 bg-[#151530] rounded-full overflow-hidden relative">
                      <div className="absolute bottom-0 w-full bg-blue-500 h-[40%]"></div>
                    </div>
                    <div className="h-24 w-2 bg-[#151530] rounded-full overflow-hidden relative">
                      <div className="absolute bottom-0 w-full bg-green-500 h-[85%]"></div>
                    </div>
                    <div className="h-24 w-2 bg-[#151530] rounded-full overflow-hidden relative">
                      <div className="absolute bottom-0 w-full bg-yellow-500 h-[25%]"></div>
                    </div>
                    <div className="h-24 w-2 bg-[#151530] rounded-full overflow-hidden relative">
                      <div className="absolute bottom-0 w-full bg-red-500 h-[70%]"></div>
                    </div>
                    <div className="h-24 w-2 bg-[#151530] rounded-full overflow-hidden relative">
                      <div className="absolute bottom-0 w-full bg-indigo-500 h-[45%]"></div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">Performance metrics visualization</div>
                </div>
              </div>
            </motion.div>

            {/* Card 3 - Enhanced */}
            <motion.div 
              className="bg-[#101022]/70 backdrop-blur-xl rounded-xl overflow-hidden border border-[#222244]/70 transition-all duration-300 hover:border-[#ff9c75]/40 hover:shadow-lg hover:shadow-[#ff9c75]/5 card-transition relative group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {/* Glassmorphism highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold">Seamless Integration</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff9c75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" y2="12"/></svg>
                </div>
                <p className="text-gray-300 mb-4">
                  Works flawlessly with your existing tools and workflow without disruption.
                </p>
                <div className="bg-[#080818]/70 backdrop-blur-sm p-4 rounded-lg border border-[#222244]/50 flex flex-wrap gap-2 justify-center">
                  <div className="bg-[#151530] p-2 rounded flex items-center gap-1 border border-blue-500/20">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-xs text-gray-400">VSCode</span>
                  </div>
                  <div className="bg-[#151530] p-2 rounded flex items-center gap-1 border border-purple-500/20">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span className="text-xs text-gray-400">GitHub</span>
                  </div>
                  <div className="bg-[#151530] p-2 rounded flex items-center gap-1 border border-green-500/20">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-xs text-gray-400">Slack</span>
                  </div>
                  <div className="bg-[#151530] p-2 rounded flex items-center gap-1 border border-red-500/20">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-xs text-gray-400">Figma</span>
                  </div>
                  <div className="bg-[#151530] p-2 rounded flex items-center gap-1 border border-yellow-500/20">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span className="text-xs text-gray-400">Notion</span>
                  </div>
                  <div className="bg-[#151530] p-2 rounded flex items-center gap-1 border border-indigo-500/20">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    <span className="text-xs text-gray-400">Jira</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-16">
            <motion.a 
              href="#" 
              className="inline-flex items-center gap-2 bg-[#6d1c1c]/80 backdrop-blur-sm text-white px-8 py-3 rounded-full font-medium hover:bg-[#7d2c2c] transition-colors border border-[#ff9c75]/20 shadow-lg shadow-black/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              See all features
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=""><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
}
