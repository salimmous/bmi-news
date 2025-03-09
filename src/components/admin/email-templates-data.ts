export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const defaultEmailTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Welcome Email",
    subject: "Welcome to BMI Tracker!",
    type: "onboarding",
    content: `<h1>Welcome to BMI Tracker!</h1>
<p>Dear {{user.name}},</p>
<p>Thank you for joining BMI Tracker. We're excited to help you on your health journey!</p>
<p>With our platform, you can:</p>
<ul>
  <li>Track your BMI and weight over time</li>
  <li>Get personalized health recommendations</li>
  <li>Access professional meal and workout plans</li>
</ul>
<p>Get started by logging in and calculating your first BMI measurement.</p>
<p>Best regards,<br>The BMI Tracker Team</p>`,
    createdAt: "2023-06-01",
    updatedAt: "2023-06-01",
  },
  {
    id: "2",
    name: "Weekly Progress Report",
    subject: "Your Weekly BMI Progress Report",
    type: "report",
    content: `<h1>Your Weekly Progress Report</h1>
<p>Dear {{user.name}},</p>
<p>Here's a summary of your progress this week:</p>
<ul>
  <li>Current BMI: {{user.currentBMI}}</li>
  <li>BMI Change: {{user.bmiChange}}</li>
  <li>Current Weight: {{user.currentWeight}} kg</li>
  <li>Weight Change: {{user.weightChange}} kg</li>
</ul>
<p>{{#if user.isImproving}}
  Great job! You're making progress toward your goal.
{{else}}
  Keep going! Consistency is key to reaching your health goals.
{{/if}}</p>
<p>Log in to view your detailed progress charts and updated recommendations.</p>
<p>Best regards,<br>The BMI Tracker Team</p>`,
    createdAt: "2023-06-15",
    updatedAt: "2023-07-01",
  },
  {
    id: "3",
    name: "New Meal Plan Recommendation",
    subject: "Your Personalized Meal Plan is Ready",
    type: "recommendation",
    content: `<h1>Your Personalized Meal Plan</h1>
<p>Dear {{user.name}},</p>
<p>Based on your recent BMI measurements and goals, we've created a personalized meal plan for you.</p>
<h2>Your {{mealPlan.name}}</h2>
<p><strong>Daily Calorie Target:</strong> {{mealPlan.calories}} kcal</p>
<h3>Breakfast</h3>
<p>{{mealPlan.breakfast}}</p>
<h3>Lunch</h3>
<p>{{mealPlan.lunch}}</p>
<h3>Dinner</h3>
<p>{{mealPlan.dinner}}</p>
<h3>Snacks</h3>
<p>{{mealPlan.snacks}}</p>
<p>Log in to view your complete meal plan with nutritional information.</p>
<p>Best regards,<br>The BMI Tracker Team</p>`,
    createdAt: "2023-07-10",
    updatedAt: "2023-07-10",
  },
  {
    id: "4",
    name: "Sport-Specific BMI Analysis",
    subject: "Your Sport-Specific BMI Analysis",
    type: "analysis",
    content: `<h1>Your Sport-Specific BMI Analysis</h1>
<p>Dear {{user.name}},</p>
<p>We've analyzed your BMI data in relation to your sport ({{user.sport}}).</p>
<h2>Analysis Results</h2>
<p><strong>Current BMI:</strong> {{user.currentBMI}}</p>
<p><strong>Ideal BMI Range for {{user.sport}}:</strong> {{sport.idealBmiRange}}</p>
<p><strong>Body Fat Percentage:</strong> {{user.bodyFat}}%</p>
<p><strong>Lean Muscle Mass:</strong> {{user.leanMass}} kg</p>

<h2>Recommendations</h2>
<p>{{sport.recommendations}}</p>

<p>For more detailed analysis and personalized recommendations, please log in to your dashboard.</p>
<p>Best regards,<br>The BMI Tracker Team</p>`,
    createdAt: "2023-08-05",
    updatedAt: "2023-08-05",
  },
  {
    id: "5",
    name: "Goal Achievement Notification",
    subject: "Congratulations! You've Reached Your Goal",
    type: "notification",
    content: `<h1>Congratulations on Reaching Your Goal!</h1>
<p>Dear {{user.name}},</p>
<p>We're thrilled to inform you that you've successfully reached your BMI goal of {{user.goalBMI}}!</p>
<p>Here's a summary of your journey:</p>
<ul>
  <li>Starting BMI: {{user.startingBMI}}</li>
  <li>Current BMI: {{user.currentBMI}}</li>
  <li>Total Change: {{user.totalBmiChange}}</li>
  <li>Days to Goal: {{user.daysToGoal}}</li>
</ul>
<p>This is a significant achievement and you should be proud of your dedication and hard work.</p>
<h2>What's Next?</h2>
<p>Now that you've reached this milestone, you might want to:</p>
<ul>
  <li>Set a new health or fitness goal</li>
  <li>Focus on maintaining your current BMI</li>
  <li>Explore advanced fitness metrics and training programs</li>
</ul>
<p>Log in to your dashboard to update your goals and continue your health journey.</p>
<p>Best regards,<br>The BMI Tracker Team</p>`,
    createdAt: "2023-08-15",
    updatedAt: "2023-08-15",
  },
  {
    id: "6",
    name: "Inactivity Reminder",
    subject: "We Miss You! Continue Your Health Journey",
    type: "reminder",
    content: `<h1>We Miss You!</h1>
<p>Dear {{user.name}},</p>
<p>We noticed it's been {{user.inactiveDays}} days since you last logged into your BMI Tracker account.</p>
<p>Consistent tracking is key to achieving your health and fitness goals. Even small steps can lead to significant progress over time.</p>
<h2>Your Last Stats</h2>
<ul>
  <li>Last Recorded BMI: {{user.lastBMI}}</li>
  <li>Progress Toward Goal: {{user.progressPercentage}}%</li>
</ul>
<p>Ready to pick up where you left off? Click the button below to log in and continue your journey.</p>
<div style="text-align: center; margin: 30px 0;">
  <a href="{{loginUrl}}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">CONTINUE MY JOURNEY</a>
</div>
<p>If you're facing any challenges or have questions about using the platform, our support team is always here to help.</p>
<p>Best regards,<br>The BMI Tracker Team</p>`,
    createdAt: "2023-09-01",
    updatedAt: "2023-09-01",
  },
  {
    id: "7",
    name: "Monthly Health Summary",
    subject: "Your Monthly Health & Fitness Summary",
    type: "report",
    content: `<h1>Your Monthly Health & Fitness Summary</h1>
<p>Dear {{user.name}},</p>
<p>Here's a summary of your health metrics and achievements for the month of {{month}}:</p>

<div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h2 style="margin-top: 0;">BMI Metrics</h2>
  <p><strong>Starting BMI:</strong> {{user.startOfMonthBMI}}</p>
  <p><strong>Current BMI:</strong> {{user.currentBMI}}</p>
  <p><strong>Change:</strong> {{user.monthlyBmiChange}}</p>
  <p><strong>Category:</strong> {{user.bmiCategory}}</p>
</div>

<div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h2 style="margin-top: 0;">Activity Summary</h2>
  <p><strong>Tracking Days:</strong> {{user.trackingDays}} days</p>
  <p><strong>Most Consistent Period:</strong> {{user.consistentPeriod}}</p>
  <p><strong>Longest Streak:</strong> {{user.longestStreak}} days</p>
</div>

<div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h2 style="margin-top: 0;">Achievements</h2>
  <ul>
    {{#each user.achievements}}
      <li>{{this}}</li>
    {{/each}}
  </ul>
</div>

<p>Log in to your dashboard for more detailed insights and personalized recommendations.</p>
<p>Best regards,<br>The BMI Tracker Team</p>`,
    createdAt: "2023-09-15",
    updatedAt: "2023-09-15",
  },
  {
    id: "8",
    name: "New Feature Announcement",
    subject: "Exciting New Features for BMI Tracker",
    type: "announcement",
    content: `<h1>New Features Just Launched!</h1>
<p>Dear {{user.name}},</p>
<p>We're excited to announce several new features that will enhance your BMI Tracker experience:</p>

<div style="margin: 20px 0;">
  <h2 style="color: #3b82f6;">Professional BMI Calculator</h2>
  <p>Our new advanced calculator provides sport-specific BMI analysis with personalized recommendations for athletes and fitness enthusiasts.</p>
  <ul>
    <li>Body composition analysis with body fat estimation</li>
    <li>Sport-specific ideal BMI ranges</li>
    <li>Emotional state considerations for holistic health</li>
    <li>Detailed metrics including BMR and daily calorie needs</li>
  </ul>
</div>

<div style="margin: 20px 0;">
  <h2 style="color: #3b82f6;">Health Recommendations Engine</h2>
  <p>Get personalized health recommendations based on your BMI, chosen sport, and emotional state.</p>
</div>

<div style="margin: 20px 0;">
  <h2 style="color: #3b82f6;">Enhanced Data Visualization</h2>
  <p>New charts and graphs to better visualize your progress and identify trends.</p>
</div>

<p>Log in today to explore these exciting new features!</p>
<p>Best regards,<br>The BMI Tracker Team</p>`,
    createdAt: "2023-10-01",
    updatedAt: "2023-10-01",
  },
];
