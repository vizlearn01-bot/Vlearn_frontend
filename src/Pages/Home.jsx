import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';
import { Rocket, Brain, TestTube, ChevronRight, GraduationCap } from 'lucide-react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

function Home() {
  // const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    date: '',
  })

  const form = useRef()

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(e.target.value)
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('Demo_booking', 'template_9hq8xvb', form.current, 'gjyESRJ1hLiyb6BrV')
      .then(
        () => {
          successAlert();
          setFormData({
            name: '',
            email: '',
            school: '',
            date: '',
          })
        },
        () => {
          failureAlert();
          setFormData({
            name: '',
            email: '',
            school: '',
            date: '',
          })
        },
      );
    // function to show success alert prompt
    const successAlert = () => {
      Swal.fire({
        title: 'Success',
        text: 'Thank you for booking a demo',
        icon: 'success',
        confirmButtonText: 'OK',
      })
    };

    // function to show failure alert prompt
    const failureAlert = (message) => {
      Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    };
  };

  const Categories = [
    {
      image:
        "https://www.thoughtco.com/thmb/6MsMmUK27akFhb8i89kj95J5iko=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-545286316-433dd345105e4c6ebe4cdd8d2317fdaa.jpg",
      title: "Chemistry Experiment",
      description: "Chemical Reactions",
    },
    {
      image:
        "https://marandahighschool.sc.ke/wp-content/uploads/2023/10/360_F_235711378_x8BsTR14c7Iu9myWbXVBk2DHf7dHsdgg.jpeg",
      title: "Biology",
      description: "Human anatomy",
    },
    {
      image:
        "https://t4.ftcdn.net/jpg/06/32/85/07/360_F_632850771_wxhuaCHM19y63i5zeYsZtEYTEU3LUbWc.jpg",
      title: "Physics Lab",
      description: "Forces and Motion",
    },
    {
      image:
        "https://astro.cornell.edu/sites/default/files/styles/pano/public/2022-11/CarinaNebulaWebb.jpg?h=42541cb7&itok=ROrFJymI",
      title: "Astronomy Observation",
      description: "Stars and Galaxies",
    },
  ];
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
                <Link to="/dashboard">
                  <button className="bg-custom-blue text-white px-8 py-3 rounded-full hover:bg-custom-orange transition-colors flex items-center">
                    Start Learning <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
                </Link>
                <AnchorLink href='#demo'>
                  <button className="border-2 border-custom-blue text-custom-blue px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors hover:border-custom-orange">
                    Book a demo
                  </button>
                </AnchorLink>
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
              {Categories.map((item, index) => (
                <div key={index} className="group overflow-hidden mx-5 rounded-3xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 rounded-3xl mx-5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-200">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
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
        <div className="container mx-auto px-6 text-center" id='demo'>
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Science Class?</h2>
          <form
            ref={form}
            onSubmit={handleSubmit}
            className="flex flex-col items-center mx-auto mt-8 w-2/3 gap-6 sm:gap-8 bg-white shadow-lg rounded-3xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-custom-blue mb-4">
              Schedule a Demo
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Fill in the details below to book your demo session.
            </p>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Full Name"
              className="py-3 px-4 rounded-3xl  w-full border border-gray-300 focus:ring-2 focus:ring-custom-blue focus:outline-none"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Email Address"
              className="py-3 px-4 rounded-3xl w-full border border-gray-300 focus:ring-2 focus:ring-custom-blue focus:outline-none"
            />
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleInputChange}
              required
              placeholder="Institution Name"
              className="py-3 px-4 rounded-3xl w-full border border-gray-300 focus:ring-2 focus:ring-custom-blue focus:outline-none"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="py-3 px-4 rounded-3xl w-full border border-gray-300 focus:ring-2 focus:ring-custom-blue focus:outline-none"
            />
            <button
              type="submit"
              className="bg-custom-blue text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300 ease-in-out flex items-center justify-center">
              Get Started Now
              <GraduationCap className="ml-2 h-5 w-5" />
            </button>
          </form>

        </div>
      </section>
      <Footer />
    </>
  );
}

export default Home;
