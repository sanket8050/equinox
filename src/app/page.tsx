// import Link from "next/link"
// import { Users, Plus, TrendingUp, Shield } from "lucide-react"

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* Header */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <h1 className="text-2xl font-bold text-gray-900">Xpence Tracker</h1>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <Link
//                 href="/auth/signin"
//                 className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
//               >
//                 Sign In
//               </Link>
//               <Link
//                 href="/auth/signup"
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
//               >
//                 Get Started
//               </Link>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <main>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <div className="text-center">
//             <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
//               <span className="block">Split expenses with</span>
//               <span className="block text-blue-600">friends & organizations</span>
//             </h1>
//             <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
//               Manage group expenses, track donations, and settle balances effortlessly. 
//               Perfect for trips, events, and organizational campaigns.
//             </p>
//             <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
//               <div className="rounded-md shadow">
//                 <Link
//                   href="/auth/signup"
//                   className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
//                 >
//                   Get Started Free
//                 </Link>
//               </div>
//               <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
//                 <Link
//                   href="/auth/signin"
//                   className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
//                 >
//                   Sign In
//                 </Link>
//               </div>
//             </div>
//           </div>

//           {/* Features */}
//           <div className="mt-20">
//             <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
//               <div className="pt-6">
//                 <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm">
//                   <div className="-mt-6">
//                     <div>
//                       <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
//                         <Users className="h-6 w-6 text-white" />
//                       </span>
//                     </div>
//                     <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
//                       Friends Mode
//                     </h3>
//                     <p className="mt-5 text-base text-gray-500">
//                       Perfect for trips and outings. Split expenses with friends and track who owes what.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="pt-6">
//                 <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm">
//                   <div className="-mt-6">
//                     <div>
//                       <span className="inline-flex items-center justify-center p-3 bg-green-500 rounded-md shadow-lg">
//                         <Shield className="h-6 w-6 text-white" />
//                       </span>
//                     </div>
//                     <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
//                       Organization Mode
//                     </h3>
//                     <p className="mt-5 text-base text-gray-500">
//                       Manage events and campaigns with team spending, donations, and transparent reporting.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="pt-6">
//                 <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm">
//                   <div className="-mt-6">
//                     <div>
//                       <span className="inline-flex items-center justify-center p-3 bg-purple-500 rounded-md shadow-lg">
//                         <TrendingUp className="h-6 w-6 text-red-50" />
//                       </span>
//                     </div>
//                     <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
//                       Smart Settlement
//                     </h3>
//                     <p className="mt-5 text-base text-gray-500">
//                       Automatic calculation of minimal transactions needed to settle all balances.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="pt-6">
//                 <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm">
//                   <div className="-mt-6">
//                     <div>
//                       <span className="inline-flex items-center justify-center p-3 bg-orange-500 rounded-md shadow-lg">
//                         <Plus className="h-6 w-6 text-white" />
//                       </span>
//                     </div>
//                     <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
//                       Easy Management
//                     </h3>
//                     <p className="mt-5 text-base text-gray-500">
//                       Add expenses, track participants, and manage everything from one dashboard.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }
//------------------------------------------------------------------------------------------
"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  Users,
  Shield,
  TrendingUp,
  Zap,
  Sparkles,
  ArrowRight,
  DollarSign,
  PieChart,
  Wallet,
} from "lucide-react"

