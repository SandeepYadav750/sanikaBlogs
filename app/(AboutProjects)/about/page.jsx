import Image from "next/image";

const AboutSection = () => {
  return (
    <section className=" py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About Our Blog
          </h2>
          <p className="text-lg max-w-2xl mx-auto">
            A place to share thoughts, inspire others, and grow together.
          </p>
          <div className="w-24 h-1 bg-red-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 md:p-10 shadow-2xl border border-gray-700 space-y-6 md:space-y-10">
          <div className="w-full flex items-center justify-between gap-10 flex-col md:flex-row">
            <div className="md:w-1/3">
              <Image
                src="/About-blog.avif"
                alt="About Us"
                className="rounded-lg shadow-lg"
                width={400}
                height={300}
              />
            </div>
            <div className="md:w-2/3 space-y-6">
              <p className=" leading-relaxed">
                Welcome to our Blog App! We created this platform for readers,
                writers, and thinkers to connect through stories, tutorials, and
                creative insights. Whether you’re a passionate blogger or
                someone who loves reading, this space is built for you.
              </p>

              <p className=" leading-relaxed">
                Our mission is to empower individuals to express themselves
                freely. We offer simple tools to write, publish, and engage with
                others in meaningful ways.
              </p>

              <p className=" leading-relaxed">
                Thank you for being a part of our growing community.
              </p>
            </div>
          </div>

          {/* Quote */}
          <div className="bg-gray-300 dark:bg-gray-900 border-l-4 border-red-500 py-2 bg-opacity-50 rounded-r-lg text-center">
            <p className=" text-lg italic">
              “Words are powerful. Use them to inspire.”
            </p>
          </div>
        </div>

        {/* Optional: Decorative elements */}
        {/* <div className="flex justify-center gap-3 mt-10">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-gray-600"></div>
          <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        </div> */}
      </div>
    </section>
  );
};

export default AboutSection;
