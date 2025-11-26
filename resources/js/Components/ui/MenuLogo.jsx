import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { MdOutlinePunchClock } from "react-icons/md";
import { motion } from 'framer-motion';

const MenuLogo = ({ isOpen, toggleSidebar }) => {
    return (
        <div className="absolute top-4 left-0 z-50 flex items-center transition-all">
            <button
                onClick={toggleSidebar}
                className={`${isOpen ? 'bg-transparent' : 'bg-primary text-primary-foreground'} w-20 h-11 rounded-r-full hover:scale-105 transition-transform`}
            >
                <Menu className="mx-auto" size={25} />
            </button>
    
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <MdOutlinePunchClock size={25} />
            </motion.div>
        </div>
    );
}

export default MenuLogo;