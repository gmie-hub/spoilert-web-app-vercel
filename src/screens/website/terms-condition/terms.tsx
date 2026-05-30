"use client";

import React from "react";

const TermsPage: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <article className="bg-white shadow-sm rounded-lg border border-gray-100">
        <header className="px-8 py-10 border-b border-gray-100">
          <h1 className="text-3xl font-semibold text-gray-900">Terms &amp; Conditions</h1>
          {/* <p className="mt-2 text-sm text-gray-500">Last Updated: [Insert Date]</p> */}
        </header>

        <section className="px-8 py-8 space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-medium text-gray-800">1. Introduction</h2>
            <p className="mt-2">
              Welcome to SPOILERT. By accessing or using our platform (mobile app
              and website), you agree to comply with these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">2. Definitions</h2>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li><strong>Platform:</strong> SPOILERT mobile app and website.</li>
              <li><strong>Spoylz:</strong> Courses created and shared by tutors.</li>
              <li><strong>User:</strong> Anyone who accesses the platform.</li>
              <li><strong>Tutor:</strong> A user who creates and sells Spoylz.</li>
              <li><strong>Student:</strong> A user who purchases or consumes Spoylz</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">3. Eligibility</h2>
            <p className="mt-2">You must be at least 18 years old or have parental consent to use SPOILERT.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">4. User Accounts</h2>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Users must provide accurate information when creating an account.</li>
              <li>You are responsible for maintaining the security of your account.</li>
              <li>SPOILERT reserves the right to suspend or terminate accounts for violations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">5. Platform Usage</h2>
            <p className="mt-2">You agree NOT to:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Upload illegal, harmful, or misleading content.</li>
              <li>Violate intellectual property rights.</li>
              <li>Attempt to hack, phish, or otherwise disrupt the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">6. Tutor Responsibilities</h2>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Provide accurate, lawful, and high-quality content.</li>
              <li>Deliver live sessions as scheduled and communicate changes promptly.</li>
              <li>Not engage in fraudulent or abusive activity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">7. Payments &amp; Earnings</h2>
            <p className="mt-2">Students pay to access Spoylz. Tutors earn revenue which is stored in their wallet. Withdrawals are subject to platform policies and processing times. SPOILERT may charge service fees.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">8. Refund Policy</h2>
            <p className="mt-2">Refunds may be granted under specific conditions. SPOILERT reserves the right to approve or deny refund requests based on our policies.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">9. Intellectual Property</h2>
            <p className="mt-2">All content on SPOILERT remains the property of its respective owners unless otherwise stated. Unauthorized reproduction, distribution, or use of content is prohibited.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">10. Termination</h2>
            <p className="mt-2">We may suspend or terminate your account if you violate these terms or engage in harmful behavior.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">11. Limitation of Liability</h2>
            <p className="mt-2">SPOILERT is not liable for content uploaded by users, losses resulting from platform usage, or service interruptions to the extent permitted by law.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-800">12. Changes to Terms</h2>
            <p className="mt-2">We may update these terms at any time. Continued use of the platform after changes indicates acceptance of the updated terms.</p>
          </section>

          <footer className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">If you have questions about these Terms, contact us at support@spoilert.com</p>
          </footer>
        </section>
      </article>
    </main>
  );
};

export default TermsPage;
