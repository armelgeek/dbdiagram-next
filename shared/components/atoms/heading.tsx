import React from "react";

const Heading = ({ text1, text2, className, children }: { text1: string; text2?: string; className?: string; children?: React.ReactNode }) => {
  return (
    <div className={`text-3xl font-bold ${className ? className : 'text-center'} `}> 
      <div className="inline-flex flex-col items-center gap-2 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-orange-500 uppercase tracking-wide drop-shadow-sm">
            {text1}
          </span>
          {text2 && (
            <span className="font-semibold text-gray-700 uppercase tracking-tight animate-fade-in">
              {text2}
            </span>
          )}
        </div>
        {/* Animated gradient underline */}
        <span className="block h-1 w-16 sm:w-24 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 animate-gradient-x" />
      </div>
      {children && (
        <p className="m-auto w-3/4 text-gray-600 text-xs sm:text-sm md:text-base font-normal mt-2">
          {children}
        </p>
      )}
    </div>
  );
};

export default Heading;
