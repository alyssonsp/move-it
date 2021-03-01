import { Children, createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData {
    minutes: number;
    seconds: number;
    hastFinished: boolean;
    isactive: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;

}

interface CountdownProviderProps {
    children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData)

let countdownTimeout: NodeJS.Timeout;


export function CountdownProvider({ children }: CountdownProviderProps) {
    const { startNewChallenge } = useContext(ChallengesContext);
    const [time, setTime] = useState(25 * 60);
    const [isactive, setIsActive] = useState(false);
    const [hastFinished, setHasFinished] = useState(false);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    function startCountdown() {
        setIsActive(true);
    }

    function resetCountdown() {
        clearTimeout(countdownTimeout);
        setIsActive(false);
        setTime(0.1 * 60);
        setHasFinished(false);
    }



    useEffect(() => {
        if (isactive && time > 0) {
            countdownTimeout = setTimeout(() => {
                setTime(time - 1)
            }, 1000)
        } else if (isactive && time == 0) {
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();
        }
    }, [isactive, time]);

    return (
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            hastFinished,
            isactive,
            startCountdown,
            resetCountdown,
        }}>
            {children}
        </CountdownContext.Provider>

    );
}