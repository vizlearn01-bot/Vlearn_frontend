import { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { 

  ChevronRight,
 
} from 'lucide-react';


function Home() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const URL = 'https://nexus-backend-kia6.onrender.com/categories/';

  // Fetching data on the categories from the JSON file
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(URL);
        console.log(response.data);
        setCategories(response.data);
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
      <section className="flex min-h-screen bg-gray-300 font-poppins">
      <div className="container mx-auto px-6 pt-20 pb-24 mt-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold  md:leading-snug leading-normal">
                Discover the Joy of <span className="text-custom-blue">Scientific Learning</span>
              </h1>
              <p className="text-xl w-full">
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
            <div className="animate-float">
              <img 
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
                alt="Science Experiment"
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="h-fit">
        <h2 className="text-4xl font-semibold mb-8 text-custom-orange text-center">
          Dive into our vast video library
        </h2>
        <div id="categories" className="relative">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[20vh]">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-custom-orange border-solid"></div>
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
              {categories.map((category) => (
                <Link to="dashboard" key={category.id}>
                  <div className="carousel-item">
                    <img
                      src={`https://res.cloudinary.com/dfycvaiv7/${category.image}`}
                      alt={category.title}
                      className="p-4 items-center w-3/4 md:w-96 md:max-w-xs h-48 rounded-3xl object-cover drop-shadow-3xl"
                    />
                    <p className="text-sm font-normal text-center mt-6">{category.title}</p>
                  </div>
                </Link>
              ))}
            </Carousel>
          )}
        </div>
      </section>

      <section id="how-it-works" className="py-16 px-4 h-auto mt-16">
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
      </section>

      <Footer />
    </>
  );
}

export default Home;
