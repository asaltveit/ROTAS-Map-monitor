import type { Metadata } from "next";
import SideNav from '@/components/ui/dashboard/SideNav';
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
    title: "Monitor Home",
    description: "Home page of ROTAS Map Monitoring",
};

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
    // TODO: Guard access here
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    return (
        <html lang="en">
            <body>
                <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                    <div className="w-full flex-none md:w-64">
                        <SideNav />
                    </div>
                    <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
                </div>
            </body>
        </html>
    );
}