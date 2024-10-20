import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'ABOUT'} text2={'US'}/>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px] ' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus maxime alias at laboriosam eius? Impedit necessitatibus quas maiores aliquam culpa. Sapiente, voluptatum?lorem</p>
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt minus ducimus voluptatem non! Eveniet mollitia excepturi beatae dicta sapiente. Repudiandae, delectus aspernatur!</p>
              <b className='text-gray-800'>Our Mission</b>
              <p>Our Misson In Saylani Is to Lorem ipsum dolor sit amet consectetur adipisicing elit.   Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, laboriosam distinctio.</p>
          </div>
      </div>


      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                <b>Quality Assurance:</b>
                <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque voluptas saepe dolorum libero rem?</p>
          </div>

          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                <b>Convinience:</b>
                <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque voluptas saepe dolorum libero rem?</p>
          </div>

          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                <b>Exceptional Customer Service:</b>
                <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque voluptas saepe dolorum libero rem?</p>
          </div>
      </div>

      <NewsletterBox  />

    </div>
  )
}

export default About
