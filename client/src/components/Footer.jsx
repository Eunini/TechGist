import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub} from 'react-icons/bs';
export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-gray-700 bg-color-light'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Link
              to='/'
              className='self-center whitespace-nowrap text-lg sm:text-3xl font-semibold dark:text-white'
            >
              𝕋𝕖𝕔𝕙𝔾𝕚𝕤𝕥
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <Footer.Title title='About' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://dribbble.com/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                      Hot Projects
                </Footer.Link>
                <Footer.Link
                  href='/about'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                 About TechGist
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Follow us' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://www.github.com/Eunini'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Github
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Legal' />
              <Footer.LinkGroup col>
                <Footer.Link href='#'>Privacy Policy</Footer.Link>
                <Footer.Link href='#'>Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright
            href='#'
            by="TechGist"
            year={new Date().getFullYear()}
          />
           <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href='#' icon={BsFacebook} className='hover:text-blue-500' />
            <Footer.Icon href='#' icon={BsInstagram} className='hover:text-blue-500' />
            <Footer.Icon href='#' icon={BsTwitter} className='hover:text-blue-500' />
            <Footer.Icon href='https://github.com/Eunini' icon={BsGithub} className='hover:text-blue-500' />
          </div>
        </div>
      </div>
    </Footer>
  );
}
