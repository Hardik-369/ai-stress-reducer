import Link from 'next/link';
import { ArrowRight, Brain, MessageCircle, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-bg via-white to-cream-bg">
      {/* Navigation Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-light-bronze/20 z-50">
        <div className="container-golden">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-bronze rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-dark-brown">AI Stress Reducer</span>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="btn-secondary">
                Log In
              </Link>
              <Link href="/signup" className="btn-primary">
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-cream-bg transition-colors">
              <div className="w-6 h-0.5 bg-dark-brown mb-1.5"></div>
              <div className="w-6 h-0.5 bg-dark-brown mb-1.5"></div>
              <div className="w-6 h-0.5 bg-dark-brown"></div>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-padding pt-32">
        <div className="container-golden">
          <div className="max-w-4xl mx-auto text-center">
            {/* Golden ratio layout: 1:1.618 */}
            <div className="grid md:grid-cols-[1.618fr_1fr] gap-12 items-center">
              {/* Main Content */}
              <div className="text-left">
                <h1 className="text-4xl md:text-6xl font-bold text-dark-brown mb-6 leading-tight">
                  Transform Your
                  <span className="text-gradient"> Stress</span>
                  <br />
                  Into Inner Peace
                </h1>
                <p className="text-lg md:text-xl text-text-brown mb-8 leading-relaxed">
                  Experience personalized stress management through AI-powered assessments,
                  compassionate chat support, and delightful 3D companions who guide your journey
                  to mental wellness.
                </p>

                {/* Call-to-Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link href="/assessment" className="btn-primary text-center group">
                    Start Assessment
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/signup" className="btn-secondary text-center">
                    Create Free Account
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center space-x-8 text-sm text-text-brown/70">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-sandy-orange rounded-full"></div>
                    <span>Science-based</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-sandy-orange rounded-full"></div>
                    <span>100% Private</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-sandy-orange rounded-full"></div>
                    <span>Free to Start</span>
                  </div>
                </div>
              </div>

              {/* Visual Element */}
              <div className="hidden md:flex justify-center">
                <div className="relative w-full max-w-sm aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-bronze/20 to-sandy-orange/20 rounded-3xl transform rotate-6"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-light-bronze/10 to-primary-bronze/10 rounded-3xl transform -rotate-6"></div>
                  <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-light-bronze/20">
                    <div className="w-full h-full flex items-center justify-center">
                      <Brain className="w-24 h-24 text-primary-bronze" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white/50">
        <div className="container-golden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-dark-brown mb-4">
                Your Complete Wellness Journey
              </h2>
              <p className="text-lg text-text-brown max-w-2xl mx-auto">
                Every aspect designed with care to support your mental health goals
              </p>
            </div>

            {/* Feature Cards - Golden ratio 3-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Assessment Feature */}
              <div className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-primary-bronze/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-bronze/20 transition-colors">
                  <Brain className="w-7 h-7 text-primary-bronze" />
                </div>
                <h3 className="text-xl font-semibold text-dark-brown mb-4">
                  Smart Assessment
                </h3>
                <p className="text-text-brown mb-6 leading-relaxed">
                  Evidence-based DASS-21 questionnaire that adapts to your progress and provides
                  accurate stress, anxiety, and depression scoring.
                </p>
                <Link href="/assessment" className="text-primary-bronze font-medium hover:text-light-bronze transition-colors inline-flex items-center">
                  Take Assessment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              {/* Chat Feature */}
              <div className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-sandy-orange/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sandy-orange/20 transition-colors">
                  <MessageCircle className="w-7 h-7 text-sandy-orange" />
                </div>
                <h3 className="text-xl font-semibold text-dark-brown mb-4">
                  AI Chat Support
                </h3>
                <p className="text-text-brown mb-6 leading-relaxed">
                  24/7 compassionate AI assistant providing personalized stress management
                  techniques and emotional support.
                </p>
                <Link href="/chat" className="text-sandy-orange font-medium hover:text-primary-bronze transition-colors inline-flex items-center">
                  Start Chatting
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              {/* Characters Feature */}
              <div className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-light-bronze/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-light-bronze/20 transition-colors">
                  <Sparkles className="w-7 h-7 text-light-bronze" />
                </div>
                <h3 className="text-xl font-semibold text-dark-brown mb-4">
                  3D Companions
                </h3>
                <p className="text-text-brown mb-6 leading-relaxed">
                  Unlock delightful 3D characters who celebrate your progress and make
                  stress management engaging and fun.
                </p>
                <Link href="/characters" className="text-light-bronze font-medium hover:text-primary-bronze transition-colors inline-flex items-center">
                  Meet Characters
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-golden">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary-bronze to-sandy-orange rounded-3xl p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands who have already transformed their stress into strength with
                our personalized approach to mental wellness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup" className="bg-white text-primary-bronze px-8 py-4 rounded-2xl font-semibold hover:bg-cream-bg transition-colors inline-flex items-center justify-center">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/demo" className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center">
                  View Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-brown text-cream-bg py-12">
        <div className="container-golden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-sandy-orange rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-lg">AI Stress Reducer</span>
              </div>
              <p className="text-cream-bg/80 leading-relaxed">
                Transforming stress management through personalized AI-powered solutions,
                compassionate support, and engaging wellness experiences.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-cream-bg/80">
                <li><Link href="/assessment" className="hover:text-sandy-orange transition-colors">Assessment</Link></li>
                <li><Link href="/chat" className="hover:text-sandy-orange transition-colors">Chat Support</Link></li>
                <li><Link href="/characters" className="hover:text-sandy-orange transition-colors">3D Characters</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-cream-bg/80">
                <li><Link href="/about" className="hover:text-sandy-orange transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-sandy-orange transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-sandy-orange transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-cream-bg/20 mt-8 pt-8 text-center text-cream-bg/60">
            <p>&copy; 2024 AI Stress Reducer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
