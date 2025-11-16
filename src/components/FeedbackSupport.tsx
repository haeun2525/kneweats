import { useState } from 'react';
import { Send, ChevronDown, ChevronUp, MessageSquare, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

const faqs = [
  {
    question: 'How do I update my allergen information?',
    answer: 'Go to the Account page and tap the edit icon next to "Allergies & Restrictions". You can add or remove allergens from your profile.',
  },
  {
    question: 'What does "Halal-friendly" mean?',
    answer: 'Restaurants marked as Halal-friendly follow Islamic dietary guidelines and do not serve pork or alcohol. However, we recommend verifying with the restaurant directly.',
  },
  {
    question: 'How accurate is the allergen information?',
    answer: 'We gather information from restaurant menus and user reports. Always verify with restaurant staff, especially for severe allergies. Use our Korean phrases to ask directly!',
  },
  {
    question: 'Can I add restaurants that are not listed?',
    answer: 'Yes! Use the Feedback section below to suggest new restaurants. We review all suggestions and add verified restaurants regularly.',
  },
  {
    question: 'How do I use the Korean phrase tool?',
    answer: 'When viewing a menu item, tap "Ask in Korean" to see the translation. You can also access the tool from your Account page to practice any allergen phrase.',
  },
  {
    question: 'How do I save favorite restaurants?',
    answer: 'Tap the heart icon on any restaurant detail page to save it to your Favorites. Access all your saved restaurants from the Favorites tab.',
  },
];

export function FeedbackSupport() {
  const [activeTab, setActiveTab] = useState<'support' | 'feedback'>('support');
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedbackText('');
      setEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
        <div className="max-w-md mx-auto">
          <h1 className="text-white mb-2">Help & Feedback</h1>
          <p className="text-sm opacity-90">
            We're here to help you
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-md mx-auto px-4 pt-4">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-full mb-6">
          <button
            onClick={() => setActiveTab('support')}
            className={`flex-1 py-2 px-4 rounded-full text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'support'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            <HelpCircle className="size-4" />
            Support
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex-1 py-2 px-4 rounded-full text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'feedback'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            <MessageSquare className="size-4" />
            Feedback
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pb-6">
        {activeTab === 'support' ? (
          <>
            {/* FAQ Section */}
            <div className="space-y-3 mb-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-4 text-left flex items-start justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-800 pr-4">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="size-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="size-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact support */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-6 text-white">
              <h3 className="text-white mb-2">Still need help?</h3>
              <p className="text-sm opacity-90 mb-4">
                Can't find what you're looking for? Send us a message using the Feedback tab.
              </p>
              <Button
                onClick={() => setActiveTab('feedback')}
                className="w-full rounded-full bg-white text-orange-600 hover:bg-gray-100"
              >
                Go to Feedback
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Feedback Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <h2 className="text-gray-800 mb-4">Send us your feedback</h2>
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✓</span>
                  </div>
                  <p className="text-gray-800 mb-2">Thank you!</p>
                  <p className="text-sm text-gray-500">
                    Your feedback has been submitted
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">
                      Email (optional)
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">
                      Your feedback
                    </label>
                    <Textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Tell us what you think, report issues, or suggest new features..."
                      rows={6}
                      required
                      className="rounded-xl resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-full bg-orange-500 hover:bg-orange-600"
                  >
                    <Send className="size-4 mr-2" />
                    Send Feedback
                  </Button>
                </form>
              )}
            </div>

            {/* Quick feedback options */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-700 mb-3">Quick feedback</h3>
              <div className="space-y-2">
                <button className="w-full p-3 bg-gray-50 rounded-xl text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  🏪 Suggest a new restaurant
                </button>
                <button className="w-full p-3 bg-gray-50 rounded-xl text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  📝 Report incorrect information
                </button>
                <button className="w-full p-3 bg-gray-50 rounded-xl text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  💡 Request a new feature
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}