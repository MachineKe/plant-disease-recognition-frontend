import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <HeroSection />
      <Dashboard />
      {/* Footer */}
      <footer className="mt-auto border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-gray-400">
              <span>© {new Date().getFullYear()} PlantGuard · AI-Powered AgTech</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
                Model running in demo mode
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <a href="#" className="text-gray-400 hover:text-[#2E7D32] transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-[#2E7D32] transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-[#2E7D32] transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
