"use client";

import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-bold">Matcha</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:underline">
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium hover:underline"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium hover:underline"
            >
              Testimonials
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:underline">
              Login
            </Link>
            <Link to="/login">
              <Button className="bg-rose-500 hover:bg-rose-600">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Find Your Perfect Match
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Connect with like-minded individuals based on shared
                    interests, location, and compatibility.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/login">
                    <Button className="bg-rose-500 hover:bg-rose-600">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline">Learn More</Button>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  alt="Dating App"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                  src="/placeholder.svg?height=550&width=750"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Features
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover what makes our dating platform unique
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-rose-100 p-3">
                  <Users className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold">Smart Matching</h3>
                <p className="text-center text-gray-500">
                  Our algorithm suggests profiles based on proximity, shared
                  interests, and compatibility.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-rose-100 p-3">
                  <MessageCircle className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold">Real-time Chat</h3>
                <p className="text-center text-gray-500">
                  Connect with your matches through our seamless real-time
                  messaging system.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-rose-100 p-3">
                  <MapPin className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold">Location-based</h3>
                <p className="text-center text-gray-500">
                  Find matches in your area with our precise location tracking
                  feature.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-rose-100 p-3">
                  <Search className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold">Advanced Search</h3>
                <p className="text-center text-gray-500">
                  Filter profiles by age, location, interests, and more to find
                  your ideal match.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-rose-100 p-3">
                  <Heart className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold">Interest Tags</h3>
                <p className="text-center text-gray-500">
                  Connect with people who share your passions through our
                  interest tag system.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-rose-100 p-3">
                  <Shield className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold">Secure Platform</h3>
                <p className="text-center text-gray-500">
                  Your data is protected with our advanced security measures and
                  privacy controls.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  How It Works
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Finding your perfect match is easy with our simple process
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold">Create Your Profile</h3>
                <p className="text-center text-gray-500">
                  Sign up and complete your profile with photos, interests, and
                  preferences.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold">Discover Matches</h3>
                <p className="text-center text-gray-500">
                  Browse suggested profiles or use our advanced search to find
                  potential matches.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold">Connect & Chat</h3>
                <p className="text-center text-gray-500">
                  Like profiles and start chatting when you match with someone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Success Stories
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from couples who found love on our platform
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-start gap-4 rounded-lg border p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    alt="User"
                    className="rounded-full"
                    height="40"
                    src="/placeholder.svg?height=40&width=40"
                    style={{
                      aspectRatio: "40/40",
                      objectFit: "cover",
                    }}
                    width="40"
                  />
                  <div>
                    <h4 className="text-lg font-bold">Sarah & Michael</h4>
                    <p className="text-sm text-gray-500">Matched 2 years ago</p>
                  </div>
                </div>
                <p className="text-gray-500">
                  "We matched based on our shared love for hiking and
                  photography. After chatting for a week, we met for coffee and
                  instantly connected. Now we're engaged!"
                </p>
              </div>
              <div className="flex flex-col items-start gap-4 rounded-lg border p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    alt="User"
                    className="rounded-full"
                    height="40"
                    src="/placeholder.svg?height=40&width=40"
                    style={{
                      aspectRatio: "40/40",
                      objectFit: "cover",
                    }}
                    width="40"
                  />
                  <div>
                    <h4 className="text-lg font-bold">David & Emma</h4>
                    <p className="text-sm text-gray-500">Matched 1 year ago</p>
                  </div>
                </div>
                <p className="text-gray-500">
                  "The location-based matching was perfect for us. We lived just
                  10 minutes apart but had never met. Thanks to Matcha, we found
                  each other and haven't looked back."
                </p>
              </div>
              <div className="flex flex-col items-start gap-4 rounded-lg border p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    alt="User"
                    className="rounded-full"
                    height="40"
                    src="/placeholder.svg?height=40&width=40"
                    style={{
                      aspectRatio: "40/40",
                      objectFit: "cover",
                    }}
                    width="40"
                  />
                  <div>
                    <h4 className="text-lg font-bold">Alex & Jamie</h4>
                    <p className="text-sm text-gray-500">
                      Matched 6 months ago
                    </p>
                  </div>
                </div>
                <p className="text-gray-500">
                  "I was skeptical about online dating, but the interest tag
                  system helped me find someone who shares my passion for indie
                  music and art. We're now planning to move in together."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-rose-500 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Find Your Match?
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of singles who have found meaningful
                  connections on our platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="bg-white text-rose-500 hover:bg-gray-100">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-bold">Matcha</span>
          </div>
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            © 2024 Matcha. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm font-medium hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="text-sm font-medium hover:underline">
              Terms of Service
            </a>
            <a href="#" className="text-sm font-medium hover:underline">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
