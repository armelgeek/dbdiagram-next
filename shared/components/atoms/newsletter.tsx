'use client';
import { Button } from '@/components/ui/button';
import React from 'react';
const NewsLetter = () => {
  const onSubmitHandler = (e) => {
    e.preventDefault();
    alert('Subscribed successfully!');
  };

  return (
    <div className="my-10 text-center">
      <p className="font-medium text-gray-800 text-2xl">
        Subscribe now
      </p>
      <p className="mt-3 text-gray-500">
        Be the first to know about new arrivals, sales & promos!
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="flex items-center gap-3 mx-auto my-6 pl-3 border w-full sm:w-1/2"
      >
        <input
          type="email"
          placeholder="Enter your email"
          className="sm:flex-1 outline-none w-full"
          required
        />
        <Button
        >
          Subscribe
        </Button>
      </form>
    </div>
  );
};

export default NewsLetter;
