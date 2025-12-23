
'use client';

import { Suspense } from 'react';
import { CheckoutPageContent } from './checkout-page-content';
import { BasketballLoader } from '@/components/basketball-loader';

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-background"><BasketballLoader /></div>}>
            <CheckoutPageContent />
        </Suspense>
    );
}
