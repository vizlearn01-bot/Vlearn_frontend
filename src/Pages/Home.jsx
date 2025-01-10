import { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
// import { Link } from 'react-router-dom';
import { Rocket,Brain,TestTube,ChevronRight, GraduationCap} from 'lucide-react';


function Home() {
  // const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const URL = 'https://nexus-backend-kia6.onrender.com/categories/';

  // Fetching data on the categories from the JSON file
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(URL);
        console.log(response.data);
        // setCategories(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 4,
    },
    tablet: {
      breakpoint: { max: 1023, min: 464 },
      items: 2,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  return (
    <>
      <Navbar />
      <section className="flex min-h-fit bg-gray-100 font-poppins">
      <div className="container mx-auto px-6 pb-24 mt-40">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold  md:leading-snug leading-normal">
                Discover the Joy of <span className="text-custom-blue">Scientific Learning</span>
              </h1>
              <p className="text-xl w-5/6">
                Transform your classroom into an interactive laboratory. Engage students with hands-on experiments and comprehensive learning tools.
              </p>
              <div className="flex space-x-4">
                <button className="bg-custom-blue text-white px-8 py-3 rounded-full hover:bg-custom-orange transition-colors flex items-center">
                  Start Learning <ChevronRight className="ml-2 h-5 w-5" />
                </button>
                <button className="border-2 border-custom-blue text-custom-blue px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors hover:border-custom-orange">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="hover:cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
                alt="Science Experiment"
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="h-fit p-10">
        <h2 className="text-4xl font-semibold mb-8 text-custom-blue text-center">
          Dive into our vast video library
        </h2>
        <div id="categories" className="">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[20vh]">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-custom-blue border-solid"></div>
            </div>
          ) : (
            <Carousel
              swipeable={true}
              draggable={true}
              showDots={false}
              responsive={responsive}
              ssr={true}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={5000}
              keyBoardControl={true}
              customTransition="transform 500ms ease-in-out"
              transitionDuration={2000}
              containerClassName="carousel-container"
              removeArrowOnDeviceType={["tablet", "mobile"]}
              deviceType={"desktop"}
              dotListClassName="absolute bottom-0 left-0 right-0 flex justify-center mb-4 custom-dot-list-style"
              itemClassName="carousel-item-wrapper"
              arrows={true}
              renderButtonGroupOutside={true}
            >
<div className="group  overflow-hidden mx-5 rounded-3xl">
  <img
    src="https://www.thoughtco.com/thmb/6MsMmUK27akFhb8i89kj95J5iko=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-545286316-433dd345105e4c6ebe4cdd8d2317fdaa.jpg"
    alt="chemistry"
    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 rounded-3xl mx-5  to-transparent opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <h3 className="text-xl font-bold text-white mb-2">Chemistry Experiment</h3>
      <p className="text-gray-200">Chemical Reactions</p>
    </div>
  </div>
</div>

<div className="group  overflow-hidden mx-5 rounded-3xl">
  <img
    src="https://marandahighschool.sc.ke/wp-content/uploads/2023/10/360_F_235711378_x8BsTR14c7Iu9myWbXVBk2DHf7dHsdgg.jpeg"
    alt="Project 2"
    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 rounded-3xl mx-5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <h3 className="text-xl font-bold text-white mb-2">Biology</h3>
      <p className="text-gray-200">Human anatomy</p>
    </div>
  </div>
</div>

<div className="group  overflow-hidden mx-5 rounded-3xl">
  <img
    src="https://t4.ftcdn.net/jpg/06/32/85/07/360_F_632850771_wxhuaCHM19y63i5zeYsZtEYTEU3LUbWc.jpg"
    alt="Project 3"
    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 rounded-3xl mx-5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <h3 className="text-xl font-bold text-white mb-2">Physics Lab</h3>
      <p className="text-gray-200">Forces and Motion</p>
    </div>
  </div>
</div>

<div className="group  overflow-hidden mx-5 rounded-3xl">
  <img
    src="https://astro.cornell.edu/sites/default/files/styles/pano/public/2022-11/CarinaNebulaWebb.jpg?h=42541cb7&itok=ROrFJymI"
    alt="Project 4"
    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 rounded-3xl mx-5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <h3 className="text-xl font-bold text-white mb-2">Astronomy Observation</h3>
      <p className="text-gray-200">Stars and Galaxies</p>
    </div>
  </div>
</div>
</Carousel>
          )}
        </div>
      </section>

        <section className='h-fit p-20 bg-slate-200'>
        <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Why Vlearn?</h2>
        <div className="grid md:grid-cols-3 text-center gap-12">

        {/* Feature 1 */}
        <div className="p-4 rounded-3xl bg-white shadow-lg hover:shadow-2xl hover:scale-105 hover:cursor-pointer transition-shadow duration-300 transform ">
        <div className="mb-4 flex justify-center items-center">
          <Brain className="h-12 w-12 text-custom-blue" />
        </div>
        <h3 className="text-xl font-semibold mb-4">Interactive Learning</h3>
        <p className="text-gray-600">Engage with interactive 3D models and simulations</p>
        </div>

        {/* Feature 2 */}
        <div className="p-4 rounded-3xl bg-white shadow-lg hover:shadow-2xl hover:scale-105 hover:cursor-pointer transition-shadow duration-300 transform ">
        <div className="mb-4 flex justify-center items-center">
          <TestTube className="h-12 w-12 text-custom-blue" />
        </div>
        <h3 className="text-xl font-semibold mb-4">Virtual Labs</h3>
        <p className="text-gray-600">Access state-of-the-art virtual laboratory experiences</p>
        </div>

        {/* Feature 3 */}
        <div className="p-4 rounded-3xl bg-white shadow-lg hover:shadow-2xl hover:scale-105 hover:cursor-pointer transition-shadow duration-300 transform ">
        <div className="mb-4 flex justify-center items-center">
          <Rocket className="h-12 w-12 text-custom-blue" />
        </div>
        <h3 className="text-xl font-semibold mb-4">Progress Tracking</h3>
        <p className="text-gray-600">Monitor student progress with detailed analytics</p>
        </div>

        </div>
        </div>

        </section>
        <section className="bg-custom-blue py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Ready to Transform Your Science Class?</h2>
          <button className="bg-white text-custom-blue px-8 py-3 rounded-full hover:bg-gray-100 transition-colors inline-flex items-center">
            Get Started Now <GraduationCap className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>
      {/* <section id="how-it-works" className="py-16 px-4 h-auto mt-16">
        <div className="flex flex-col md:flex-row items-center justify-around mx-auto">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <img
              src="/images/experiments.webp"
              className="mx-auto w-1/2 object-cover rounded-[58%_42%_88%_12%/44%_37%_63%_56%]"
              alt="earn"
            />
          </div>
          <div className="lg:w-1/3 md:w-1/2 text-center md:text-left">
            <h2 className="text-2xl font-medium mb-4 text-custom-orange">
              Explain concepts faster with learning resources
            </h2>
            <p className="text-base font-normal mb-6 mx-auto md:mx-0">
              Use pre-made visuals to clarify concepts quickly, capture student&apos;s attention, and reduce the need for
              repeated explanations.
            </p>
            <Link to="/dashboard">
              <button className="bg-custom-orange hover:bg-custom-orange text-white text-base font-medium py-2 px-2.5 rounded-3xl">
                Learn more
              </button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col md:flex-row mt-12 space-x-0 md:space-x-4 items-center justify-around mx-auto">
          <div className="lg:w-1/3 md:w-1/2 text-center md:text-right mb-8 md:mb-0">
            <h2 className="text-2xl font-medium mb-4 text-custom-orange">
              Students can now revisit your science experiments anytime.
            </h2>
            <p className="text-base font-normal mb-6 mx-auto md:mx-0">
              Students can now access your science experiments on demand, enabling them to review concepts anytime they
              need.
            </p>
            <Link to="/products">
              <button className="bg-custom-orange hover:bg-custom-orange text-white text-base font-medium py-2 px-2.5 rounded-3xl">
                Learn more
              </button>
            </Link>
          </div>
          <div className="w-full md:w-1/2">
            <img
              src="/images/experiments.webp"
              className="mx-auto w-1/2 object-cover rounded-[58%_42%_88%_12%/44%_37%_63%_56%]"
              alt="experiments"
            />
          </div>
        </div>
      </section> */}

      <Footer />
    </>
  );
}

export default Home;
