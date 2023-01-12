import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { MoonIcon } from "@heroicons/react/24/solid";
const ThemeSwtich = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme()
    const toggleTheme = () => {
        // const event = new Event('themeChanged');
        // document.dispatchEvent(event);
        if (theme === "dark") setTheme("light");
        else setTheme("dark");
    }
    useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) return null;
    const checked = theme === "dark" ? true : false;
    return (
        <div>
            <label className="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" checked={checked} onChange={toggleTheme} value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"><MoonIcon className='h-6 w-6 dark:fill-white dark:text-white' /></span>
            </label>

        </div>
    )
}
export default ThemeSwtich;