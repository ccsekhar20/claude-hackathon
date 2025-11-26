"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div className={cn("relative mx-auto", className)}>
      {/* iPhone-style frame */}
      <div className="relative w-[375px] h-[812px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl z-10" />
        
        {/* Screen */}
        <div className="relative w-full h-full bg-gradient-to-br from-[#0f0f23] via-[#1a1a35] to-[#0f0f23] rounded-[2.5rem] overflow-hidden">
          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-8 text-white text-xs z-20">
            <span className="font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 border border-white rounded-sm relative">
                <div className="absolute inset-0.5 bg-white rounded-sm" />
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="w-full h-full overflow-y-auto scrollbar-hide">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
