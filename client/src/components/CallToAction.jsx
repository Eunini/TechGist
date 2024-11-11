import { Button } from 'flowbite-react';

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-gray-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className="flex-1 justify-center flex flex-col mx-5">
            <h2 className='text-2xl'>
                Want to learn more about JavaScript?
            </h2>
            <p className='text-gray-600 my-2'>
                Checkout these resources with 100 JavaScript Projects
            </p>
            <Button className='rounded-xl bg-gray-500 hover:bg-gray-600 dark:bg-gray-500 dark:hover:bg-gray-600 text-white'>
                <a href="" target='_blank' rel='noopener noreferrer'>
                    100 JavaScript Projects
                </a>
            </Button>
        </div>
        <div className="p-7 flex-1 mx-5">
            <img src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg" />
        </div>
    </div>
  )
}