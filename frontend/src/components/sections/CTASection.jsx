import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { ArrowRight } from 'lucide-react'

export const CTASection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary-500 via-orange-500 to-primary-600">
      <div className="max-w-4xl mx-auto text-center page-enter">
        <h2 className="text-5xl md:text-6xl font-poppins font-bold text-white mb-6 leading-tight">
          Ready to Transform Your Dining?
        </h2>

        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of users already enjoying smarter dining and booking. Start your free trial today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Get Started Free
              <ArrowRight size={20} />
            </Button>
          </Link>

          <button className="px-8 py-3 rounded-lg bg-white/20 text-white font-semibold hover:bg-white/30 transition-smooth border-2 border-white">
            Watch Demo (2 min)
          </button>
        </div>

        {/* Trust badges */}
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-center items-center gap-8 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔒</span>
            <span>Secure & Privacy-First</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span>Lightning Fast</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌍</span>
            <span>Available Worldwide</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
