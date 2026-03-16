// ───────────────────────────────────────────────────────────
// Quote of the Day — date-seeded so every friend sees the same one
// ───────────────────────────────────────────────────────────

const QUOTES: string[] = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "It does not matter how slowly you go as long as you do not stop. — Confucius",
  "Success is the sum of small efforts repeated day in and day out. — Robert Collier",
  "We are what we repeatedly do. Excellence is not an act, but a habit. — Aristotle",
  "Motivation is what gets you started. Habit is what keeps you going. — Jim Ryun",
  "A journey of a thousand miles begins with a single step. — Lao Tzu",
  "Small daily improvements are the key to staggering long-term results. — Unknown",
  "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
  "The only way to do great work is to love what you do. — Steve Jobs",
  "You don't have to be great to start, but you have to start to be great. — Zig Ziglar",
  "Believe you can and you're halfway there. — Theodore Roosevelt",
  "Discipline is the bridge between goals and accomplishment. — Jim Rohn",
  "The best time to plant a tree was 20 years ago. The second best time is now. — Chinese Proverb",
  "Your future is created by what you do today, not tomorrow. — Robert Kiyosaki",
  "Fall seven times, stand up eight. — Japanese Proverb",
  "Consistency is what transforms average into excellence. — Unknown",
  "Action is the foundational key to all success. — Pablo Picasso",
  "The harder you work for something, the greater you'll feel when you achieve it. — Unknown",
  "Dream big. Start small. Act now. — Robin Sharma",
  "Don't let yesterday take up too much of today. — Will Rogers",
  "What you do today can improve all your tomorrows. — Ralph Marston",
  "It always seems impossible until it's done. — Nelson Mandela",
  "Strive not to be a success, but rather to be of value. — Albert Einstein",
  "The pain you feel today will be the strength you feel tomorrow. — Unknown",
  "Perseverance is not a long race; it is many short races one after the other. — Walter Elliot",
  "You are never too old to set another goal or to dream a new dream. — C.S. Lewis",
  "Start where you are. Use what you have. Do what you can. — Arthur Ashe",
  "With the new day comes new strength and new thoughts. — Eleanor Roosevelt",
  "Hardships often prepare ordinary people for an extraordinary destiny. — C.S. Lewis",
  "The only limit to our realization of tomorrow is our doubts of today. — Franklin D. Roosevelt",
  "Everything you've ever wanted is on the other side of fear. — George Addair",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill",
  "Habits are the compound interest of self-improvement. — James Clear",
  "Be stronger than your excuses. — Unknown",
  "One percent better every day. — James Clear",
  "Progress, not perfection. — Unknown",
  "The difference between try and triumph is a little umph. — Marvin Phillips",
  "Great things are done by a series of small things brought together. — Vincent van Gogh",
  "Do something today that your future self will thank you for. — Sean Patrick Flanery",
  "Champions keep playing until they get it right. — Billie Jean King",
  "Energy and persistence conquer all things. — Benjamin Franklin",
  "Quality is not an act, it is a habit. — Aristotle",
  "Tough times never last, but tough people do. — Robert H. Schuller",
  "Every day is a new beginning. Take a deep breath and start again. — Unknown",
  "Don't count the days, make the days count. — Muhammad Ali",
  "Little by little, one travels far. — J.R.R. Tolkien",
  "Strength does not come from winning. Your struggles develop your strengths. — Arnold Schwarzenegger",
  "You miss 100% of the shots you don't take. — Wayne Gretzky",
  "The man who moves a mountain begins by carrying away small stones. — Confucius",
  "Today is a good day to try. — Unknown",
];

/**
 * Returns the same quote for every user on the same calendar day.
 * Seed = numeric YYYYMMDD mod 50.
 */
export function getQuoteOfTheDay(today: Date = new Date()): string {
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const d = today.getDate();
  const seed = y * 10000 + m * 100 + d;
  return QUOTES[seed % QUOTES.length];
}

export default getQuoteOfTheDay;
