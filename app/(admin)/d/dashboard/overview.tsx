import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import React from 'react';
import { BadgeDollarSign, Barcode, Users } from 'lucide-react';

export default async function Overview() {

    return (
        <div className='space-y-4'>
            <div className='flex flex-col space-y-2'>
                <h1 className="font-bold text-3xl tracking-tight scroll-m-20">Dashboard</h1>
                <p className="mb-2 text-muted-foreground text-sm md:text-base">
                    Overview of your performance metrics and recent activities.
                </p>
            </div>

            <div className='gap-4 grid md:grid-cols-2 lg:grid-cols-4'>
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Total Revenue</CardTitle>
                        <BadgeDollarSign className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-primary text-2xl'>
                            0
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs">All time store revenue</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Customers</CardTitle>
                        <Users className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-primary text-2xl'>
                            0
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs">Unique buyers to date</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Products</CardTitle>
                        <Barcode className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-primary text-2xl'>
                            0
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs">Items in your catalog</p>
                    </CardContent>
                </Card>
            </div>

            <div className='gap-4 grid md:grid-cols-2 lg:grid-cols-7'>
                <Card className='col-span-4 shadow-sm hover:shadow-md transition-shadow duration-200'>
                    <CardHeader>
                        <CardTitle>Revenue Trends</CardTitle>
                        <CardDescription>Monthly revenue over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                     
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}