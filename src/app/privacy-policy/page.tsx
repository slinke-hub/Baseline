
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="space-y-6 prose prose-invert max-w-none">
            <p>
              HoopsCoach ("us", "we", or "our") operates the HoopsCoach mobile application (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>

            <h2 className="text-xl font-bold">1. Information Collection and Use</h2>
            <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
            <h3>Types of Data Collected:</h3>
            <ul>
              <li>
                <strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This includes, but is not limited to: email address, name, age, height, weight, and basketball position.
              </li>
              <li>
                <strong>Usage Data:</strong> We may collect information on how the Service is accessed and used. This may include workout progress, meals logged, and feature usage.
              </li>
              <li>
                <strong>User-Generated Content:</strong> We collect content you provide, such as court locations, photos (including "Ball is Life" selfies), and chat messages.
              </li>
            </ul>

            <h2 className="text-xl font-bold">2. Use of Data</h2>
            <p>HoopsCoach uses the collected data for various purposes:</p>
            <ul>
              <li>To provide and maintain our Service</li>
              <li>To manage your account</li>
              <li>To provide personalized workout and meal plans</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To monitor the usage of our Service and to improve it</li>
            </ul>

            <h2 className="text-xl font-bold">3. Data Storage and Security</h2>
            <p>
              Your information is stored on secure servers provided by Google Firebase. The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure.
            </p>

            <h2 className="text-xl font-bold">4. AI Features</h2>
            <p>
              Some features in our app may use generative AI models to provide suggestions (e.g., meal plan adjustments). The data you provide to these features (such as your goals and progress) may be sent to third-party AI service providers to generate a response. We do not use this data to train the models.
            </p>

            <h2 className="text-xl font-bold">5. Your Data Rights</h2>
            <p>
              You have the right to access, update, or delete the information we have on you. You can do this at any time through your profile settings page within the app.
            </p>

            <h2 className="text-xl font-bold">6. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>

            <h2 className="text-xl font-bold">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at: privacy@hoopscoach.app.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
