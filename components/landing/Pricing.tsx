import React from 'react';

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    features: ['5 mockups per month', 'Basic customization', 'Standard export quality'],
  },
  {
    name: 'Pro',
    price: '$19/month',
    features: ['Unlimited mockups', 'Advanced customization', 'High-quality exports', 'Priority support'],
  },
 
];

export default function Pricing() {
  return (
    <section className="py-20 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan, index) => (
          <div key={index} className="bg-[#1F1F1F] p-6 rounded-lg text-center">
            <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold text-button-hover mb-6">{plan.price}</p>
            <ul className="text-left mb-6">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="bg-button-default hover:bg-button-hover text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 w-full">
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
