'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, Upload, Clock, Download, Shield, Zap, ArrowRight,
  Wand2, Users, Palette, ShoppingBag, Smile, Shirt, Glasses, Heart
} from 'lucide-react';
import { APP_CONFIG } from '@/lib/constants';

export default function HomePage() {
  const features = [
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Upload from gallery or capture live with your camera',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered',
      description: 'Advanced AI technology for realistic transformations',
    },
    {
      icon: Clock,
      title: 'Instant Results',
      description: 'Get transformed images in seconds',
    },
    {
      icon: Download,
      title: 'Download & Share',
      description: 'Save results or share to social media',
    },
    {
      icon: Shield,
      title: 'Private & Secure',
      description: 'Photos processed securely, never stored',
    },
    {
      icon: Zap,
      title: 'Mobile Friendly',
      description: 'Works perfectly on all devices',
    },
  ];

  const availableEffects = [
    {
      icon: '⏳',
      title: 'Age Transformation',
      description: 'See yourself younger or older',
      status: 'Available',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: '⚧️',
      title: 'Gender Swap',
      description: 'Transform your appearance',
      status: 'Available',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '✨',
      title: 'Beauty Filters',
      description: 'Enhance your natural beauty',
      status: 'Available',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: '👗',
      title: 'Virtual Try-On',
      description: 'Try clothes before buying',
      status: 'Coming Soon',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: '💄',
      title: 'Makeup Artist',
      description: 'Try different makeup styles',
      status: 'Coming Soon',
      gradient: 'from-red-500 to-pink-500',
    },
    {
      icon: '💇',
      title: 'Hairstyle Changer',
      description: 'Experiment with new hairstyles',
      status: 'Coming Soon',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: '👄',
      title: 'Lip Color',
      description: 'Try different lipstick colors',
      status: 'Available',
      gradient: 'from-rose-500 to-red-500',
    },
    {
      icon: '🎨',
      title: 'Artistic Filters',
      description: 'Transform into art styles',
      status: 'Coming Soon',
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Powered by Advanced AI Technology</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Photos
              <span className="block bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                With AI Magic
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
              {APP_CONFIG.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/transform"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-lg font-semibold rounded-full hover:shadow-xl hover:shadow-purple-300/50 transition-all hover:-translate-y-1"
              >
                Start Creating
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 text-lg font-semibold rounded-full hover:border-purple-300 hover:bg-purple-50 transition-all"
              >
                Explore Features
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { value: '20+', label: 'AI Effects' },
              { value: 'Instant', label: 'Processing' },
              { value: '100%', label: 'Free' },
              { value: 'Secure', label: 'Privacy' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Available Effects Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful AI Effects
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your photos with our growing collection of AI-powered effects
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableEffects.map((effect, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative group p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-100 hover:border-transparent hover:shadow-xl transition-all"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${effect.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
                
                {/* Status badge */}
                <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${
                  effect.status === 'Available' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {effect.status}
                </div>

                {/* Icon */}
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                  {effect.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {effect.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600">
                  {effect.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your photos in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Upload Your Photo',
                description: 'Take a selfie or upload from your gallery',
                icon: Upload,
              },
              {
                step: '02',
                title: 'Choose Effect',
                description: 'Select from 20+ AI-powered transformations',
                icon: Wand2,
              },
              {
                step: '03',
                title: 'Get Your Result',
                description: 'Download or share your transformed image',
                icon: Download,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative p-8 bg-white rounded-3xl shadow-lg"
              >
                <div className={`absolute top-8 right-8 w-16 h-16 bg-gradient-to-br ${
                  index === 0 ? 'from-purple-500 to-pink-500' :
                  index === 1 ? 'from-blue-500 to-cyan-500' :
                  'from-pink-500 to-rose-500'
                } rounded-2xl flex items-center justify-center`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <span className="text-6xl font-bold text-purple-50">{item.step}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose {APP_CONFIG.name}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The most advanced AI photo transformation platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-3xl shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Photos?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              It's free, fast, and fun. No sign-up required. Start creating now!
            </p>
            <Link
              href="/transform"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-600 text-lg font-semibold rounded-full hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Start Transforming Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
