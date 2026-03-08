import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo({
                top: 0,
                behavior: 'instant'
            });
            return;
        }

        const id = hash.replace('#', '');
        let retries = 0;
        const maxRetries = 10;

        const scrollToTarget = () => {
            const element = document.getElementById(id);
            if (element) {
                // Tactical scroll with offset for floating navbar (approx 80-100px)
                const yOffset = -100;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
            } else if (retries < maxRetries) {
                retries++;
                setTimeout(scrollToTarget, 100);
            }
        };

        scrollToTarget();
    }, [pathname, hash]);

    return null;
};

export default ScrollToTop;
