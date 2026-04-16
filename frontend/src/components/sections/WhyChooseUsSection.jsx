import React from 'react'
import { Card, Badge } from '../ui/Card'
import { Zap, Smile, Gauge } from 'lucide-react'

export const WhyChooseUsSection = () => {
  const reasons = [
    {
      icon: Zap,
      title: 'Faster Booking',
      description: 'Reserve your table in seconds, not minutes. Instant confirmations and real-time availability.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Smile,
      title: 'Better Experience',
      description: 'Seamless interface designed with users in mind. Intuitive and delightful at every step.',
      color: 'from-primary-500 to-orange-500',
    },
    {
      icon: Gauge,
      title: 'Smart Management',
      description: 'For restaurants: analytics, staff coordination, and customer insights all in one place.',
      color: 'from-secondary-400 to-teal-500',
    },
  ]

  return (
    <section id="why-us" className="py-20 px-4 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 page-enter">
          <Badge variant="secondary" size="md" className="mb-4">💡 Benefits</Badge>
          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-neutral-900 mb-6">
            Why Choose EasyDine?
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Built for both diners and restaurant owners. The platform that gets out of your way.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, i) => {
            const Icon = reason.icon
            return (
              <Card
                key={i}
                className="h-full hover:shadow-xl transition-smooth hover:scale-105 border-2 border-transparent hover:border-primary-500"
                isHoverable
              >
                {/* Icon */}
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${reason.color} flex items-center justify-center mb-6 text-white shadow-lg mx-auto`}
                >
                  <Icon size={40} />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-poppins font-bold text-center text-neutral-900 mb-4">
                  {reason.title}
                </h3>
                <p className="text-neutral-600 text-center leading-relaxed">
                  {reason.description}
                </p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUsSection
