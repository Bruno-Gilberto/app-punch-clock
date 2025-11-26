import React, { useState, useEffect } from 'react';
import Navbar from "../ui/Navbar";
import { toast, Toaster } from 'react-hot-toast';
import SideBar from "../ui/SideBar";
import { usePage } from '@inertiajs/react';
import authUser from "@/hooks/authUser";
import MenuLogo from '../ui/MenuLogo';

const Layout = ({ children }) => {
  const user = authUser();
  const { flash, errors } = usePage().props; 
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1280);

  const handleResize = () => {
    setSidebarOpen(window.innerWidth > 1280);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 

  useEffect(() => {
    setSidebarOpen(window.innerWidth <= 1280 ? false : true)
  }, [window.innerWidth])

  const formatErrorsToString = (errorsObject) => {
    if (!errorsObject || typeof errorsObject !== 'object') return '';

    console.log('object Errors:', errorsObject);

    const errorMessages = Object.values(errorsObject);
    console.log('object join:', errorMessages.join('\n'));
    
    return errorMessages.join('\n')
  }

  useEffect(() => {
    console.log('isArray:', Array.isArray(errors));
    console.log('isArray:', Object.keys(errors));
    if (Object.keys(errors).length > 0) toast.error(formatErrorsToString(errors));
    if (flash?.error && !Array.isArray(flash?.error)) toast.error(flash.error);
    if (flash?.error && Array.isArray(flash?.error)) toast.error(formatErrorsToString(flash?.error));
    if (flash?.success) toast.success(flash.success);
    if (flash?.data?.success) toast.success(flash.data.message);
  }, [flash, errors]);

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-all">
      {user && <MenuLogo isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />}
      {user && <SideBar isOpen={sidebarOpen} user={user} />}
      <main className={`relative flex-grow transition-all duration-700 ease-in-out w-full`}>
        <Navbar user={user} />
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'border border-border px-4 py-3 rounded-xl shadow-lg text-card-foreground bg-card'
          }}
        />
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;