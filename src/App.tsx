import React, { useState } from 'react';
import {
  Home,
  DollarSign,
  Shield,
  Calculator,
  ChevronRight,
} from 'lucide-react';
import CalculadoraAmortizacao from './CalculadoraAmortizacao';

const TestimonialCard = ({
  quote,
  author,
}: {
  quote: string;
  author: string;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <p className="text-gray-600 italic mb-4">"{quote}"</p>
    <p className="text-gray-800 font-semibold">- {author}</p>
  </div>
);

function App() {
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Home className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-semibold">Crédito Patrimonial</span>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            Contact Us
          </button>
        </nav>
      </header>

      <main>
        {!showCalculator ? (
          <>
            <section className="container mx-auto px-6 py-16 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Do you have big projects in mind?
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Understand the opportunity cost to make them happen.
              </p>
              <button
                onClick={() => setShowCalculator(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center mx-auto"
              >
                Access Opportunity Cost Calculator
                <Calculator className="ml-2 h-5 w-5" />
              </button>
            </section>

            <section className="bg-white py-16">
              <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  Understanding Opportunity Cost
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <DollarSign className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Financial Decision Making
                    </h3>
                    <p className="text-gray-600">
                      Learn how to evaluate the true cost of your choices.
                    </p>
                  </div>
                  <div className="text-center">
                    <Home className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Real Estate Potential
                    </h3>
                    <p className="text-gray-600">
                      Discover the hidden value in your property.
                    </p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Secure Your Future
                    </h3>
                    <p className="text-gray-600">
                      Make informed decisions to protect your assets.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-16 bg-gray-100">
              <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  Benefits of Real Estate Collateral
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">
                      Lower Interest Rates
                    </h3>
                    <p className="text-gray-600">
                      Secure more favorable terms with your property as
                      collateral.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">
                      Higher Borrowing Limits
                    </h3>
                    <p className="text-gray-600">
                      Access larger amounts of credit to fund your big projects.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">
                      Flexible Repayment Options
                    </h3>
                    <p className="text-gray-600">
                      Tailor your repayment schedule to suit your financial
                      situation.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Tax Benefits</h3>
                    <p className="text-gray-600">
                      Potential tax advantages when using real estate as
                      collateral.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-16">
              <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  What Our Clients Say
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <TestimonialCard
                    quote="Using my property as collateral allowed me to start my dream business. The opportunity cost calculator helped me make the right decision."
                    author="Sarah J., Entrepreneur"
                  />
                  <TestimonialCard
                    quote="I was hesitant at first, but the security and terms offered made it an easy choice. Now I'm renovating my home and increasing its value."
                    author="Michael T., Homeowner"
                  />
                </div>
              </div>
            </section>

            <section className="bg-blue-600 text-white py-16">
              <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Explore Your Options?
                </h2>
                <p className="text-xl mb-8">
                  Use our opportunity cost calculator to make an informed
                  decision.
                </p>
                <button
                  onClick={() => setShowCalculator(true)}
                  className="bg-white text-blue-600 px-6 py-3 rounded-md text-lg hover:bg-gray-100 transition duration-300 flex items-center justify-center mx-auto"
                >
                  Start Calculating
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </section>
          </>
        ) : (
          <CalculadoraAmortizacao />
        )}
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 Crédito Patrimonial. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
