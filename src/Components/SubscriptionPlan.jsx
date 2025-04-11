import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GraduationCap, LockKeyhole } from 'lucide-react';
import BASE_URL from '../config';
import UserContext from '../Context/UserContext';

const SubscriptionPlan = () => {
    const { token } = useContext(UserContext)
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [mpesaNumber, setMpesaNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [plans, setPlans] = useState([]);
    const [error, setError] = useState(null);
    const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch subscription plans from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [plansResponse, subscriptionResponse] = await Promise.all([
                    axios.get(`${BASE_URL}/plans`),
                    axios.get(`${BASE_URL}/subscriptions`, {
                        headers: { Authorization: `Bearer ${token.access}` },
                    })
                ]);

                // Transform plans data
                const transformedPlans = plansResponse.data.map(plan => ({
                    id: plan.id,
                    name: plan.name,
                    price: parseInt(plan.price), // Ensure price is stored as integer
                    displayPrice: `KSh ${plan.price.toLocaleString()}`, // Formatted for display
                    duration: plan.duration_days === 30 ? 'month' :
                        plan.duration_days === 365 ? 'year' :
                            `${plan.duration_days} days`,
                    features: plan.features,
                    popular: plan.is_popular
                }));
                setPlans(transformedPlans);
                setHasActiveSubscription(subscriptionResponse.data.is_active);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load data');
                console.error('API Error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [token]);

    // Handle plan selection
    const handleSelectPlan = (plan) => {
        if (hasActiveSubscription) {
            setError('You already have an active subscription');
            return;
        }
        setSelectedPlan(plan);
        setShowPaymentPopup(true);
        setError(null);
    };

      // Format phone number to string (254XXXXXXXXX)
      const formatMpesaNumber = (phoneNumber) => {
        // Remove all non-digit characters
        const digitsOnly = phoneNumber.replace(/\D/g, '');
      
        // Convert to string in 254 format
        if (digitsOnly.startsWith('254')) {
            return digitsOnly;
        } else if (digitsOnly.startsWith('0')) {
            return `254${digitsOnly.substring(1)}`;
        }
        return `254${digitsOnly}`;
    };

    // Handle payment submission
    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setError(null);

        try {
            const formattedPhone = formatMpesaNumber(mpesaNumber);
            
            await axios.post(`${BASE_URL}/mpesa/pay/`, {
                phone: formattedPhone, // Sent as string (254XXXXXXXXX)
                amount: selectedPlan.price, // Sent as integer
                plan_id: selectedPlan.id
            }, {
                headers: { Authorization: `Bearer ${token.access}` },
            });

            // Payment successful
            setIsProcessing(false);
            setPaymentSuccess(true);
            setHasActiveSubscription(true);

            // Close popup after 3 seconds
            setTimeout(() => {
                setShowPaymentPopup(false);
                setPaymentSuccess(false);
                setMpesaNumber('');
            }, 3000);
        } catch (err) {
            setIsProcessing(false);
            setError(err.response?.data?.error || 'Payment failed. Please try again.');
            console.error('Payment Error:', err);
        }
    };



    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-10 px-2 sm:px-4 lg:px-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-blue mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading subscription data...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !showPaymentPopup) {
        return (
            <div className="min-h-screen bg-gray-50 py-10 px-2 sm:px-4 lg:px-6 flex items-center justify-center">
                <div className="bg-white p-8 rounded-3xl shadow-md max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="bg-custom-blue text-white rounded-3xl px-6 py-2 hover:bg-custom-orange"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Active subscription notice
    if (hasActiveSubscription) {
        return (
            <div className="min-h-screen bg-gray-50 py-10 px-2 sm:px-4 lg:px-6 flex items-center justify-center">
                <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg
                            className="h-6 w-6 text-green-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription Active</h2>
                    <p className="text-gray-600 mb-6">
                        You already have an active subscription. You can manage it in your account settings.
                    </p>
                    <button
                        onClick={() => window.location.href = 'dashboard/user'}
                        className="bg-custom-blue text-white rounded-3xl px-6 py-2 hover:bg-custom-orange"
                    >
                        Go to Account
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-2 sm:px-4 lg:px-6">
            {/* Subscription plans section */}
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        VizLearn Subscription Plans
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                        Choose the plan that works best for your learning journey
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-5">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative flex flex-col rounded-3xl border border-gray-200 bg-white p-8 shadow-sm ${plan.popular ? 'border-custom-blue ring-2 ring-custom-blue' : ''}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-custom-blue px-3 py-2 text-center text-sm font-semibold text-white">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>

                            <div className="mt-4 flex items-baseline text-gray-900">
                                <span className="text-4xl font-extrabold tracking-tight">
                                    {plan.displayPrice}
                                </span>
                                <span className="ml-1 text-xl font-semibold">
                                    /{plan.duration}
                                </span>
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
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="ml-3 text-gray-500">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSelectPlan(plan)}
                                className={`mt-8 block w-full rounded-3xl py-3 px-6 text-center font-medium ${plan.popular
                                    ? 'bg-custom-blue text-white hover:bg-custom-orange'
                                    : 'bg-blue-50 text-custom-blue hover:bg-custom-orange hover:text-white'
                                    }`}
                            >
                                Select Plan
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Popup */}
            {showPaymentPopup && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div
                            className="fixed inset-0 transition-opacity"
                            aria-hidden="true"
                            onClick={() => {
                                if (!isProcessing) {
                                    setShowPaymentPopup(false);
                                    setPaymentSuccess(false);
                                    setMpesaNumber('');
                                    setError(null);
                                }
                            }}
                        >
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        {/* Popup content */}
                        <div className="inline-block transform overflow-hidden rounded-3xl bg-white text-left align-bottom shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="absolute top-0 right-0 pt-4 pr-4">
                                    <button
                                        type="button"
                                        className="rounded-3xl bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                        onClick={() => {
                                            if (!isProcessing) {
                                                setShowPaymentPopup(false);
                                                setPaymentSuccess(false);
                                                setMpesaNumber('');
                                                setError(null);
                                            }
                                        }}
                                        disabled={isProcessing}
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg
                                            className="h-6 w-6"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                {!paymentSuccess ? (
                                    <>
                                        <div className="sm:flex sm:items-start">
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                                <h3 className="text-2xl font-medium leading-6 text-gray-900">
                                                    Complete Your Subscription
                                                </h3>
                                                <div className="mt-4">
                                                    <p className="text-gray-600">
                                                        You're subscribing to the{' '}
                                                        <span className="font-extrabold">
                                                            {selectedPlan?.name}
                                                        </span>{' '}
                                                        plan for {selectedPlan?.price} per{' '}
                                                        {selectedPlan?.duration}.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                                                <p>{error}</p>
                                            </div>
                                        )}

                                        <form onSubmit={handlePaymentSubmit} className="mt-6">
                                            <div>
                                                <label
                                                    htmlFor="mpesa-number"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    M-Pesa Phone Number
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="tel"
                                                        id="mpesa-number"
                                                        className="block w-full rounded-3xl border-gray-300 shadow-sm focus:border-custom-blue focus:ring-custom-blue p-3 border"
                                                        placeholder="e.g. 0712345678 or +254712345678"
                                                        value={mpesaNumber}
                                                        onChange={(e) => setMpesaNumber(e.target.value)}
                                                        required
                                                        pattern="^(?:254|\+254|0)?(7\d{8})$"
                                                        title="Enter a valid Kenyan phone number"
                                                        disabled={isProcessing}
                                                    />
                                                </div>
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Enter your M-Pesa registered phone number
                                                </p>
                                            </div>

                                            <div className="mt-8">
                                                <button
                                                    type="submit"
                                                    disabled={isProcessing}
                                                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-3xl shadow-sm text-lg font-medium text-white ${isProcessing
                                                        ? 'bg-gray-500 cursor-not-allowed'
                                                        : 'bg-green-600 hover:bg-green-700'
                                                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                                >
                                                    {isProcessing
                                                        ? 'Processing...'
                                                        : `Pay ${selectedPlan?.displayPrice}`}
                                                </button>
                                            </div>
                                        </form>

                                        <div className="mt-8 bg-blue-100 p-6 rounded-3xl">
                                            <h4 className="text-lg font-medium">
                                                How to pay with M-Pesa:
                                            </h4>
                                            <ol className="mt-2 list-decimal list-inside text-gray-600 space-y-1 p-2">
                                                <li>Enter your M-Pesa registered phone number</li>
                                                <li>Click "Pay" button</li>
                                                <li>Check your phone for M-Pesa prompt</li>
                                                <li>Enter your M-Pesa PIN to complete payment</li>
                                            </ol>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                            <svg
                                                className="h-6 w-6 text-green-600"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="mt-3 text-2xl font-medium text-gray-900">
                                            Payment Successful!
                                        </h3>
                                        <div className="mt-4">
                                            <p className="text-gray-600">
                                                Thank you for subscribing to VizLearn{' '}
                                                {selectedPlan?.name} plan.
                                            </p>
                                            <p className="text-gray-600 mt-2">
                                                Your access will be activated shortly.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Why Choose VizLearn section */}
            <div className="mt-8 bg-blue-50 rounded-3xl shadow-2xl  p-8 items-center">
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