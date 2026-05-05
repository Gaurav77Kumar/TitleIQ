export const COMPETITOR_TITLES: Record<string, string[]> = {
  'Tech': [
    "I Switched to Linux for 30 Days — Here's What Happened",
    "The Truth About the New MacBook Pro Nobody Is Saying",
    "Why I Returned My iPhone 16 After One Week",
    "This $200 Laptop Replaced My $2000 MacBook",
    "Apple Is Lying to You About This Feature",
    "The Gadget Every Desk Needs in 2026",
    "How to Fix Your PC Performance in 5 Minutes",
    "I Bought a Random PC from eBay — Is it a Scam?",
    "The Next Big Thing in Tech is Already Here",
    "Stop Buying Cheap USB-C Cables!"
  ],
  'Gaming': [
    "I Survived 100 Days in Hardcore Minecraft (World Record)",
    "The Secret Ending No One Found in Elden Ring",
    "Why Modern FPS Games are Dying",
    "I Spent $1000 on a Game I Hate — Here's Why",
    "The Most Broken Build in Diablo 4 History",
    "Minecraft but Everything is Lava",
    "This Indie Game is Better than Any AAA Release",
    "The Evolution of Mario (1985 - 2026)",
    "I Built a City Underground in Cities Skylines",
    "GTA 6 Leaks: Everything We Know So Far"
  ],
  'Finance': [
    "How I Retired at 28 (The Realistic Way)",
    "The Market is Crashing — What to Do Now",
    "Why Your Savings Account is a Scam",
    "I Lived on $5 a Day for a Week to Save $10,000",
    "The Only Investment You Need in Your 20s",
    "Credit Card Hacks No One Tells You About",
    "How to Buy Your First Rental Property",
    "The Truth About Passive Income in 2026",
    "Why I Quit My 6-Figure Job to be Free",
    "Compound Interest: The 8th Wonder of the World"
  ],
  'Fitness': [
    "I Did 100 Pushups Every Day for a Year — My Results",
    "The Truth About Why You're Not Losing Fat",
    "Stop Doing These 3 Exercises (They're Useless)",
    "How I Transformed My Body in 90 Days",
    "The Best Morning Routine for Muscle Growth",
    "Why You Should Stop Counting Calories",
    "Full Body Workout with Zero Equipment",
    "The Science of Sleep and Recovery",
    "I Ran a Marathon with Zero Training — Big Mistake",
    "What I Eat in a Day as a Hybrid Athlete"
  ],
  'Cooking': [
    "The Only Way to Make a Perfect Steak at Home",
    "Gordon Ramsay's Secret Ingredient for Scrambled Eggs",
    "I Lived on Instant Ramen for 7 Days — Here's the Cost",
    "Professional Chef vs Home Cook: Who Wins?",
    "The Ultimate 10-Minute Pasta Recipe",
    "Stop Washing Your Rice Wrong!",
    "I Made a 5-Course Meal Using Only a Microwave",
    "Why Your Homemade Pizza Sucks (And How to Fix It)",
    "The Most Expensive Restaurant in the World",
    "How to Meal Prep for a Month in 2 Hours"
  ],
  'Other': [
    "The Untold Story of the World's Smallest Country",
    "I Traveled Across the Ocean in a Rowboat",
    "How to Learn Any Skill in 20 Hours",
    "The Mystery of the Abandoned Island",
    "I Spent 24 Hours in a Sensory Deprivation Tank",
    "Why We're All Addicted to Our Phones",
    "The History of the Internet (Part 1)",
    "How to Survive a Wilderness Emergency",
    "I Built a House from Scrap Wood",
    "The Science of Why We Dream"
  ]
};

// Add fallbacks for other niches if needed
const ALL_NICHES = ['Education', 'Lifestyle', 'Travel', 'Beauty', 'Business', 'Music', 'Sports', 'Entertainment', 'Health'];
ALL_NICHES.forEach(niche => {
  if (!COMPETITOR_TITLES[niche]) {
    COMPETITOR_TITLES[niche] = COMPETITOR_TITLES['Other'];
  }
});
