'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getDashboardStats, getAnalyticsStats } from '@/app/actions/adminActions';

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin-secret-portal';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: `/${adminPath}` },
    { id: 'users', label: 'Users', icon: 'groups', href: `/${adminPath}/users` },
    { id: 'feedback', label: 'Feedback', icon: 'comment', href: `/${adminPath}/feedback` },
    { id: 'news', label: 'News', icon: 'article', href: `/${adminPath}/news` },
    { id: 'game-manager', label: 'Games', icon: 'sports_esports', href: `/${adminPath}/game-manager` },
    { id: 'analytics-detail', label: 'Analytics', icon: 'analytics', href: `/${adminPath}/analytics-detail` },
    { id: 'contact-inbox', label: 'Contact', icon: 'mail', href: `/${adminPath}/contact-inbox` },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          getDashboardStats(),
          getAnalyticsStats()
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (analyticsRes.success) setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Chart options
  const customerHabitsOptions = {
    series: [{
      name: 'Seen Product',
      data: [44, 55, 57, 56, 61, 58, 63]
    }, {
      name: 'Sales',
      data: [76, 85, 101, 98, 87, 105, 91]
    }],
    chart: {
      type: 'bar',
      height: 220,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    colors: ['#c3c0ff', '#4f46e5'],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#777587', fontSize: '10px', fontWeight: 600 } }
    },
    yaxis: { show: false },
    grid: {
      borderColor: '#f2f4f6',
      strokeDashArray: 4,
      yaxis: { lines: { show: true } }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      markers: { radius: 12 },
      itemMargin: { horizontal: 10, vertical: 0 }
    },
    fill: { opacity: 1 },
    tooltip: {
      y: { formatter: (val) => `${val} Users` }
    }
  };

  const productStatisticOptions = {
    series: [44, 55, 67],
    chart: {
      height: 250,
      type: 'radialBar',
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '40%' },
        track: { background: '#f2f4f6', margin: 8 },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: '24px',
            fontWeight: 800,
            fontFamily: 'Manrope, sans-serif',
            color: '#191c1e',
            show: true,
            formatter: () => '9.8K'
          }
        }
      }
    },
    colors: ['#adc6ff', '#2170e4', '#4f46e5'],
    labels: ['Furniture', 'Games', 'Electronic'],
    stroke: { lineCap: 'round' }
  };

  return (
    <div className="flex h-screen bg-[#f7f9fb] text-[#191c1e] font-['Inter']">
      {/* Sidebar */}
      <aside className="w-64 fixed left-0 top-0 bg-[#eceef0] flex flex-col p-6 border-r border-outline-variant/20 z-50">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer transition-transform hover:scale-105">
          <div className="w-10 h-10 bg-primary-gradient rounded-xl flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined" data-icon="rocket_launch">rocket_launch</span>
          </div>
          <div>
            <h1 className="text-xl font-bold font-headline text-[#191c1e] leading-none">Teknologi Santuy</h1>
            <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant/60 mt-1">Analytics Intelligence</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto hide-scrollbar pb-6">
          {navItems.map(item => (
            <Link key={item.id} href={item.href} className="flex items-center gap-3 px-4 py-3 text-[#191c1e]/70 hover:bg-white hover:shadow-sm rounded-lg transition-all font-medium text-sm">
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto bg-slate-800 rounded-2xl p-5 relative overflow-hidden group shadow-lg">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/40 rounded-full blur-2xl group-hover:bg-primary/60 transition-all"></div>
          <p className="text-white text-xs font-medium mb-1 opacity-80">Pro Version</p>
          <h4 className="text-white font-headline text-lg mb-4 font-bold">Upgrade Pro</h4>
          <button className="w-full py-2.5 bg-primary-gradient text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-95">
            Upgrade $30
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 mr-80 min-h-screen p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-extrabold font-headline text-on-surface">Sales Report</h2>
            <p className="text-sm text-on-surface-variant font-medium opacity-70">Friday, December 15th 2023</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
              <input className="bg-white border-none rounded-2xl py-3 pl-10 pr-4 w-64 text-sm shadow-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Search report..." type="text"/>
            </div>
            <button className="w-12 h-12 bg-white shadow-sm rounded-2xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-error border-2 border-white rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-bold font-headline leading-none group-hover:text-primary transition-colors">Admin</p>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1">Admin store</p>
              </div>
              <img alt="User Profile" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-primary/30 transition-all" src="https://ui-avatars.com/api/?name=Admin&background=e2dfff&color=3525cd&rounded=true"/>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="col-span-2 bg-primary-gradient p-8 rounded-3xl text-white shadow-xl shadow-primary/20 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-pointer">
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-500"></div>
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm">+2.08%</span>
            </div>
            <div className="relative z-10">
              <p className="text-white/80 text-xs font-bold mb-1 uppercase tracking-widest">Total Sales</p>
              <h3 className="text-5xl font-extrabold font-headline tracking-tight">${stats?.totalSales || '0'}</h3>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer border border-transparent hover:border-surface-container-high">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">shopping_cart</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">In-Stock</span>
            </div>
            <div className="mt-8">
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Total Orders</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-headline">{stats?.totalOrders || 0}</span>
                <span className="text-green-600 text-xs font-bold">↑ 12%</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer border border-transparent hover:border-surface-container-high">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-tertiary-container/10 text-tertiary-container rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">visibility</span>
              </div>
              <span className="px-2 py-1 bg-error-container text-on-error-container rounded-full text-[10px] font-bold">-2.08%</span>
            </div>
            <div className="mt-8">
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Visitor</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-headline">{analytics?.totalVisitors || 0}</span>
                <span className="text-error text-xs font-bold">↓ 3%</span>
              </div>
            </div>
          </div>

          <div className="col-span-2 bg-surface-container-lowest p-8 rounded-3xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">Total Sold Products</p>
              <h3 className="text-3xl font-bold font-headline mb-4">{stats?.totalSoldProducts || 0}</h3>
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://ui-avatars.com/api/?name=User+One&background=random"/>
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://ui-avatars.com/api/?name=User+Two&background=random"/>
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://ui-avatars.com/api/?name=User+Three&background=random"/>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary z-10">+80</div>
              </div>
            </div>
            <div className="h-16 w-32 flex items-end gap-1">
              <div className="flex-1 bg-primary/10 rounded-t-sm h-[40%] hover:bg-primary/40 transition-colors"></div>
              <div className="flex-1 bg-primary/20 rounded-t-sm h-[60%] hover:bg-primary/40 transition-colors"></div>
              <div className="flex-1 bg-primary/40 rounded-t-sm h-[90%] hover:bg-primary/60 transition-colors"></div>
              <div className="flex-1 bg-primary/60 rounded-t-sm h-[70%] hover:bg-primary transition-colors"></div>
              <div className="flex-1 bg-primary-container rounded-t-sm h-[100%] hover:bg-primary transition-colors"></div>
            </div>
          </div>

          <div className="col-span-2 bg-surface-container-lowest p-6 rounded-3xl shadow-sm flex flex-col justify-center">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold font-headline">Customer Habits</h3>
            </div>
            <div id="customerHabitsChart" className="-ml-4">
              <ReactApexChart options={customerHabitsOptions} series={customerHabitsOptions.series} type="bar" height={220} />
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 h-screen fixed right-0 top-0 bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.02)] p-8 border-l border-surface-container-high overflow-y-auto hide-scrollbar z-40">
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold font-headline">Product Statistic</h3>
            <button className="text-on-surface-variant hover:bg-surface-container-low p-1 rounded-full transition-colors">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          
          <div className="bg-surface relative rounded-3xl p-6">
            <div id="productStatisticChart" className="flex justify-center -mt-4">
              <ReactApexChart options={productStatisticOptions} series={productStatisticOptions.series} type="radialBar" height={250} />
            </div>
            
            <div className="mt-2 space-y-4">
              <div className="flex justify-between items-center group cursor-pointer hover:bg-white p-2 -mx-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]"></div>
                  <span className="text-xs font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors">Electronic</span>
                </div>
                <span className="text-xs font-bold">4.210</span>
              </div>
              <div className="flex justify-between items-center group cursor-pointer hover:bg-white p-2 -mx-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2170e4]"></div>
                  <span className="text-xs font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors">Games</span>
                </div>
                <span className="text-xs font-bold">3.120</span>
              </div>
              <div className="flex justify-between items-center group cursor-pointer hover:bg-white p-2 -mx-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#adc6ff]"></div>
                  <span className="text-xs font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors">Furniture</span>
                </div>
                <span className="text-xs font-bold">2.499</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold font-headline">Customer Growth</h3>
            <button className="text-xs font-bold text-primary px-3 py-1.5 bg-primary/10 hover:bg-primary/20 transition-colors rounded-full">View All</button>
          </div>
          
          <div className="bg-surface rounded-3xl p-6">
            <div className="relative h-40 w-full mb-6 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] rounded-xl border border-outline-variant/20">
              <div className="absolute top-[20%] left-[10%] w-14 h-14 bg-[#4f46e5]/20 rounded-full flex items-center justify-center border border-[#4f46e5]/30 animate-pulse">
                <span className="text-[10px] font-bold text-[#4f46e5]">US</span>
              </div>
              <div className="absolute top-[45%] left-[45%] w-16 h-16 bg-[#2170e4]/30 rounded-full flex items-center justify-center border border-[#2170e4]/40 animate-[pulse_2.5s_infinite]">
                <span className="text-[10px] font-bold text-[#2170e4]">DE</span>
              </div>
              <div className="absolute top-[15%] left-[65%] w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/30 animate-[pulse_3s_infinite]">
                <span className="text-[10px] font-bold text-purple-700">AU</span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-sm font-bold">🇺🇸</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-on-surface-variant group-hover:text-on-surface transition-colors">United States</span>
                    <span className="text-xs font-bold text-primary">78%</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="w-[78%] h-full bg-primary-gradient rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-sm font-bold">🇩🇪</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-on-surface-variant group-hover:text-on-surface transition-colors">Germany</span>
                    <span className="text-xs font-bold text-[#2170e4]">62%</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="w-[62%] h-full bg-[#2170e4] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 rounded-3xl overflow-hidden relative h-36 group cursor-pointer shadow-lg">
          <img alt="Promotion Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop"/>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent p-6 flex flex-col justify-end">
            <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mb-1">New Update</p>
            <h4 className="text-white text-lg font-bold font-headline leading-tight group-hover:text-primary-fixed transition-colors">Advanced Prediction</h4>
          </div>
        </div>
      </aside>
    </div>
  );
}