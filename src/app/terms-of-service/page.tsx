
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="space-y-6 prose prose-invert max-w-none">
            <p>
              Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the HoopsCoach ("the App", "us", "we", or "our") application.
            </p>
            <p>
              Your access to and use of the App is conditioned upon your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who wish to access or use the App.
            </p>

            <h2 className="text-xl font-bold">1. Accounts</h2>
            <p>
              When you create an account with us, you guarantee that you are above the age of 13 and that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the App.
            </p>

            <h2 className="text-xl font-bold">2. User Conduct and Content</h2>
            <p>
              You are responsible for any content you post to the App, including court locations, photos, and messages ("User Content"). You grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such User Content in connection with the App. You agree not to post content that is unlawful, offensive, or otherwise objectionable.
            </p>

            <h2 className="text-xl font-bold">3. Disclaimer of Warranties</h2>
            <p>
              <strong>The advice, workouts, and meal plans provided by this App are for informational purposes only and do not constitute professional medical, nutritional, or fitness advice. You should consult with a healthcare professional before beginning any new fitness or nutrition program. You assume all risks associated with your use of the App.</strong>
            </p>
            <p>
              The App is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, express or implied, regarding the operation or availability of the App.
            </p>

            <h2 className="text-xl font-bold">4. Limitation of Liability</h2>
            <p>
              In no event shall HoopsCoach, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the App.
            </p>

            <h2 className="text-xl font-bold">5. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-xl font-bold">6. Changes</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms of Service on this page.
            </p>

            <h2 className="text-xl font-bold">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at: legal@hoopscoach.app.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
