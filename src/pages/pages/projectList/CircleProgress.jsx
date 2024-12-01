import React from 'react';

const CircleProgress = ({ progress }) => {
  // Set the fixed size of the SVG
  const svgWidth = 150; // Set your desired width
  const svgHeight = 150; // Set your desired height

  // Calculate the radius and circumference of the circle based on the SVG size
  const radius = Math.min(svgWidth, svgHeight) / 2 - 30; // Adjusted to leave space for stroke
  const circumference = 2 * Math.PI * radius;

  // Calculate the progress value for the stroke-dashoffset
  const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
      {/* Background circle */}
      <circle cx={svgWidth / 2} cy={svgHeight / 2} r={radius} fill="none" stroke="#e6e6e6" strokeWidth="15" />

      {/* Progress circle */}
      <circle
        cx={svgWidth / 2}
        cy={svgHeight / 2}
        r={radius}
        fill="none"
        stroke="#6226EF"
        strokeWidth="15"
        strokeDasharray={circumference}
        strokeDashoffset={progressOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${svgWidth / 2} ${svgHeight / 2})`}
      />

      {/* Progress text */}
      <text x={svgWidth / 2} y={svgHeight / 2} textAnchor="middle" dy=".05em" fontSize="25px" fill="#6226EF">
        {progress}%
      </text>
    </svg>
  );
};

export default CircleProgress;
