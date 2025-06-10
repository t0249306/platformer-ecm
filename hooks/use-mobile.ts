"use client"

import { useState, useEffect } from "react"

export function useMobile() {
    const checkMobile = () => {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
        const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
            userAgent.toLowerCase(),
        )
        const isSmallScreen = typeof window !== "undefined" && window.innerWidth <= 768
        return isMobileDevice || isSmallScreen
    }

    const [isMobile, setIsMobile] = useState(checkMobile())

    useEffect(() => {
        setIsMobile(checkMobile())

        window.addEventListener("resize", () => setIsMobile(checkMobile()))
        
        return () => window.removeEventListener("resize", () => setIsMobile(checkMobile()))
    }, [])

    return isMobile
}