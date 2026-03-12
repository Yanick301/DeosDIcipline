/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                airbnb: '#FF385C',
                surface: {
                    100: '#121212',
                    200: '#1C1C1E',
                    300: '#2C2C2E',
                },
                text: {
                    primary: '#FFFFFF',
                    secondary: '#A1A1AA',
                    tertiary: '#71717A',
                }
            },
            fontFamily: {
                sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
            },
            animation: {
                'spring-in': 'springIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
            },
            keyframes: {
                springIn: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
