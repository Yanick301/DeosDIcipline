import React from 'react';
import { motion } from 'framer-motion';

const ProgressRing = ({ progress, size = 80, stroke = 8 }) => {
    const radius = (size / 2) - (stroke / 2);
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg width={size} height={size} className="transform -rotate-90 drop-shadow-lg">
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className="stroke-white/5 fill-transparent"
                strokeWidth={stroke}
            />
            <motion.circle
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: 'easeOut' }}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className="stroke-airbnb fill-transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference}
                strokeLinecap="round"
            />
        </svg>
    );
};

export default ProgressRing;
