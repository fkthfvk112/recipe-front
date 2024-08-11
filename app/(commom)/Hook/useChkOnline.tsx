import { useEffect, useState } from "react";

export default function useChkOnline() {
    const [isOnline, setIsOnline] = useState(typeof window !== "undefined" ? window.navigator.onLine : true);

    useEffect(() => {
        const updateOnlineStatus = () => setIsOnline(window.navigator.onLine);

        window.addEventListener("offline", updateOnlineStatus);
        window.addEventListener("online", updateOnlineStatus);

        return () => {
            window.removeEventListener("offline", updateOnlineStatus);
            window.removeEventListener("online", updateOnlineStatus);
        };
    }, []);

    return isOnline;
}
