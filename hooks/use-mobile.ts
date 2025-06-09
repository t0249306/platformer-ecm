"use client"

import { useState, useEffect } from "react"

export function useMobile() {
    const checkMobile = () => {
        if (typeof window === "undefined") {
            return false
        }
        return window.innerWidth < 768 || "ontouchstart" in window || navigator.maxTouchPoints > 0
    }

    const [isMobile, setIsMobile] = useState(checkMobile())

    useEffect(() => {
        setIsMobile(checkMobile())

        window.addEventListener("resize", () => setIsMobile(checkMobile()))
        
        return () => window.removeEventListener("resize", () => setIsMobile(checkMobile()))
    }, [])

    return isMobile
}