import Hero from "@/components/Hero";
import RecentBlogs from "@/components/RecentBlogs";
import PopularAuthors from "../components/PopularAuthors";

export default function Home() {
  return (
    <>
      <div className="min-h-screen ">
        <Hero />
        <RecentBlogs />
        <PopularAuthors />
      </div>
    </>
  );
}
