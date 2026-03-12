// ========================================
// quotes.js — Daily motivational quotes
// ========================================

const QUOTES = [
    { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
    { text: "We are what we repeatedly do. Excellence is not an act, but a habit.", author: "Aristotle" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Success is nothing more than a few simple disciplines, practiced every day.", author: "Jim Rohn" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" },
    { text: "Stay focused and never give up.", author: "Unknown" },
    { text: "Your only limit is your mind.", author: "Unknown" },
    { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
    { text: "The difference between who you are and who you want to be is what you do.", author: "Unknown" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The habit of doing more than necessary can only stop with death.", author: "Frank Tibolt" },
    { text: "Motivation gets you going, discipline keeps you growing.", author: "John C. Maxwell" },
    { text: "You will never always be motivated. You have to learn to be disciplined.", author: "Unknown" },
    { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
    { text: "One day or day one. You decide.", author: "Unknown" },
    { text: "The pain of discipline is far less than the pain of regret.", author: "Unknown" },
    { text: "Consistency is what transforms average into excellence.", author: "Unknown" },
    { text: "Nothing in the world can take the place of persistence.", author: "Calvin Coolidge" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Fall seven times. Stand up eight.", author: "Japanese Proverb" },
    { text: "Act as if what you do makes a difference. It does.", author: "William James" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
    { text: "Strive for progress, not perfection.", author: "Unknown" },
    { text: "Do something today that your future self will thank you for.", author: "Unknown" },
    { text: "Every accomplishment starts with the decision to try.", author: "Unknown" },
    { text: "Be so good they can't ignore you.", author: "Steve Martin" },
    { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
    { text: "Sweat is just fat crying.", author: "Unknown" },
    { text: "The successful warrior is the average man with laser-like focus.", author: "Bruce Lee" },
    { text: "Train hard, win easy.", author: "Unknown" },
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" }
];

const QuoteManager = {
    getTodayQuote() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
        const keys = ['q1', 'q2', 'q3', 'q4'];
        const key = keys[dayOfYear % keys.length];
        return { text: i18n.t(key), author: 'DeOs' };
    }
};

window.QuoteManager = QuoteManager;
