import React from "react"

export function useScroll() {
    const [scrolled, setScrolled] = React.useState(false)
    const [scrollDirection, setScrollDirection] = React.useState<'up' | 'down' | null>(null)
    const lastScrollY = React.useRef(0)

    React.useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            setScrolled(currentScrollY > 20)

            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setScrollDirection('down')
            } else if (currentScrollY < lastScrollY.current) {
                setScrollDirection('up')
            }

            lastScrollY.current = currentScrollY
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return { scrolled, scrollDirection }
}
