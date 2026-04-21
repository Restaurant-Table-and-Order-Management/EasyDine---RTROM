import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Menu, X, ChefHat, Zap, Clock, Star,
  BarChart3, ShieldCheck, Smartphone, Layers, Wifi, Users,
  Sun, Moon, ArrowUp, Mail, Phone, MapPin,
  Github, Twitter, Linkedin,
} from 'lucide-react';

// ─── Theme Context (page-scoped — does NOT touch Login/Register) ──────────────
const ThemeCtx = createContext({ dark: false, toggle: () => { } });

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Floating Navbar ──────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dark, toggle } = useContext(ThemeCtx);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl rounded-2xl transition-all duration-500 ${scrolled
        ? dark
          ? 'bg-gray-900/90 backdrop-blur-xl shadow-lg shadow-black/30 border border-white/10'
          : 'bg-white/85 backdrop-blur-xl shadow-lg shadow-black/8 border border-white/60'
        : dark
          ? 'bg-gray-900/70 backdrop-blur-md border border-white/10'
          : 'bg-white/60 backdrop-blur-md border border-white/40'
        }`}
    >
      <nav className="flex items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-orange to-brand-gold flex items-center justify-center shadow-md shadow-brand-orange/30">
            <ChefHat className="w-4 h-4 text-white" />
          </span>
          <span className={`text-lg font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
            Easy<span className="text-brand-orange">Dine</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
          {[['Features', 'features'], ['About', 'about'], ['Contact', 'contact']].map(([label, id]) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className={`hover:text-brand-orange transition-colors duration-200 ${dark ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggle}
            className={`p-2 rounded-xl transition-all duration-200 ${dark ? 'bg-white/10 text-yellow-300 hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link
            to="/login"
            className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${dark ? 'text-gray-200 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-orange to-brand-gold shadow-md shadow-brand-orange/30 hover:shadow-lg hover:shadow-brand-orange/40 hover:scale-105 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggle} className={`p-2 rounded-xl ${dark ? 'bg-white/10 text-yellow-300' : 'bg-gray-100 text-gray-600'}`}>
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            className={`p-2 rounded-lg transition ${dark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={`md:hidden px-6 pb-4 flex flex-col gap-3 border-t pt-3 ${dark ? 'border-white/10' : 'border-gray-100'
          }`}>
          {[['Features', 'features'], ['About', 'about'], ['Contact', 'contact']].map(([label, id]) => (
            <button key={id} onClick={() => scrollTo(id)}
              className={`text-sm font-medium text-left hover:text-brand-orange ${dark ? 'text-gray-300' : 'text-gray-600'
                }`}>
              {label}
            </button>
          ))}
          <div className="flex gap-3 mt-2">
            <Link to="/login" className={`flex-1 text-center text-sm font-semibold border py-2 rounded-xl transition ${dark ? 'border-white/20 text-gray-200 hover:bg-white/10' : 'border-gray-200 hover:bg-gray-50'
              }`}>
              Login
            </Link>
            <Link to="/signup" className="flex-1 text-center text-sm font-semibold text-white py-2 rounded-xl bg-gradient-to-r from-brand-orange to-brand-gold shadow-md">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Spring Reveal Wrapper ────────────────────────────────────────────────────
function SpringReveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.8, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Bento Card ───────────────────────────────────────────────────────────────
function BentoCard({ className = '', children }) {
  const { dark } = useContext(ThemeCtx);
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`rounded-3xl overflow-hidden shadow-xl backdrop-blur-sm ${
        dark ? 'bg-gray-900/60 border border-white/10 shadow-black/40' : 'bg-white/70 border border-white/60 shadow-black/8'
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const { dark } = useContext(ThemeCtx);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -250]);
  const rotate1 = useTransform(scrollY, [0, 1000], [0, 90]);
  const rotate2 = useTransform(scrollY, [0, 1000], [0, -90]);

  return (
    <section className={`relative min-h-screen flex flex-col items-center justify-center pt-28 pb-16 px-4 overflow-hidden transition-colors duration-300 ${dark ? 'bg-[#0a0a0a]' : 'bg-[#fcfcfc]'
      }`}>

      {/* Animated scroll-reactive mesh blobs */}
      <motion.div style={{ y: y1, rotate: rotate1 }} className={`absolute top-20 left-[-10%] w-[520px] h-[520px] rounded-full blur-[110px] pointer-events-none ${dark ? 'bg-brand-orange/20' : 'bg-brand-orange/10'}`} />
      <motion.div style={{ y: y2, rotate: rotate2 }} className={`absolute bottom-10 right-[-8%] w-[420px] h-[420px] rounded-full blur-[100px] pointer-events-none ${dark ? 'bg-violet-600/15' : 'bg-brand-gold/10'}`} />
      <motion.div style={{ y: y1 }} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[130px] pointer-events-none ${dark ? 'bg-brand-gold/8' : 'bg-orange-50/60'}`} />

      {/* Headline */}
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div variants={fadeUp} custom={0}>
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-4 py-1.5 rounded-full mb-6">
            <Zap className="w-3 h-3" /> Real-Time Restaurant Management
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          custom={1}
          className={`text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}
        >
          Master Your Kitchen,{' '}
          <span className="bg-gradient-to-r from-brand-orange via-orange-400 to-brand-gold bg-clip-text text-transparent">
            Elevate Your Dining.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={2}
          className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 ${dark ? 'text-gray-400' : 'text-gray-500'}`}
        >
          EasyDine connects your kitchen, waitstaff, and guests in real time —
          reducing errors, speeding up service, and creating memorable experiences.
        </motion.p>

        <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-gold text-white font-bold text-base shadow-xl shadow-brand-orange/30 hover:shadow-2xl hover:shadow-brand-orange/40 hover:scale-105 transition-all duration-200"
          >
            Start for Free →
          </Link>
          <Link
            to="/login"
            className={`px-8 py-4 rounded-2xl border-2 font-semibold text-base transition-all duration-200 ${dark
              ? 'border-white/20 text-gray-200 hover:border-brand-orange/60 hover:text-brand-orange hover:bg-brand-orange/10'
              : 'border-gray-200 text-gray-700 hover:border-brand-orange/40 hover:text-brand-orange hover:bg-brand-orange/5'
              }`}
          >
            Sign In
          </Link>
        </motion.div>
      </motion.div>

      {/* Bento Grid */}
      <motion.div
        className="relative z-10 mt-20 w-full max-w-6xl mx-auto grid grid-cols-12 grid-rows-2 gap-4 h-[520px]"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Card 1 – Large hero image (fine dining) */}
        <BentoCard className="col-span-12 md:col-span-5 row-span-2">
          <div className="relative w-full h-full min-h-[240px]">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop"
              alt="Fine dining restaurant"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-1">Premium Experience</p>
              <p className="text-2xl font-bold leading-tight">Fine Dining,<br />Reimagined.</p>
            </div>
          </div>
        </BentoCard>

        {/* Card 2 – Order tracking mini card */}
        <BentoCard className="col-span-12 md:col-span-4 row-span-1 p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Live Order Tracking</span>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Table 4 – Pasta Primavera', status: 'Preparing', color: 'bg-yellow-400' },
              { label: 'Table 7 – Paneer Malai Tikka', status: 'Ready', color: 'bg-green-400' },
              { label: 'Table 2 – Tandoori Butter chicken', status: 'Pending', color: 'bg-orange-400' },
            ].map((o) => (
              <div key={o.label} className={`flex items-center justify-between rounded-xl px-3 py-2 ${dark ? 'bg-gray-800/80' : 'bg-gray-50'}`}>
                <span className={`text-xs font-medium truncate ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{o.label}</span>
                <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${o.color}`}>{o.status}</span>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Card 3 – Kitchen status */}
        <BentoCard className="col-span-12 md:col-span-3 row-span-1 p-5 flex flex-col justify-between bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Kitchen Load</span>
            <ChefHat className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Active Orders</span>
              <span className="font-bold text-brand-gold">14</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div className="bg-gradient-to-r from-brand-orange to-brand-gold h-1.5 rounded-full" style={{ width: '70%' }} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Avg. Cook Time</span>
              <span className="font-bold text-white flex items-center gap-1"><Clock className="w-3 h-3" />12 min</span>
            </div>
          </div>
        </BentoCard>

        {/* Card 4 – Chef image */}
        <BentoCard className="col-span-12 md:col-span-4 row-span-1">
          <div className="relative w-full h-full min-h-[180px]">
            <img
              src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600&q=80&auto=format&fit=crop"
              alt="Chef plating"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-xs font-semibold opacity-75 mb-0.5">Award-Winning Chefs</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-brand-gold text-brand-gold" />
                ))}
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Card 5 – Stats */}
        <BentoCard className={`col-span-12 md:col-span-3 row-span-1 p-5 flex flex-col justify-center ${dark ? 'bg-gradient-to-br from-brand-orange/20 to-brand-gold/10' : 'bg-gradient-to-br from-brand-orange/10 to-brand-gold/5'}`}>
          <p className={`text-4xl font-extrabold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>98<span className="text-brand-orange">%</span></p>
          <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Customer satisfaction across all partner restaurants</p>
        </BentoCard>
      </motion.div>
    </section>
  );
}

// ─── Mini-UI: Order Tracking Card ────────────────────────────────────────────────
function OrderMiniUI() {
  const orders = [
    { name: 'Truffle Risotto', table: 'T-3', progress: 85, status: 'Almost Ready', color: 'bg-green-400' },
    { name: 'Achari Paneer Tikka', table: 'T-7', progress: 45, status: 'Preparing', color: 'bg-yellow-400' },
    { name: 'The 1970s Dal Makhani ', table: 'T-1', progress: 15, status: 'Queued', color: 'bg-orange-400' },
  ];
  return (
    <div className="mt-6 space-y-3">
      {orders.map((o) => (
        <div key={o.name} className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-bold text-gray-800">{o.name}</p>
              <p className="text-[10px] text-gray-400">{o.table}</p>
            </div>
            <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${o.color}`}>{o.status}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className={`${o.color} h-1.5 rounded-full transition-all duration-700`} style={{ width: `${o.progress}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Mini-UI: Menu Insights Chart ───────────────────────────────────────────────
function MenuInsightsMiniUI() {
  const items = [
    { name: 'Truffle Pasta', orders: 142, pct: 95 },
    { name: 'Sea Bass', orders: 98, pct: 65 },
    { name: 'Tiramisu', orders: 87, pct: 58 },
    { name: 'Wagyu Steak', orders: 76, pct: 50 },
  ];
  return (
    <div className="mt-5 space-y-2.5">
      {items.map((item) => (
        <div key={item.name} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-28 truncate flex-shrink-0">{item.name}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-brand-orange to-brand-gold"
              style={{ width: `${item.pct}%` }}
            />
          </div>
          <span className="text-xs font-bold text-gray-700 w-8 text-right">{item.orders}</span>
        </div>
      ))}
      <p className="text-[10px] text-gray-400 pt-1">↑ 24% vs last month across top items</p>
    </div>
  );
}

// ─── Mini-UI: Staff Chat Bubbles ────────────────────────────────────────────────
function StaffChatMiniUI() {
  const messages = [
    { from: 'Kitchen', msg: 'Table 5 order is up ✅', time: '8:14 PM', self: false },
    { from: 'Waiter', msg: 'Picked up, heading over now', time: '8:14 PM', self: true },
    { from: 'Kitchen', msg: '86 on the sea bass tonight', time: '8:18 PM', self: false },
    { from: 'Manager', msg: 'Noted — update menu display', time: '8:19 PM', self: true },
  ];

  return (
    /* Removed max-h constraint and used h-auto to ensure all messages render fully */
    <div className="mt-5 space-y-2.5 h-auto overflow-visible pb-2">
      {messages.map((m, i) => (
        <div key={i} className={`flex ${m.self ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs shadow-sm ${
            m.self
              ? 'bg-gradient-to-r from-brand-orange to-brand-gold text-white rounded-br-sm'
              : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm'
          }`}>
            {!m.self && (
              <p className="text-[10px] font-bold mb-0.5 text-brand-orange">
                {m.from}
              </p>
            )}
            <p className="leading-relaxed">{m.msg}</p>
            <p className={`text-[9px] mt-0.5 ${m.self ? 'text-white/70' : 'text-gray-400'}`}>
              {m.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
// ─── System Status health check ──────────────────────────────────────────────
function SystemStatsMiniUI() {
  return (
    <div className="mt-5 grid grid-cols-2 gap-4">
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-gray-400 text-[10px] uppercase">Server Load</p>
        <p className="text-green-400 text-lg font-bold">12%</p>
      </div>
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-gray-400 text-[10px] uppercase">Active Tables</p>
        <p className="text-orange-400 text-lg font-bold">24/30</p>
      </div>
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 col-span-2">
        <p className="text-gray-400 text-[10px] uppercase">Database Sync</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-[99%] bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
          </div>
          <span className="text-[10px] text-green-400">99.9%</span>
        </div>
      </div>
    </div>
  );
}
// ─── Features Section (Phase 2) ──────────────────────────────────────────────
const FEATURES = [
  {
    id: 'tracking',
    badge: 'Real-Time',
    icon: <Wifi className="w-5 h-5" />,
    title: 'Live Order Tracking',
    desc: 'Every order, every table, every status update — pushed instantly to kitchen displays and staff devices. No polling. No refresh.',
    miniUI: <OrderMiniUI />,
    col: 'md:col-span-2',
    accentFrom: 'from-green-500',
    accentTo: 'to-emerald-400',
    badgeColor: 'text-green-700 bg-green-50 border-green-200',
  },
  {
    id: 'insights',
    badge: 'AI-Powered',
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Menu Intelligence',
    desc: 'Surface your top-performing dishes, spot slow-movers, and optimise your menu based on real order data — not gut feel.',
    miniUI: <MenuInsightsMiniUI />,
    col: 'md:col-span-1',
    accentFrom: 'from-brand-orange',
    accentTo: 'to-brand-gold',
    badgeColor: 'text-orange-700 bg-orange-50 border-orange-200',
  },
  {
    id: 'staff',
    badge: 'Team Sync',
    icon: <Users className="w-5 h-5" />,
    title: 'Staff Communication',
    desc: 'Built-in role-based messaging. Kitchen alerts waiters. Managers broadcast updates. Everyone stays in sync, instantly.',
    miniUI: <StaffChatMiniUI />,
    col: 'md:col-span-1',
    accentFrom: 'from-violet-500',
    accentTo: 'to-purple-400',
    badgeColor: 'text-violet-700 bg-violet-50 border-violet-200',
  },
];

function FeaturesSection() {
  const { dark } = useContext(ThemeCtx);
  return (
    <section id="features" className={`py-28 px-4 transition-colors duration-300 ${dark ? 'bg-[#0a0a0a]' : 'bg-[#fafaf9]'}`}>
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className={`inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5 border ${
            dark 
              ? 'text-brand-orange bg-brand-orange/20 border-brand-orange/30' 
              : 'text-brand-orange bg-brand-orange/10 border-brand-orange/20'
          }`}>
            <Zap className="w-3 h-3" /> Core Features
          </span>

          <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-5 leading-tight transition-colors duration-300 ${
            dark ? 'text-white' : 'text-gray-900'
          }`}>
            Three pillars of a
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent"> seamless service.</span>
          </h2>

          <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${
            dark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            From the moment a guest places an order to the second it lands on their table — EasyDine orchestrates every step.
          </p>
        </motion.div>

        {/* 3-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.id}
              className={`group bg-white border border-gray-100 rounded-3xl p-7 shadow-md shadow-black/4 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col ${f.col}`}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Top row: badge + icon */}
              <div className="flex items-start justify-between mb-5">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase border px-3 py-1 rounded-full ${f.badgeColor}`}>
                  {f.icon} {f.badge}
                </span>
                {/* Decorative gradient blob */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.accentFrom} ${f.accentTo} opacity-15 group-hover:opacity-25 transition-opacity`} />
              </div>

              {/* Title & description */}
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-2.5">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>

              {/* Embedded Mini-UI */}
              <div className="flex-1">
                {f.miniUI}
              </div>

              {/* Bottom hover accent */}
              <div className={`mt-6 h-0.5 w-0 bg-gradient-to-r ${f.accentFrom} ${f.accentTo} group-hover:w-full transition-all duration-500 rounded-full`} />
            </motion.div>
          ))}
        </div>

        {/* Bottom stats strip */}
        <motion.div
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {[
            { value: '<200ms', label: 'Order sync latency' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '4 Roles', label: 'Supported user types' },
            { value: '3× faster', label: 'Table turnover rate' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-2xl px-6 py-5 text-center shadow-sm">
              <p className="text-2xl font-extrabold text-gray-900 mb-1">{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Trusted By Marquee ───────────────────────────────────────────────────────
const brands = [
  { name: 'Zomato', letter: 'Z', color: '#e23744' },
  { name: 'Swiggy', letter: 'S', color: '#fc8019' },
  { name: 'OpenTable', letter: 'O', color: '#d4192c' },
  { name: 'Resy', letter: 'R', color: '#000000' },
  { name: 'SevenRooms', letter: '7', color: '#1a1a2e' },
  { name: 'TableAgent', letter: 'T', color: '#2563eb' },
  { name: 'Yelp', letter: 'Y', color: '#d32323' },
  { name: 'Toast', letter: 'T', color: '#ff4c00' },
];

function BrandChip({ b }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-3.5 mx-3 flex-shrink-0 shadow-sm">
      <span
        className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
        style={{ backgroundColor: b.color }}
      >{b.letter}</span>
      <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">{b.name}</span>
    </div>
  );
}

function TrustedBySection() {
  const { dark } = useContext(ThemeCtx);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const allBrands = [...brands, ...brands]; // duplicate for seamless loop

  return (
    <section ref={ref} className={`py-20 border-y overflow-hidden transition-colors duration-300 ${dark ? 'bg-[#0f0f0f] border-white/10' : 'bg-[#fafaf9] border-gray-100'}`}>
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">Trusted by teams at</p>
      </motion.div>

      {/* Marquee track */}
      <div className="relative">
        {/* Left + right fade masks */}
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#fafaf9] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#fafaf9] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee">
          {allBrands.map((b, i) => <BrandChip key={`a-${i}`} b={b} />)}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTASection() {
  const { dark } = useContext(ThemeCtx);
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-orange via-orange-500 to-brand-gold" />
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")" }}
          />
          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase bg-white/20 border border-white/30 text-white px-4 py-1.5 rounded-full mb-7"
            >
              <Zap className="w-3 h-3" /> Start Today — It's Free
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6"
            >
              Join the Future<br />of Dining.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/80 text-lg max-w-xl mx-auto mb-10"
            >
              Set up EasyDine in minutes. No credit card required. Trusted by restaurants that refuse to settle for slow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/signup"
                className="px-10 py-4 rounded-2xl bg-white text-brand-orange font-extrabold text-base shadow-2xl hover:scale-105 hover:shadow-white/30 transition-all duration-200"
              >
                Create Free Account →
              </Link>
              <Link
                to="/login"
                className="px-10 py-4 rounded-2xl border-2 border-white/40 text-white font-semibold text-base hover:bg-white/10 transition-all duration-200"
              >
                Sign In Instead
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const { dark } = useContext(ThemeCtx);
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer
      id="contact"
      className={`border-t pt-16 pb-10 px-4 ${dark ? 'bg-gray-950 border-white/10' : 'bg-white border-gray-100'
        }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange to-brand-gold flex items-center justify-center shadow-md shadow-brand-orange/30">
                <ChefHat className="w-5 h-5 text-white" />
              </span>
              <span className={`text-xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                Easy<span className="text-brand-orange">Dine</span>
              </span>
            </div>
            <p className={`text-sm leading-relaxed mb-6 max-w-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              A real-time restaurant management system built for the modern dining era. Engineered for speed, designed for people.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {[
                { Icon: Github, href: 'https://github.com', label: 'GitHub' },
                { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:text-brand-orange ${dark ? 'bg-white/10 text-gray-400 hover:bg-white/20' : 'bg-gray-100 text-gray-500 hover:bg-brand-orange/10'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-5 ${dark ? 'text-gray-400' : 'text-gray-400'}`}>Navigation</h3>
            <ul className="space-y-3">
              {[['Features', 'features'], ['About', 'about'], ['Contact', 'contact']].map(([label, id]) => (
                <li key={id}>
                  <button
                    onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
                    className={`text-sm font-medium hover:text-brand-orange transition-colors ${dark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                  >
                    {label}
                  </button>
                </li>
              ))}
              <li>
                <Link to="/login" className={`text-sm font-medium hover:text-brand-orange transition-colors ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Login</Link>
              </li>
              <li>
                <Link to="/signup" className={`text-sm font-medium hover:text-brand-orange transition-colors ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Register</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-5 ${dark ? 'text-gray-400' : 'text-gray-400'}`}>Contact</h3>
            <ul className="space-y-4">
              {[
                { Icon: Phone, text: '+91 98765-43210' },
                { Icon: Mail, text: 'hello@easydine.in' },
                { Icon: MapPin, text: 'Indore, Madhya Pradesh, India' },
              ].map(({ Icon, text }) => (
                <li key={text} className={`flex items-start gap-3 text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Icon className="w-4 h-4 text-brand-orange mt-0.5 flex-shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t ${dark ? 'border-white/10' : 'border-gray-100'
          }`}>
          <p className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
            © {new Date().getFullYear()} EasyDine. Built with ❤️ for a final-year engineering project.
          </p>
          {/* Back to top */}
          <button
            onClick={scrollTop}
            className="flex items-center gap-2 text-xs font-semibold text-brand-orange hover:text-brand-orange-dark transition-colors group"
          >
            Back to top
            <span className="w-7 h-7 rounded-lg bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors">
              <ArrowUp className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

// ─── Project Features Section (Real vs Coming Soon) ──────────────────────────
const REAL_FEATURES = [
  {
    icon: '🍽️',
    title: 'Digital Kitchen Management',
    desc: 'Real-time order flow from customer tap to kitchen display. Zero lag, zero reprints.',
  },
  {
    icon: '🔐',
    title: 'Dynamic Authentication',
    desc: 'Multi-role JWT login: Admin, Staff, Kitchen, Customer — each with a secured workspace.',
  },
  {
    icon: '⚡',
    title: 'Seamless UI/UX',
    desc: 'Built with React 18, Vite, Tailwind CSS and Framer Motion for sub-200ms interactions.',
  },
];

const COMING_SOON = [
  { icon: '🤖', title: 'AI Menu Intelligence', desc: 'Predictive dish recommendations powered by customer order history.' },
  { icon: '💬', title: 'Staff Chatbots', desc: 'Built-in internal communication with role-aware automated alerts.' },
  { icon: '📦', title: 'Automated Inventory', desc: 'AI-driven stock management that forecasts depletion before it happens.' },
];

function ProjectFeaturesSection() {
  const { dark } = useContext(ThemeCtx);
  return (
    <section id="about" className={`py-28 px-4 transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <SpringReveal className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-4 py-1.5 rounded-full mb-5">
            <Zap className="w-3 h-3" /> CORE FEATURES
          </span>
          <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
            Real today.
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent"> Smarter tomorrow.</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            Here's exactly what's live in production — and what's engineered next.
          </p>
        </SpringReveal>

        {/* ACTIVE — Real Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {REAL_FEATURES.map((f, i) => (
            <SpringReveal key={f.title} delay={i * 0.1}>
              <div className={`h-full rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group ${dark
                ? 'bg-gray-900/70 border-white/10 hover:border-brand-orange/30 hover:shadow-brand-orange/10'
                : 'bg-white border-gray-100 hover:border-brand-orange/30 hover:shadow-black/8'
                }`}>
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`text-lg font-extrabold ${dark ? 'text-white' : 'text-gray-900'}`}>{f.title}</h3>
                  <span className="text-[10px] font-bold text-green-600 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full ml-2 whitespace-nowrap flex-shrink-0">Live ✓</span>
                </div>
                <p className={`text-sm leading-relaxed mb-4 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{f.desc}</p>
                <p className={`text-[11px] font-bold uppercase tracking-wider ${dark ? 'text-gray-600' : 'text-gray-400'}`}>{f.tech}</p>
                <div className="mt-5 h-0.5 w-0 bg-gradient-to-r from-brand-orange to-brand-gold group-hover:w-full transition-all duration-500 rounded-full" />
              </div>
            </SpringReveal>
          ))}
        </div>

        {/* COMING SOON */}
        <SpringReveal delay={0.3}>
          <p className={`text-xs font-bold uppercase tracking-widest text-center mb-5 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
            — Stay Tuned —
          </p>
        </SpringReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {COMING_SOON.map((f, i) => (
            <SpringReveal key={f.title} delay={i * 0.1}>
              <div className={`h-full rounded-3xl border border-dashed p-7 opacity-70 relative overflow-hidden ${dark ? 'bg-gray-900/40 border-white/10' : 'bg-gray-50 border-gray-200'
                }`}>
                {/* Coming Soon ribbon */}
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-bold text-violet-600 bg-violet-100 border border-violet-200 px-2 py-0.5 rounded-full">Coming Soon</span>
                </div>
                <span className="text-3xl mb-4 block grayscale">{f.icon}</span>
                <h3 className={`text-lg font-extrabold mb-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed ${dark ? 'text-gray-600' : 'text-gray-400'}`}>{f.desc}</p>
              </div>
            </SpringReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [dark, setDark] = useState(false);
  const toggle = () => setDark((d) => !d);

  return (
    <ThemeCtx.Provider value={{ dark, toggle }}>
      <div className={`font-sans antialiased overflow-x-hidden transition-colors duration-300 ${dark ? 'bg-[#0a0a0a] text-white' : 'bg-[#fcfcfc] text-gray-900'
        }`}>
        <Navbar />
        <HeroSection />
        <TrustedBySection />
        <FeaturesSection />
        <ProjectFeaturesSection />
        <CTASection />
        <Footer />
      </div>
    </ThemeCtx.Provider>
  );
}