export default function LandingPage() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 }) // Default values
  const [activeTab, setActiveTab] = useState<"friends" | "organization">("friends")
  const [count, setCount] = useState(0)
  const rafRef = useRef<number | null>(null)
  const lastPos = useRef({ x: 0, y: 0 })
  const dashboardRef = useRef<HTMLDivElement | null>(null)
  const tiltRefs = useRef<Array<HTMLDivElement | null>>([])

  const [animatedAmount, setAnimatedAmount] = useState(100);


  // Set window size on mount
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Scenarios kept as-is (random values preserved)
  const scenarios = {
    friends: {
      title: "Split with Friends",
      emoji: "🎉",
      amount: "$342.50",
      people: ["Alex", "Jamie", "Sam", "You"],
      items: ["Dinner", "Uber", "Concert tickets", "Drinks"],
    },
    organization: {
      title: "Organization Campaign",
      emoji: "🏢",
      amount: "$12,450",
      people: ["Team A", "Team B", "Donors", "Sponsors"],
      items: ["Event venue", "Marketing", "Donations", "Supplies"],
    },
  }

  const activeScenario = scenarios[activeTab]

  // Lightweight mouse handler using rAF
  useEffect(() => {
    let running = false

    const handleMouse = (e: MouseEvent) => {
      lastPos.current = { x: e.clientX, y: e.clientY }
      if (!running) {
        running = true
        rafRef.current = requestAnimationFrame(() => {
          setMouse({ x: lastPos.current.x, y: lastPos.current.y })
          running = false
        })
      }
    }

    window.addEventListener("mousemove", handleMouse)
    return () => {
      window.removeEventListener("mousemove", handleMouse)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Smooth count-up using rAF (keeps same final value as your original)
  useEffect(() => {
    const target = 2847
    let current = 0
    let last = performance.now()

    function tick(now: number) {
      const dt = now - last
      last = now
      // progress speed scaled by dt
      const step = Math.min(target - current, Math.max(1, Math.round((47 * dt) / 50)))
      current += step
      setCount(current)
      if (current < target) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Dashboard tilt/rotate and cards tilt effect
  useEffect(() => {
    const applyTransforms = () => {
      if (!dashboardRef.current) return
      const rect = dashboardRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = mouse.x - cx
      const dy = mouse.y - cy
      const rx = (dy / rect.height) * 6 // rotateX range
      const ry = -(dx / rect.width) * 10 // rotateY range

      dashboardRef.current.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`

      // Cards tilt
      tiltRefs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const rcx = r.left + r.width / 2
        const rcy = r.top + r.height / 2
        const rdx = mouse.x - rcx
        const rdy = mouse.y - rcy
        const rrX = (rdy / r.height) * 6
        const rrY = -(rdx / r.width) * 8
        el.style.transform = `translateZ(8px) rotateX(${rrX}deg) rotateY(${rrY}deg)`
      })
    }

    // Use rAF for transform updates
    let raf: number | null = null
    const loop = () => {
      applyTransforms()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [mouse])

  // Helper to set refs for tilt elements
  const setTiltRef = (el: HTMLDivElement | null, idx: number) => {
    tiltRefs.current[idx] = el
  }

  // const finalAmount = Number(String(activeScenario.amount).replace(/[^\d]/g, ""));
  useEffect(() => {
  if (!mouse.x && !mouse.y) return;
  

  setAnimatedAmount((prev) => {
    // random increment between 20 and 500
        
    const jump = Math.floor(Math.random() * 480) + 20;

    // new increasing amount
    const next = prev + jump;

    // keep it within 5 digit range
    if (next > 200000)return 100;  // cap at 5 digits
   
    return next;
    
  });
}, [mouse,activeTab]);

// when tab chages the amount resets 
useEffect(() => {
  setAnimatedAmount(200);   // reset to 200 when switching tabs
}, [activeTab]);





  // small utility to create shimmer animation for numbers
  const ShimmerNumber = ({ value }: { value: string | number }) => (
    <span className="relative inline-block">
      <span className="shimmer-clip">{value}</span>
      <style jsx>{`
        .shimmer-clip{
          background: linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.06) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer 2.2s linear infinite;
        }
        @keyframes shimmer{
          0%{background-position: -200% 0}
          100%{background-position: 200% 0}
        }
      `}</style>
    </span>
  )

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Parallax layers */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ transform: `translate3d(${(mouse.x - windowSize.width / 2) * 0.01}px, ${(mouse.y - windowSize.height / 2) * 0.01}px, 0)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#001219] via-[#031025] to-[#000000] opacity-95" />

        {/* soft beams */}
        <div
          className="absolute left-1/2 top-10 w-[1200px] h-[600px] -translate-x-1/2 blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle at 20% 30%, rgba(99,102,241,0.14), transparent 20%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.08), transparent 30%)' }}
        />

        {/* subtle grid low-contrast */}
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: '72px 72px' }}
        />
      </div>

      {/* Multi-color cursor glow (keeps pointer-events none) */}
      <div
        className="fixed rounded-full pointer-events-none z-30 mix-blend-screen transition-all duration-200"
        style={{
          width: 420,
          height: 420,
          left: mouse.x - 210,
          top: mouse.y - 210,
          background: `radial-gradient(circle, rgba(59,130,246,0.16) 0%, rgba(124,58,237,0.12) 25%, rgba(236,72,153,0.08) 55%, transparent 70%)`,
          filter: 'blur(28px)'
        }}
      />

      {/* Floating nav */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg">Xpence</span>
        </div>

        <div className="flex gap-6 text-sm">
          <button className="text-gray-400 hover:text-white transition-colors">Features</button>
          <button className="text-gray-400 hover:text-white transition-colors">How it works</button>
        </div>

        <div className="flex gap-3">
          <Link href="/auth/signin" className="px-4 py-1.5 text-sm hover:text-blue-400 transition-colors">
            Sign In
          </Link>
          <Link href="/auth/signup" className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 rounded-full transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20">
        <div className="grid md:grid-cols-12 gap-10 items-start">
          {/* Left: Hero */}
          <section className="md:col-span-7">
            <div className="mb-6">
              <div className="inline-flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm text-blue-400">Trusted by <span className="font-semibold"><ShimmerNumber value={`${count.toLocaleString()}+`} /></span> users</span>
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-6">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 animate-fade-in-up">Never split</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-fade-in-up delay-150">the awkward way</span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mb-8">The expense tracker that actually understands groups. Smart splitting, instant settlements, zero awkwardness.</p>

            <div className="flex items-center gap-4">
              <Link href="/auth/signup" className="group relative px-8 py-4 bg-blue-600 rounded-xl font-semibold overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  Start Free Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link href="/auth/signin" className="px-8 py-4 border border-zinc-700 rounded-xl font-semibold hover:border-zinc-600 transition-colors">
                Watch Demo
              </Link>
            </div>

            {/* subtle hints that page is alive */}
            <div className="mt-8 flex gap-4">
              <div className="text-sm text-gray-400">Live mock data •</div>
              <div className="text-sm text-gray-400">Realtime sync •</div>
              <div className="text-sm text-gray-400">Auto suggestions</div>
            </div>
          </section>

          {/* Right: Interactive Mock Dashboard */}
          <aside className="md:col-span-5">
            <div ref={dashboardRef} className="bg-zinc-900/55 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-2xl transition-transform will-change-transform">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-3xl mb-1">{activeScenario.emoji}</div>
                  <h3 className="text-xl font-bold">{activeScenario.title}</h3>
                  <p className="text-sm text-gray-400">Last updated just now</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">Total Amount</div>
                  <div className="text-2xl font-bold text-green-400">₹{animatedAmount.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="flex gap-3 mb-4">
                <button onClick={() => setActiveTab("friends")} className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "friends" ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-gray-400 hover:text-white'}`}>
                  👥 Friends
                </button>
                <button onClick={() => setActiveTab("organization")} className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "organization" ? 'bg-purple-600 text-white' : 'bg-zinc-900 text-gray-400 hover:text-white'}`}>
                  🏢 Organization
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-black/30 rounded-2xl p-3 border border-zinc-800" ref={(el) => setTiltRef(el, 0)}>
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">PARTICIPANTS</h4>
                  <div className="space-y-2">
                    {activeScenario.people.map((person:any, idx:any) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-zinc-900/40 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold">{person[0]}</div>
                          <span>{person}</span>
                        </div>
                        <div className="text-sm text-green-400">+${(Math.random() * 100).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-black/30 rounded-2xl p-3 border border-zinc-800" ref={(el) => setTiltRef(el, 1)}>
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">RECENT EXPENSES</h4>
                  <div className="space-y-2">
                    {activeScenario.items.map((item:any, idx:any) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-zinc-900/40 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-blue-400" />
                          </div>
                          <span>{item}</span>
                        </div>
                        <div className="text-sm text-gray-400">${(Math.random() * 200 + 50).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-2 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg flex items-center gap-3" ref={(el) => setTiltRef(el, 2)}>
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <div>
                    <div className="font-semibold">Smart Settlement Ready</div>
                    <div className="text-sm text-gray-400">2 simple transactions will settle all balances.</div>
                  </div>
                </div>
              </div>

            </div>
          </aside>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-gradient-to-br from-blue-600/15 to-purple-600/15 border border-blue-500/10 rounded-3xl p-6 transform transition will-change-transform">
            <Wallet className="w-10 h-10 text-blue-400 mb-3" />
            <h3 className="text-2xl font-bold mb-1">Split Any Way</h3>
            <p className="text-gray-400">Equal, percentage, custom amounts, or itemized. You name it, we split it.</p>
          </div>

          <div className="bg-gradient-to-br from-green-600/15 to-emerald-600/15 border border-green-500/10 rounded-3xl p-6 transform transition will-change-transform">
            <Shield className="w-10 h-10 text-green-400 mb-3" />
            <h3 className="text-2xl font-bold mb-1">Bank-Level Security</h3>
            <p className="text-gray-400">Your data is encrypted and private.</p>
          </div>

          <div className="bg-gradient-to-br from-orange-600/15 to-red-600/15 border border-orange-500/10 rounded-3xl p-6 transform transition will-change-transform">
            <TrendingUp className="w-10 h-10 text-orange-400 mb-3" />
            <h3 className="text-2xl font-bold mb-1">Real-Time Sync</h3>
            <p className="text-gray-400">Everyone sees updates instantly.</p>
          </div>

          <div className="md:col-span-2 bg-gradient-to-br from-purple-600/15 to-pink-600/15 border border-purple-500/10 rounded-3xl p-6 transform transition will-change-transform">
            <PieChart className="w-10 h-10 text-purple-400 mb-3" />
            <h3 className="text-2xl font-bold mb-1">Visual Reports</h3>
            <p className="text-gray-400">Beautiful charts and insights. See where your money goes at a glance.</p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to never argue about money again?</h2>
            <p className="text-gray-400 mb-6">Join thousands who've made splitting expenses effortless</p>
            <Link href="/auth/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .animate-fade-in-up{ animation: fadeInUp 700ms ease both }
        .animate-fade-in-up.delay-150{ animation-delay: 150ms }
        @keyframes fadeInUp{ from{ opacity:0; transform: translateY(8px) } to{ opacity:1; transform: translateY(0) } }

        /* small perf-friendly shadow for cards */
        .shadow-2xl{ box-shadow: 0 10px 30px rgba(2,6,23,0.7) }

        /* smooth transform */
        .will-change-transform{ will-change: transform }
      `}</style>
    </div>
  )
}  