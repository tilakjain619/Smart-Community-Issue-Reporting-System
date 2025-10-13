import { FileText, CheckCircle, Wrench, Bell, MapPin, AlertCircle, Users, TrendingUp, Award, Sparkles, ArrowRight, Menu } from "lucide-react";
import { Link } from "react-router-dom";
// Inline Link Component
function LinkComponent({ children, className = "", ...props }) {
  return (
    <Link
      className={`inline-flex items-center cursor-pointer justify-center px-4 py-2 rounded-xl transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

// Inline Badge Component
function Badge({ children, className = "", ...props }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs transition-all ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default function Landing() {
  const issueCards = [
    {
      title: "Broken Street Light",
      location: "MG Road, Sector 14",
      status: "In Progress",
      statusColor: "bg-blue-500",
      votes: 42,
      time: "2h ago",
      size: "large",
      imageUrl: "https://res.cloudinary.com/da3wjnlzg/image/upload/v1759934831/JagrukImageContainer/vsgmbboktdap1v5elbls.jpg"
    },
    {
      title: "Pothole on Highway",
      location: "NH-48, Km 23",
      status: "Resolved",
      statusColor: "bg-green-500",
      votes: 156,
      time: "1d ago",
      size: "small"
    },
    {
      title: "Garbage Not Collected",
      location: "Lawate Nagar",
      status: "Reported",
      statusColor: "bg-[#ff9a47]",
      votes: 89,
      time: "3h ago",
      size: "medium"
    },
    {
      title: "Water Leakage",
      location: "Ashok Nagar, Lane 5",
      status: "In Progress",
      statusColor: "bg-blue-500",
      votes: 67,
      time: "5h ago",
      size: "small"
    },
    {
      title: "Illegal Parking",
      location: "Market Square",
      status: "Reported",
      statusColor: "bg-[#ff9a47]",
      votes: 34,
      time: "1h ago",
      size: "medium"
    }
  ];

  const howItWorksSteps = [
    {
      icon: FileText,
      title: "Report",
      description: "Submit issues with photo and location",
      gradient: "from-[#ff9a47] to-orange-500"
    },
    {
      icon: CheckCircle,
      title: "Verify",
      description: "Admin validates the issue",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Wrench,
      title: "Resolve",
      description: "Authorities take action",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Bell,
      title: "Notify",
      description: "Get updates on progress",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { value: "10K+", label: "Issues Reported", icon: FileText },
    { value: "85%", label: "Resolution Rate", icon: TrendingUp },
    { value: "50K+", label: "Active Citizens", icon: Users },
    { value: "200+", label: "Cities Covered", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 text-gray-900 overflow-hidden">
      {/* Static background grid */}
      <div className="fixed z-[-1] inset-0 bg-[linear-gradient(to_right,#ff9a4715_1px,transparent_1px),linear-gradient(to_bottom,#ff9a4715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Static background orbs */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-[#ff9a47]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-[120px] pointer-events-none" />


      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-10 sm:pt-24">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-full px-4 py-2 mb-8 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#ff9a47]" />
              <span className="text-sm text-gray-700">Empowering Citizens</span>
            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight"
            >
              Report Issues.
              <br />
              <span className="bg-gradient-to-r from-[#ff9a47] via-orange-500 to-orange-600 bg-clip-text text-transparent">
                Build Change.
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Join thousands of citizens making their communities better, one report at a time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div>
                <LinkComponent to="/report" className="bg-gradient-to-r from-[#ff9a47] to-orange-500 hover:from-[#ff9a47]/90 hover:to-orange-500/90 text-white px-8 py-6 rounded-full shadow-2xl shadow-[#ff9a47]/30 border-0 group">
                  Start Reporting
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </LinkComponent>
              </div>
              <div>
                <LinkComponent to="/community" className="bg-white/60 backdrop-blur-sm hover:bg-white/80 text-gray-900 px-8 py-6 rounded-full border border-gray-200/50 shadow-lg">
                  View Issues
                </LinkComponent>
              </div>
            </div>

            {/* Static stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:bg-white/80 hover:shadow-xl transition-all duration-300"
                >
                  <stat.icon className="w-8 h-8 text-[#ff9a47] mb-3 mx-auto" />
                  <div className="text-3xl font-bold mb-1 text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
        </div>

        {/* Static scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center p-2">
            <div className="w-1 h-2 bg-gray-500 rounded-full" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-full px-4 py-2 mb-4 shadow-sm">
              <span className="text-sm text-[#ff9a47] font-medium">How It Works</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Simple. Fast. Effective.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="relative bg-white/60 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 hover:bg-white/80 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Step number */}
                  <div className="absolute top-4 right-4 text-6xl font-bold opacity-5 group-hover:opacity-10 transition-opacity text-gray-900">
                    {index + 1}
                  </div>

                  <div className={`relative w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>

                  {/* Connecting line */}
                  {index < howItWorksSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-300 to-transparent" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Reports - Bento Grid */}
      <section id="community" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-white/30">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-full px-4 py-2 mb-4 shadow-sm">
              <span className="text-sm text-[#ff9a47] font-medium">Community</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              Sample Reports
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See what citizens are reporting in real-time across various communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            {issueCards.map((issue, index) => {
              const sizeClass = issue.size === 'large' 
                ? 'md:col-span-2 md:row-span-2' 
                : issue.size === 'medium'
                ? 'md:col-span-2'
                : 'md:col-span-1';

              return (
                <div
                  key={index}
                  className={`${sizeClass} group cursor-pointer`}
                >
                  <div className={`relative h-full bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 hover:bg-white/90 hover:shadow-2xl transition-all duration-500 overflow-hidden`}>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ff9a47]/0 to-[#ff9a47]/7 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className={`relative h-full flex flex-col justify-between ${issue.imageUrl ? 'bg-cover bg-center rounded-2xl p-4' : ''}`} style={issue.imageUrl ? { backgroundImage: `url(${issue.imageUrl})` } : {}}>
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <Badge className={`${issue.statusColor} text-white border-0 shadow-lg`}>
                            {issue.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{issue.time}</span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-[#ff9a47] group-hover:text-shadow-zinc-950 transition-colors">
                          {issue.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{issue.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <div>
              <LinkComponent to='/community' className="bg-white/60 backdrop-blur-sm hover:bg-white/80 text-gray-900 px-8 py-6 rounded-full border border-gray-200/50 shadow-lg">
                View All Reports
                <ArrowRight className="ml-2 w-5 h-5" />
              </LinkComponent>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="impact" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="relative bg-gradient-to-br from-[#ff9a47] to-orange-500 backdrop-blur-xl border border-orange-400/30 rounded-[3rem] p-12 md:p-16 overflow-hidden shadow-2xl">
            {/* Static background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:2rem_2rem]" />
            
            <div className="relative text-center">
              <div className="inline-block mb-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border border-white/30">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join our growing community of active citizens and help build a better tomorrow.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div>
                  <LinkComponent to="/report" className="bg-white text-[#ff9a47] hover:bg-gray-50 px-8 py-6 rounded-full shadow-2xl border-0 font-semibold">
                    Get Started Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </LinkComponent>
                </div>
                <div>
                  <LinkComponent className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-6 rounded-full border border-white/30">
                    Learn More
                  </LinkComponent>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8 mt-20 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#ff9a47] to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-[#ff9a47]/40">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-[#ff9a47] to-orange-500 bg-clip-text text-transparent">
                  Jagruk
                </span>
              </div>
              <p className="text-gray-600 max-w-sm">
                Empowering citizens to report issues and build better communities through collective action.
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["Home", "Community", "About", "Contact"].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-sm text-gray-600 hover:text-[#ff9a47] transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="text-sm">support@jagruk.com</li>
                <li className="text-sm">+91 1234567890</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              &copy; 2025 Jagruk. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <a key={item} href="#" className="text-gray-600 hover:text-[#ff9a47] transition-colors text-sm">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
