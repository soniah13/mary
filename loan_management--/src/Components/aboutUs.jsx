import React from 'react';


function AboutUs() {
  return (
    <div className="bg-cover bg-center min-h-screen flex items-center justify-center" 
    style={{ backgroundImage: "url('loan_homepage.jpg')" }}>
      <div className="max-w-4xl mx-auto p-6 bg-black bg-opacity-75 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-white">About Us</h1>
        <p className="mb-4 text-white">
          Welcome to <strong>Yangu Mkopo</strong>, your trusted partner in financial solutions. We are dedicated to providing a seamless and efficient loan management experience tailored to meet the diverse needs of our customers.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-white">Our Mission</h2>
        <p className="mb-4 text-white">
          At Yangu Mkopo, our mission is to empower individuals and businesses by offering accessible and flexible loan options. We believe that everyone deserves financial support, and we strive to make the borrowing process simple, transparent, and fair.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-white">Who We Are</h2>
        <p className="mb-4 text-white">
          Founded by a team of financial experts and technology enthusiasts, Yangu Mkopo combines years of industry experience with innovative technology to create a platform that enhances the borrowing experience. Our goal is to bridge the gap between lenders and borrowers, ensuring that your financial needs are met promptly and responsibly.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-white">What We Offer</h2>
        <ul className="list-disc list-inside mb-4 text-white">
          <li><strong>Personal Loans:</strong> Quick and easy personal loan solutions for individuals seeking to meet their financial goals.</li>
          <li><strong>Business Loans:</strong> Tailored loan options designed for startups and established businesses.</li>
          <li><strong>Transparent Terms:</strong> Clear terms, competitive interest rates, and no hidden fees.</li>
          <li><strong>User-Friendly Platform:</strong> Manage your loans from anywhere, anytime with our digital platform.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2 text-white">Our Values</h2>
        <ul className="list-disc list-inside mb-4 text-white">
          <li><strong>Customer-Centric:</strong> We put our customers at the heart of everything we do.</li>
          <li><strong>Integrity:</strong> Adhering to the highest standards of honesty and ethics.</li>
          <li><strong>Innovation:</strong> Continuously seeking new ways to improve our services.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2 text-white">Join Us</h2>
        <p className="mb-4 text-white">
          Whether you're looking to apply for a loan or seeking support in managing your finances, Yangu Mkopo is here to help. Together, let's build a financially secure future.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-white">Contact Us</h2>
        <p className="text-white">
          For any inquiries or assistance, please feel free to reach out to our dedicated support team at 
          <a href="mailto:support@yangu.mkopo" className="text-blue-500 underline"> support@yangu.mkopo</a>.
        </p>
      </div>
    </div>
  );
}

export default AboutUs;
