/**
 * Home Page
 *
 * This is the landing page. Navigate users to the schedule page.
 */

import { DarkModeToggle } from '@/components/ui/DarkModeToggle';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Dark Mode Toggle in top right */}
      <div className="absolute top-6 right-6">
        <DarkModeToggle />
      </div>

      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
          Hospital Appointment Scheduler
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">
          Welcome to the appointment scheduling system. View and manage doctor schedules
          for our hospital.
        </p>

        <div className="space-y-4">
          <Link
            href="/schedule"
            className="block w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
          >
            Go to Schedule
          </Link>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 transition-colors">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">
              Available Doctors:
            </h2>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 transition-colors">
              <li>• Dr. Sarah Chen - Cardiology</li>
              <li>• Dr. Michael Rodriguez - Pediatrics</li>
              <li>• Dr. Emily Johnson - General Practice</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
