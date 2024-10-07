import React from "react";

function ThankYou() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 sm:p-16 bg-gray-100 text-center">
      <h1 className="text-4xl font-bold mb-6">Thank You and Sorry!</h1>
      <p>
        It sucks to be asked again and again if you are a human or not right?
      </p>
      <p className="text-lg mb-4">
        This test was part of an exciting{" "}
        <a
          href="https://github.com/Sujas-Aggarwal/captcha-solver"
          className="text-blue-500 underline hover:text-blue-700"
        >
          <u> FREE and OPEN SOURCE PROJECT </u>
        </a>{" "}
        project where we are training a machine learning model to solve CAPTCHAs
        more effectively. Your participation directly helps us build a smarter,
        more efficient system.
      </p>
      <p className="text-lg mb-4">
        By taking part, you{"'"}re not only contributing to this research but also
        gaining insight into how CAPTCHAs can be solved with cutting-edge
        technology. If this interests you, feel free to check out the project{"'"}s
        source code and dive deeper!
      </p>
      <p className="text-lg mt-4">
        Thank you once again for your valuable contribution—it{"'"}s helping shape
        the future!
      </p>
      <p className="text-lg mt-4">Even if you are not familiar with Programming, You can help contribute to this project by sharing this with your known ones to help the project!</p>
    </div>
  );
}

export default ThankYou;
