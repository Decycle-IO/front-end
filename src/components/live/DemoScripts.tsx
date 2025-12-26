import React from 'react';
import { motion } from 'framer-motion';

interface DemoScriptsProps {}

const DemoScripts: React.FC<DemoScriptsProps> = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Demo Scripts</h2>
        
        {/* Elevator Pitch */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">30-Second Elevator Pitch</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">🌍 For Everyone - Making Environmental Action Fun</h4>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-gray-700 leading-relaxed mb-3">
                  "Hey! This is <strong>Trash-Cannes</strong> - we're proving that helping the environment can be gamified! 
                  Just tap your event badge here, drop in a recyclable item, and earn points to climb our live leaderboard!"
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-blue-700 mb-2">🎯 Key Points:</h5>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• Items go to actual recycling facilities</li>
                  <li>• Instant feedback and points system</li>
                  <li>• Live leaderboard creates competition</li>
                  <li>• Simple NFC tap - no app downloads</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-blue-700 mb-2">💫 Demo Flow:</h5>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• "Try it out - just tap your badge here"</li>
                  <li>• "Check the leaderboard - see where you rank"</li>
                  <li>• "Unlock achievements for cool rewards"</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Demo */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">5-Minute Detailed Walkthrough</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-semibold text-green-800 mb-4">🎮 For Engaged Visitors</h4>
            <div className="space-y-6">
              {/* The Problem */}
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h5 className="font-medium text-green-700 mb-2">1. The Problem (45 seconds)</h5>
                <p className="text-sm text-green-600 mb-2">
                  "Recycling is important, but it's usually boring and you never see the results. 
                  Most people want to recycle more, but there's no immediate feedback or reward."
                </p>
                <p className="text-sm text-green-600">
                  "We thought - what if recycling felt more like playing a game? What if you got instant feedback and could compete with friends?"
                </p>
                <p className="text-xs text-green-500 mt-2">
                  <strong>Connect:</strong> "Anyone here ever forget to recycle because it felt like a chore?"
                </p>
              </div>

              {/* The Solution */}
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h5 className="font-medium text-green-700 mb-2">2. Live Demo (2 minutes)</h5>
                <div className="space-y-2 text-sm text-green-600">
                  <p><strong>Step 1:</strong> "I tap my badge here - the system knows who I am instantly."</p>
                  <p><strong>Step 2:</strong> "Drop in this bottle - sensors detect it's plastic and award points automatically."</p>
                  <p><strong>Step 3:</strong> "Check the leaderboard - I just moved up! Competition makes it more engaging."</p>
                  <p><strong>Step 4:</strong> "Achievement unlocked! I can redeem this for actual merchandise at the recycling center."</p>
                </div>
                <p className="text-xs text-green-500 mt-2">
                  <strong>Show:</strong> Live deposit, point to leaderboard changes, show achievement popup
                </p>
              </div>

              {/* The Tech */}
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h5 className="font-medium text-green-700 mb-2">3. How It Works (1.5 minutes)</h5>
                <div className="space-y-2 text-sm text-green-600">
                  <p>"The smart trash can automatically detects what you put in and records it on the blockchain. 
                  Your event badge is linked to a wallet, so no app downloads or complicated setup."</p>
                  <p>"When the bin gets full, someone can pay $10 to buy the contents, take them to our recycling center, 
                  and get $15 back - creating economic incentives for proper recycling."</p>
                  <p>"Everything is transparent and verifiable. You can see exactly where your items go and track your impact over time."</p>
                </div>
              </div>

              {/* The Vision */}
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h5 className="font-medium text-green-700 mb-2">4. Bigger Applications (30 seconds)</h5>
                <p className="text-sm text-green-600">
                  "This same approach could work in offices, schools, or entire cities. Imagine neighborhood recycling competitions 
                  or workplace sustainability challenges. The technology makes it easy to track and reward good behavior at scale."
                </p>
                <p className="text-xs text-green-500 mt-2">
                  <strong>Ask:</strong> "Where else could you see this kind of system being useful?"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Talking Points */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Talking Points</h3>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h4 className="font-semibold text-purple-800 mb-4">💡 For Deeper Conversations</h4>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">🎮 Gamification Works</h5>
                <p className="text-sm text-purple-600 mb-2">
                  "Games are powerful at motivating behavior. Instead of using that psychology to sell products or increase screen time, 
                  we're applying it to recycling. Every point represents actual items processed at recycling facilities."
                </p>
                <p className="text-xs text-purple-500">
                  <strong>Key insight:</strong> "The same mechanics that make mobile games engaging can make good habits stick."
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">🤝 Community Effect</h5>
                <p className="text-sm text-purple-600 mb-2">
                  "Individual recycling feels insignificant, but seeing others participate makes it feel worthwhile. 
                  The leaderboard shows you're part of a group effort, which encourages continued participation."
                </p>
                <p className="text-xs text-purple-500">
                  <strong>Social proof:</strong> "When people see others recycling, they're more likely to do it too."
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">🔍 Verifiable Impact</h5>
                <p className="text-sm text-purple-600 mb-2">
                  "People are skeptical of environmental claims because they can't verify them. Our blockchain tracking 
                  lets you see exactly where your items go and confirm they reach recycling facilities."
                </p>
                <p className="text-xs text-purple-500">
                  <strong>Trust factor:</strong> "Transparency increases participation because people can verify their impact."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Common Questions & Answers */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Questions & Answers</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">Q: "Does this actually help the environment?"</h5>
                <p className="text-sm text-gray-600">
                  A: "Yes - every item goes to actual recycling facilities. But the bigger impact is behavioral: 
                  when recycling feels rewarding and social, people do it more consistently. The gamification 
                  creates habits that extend beyond this event."
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">Q: "Why not just recycle normally?"</h5>
                <p className="text-sm text-gray-600">
                  A: "Normal recycling has low engagement rates. Adding instant feedback, competition, and rewards 
                  significantly increases participation. When something feels like a game, people are more likely 
                  to stick with it."
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">Q: "Could this work in other places?"</h5>
                <p className="text-sm text-gray-600">
                  A: "Definitely. The same principles could apply to offices, schools, or neighborhoods. 
                  Any behavior you want to encourage can benefit from instant feedback, tracking, and social competition."
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">Q: "What's the technical implementation?"</h5>
                <p className="text-sm text-gray-600">
                  A: "Smart contracts handle the logic, NFC readers identify users, sensors detect item types, 
                  and the frontend shows real-time updates. The blockchain provides transparency and permanent records 
                  of environmental impact."
                </p>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default DemoScripts;
