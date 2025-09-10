'use client';

import Link from 'next/link';
import { Button } from './button';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Heading from '@/shared/components/atoms/heading';
import { motion } from 'framer-motion';
import { Sparkles, Clock, Gift, ArrowRight } from 'lucide-react';

// Static target date (replace with desired date)
const TARGET_DATE = new Date('2025-10-20T00:00:00');

// Function to calculate the time remaining
const calculateTimeRemaining = (targetDate: Date) => {
    const currentTime = new Date();
    const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);
    return {
        days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
            (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
    };
};

const DealCountdown = () => {
    const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();

    useEffect(() => {
        // Calculate initial time on client
        setTime(calculateTimeRemaining(TARGET_DATE));

        const timerInterval = setInterval(() => {
            const newTime = calculateTimeRemaining(TARGET_DATE);
            setTime(newTime);

            if (
                newTime.days === 0 &&
                newTime.hours === 0 &&
                newTime.minutes === 0 &&
                newTime.seconds === 0
            ) {
                clearInterval(timerInterval);
            }

            return () => clearInterval(timerInterval);
        }, 1000);
    }, []);

    if (!time) {
        return (
            <section className='relative my-20 px-4'>
                <div className="max-w-7xl mx-auto">
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                        <div className='space-y-6'>
                            <div className="animate-pulse">
                                <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (
        time.days === 0 &&
        time.hours === 0 &&
        time.minutes === 0 &&
        time.seconds === 0
    ) {
        return (
            <section className='relative py-20 px-4 bg-gradient-to-br from-gray-50 to-white overflow-hidden'>
                <div className="absolute top-10 right-10 w-32 h-32 bg-gray-100 rounded-full opacity-20 blur-3xl"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className='space-y-6'
                        >
                            <div className="inline-flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                                <Clock className="w-4 h-4 mr-2" />
                                Deal Expired
                            </div>
                            <Heading text1={'Deal Has'} text2={"Ended"} className="text-left" />
                            <p className="text-gray-600 text-lg leading-relaxed">
                                This exclusive offer is no longer available. Don&apos;t worry! Check out our latest promotions and discover amazing deals waiting for you.
                            </p>
                            <Button size="lg" className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                                <Link href='/collection' className="flex items-center">
                                    View Products
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className='flex justify-center'
                        >
                            <div className="relative">
                                <Image
                                    src='/promo.jpg'
                                    alt='promotion'
                                    width={400}
                                    height={300}
                                    className="rounded-2xl shadow-2xl"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className='relative py-20 px-4 bg-gradient-to-br from-orange-50/30 via-white to-orange-100/20 overflow-hidden'>
            {/* Background decorative elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-orange-100 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-200 rounded-full opacity-30 blur-2xl"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className='space-y-8'
                    >
                        {/* Badge */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                        >
                            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                            Limited Time Offer
                        </motion.div>

                        {/* Heading */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Heading text1={'Deal Of The'} text2={"Month"} className="text-left" />
                        </motion.div>

                        {/* Description */}
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-gray-600 text-lg leading-relaxed"
                        >
                            Get ready for a shopping experience like never before with our exclusive Deal of the Month! Every purchase comes with special perks and amazing offers. Don&apos;t let this opportunity slip away! 🎁
                        </motion.p>

                        {/* Countdown Timer */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className='grid grid-cols-4 gap-4'
                        >
                            <StatBox label='Days' value={time.days} delay={0.1} />
                            <StatBox label='Hours' value={time.hours} delay={0.2} />
                            <StatBox label='Minutes' value={time.minutes} delay={0.3} />
                            <StatBox label='Seconds' value={time.seconds} delay={0.4} />
                        </motion.div>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <Button size="lg" className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300">
                                <Link href='/collection' className="flex items-center">
                                    <Gift className="w-5 h-5 mr-2" />
                                    Shop Now
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Image Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className='flex justify-center'
                    >
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                            <Image
                                src='/promo.jpg'
                                alt='promotion'
                                width={500}
                                height={400}
                                className="relative rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const StatBox = ({ label, value, delay }: { label: string; value: number; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay }}
        className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group'
    >
        <motion.p 
            key={value}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className='font-bold text-3xl lg:text-4xl text-gray-900 mb-2 group-hover:text-orange-600 transition-colors'
        >
            {value.toString().padStart(2, '0')}
        </motion.p>
        <p className='text-sm text-gray-600 font-medium uppercase tracking-wider'>{label}</p>
    </motion.div>
);

export default DealCountdown;
