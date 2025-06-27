import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import BASE_URL from '../config';
import UserContext from '../Context/UserContext';
import { GraduationCap, LockKeyhole } from 'lucide-react';
import { useNavigate } from 'react-router';

const SubscriptionPlan = () => {
    const { token } = useContext(UserContext);
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/plans`);
                const formattedPlans = response.data.map(plan => ({
                    id: plan.id,
                    name: plan.name,
                    price: parseInt(plan.price),
                    displayPrice: `KSh ${plan.price.toLocaleString()}`,
                    duration: plan.duration_days === 1 ? 'day' :
                        plan.duration_days === 30 ? 'month' :
                            plan.duration_days === 365 ? 'year' :
                                `${plan.duration_days} days`,
                    features: plan.features,
                    popular: plan.is_popular,
                }));
                setPlans(formattedPlans);
            } catch (err) {
                console.error('Error fetching plans:', err);
                setError('Failed to load subscription plans.');
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-2 sm:px-4 lg:px-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
                    VizLearn Subscription Plans
                </h1>
                <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                    Choose the plan that works best for your learning journey
                </p>
            </div>

            {/* Loading and Error State */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-blue mx-auto" />
                    <p className="mt-4 text-gray-600">Loading subscription plans...</p>
                </div>
            ) : error ? (
                <div className="text-center text-red-600">{error}</div>
            ) : (
                <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative flex flex-col rounded-3xl border border-gray-200 bg-white p-8 shadow-sm ${plan.popular ? 'border-custom-blue ring-2 ring-custom-blue' : ''
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-custom-blue px-3 py-2 text-center text-sm font-semibold text-white">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                            <div className="mt-4 flex items-baseline text-gray-900">
                                <span className="text-4xl font-extrabold tracking-tight">{plan.displayPrice}</span>
                                <span className="ml-1 text-xl font-semibold">/{plan.duration}</span>
                            </div>

                            <ul className="mt-6 space-y-4">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex">
                                        <svg
                                            className="h-6 w-6 flex-shrink-0 text-custom-orange"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="ml-3 text-gray-500">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className="mt-8 block w-full rounded-3xl py-3 px-6 text-center font-medium bg-custom-blue text-white hover:bg-custom-orange"
                                onClick={() => navigate('/billing-and-payments/subscriptions')}>
                                Select Plan
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Why Choose VizLearn section */}
            <div className="mt-16 bg-blue-50 rounded-3xl shadow-2xl p-8 items-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Why Choose VizLearn?</h2>
                <p className="text-gray-600 mb-6 text-center max-w-4xl mx-auto">
                    Our subscription plans are designed to provide flexible learning options for every type of student.
                    Whether you're just starting out or looking to master advanced concepts, we have a plan that fits your needs.
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex items-start">
                        <GraduationCap className='text-white h-12 w-12 bg-custom-orange p-1 rounded-full' />
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Learn at Your Pace</h3>
                            <p className="mt-1 text-gray-600">
                                Access courses anytime, anywhere with our mobile-friendly platform.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <LockKeyhole className='text-white h-12 w-12 bg-custom-orange p-1 rounded-full' />
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Secure Payment</h3>
                            <p className="mt-1 text-gray-600">
                                Your payment information is always protected with M-Pesa's secure system.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlan;
