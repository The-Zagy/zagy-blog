import { InformationCircleIcon, LightBulbIcon, ClockIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/solid"
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"
type CalloutType = "note" | "tldr" | "idea" | "pro" | "con" | "info"
const colorHeader = {
    "note": "bg-blue-400 dark:bg-dark-primary-500",
    "tldr": "bg-pink-500 dark:bg-dark-secondary-500",
    "idea": "bg-yellow-500 dark:bg-yellow-700",
    "pro": "bg-green-400 dark:bg-green-600",
    "con": "bg-red-500 dark:bg-red-700",
    "info": "bg-gray-500",
}
const colorBG = {
    "note": "bg-gray-200",
    "tldr": "bg-gray-200",
    "idea": "bg-yellow-500",
    "pro": "bg-green-200",
    "con": "bg-red-500",
    "info": "bg-gray-500",
}
export const Callout: React.FC<{ children: string, type: CalloutType }> = ({ children, type }) => {
    function CalloutIcon() {
        switch (type) {
            case "note": return <InformationCircleIcon className="fill-white  w-8 h-8" />
            case "tldr": return <ClockIcon className="fill-white w-8 h-8" />
            case "pro": return <CheckCircleIcon className="text-white w-8 h-8" />
            case "con": return <XCircleIcon className="text-white w-8 h-8" />
            case "idea": return <LightBulbIcon className="fill-white w-8 h-8" />
            case "info": return <QuestionMarkCircleIcon className="fill-white w-8 h-8   " />
        }
    }
    return (
        <div className=" text-lg font-semibold 
         text-gray-500 bg-gray-100
        dark:bg-dark-muted-400
        dark:text-dark-text-600
        flex flex-row items-center gap-x-4
         rounded-md
        not-italic
        ">
            <header className={`px-2 rounded-l-md flex flex-col justify-center py-4 ${colorHeader[type]}`}>
                <CalloutIcon />
            </header>
            <div>
                {children}
            </div>
        </div>
    )

}
