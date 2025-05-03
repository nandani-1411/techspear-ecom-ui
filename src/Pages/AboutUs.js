
import Footer from "../Components/Footer";
import { ThemeContext } from "../Helpers/ThemeContext";
import dell from './Dell_Logo.png'
import hp from './hp_logo.png'
import asus from './Asus.png'
import iball from './IBall_logo.svg.png'
import lenovo from './Lenovo_logo_2015.svg.png'
import React, { useState, useEffect, useContext } from "react";



const stats = [
    { label: 'Transactions every 24 hours', value: '4 million' },
    { label: 'Assets under holding', value: '19 million' },
    { label: 'New users annually', value: '4,000' },
]
const values = [
    {
        name: 'Quality First',
        description:
            'We are committed to providing high-quality laptops, PCs, and components from top brands. Every product we offer is carefully selected to ensure that our customers receive the best technology for their needs.',
    },
    {
        name: 'Transparency & Guidance',
        description:
            'We believe in sharing our knowledge to help our customers make informed decisions. Whether you\'re buying products or booking services, we ensure you understand all your options and make choices that are right for you.',
    },
    {
        name: 'Innovation & Growth',
        description:
            'In the fast-evolving tech world, staying ahead is essential. We continuously update our product offerings and services to provide the latest technology and the best solutions for our customers.',
    },
    {
        name: 'Customer-Centric Service',
        description:
            'Our customers are at the heart of everything we do. From easy online booking for services to personalized product recommendations, we are here to support you every step of the way.',
    },
    {
        name: 'Accountability',
        description:
            'We take pride in being responsible for the products and services we provide. If something doesn\'t meet your expectations, we\'re here to make it right and ensure your satisfaction..',
    },
    {
        name: 'Work-Life Balance',
        description:
            'We understand the value of downtime and balance in life. While we work hard to offer exceptional products and services, we also believe in creating a positive, stress-free experience for our customers',
    },
]
const ImageWithLoader = ({ src, alt }) => {
    const [loading, setLoading] = useState(true);

    const handleImageLoad = () => {
        setLoading(false);
    };

    return (
        <div className="relative">
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-gray-300 animate-pulse rounded-xl">
                    {/* Loader: can be a circle, spinner, or skeleton */}
                    <div className="w-16 h-16 rounded-full bg-gray-400 animate-pulse"></div>
                </div>
            )}
            <img
                alt={alt}
                src={src}
                onLoad={handleImageLoad}
                className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
            />
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
        </div>
    );
};

