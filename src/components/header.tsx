import LoginButton from '@/components/login-button'
import { getAppToken } from '@/lib/auth'
import { Routes } from '@/lib/routes';
import { buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';
import ArtistSearch from '@/components/artist-search';
import Link from 'next/link';
import { Power } from 'lucide-react';

export default async function Header() {
    const token = await getAppToken();
    return (
        <div className="flex flex-col sm:flex-row items-center sm:justify-between h-full gap-4 sm:gap-6 px-4 sm:px-8 py-3 w-full">
            <div className="flex items-center w-full sm:w-auto justify-between">
                <Link href={Routes.client.home} className="text-2xl font-bold whitespace-nowrap">Wollen Labs</Link>
                <div className="sm:hidden ml-auto shrink-0">
                    {token ? (
                        <a className={cn(buttonVariants({ variant: "outline", size: "icon" }), 'bg-neutral-50 rounded-full text-destructive border-destructive hover:bg-destructive hover:text-neutral-50')} href={Routes.api.logout}>
                            <Power className="size-4" />
                        </a>
                    ) : (
                        <LoginButton />
                    )}
                </div>
            </div>

            {/* Search artist input */}
            {token && (
                <div className="w-full sm:max-w-md sm:flex-1 sm:mx-4 mt-2 sm:mt-0">
                    <ArtistSearch />
                </div>
            )}

            <div className="ml-auto shrink-0 hidden sm:block">
                {token ? (
                    <a className={cn(buttonVariants({ variant: "outline", size: "icon" }), 'bg-neutral-50 rounded-full text-destructive border-destructive hover:bg-destructive hover:text-neutral-50')} href={Routes.api.logout}>
                        <Power className="size-4" />
                    </a>
                ) : (
                    <LoginButton />
                )}
            </div>
        </div>
    )
}
