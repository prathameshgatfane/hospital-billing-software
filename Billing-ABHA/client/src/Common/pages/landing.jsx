import React from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  BarChart3, 
  Shield, 
  Zap, 
  Users,
  CreditCard,
  FileText,
  Smartphone,
  Globe,
  Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../User/layouts/MainLayout';

const Landing = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Process invoices and payments in seconds with our optimized engine"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bank-Level Security",
      description: "Enterprise-grade security with 256-bit encryption and GDPR compliance"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Smart Analytics",
      description: "Real-time insights and forecasting to grow your business"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Currency",
      description: "Bill clients worldwide with automatic currency conversion"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile First",
      description: "Full-featured mobile app for billing on the go"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Role-based access control for your entire team"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small businesses",
      features: [
        "Up to 100 invoices/month",
        "Basic reporting",
        "Email support",
        "1 user account",
        "Mobile app access"
      ],
      highlighted: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Best for growing companies",
      features: [
        "Unlimited invoices",
        "Advanced analytics",
        "Priority support",
        "5 user accounts",
        "API access",
        "Custom branding"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Unlimited users",
        "Dedicated account manager",
        "SLA guarantee",
        "On-premise deployment",
        "Custom integrations"
      ],
      highlighted: false
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechFlow Inc.",
      content: "Makvid reduced our billing time by 70%. The automation features are incredible!",
      company: "Building"
    },
    {
      name: "Michael Chen",
      role: "CFO, RetailPlus",
      content: "Switching to Makvid saved us over $15,000 annually in administrative costs.",
      company: "CreditCard"
    },
    {
      name: "Elena Rodriguez",
      role: "Operations Manager, Global Services",
      content: "The multi-currency support transformed our international billing process.",
      company: "Globe"
    }
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-gray-50 to-white">

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-red-50 rounded-full mb-6">
            <span className="text-red-600 font-medium">New</span>
            <span className="mx-2">•</span>
            <span className="text-gray-600">AI-powered expense tracking now available</span>
            <ArrowRight className="w-4 h-4 ml-2 text-red-600" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Modern Billing
            <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent"> Software</span>
            That Scales
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Makvid automates your invoicing, expense tracking, and financial reporting. 
            Join 10,000+ businesses that trust us with their billing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => navigate('/register')} className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:-translate-y-1 shadow-2xl hover:shadow-2xl flex items-center">
              Start 14-Day Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-red-300 hover:bg-red-50 transition-all duration-300">
              Book a Demo
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">10K+</div>
              <div className="text-gray-600">Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">50M+</div>
              <div className="text-gray-600">Invoices Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent"> Perfect Billing</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From automated invoices to detailed financial reports, Makvid has all your billing needs covered.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-red-300 hover:shadow-2xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:from-red-100 group-hover:to-red-200 transition-all">
                  <div className="text-red-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent"> Pricing</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your business. All plans include core features.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative rounded-2xl p-8 border-2 transition-all duration-300 ${plan.highlighted ? 'border-red-500 bg-gradient-to-b from-white to-red-50 transform -translate-y-4 shadow-2xl' : 'border-gray-200 bg-white'}`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="px-4 py-1 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-full">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-end justify-center">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button onClick={() => navigate('/register')} className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 ${plan.highlighted ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Businesses
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent"> Worldwide</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about their experience with Makvid.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => {
              const IconComponent = Building; // Default icon
              return (
                <div key={index} className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                About
                <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent"> Makvid</span>
              </h2>
              <p className="text-xl text-gray-600">
                We're on a mission to simplify business billing for everyone.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    Our Story
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Founded in 2018, Makvid started with a simple goal: to make business billing effortless. 
                    We saw businesses struggling with complex, outdated billing systems and knew there had to be a better way.
                  </p>
                  <p className="text-gray-700 mb-6">
                    Today, we serve over 10,000 businesses worldwide, processing millions of invoices every month. 
                    Our team of financial experts and engineers continuously innovates to bring you the best billing experience.
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-700">50+</div>
                      <div className="text-sm text-gray-600">Team Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-700">15+</div>
                      <div className="text-sm text-gray-600">Countries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-700">24/7</div>
                      <div className="text-sm text-gray-600">Support</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-64 h-64 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl transform rotate-3"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl -rotate-6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Billing?
            </h2>
            <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
              Join thousands of businesses that have streamlined their billing with Makvid.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-red-700 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-2xl">
                Start Free Trial
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300">
                Schedule a Demo
              </button>
            </div>
            <p className="text-red-200 mt-8 text-sm">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      </div>
    </MainLayout>
  );
};

export default Landing;