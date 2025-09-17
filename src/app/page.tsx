
import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import FeaturedResources from "@/components/home/FeaturedResources";
import BookingPreview from "@/components/home/BookingPreview";
import UpcomingPrograms from "@/components/home/UpcomingPrograms";
import Testimonials from "@/components/home/Testimonials";
import Partners from "@/components/home/Partners";
import LatestNews from "@/components/home/LatestNews";

export default async function Home() {
 
  return <>
      <Hero />
      <AboutSection />
      <FeaturedResources />
      <BookingPreview />
      <UpcomingPrograms />
      <Testimonials />
      <Partners />
      <LatestNews />
  </>
}
