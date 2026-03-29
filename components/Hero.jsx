import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="pb-12 md:pb-20 px-4 md:px-0 flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl font-bold dark:text-white text-gray-900 leading-tight">
                Welcome to <span className="text-blue-600">Sanika Blogs</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
                Discover insightful articles, stories, and perspectives on
                technology, lifestyle, and personal growth.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/blogs">
                <Button className=" px-8 py-6 text-lg rounded-lg">
                  Explore Blogs
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  className="px-8 py-6 text-lg border-2 dark:border-gray-400 dark:text-white rounded-lg"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t dark:border-gray-700">
              <div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  50+
                </p>
                <p className="text-gray-600 dark:text-gray-400">Articles</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  10k+
                </p>
                <p className="text-gray-600 dark:text-gray-400">Readers</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  5
                </p>
                <p className="text-gray-600 dark:text-gray-400">Categories</p>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="relative h-96 md:h-full min-h-96">
            <Image
              src="/blog2.png"
              alt="Hero Image"
              fill
              className="object-cover rounded-lg "
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