const AboutUs = () => {

    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useContext(ThemeContext);

    useEffect(() => {
        // Simulate page loading (e.g., network request or heavy assets loading)
        const timer = setTimeout(() => {
            setLoading(false);  // Page is fully loaded
        }, 3000);  // Set to your preferred duration or based on actual load time

        return () => clearTimeout(timer);  // Cleanup timer on component unmount
    }, []);

    return (
        <div className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>


            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <main className="isolate">
                    {/* Hero section */}
                    <div className="relative isolate -z-10">

                        <div
                            aria-hidden="true"
                            className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
                        >
                            <div
                                style={{
                                    clipPath:
                                        'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
                                }}
                                className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[/ff80b5] to-[/9089fc] opacity-30"
                            />
                        </div>
                        <div className="overflow-hidden">
                            <div className="mx-auto max-w-7xl px-6 pb-32 pt-3 sm:pt-2 lg:px-83 lg:pt-3">
                                <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                                    <div className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl">
                                        <h1 className={`text-5xl font-semibold tracking-tight sm:text-6xl 
                                                        bg-gradient-to-r inline-block text-transparent bg-clip-text
                                                        ${isDarkMode ? "from-gray-200 via-gray-400 to-gray-600" : "from-gray-800 via-gray-700 to-gray-600"}`}>
                                            Transforming the Way You Shop for Tech
                                        </h1>
                                        <p className={`mt-8 text-pretty text-lg font-medium sm:max-w-md sm:text-xl/8 lg:max-w-none 
                                            ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                                            <span className={`${isDarkMode ? "text-white" : "text-gray-900"} font-extrabold`}>
                                                Welcome to TechSphear Sales & Services
                                            </span>
                                            , your trusted partner for all things laptops and PCs. Whether you're looking for the latest gadgets or top-notch service, we're here to make technology work for you. We offer a wide selection of laptops and PCs from leading brands, as well as high-quality components for all your computing needs. You can easily book services online, from repairs to upgrades, or browse our extensive collection of accessories and parts. Our platform provides a seamless e-commerce experience, ensuring that you get the products and services you need with convenience and reliability.
                                        </p>

                                    </div>
                                    <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                                        <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                                            <ImageWithLoader
                                                alt="Image 1"
                                                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                                            />
                                        </div>
                                        <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                                            <ImageWithLoader
                                                alt="Image 2"
                                                src="https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                                            />
                                            <ImageWithLoader
                                                alt="Image 3"
                                                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=396&h=528&q=80"
                                            />
                                        </div>
                                        <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                                            <ImageWithLoader
                                                alt="Image 4"
                                                src="https://images.unsplash.com/photo-1670272504528-790c24957dda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=left&w=400&h=528&q=80"
                                            />
                                            <ImageWithLoader
                                                alt="Image 5"
                                                src="https://images.unsplash.com/photo-1670272505284-8faba1c31f7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content section */}
                    <div className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8">
                        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                            <h2 className={`text-pretty text-4xl font-semibold tracking-tight sm:text-5xl 
    ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                Our mission
                            </h2>

                            <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
                                <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
                                    <p className={`text-xl/8 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                        At TechSphear Sales & Services, our mission is simple: to provide a wide range of laptops, PCs,
                                        and components from different leading brands, ensuring that you have access to the best products
                                        for your needs. Whether you're looking for a new device or specific parts, we offer a comprehensive
                                        selection for every type of user.
                                    </p>

                                    <p className={`mt-10 max-w-xl text-base/7 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
                                        We also make it easy for you to book services online, from repairs to upgrades, and access a variety of
                                        components for your PC or laptop. Our platform is designed to provide a seamless e-commerce experience, allowing
                                        you to purchase products and services with convenience and reliability, all in one place.
                                    </p>
                                </div>

                                <div className="lg:flex lg:flex-auto lg:justify-center">
                                    <dl className="w-64 space-y-8 xl:w-80">
                                        {stats.map((stat) => (
                                            <div key={stat.label} className="flex flex-col-reverse gap-y-4">
                                                <dt className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                                    {stat.label}
                                                </dt>
                                                <dd className={`text-5xl font-semibold tracking-tight 
              ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                                    {stat.value}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Image section */}
                    <div className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
                        <img
                            alt=""
                            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
                            className="aspect-[5/2] w-full object-cover xl:rounded-3xl"
                        />
                    </div>

                    {/* Values section */}
                    <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <h2 className={`text-pretty text-4xl font-semibold tracking-tight sm:text-5xl 
                                         ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                Our values
                            </h2>

                            <p className={`mt-6 text-lg/8 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                At TechSphear Sales & Services, we operate with a set of core values that guide everything we do.
                            </p>
                        </div>

                        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base/7 
                                        sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                            {values.map((value) => (
                                <div key={value.name}>
                                    <dt className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                        {value.name}
                                    </dt>
                                    <dd className={`mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                        {value.description}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                    </div>

                    {/* Logo cloud */}
                    <div className="relative isolate -z-10 mt-32 sm:mt-48">
                        <div className="mx-auto max-w-3xl px-6 lg:px-8 mt-0 mb-10">
                            <h2 className={`text-center text-lg/8 font-semibold 
                                            ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                Trusted by Leading Brands and Innovators
                            </h2>

                            <div className="mx-auto  mt-10 grid max-w-lg grid-cols-4 items-center gap-x-12 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-16 lg:mx-0 lg:max-w-none lg:grid-cols-5">
                                <img
                                    alt="Dell"
                                    src={dell}
                                    width={200}
                                    height={72}
                                    className="col-span-2 max-h-20 w-full object-contain lg:col-span-1 bg-white"
                                />
                                <img
                                    alt="Asus"
                                    src={asus}
                                    width={200}
                                    height={64}
                                    className="col-span-2 max-h-20 w-full object-contain lg:col-span-1"
                                />
                                <img
                                    alt="Iball"
                                    src={iball}
                                    width={200}
                                    height={64}
                                    className="col-span-2 max-h-20 w-full object-contain lg:col-span-1"
                                />
                                <img
                                    alt="Hp"
                                    src={hp}
                                    width={200}
                                    height={64}
                                    className="col-span-2 max-h-20 w-full object-contain sm:col-start-2 lg:col-span-1"
                                />
                                <img
                                    alt="Lenovo"
                                    src={lenovo}
                                    width={200}
                                    height={64}
                                    className="col-span-2 col-start-2 max-h-20 w-full object-contain sm:col-start-auto lg:col-span-1"
                                />
                            </div>
                        </div>

                    </div>

                </main>
            )}
            <Footer />
        </div>
    )
}

export default AboutUs;