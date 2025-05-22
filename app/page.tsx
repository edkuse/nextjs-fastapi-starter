"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <div className="flex-1 md:ml-[240px]">
        <Header />
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Next.js + FastAPI Starter
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                    A modern full-stack application with Microsoft Entra authentication and PostgreSQL database.
                  </p>
                </div>
                <div className="space-x-4">
                  <Link href="/dashboard">
                    <Button>Get Started</Button>
                  </Link>
                  <Link
                    href="https://github.com/edkuse/nextjs-fastapi-starter.git"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">GitHub</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
            <div className="container px-4 md:px-6">
              <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
                <div className="space-y-4">
                  <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">Frontend</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Next.js Application</h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Built with the latest Next.js features including App Router, Server Components, and more.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">Backend</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">FastAPI Backend</h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    High-performance Python API with PostgreSQL database and Microsoft Entra authentication.
                  </p>
                </div>
              </div>
              <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Authentication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Secure authentication with Microsoft Entra ID (formerly Azure AD).</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Database</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>PostgreSQL database with SQLAlchemy ORM for efficient data management.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>API Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Seamless communication between frontend and backend services.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
              © 2025 FullStack App. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
