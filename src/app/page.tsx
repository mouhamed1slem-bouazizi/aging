'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Upload, Clock, Download, Shield, Zap, ArrowRight } from 'lucide-react';
import { AGE_CATEGORIES, APP_CONFIG } from '@/lib/constants';

export default function HomePage() {
  const features = [
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Upload from your gallery or capture a live photo with your camera',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered',
      description: 'Advanced AI technology creates realistic age transformations',
    },
    {
      icon: Clock,
      title: 'Instant Results',
      description: 'Get your transformed image in seconds, not minutes',
    },
    {
      icon: Download,
      title: 'Download & Share',
      description: 'Save your results or share directly to social media',
    },
    {
      icon: Shield,
      title: 'Private & Secure',
      description: 'Your photos are processed securely and never stored',
    },
    {
      icon: Zap,
      title: 'Mobile Friendly',
      description: 'Works perfectly on all devices - phone, tablet, or desktop',
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Powered by AI</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              See Yourself at
              <span className="block bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Any Age
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10">
              {APP_CONFIG.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/transform"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-lg font-semibold rounded-full hover:shadow-xl hover:shadow-purple-300/50 transition-all hover:-translate-y-1"
              >
                Try It Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 text-lg font-semibold rounded-full hover:border-purple-300 hover:bg-purple-50 transition-all"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          {/* Age Categories Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 flex flex-wrap justify-center gap-4"
          >
            {AGE_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex flex-col items-center gap-2 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <span className="text-4xl">{category.icon}</span>
                <span className="text-sm font-medium text-gray-700">{category.label}</span>
                <span className="text-xs text-gray-400">{category.ageRange}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
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
                description: 'Take a selfie or upload an existing photo from your gallery',
              },
              {
                step: '02',
                title: 'Choose an Age',
                description: 'Select from Baby, Young, Adult, Old, or Elderly',
              },
              {
                step: '03',
                title: 'Get Your Result',
                description: 'Download or share your AI-transformed image',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative p-8 bg-gray-50 rounded-3xl"
              >
                <span className="text-6xl font-bold text-purple-100">{item.step}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose {APP_CONFIG.name}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The best AI-powered age transformation experience
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
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to See Your Future Self?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              It's free, fast, and fun. No sign-up required.
            </p>
            <Link
              href="/transform"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-600 text-lg font-semibold rounded-full hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Start Transforming
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
