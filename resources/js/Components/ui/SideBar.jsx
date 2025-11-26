import React from "react";
import authUser from "@/hooks/authUser";
import { Link, usePage } from '@inertiajs/react';
import { MdOutlinePunchClock } from "react-icons/md";
import { FaHome, FaUsers, FaCog} from 'react-icons/fa';

export default function SideBar({ isOpen }) {
    const { url } = usePage();
    const user = authUser();
    const { basePath } = usePage().props;

    const pages = {
        admin: [
            { name: 'Dashboard', href: `${basePath}/dashboard`, icon: FaHome },
            { name: 'Usuários', href: `${basePath}/user/list`, icon: FaUsers },
            { name: 'Registros', href: `${basePath}/register/list`, icon: MdOutlinePunchClock },
        ],
        user: [
            { name: 'Dashboard', href: `${basePath}/dashboard`, icon: FaHome },
            { name: 'Registros', href: `${basePath}/register/list`, icon: MdOutlinePunchClock },
        ]
    };

    const activeStyle = 'active shadow-md bg-accent text-accent-foreground';

    return (
        <aside className={`sidebar absolute 2xl:static transition-all duration-700 ease-in-out flex top-0 left-0 z-40 h-screen pt-20 -translate-x-full bg-background rounded-r-xl sm:translate-x-0 ${isOpen ? 'w-[280px]' : 'w-0'}
    ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-hidden`} aria-label="Sidebar">
            <div className="h-full w-full pb-4 overflow-y-auto">
                <ul className="space-y-2 font-medium menu">
                    {pages[user.role].map((page) => (
                        <li key={page.name}>
                            <Link href={page.href} className={`flex items-center py-3 px-4 ml-4 mr-4 rounded-lg menu-item ${url.startsWith(page.href) ? activeStyle : 'text-foreground'}`}>
                                <page.icon className="mr-3 text-xl" />
                                {page.name} 
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}