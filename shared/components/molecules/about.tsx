import React from 'react';
import Heading from '../atoms/heading';
import NewsLetter from '../atoms/newsletter';

const About = () => {
  return (
    <div>
      <div className="pt-8 border-t text-2xl text-center">
        <Heading text1={'ABOUT'} text2={'US'} />
      </div>

      <div className="flex md:flex-row flex-col gap-16 my-10">
        <div
          className="bg-gray-400 w-full md:max-w-[450px]">

          </div>

        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
           Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus similique numquam cumque pariatur voluptatem sunt fugit ducimus corporis consectetur magnam accusamus illum ab natus, ad at. Reiciendis doloremque voluptas sit!
          </p>
          <p>
           Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae accusantium perferendis maxime voluptatem laudantium ullam sed facere modi, illum alias similique officiis, id saepe placeat quisquam, unde rerum nulla. Aspernatur!
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            {' '}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae odit magnam impedit a magni saepe ad minima commodi perspiciatis suscipit est laborum autem vel aliquam, libero et? Inventore, quasi tempora?
          </p>
        </div>
      </div>

      <div className="py-4 text-2xl">
        <Heading text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className="flex md:flex-row flex-col gap-4 mb-20 text-sm">
        <div className="flex flex-col gap-5 px-10 md:px-16 py-8 sm:py-20 border">
          <b>Quality Assurance</b>
          <p className="text-gray-600">
            We take pride in offering only the highest quality products that
            meet our stringent standards for durability, performance, and value.{' '}
          </p>
        </div>
        <div className="flex flex-col gap-5 px-10 md:px-16 py-8 sm:py-20 border">
          <b>Convenience</b>
          <p className="text-gray-600">
            Our user-friendly website and mobile app make it easy to browse,
            compare, and purchase products on the go.{' '}
          </p>
        </div>
        <div className="flex flex-col gap-5 px-10 md:px-16 py-8 sm:py-20 border">
          <b>Exceptional Customer Services</b>
          <p className="text-gray-600">
            Our dedicated team of customer service representatives is available
            around the clock to assist you with any queries or concerns you may
            have.{' '}
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
