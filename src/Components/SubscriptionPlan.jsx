import React, { useState } from 'react';

const SubscriptionPlan = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const plans = [
    {
      id: 1,
      name: 'Basic',
      price: 'KSh 500',
      duration: 'month',
      features: [
        'Access to basic courses',
        'Limited quizzes',
        'Email support',
        '1 device at a time'
      ],
      popular: false
    },
    {
      id: 2,
      name: 'Standard',
      price: 'KSh 1,200',
      duration: 'month',
      features: [
        'All basic features',
        'Access to premium courses',
        'Unlimited quizzes',
        'Priority email support',
        '2 devices at a time'
      ],
      popular: true
    },
    {
      id: 3,
      name: 'Premium',
      price: 'KSh 2,500',
      duration: 'month',
      features: [
        'All standard features',
        'Access to all courses',
        'Certificates',
        '24/7 support',
        '4 devices at a time',
        'Downloadable content'
      ],
      popular: false
    }
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentPopup(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Close popup after 3 seconds
      setTimeout(() => {
        setShowPaymentPopup(false);
        setPaymentSuccess(false);
        setMpesaNumber('');
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* subscription plans */}
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
              className={`relative flex flex-col rounded-3xl border border-gray-200 bg-white p-8 shadow-sm ${
                plan.popular ? 'border-custom-blue ring-2 ring-custom-blue' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-custom-blue px-3 py-2 text-center text-sm font-semibold text-white">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
              
              <div className="mt-4 flex items-baseline text-gray-900">
                <span className="text-5xl font-extrabold tracking-tight">
                  {plan.price}
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
                className={`mt-8 block w-full rounded-3xl py-3 px-6 text-center font-medium ${
                  plan.popular
                    ? 'bg-custom-blue text-white hover:bg-custom-orange'
                    : 'bg-blue-50 text-custom-blue hover:bg-blue-100'
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
                setShowPaymentPopup(false);
                setPaymentSuccess(false);
                setMpesaNumber('');
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
                      setShowPaymentPopup(false);
                      setPaymentSuccess(false);
                      setMpesaNumber('');
                    }}
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
                            placeholder="e.g. +254712345678"
                            value={mpesaNumber}
                            onChange={(e) => setMpesaNumber(e.target.value)}
                            required
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
                          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-3xl shadow-sm text-lg font-medium text-white ${
                            isProcessing
                              ? 'bg-gray-500'
                              : 'bg-green-600 hover:bg-green-700'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                        >
                          {isProcessing
                            ? 'Processing...'
                            : `Pay ${selectedPlan?.price}`}
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
    </div>
  );
};

export default SubscriptionPlan;