"use client"

import type React from "react"

interface MobileControlsProps {
  controlMode: "two-handed" | "one-handed"
  onMobileControl: (action: "left" | "right" | "jump", isPressed: boolean) => void
}

export default function MobileControls({ controlMode, onMobileControl }: MobileControlsProps) {
  const buttonBaseClass = "bg-gradient-to-b transition-all duration-75 active:scale-95 select-none shadow-lg border-2"
  const blueButtonClass = `${buttonBaseClass} from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white font-bold rounded-xl border-blue-400`
  const greenButtonClass = `${buttonBaseClass} from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:from-green-700 active:to-green-800 text-white font-bold rounded-full border-green-400`

  const handleButtonEvents = (action: "left" | "right" | "jump") => ({
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault()
      onMobileControl(action, true)
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.preventDefault()
      onMobileControl(action, false)
    },
    onMouseDown: (e: React.MouseEvent) => {
      e.preventDefault()
      onMobileControl(action, true)
    },
    onMouseUp: (e: React.MouseEvent) => {
      e.preventDefault()
      onMobileControl(action, false)
    },
    onMouseLeave: (e: React.MouseEvent) => {
      e.preventDefault()
      onMobileControl(action, false)
    },
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  })

  return (
    <>
      <div className="fixed inset-0 z-40 pointer-events-none">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex items-end p-6">
            {controlMode === "two-handed" ? (
              <div className="w-full flex justify-between items-end">
                <div className="flex gap-3 pointer-events-auto">
                  <button className={`w-16 h-16 text-2xl ${blueButtonClass}`} {...handleButtonEvents("left")}>
                    ←
                  </button>
                  <button className={`w-16 h-16 text-2xl ${blueButtonClass}`} {...handleButtonEvents("right")}>
                    →
                  </button>
                </div>

                <div className="pointer-events-auto">
                  <button className={`w-20 h-20 text-xl ${greenButtonClass}`} {...handleButtonEvents("jump")}>
                    ↑
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-between items-end">
                <div className="pointer-events-auto">
                  <button className={`w-20 h-20 text-2xl ${blueButtonClass}`} {...handleButtonEvents("left")}>
                    ←
                  </button>
                </div>

                <div className="pointer-events-auto">
                  <button className={`w-24 h-24 text-xl ${greenButtonClass}`} {...handleButtonEvents("jump")}>
                    ↑
                  </button>
                </div>

                <div className="pointer-events-auto">
                  <button className={`w-20 h-20 text-2xl ${blueButtonClass}`} {...handleButtonEvents("right")}>
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}