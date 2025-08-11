import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Home from './features/common/Home';
import About from './features/common/About';
import SignIn from './features/authentication/SignIn';
import Dashboard from './features/dashboard/Dashboard';
import Projects from './features/common/Projects';
import SignUp from './features/authentication/SignUp';
import Header from './features/common/Header';
import Footer from './features/common/Footer';
import PrivateRoute from './features/common/PrivateRoute';
import OnlyAdminPrivateRoute from './features/common/OnlyAdminPrivateRoute';
import CreatePost from './features/posts/CreatePost';
import UpdatePost from './features/posts/UpdatePost';
import PostPage from './features/posts/PostPage';
import ScrollToTop from './features/common/ScrollToTop';
import Search from './features/common/Search';
import ExploreTopics from './pages/ExploreTopics';
import Profile from './pages/Profile';
import ThemeProvider from './features/common/ThemeProvider';
import { ToastProvider } from './components/UI/ToastProvider';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Helmet>
          <title>TechGist</title>
          <meta name='description' content='TechGist - Articles on Cloud, AI/ML, DevOps, and Future Tech.' />
          <meta property='og:site_name' content='TechGist' />
        </Helmet>
        <ThemeProvider>
          <ToastProvider>
          <ScrollToTop />
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/search' element={<Search />} />
            <Route path='/explore-topics' element={<ExploreTopics />} />
            <Route path='/profile/:userId' element={<Profile />} />
            <Route element={<PrivateRoute />}>
              <Route path='/dashboard' element={<Dashboard />} />
            </Route>
            <Route element={<OnlyAdminPrivateRoute />}>
              <Route path='/create-post' element={<CreatePost />} />
              <Route path='/update-post/:postId' element={<UpdatePost />} />
            </Route>
            <Route path='/projects' element={<Projects />} />
            <Route path='/post/:postSlug' element={<PostPage />} />
          </Routes>
          <Footer />
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}