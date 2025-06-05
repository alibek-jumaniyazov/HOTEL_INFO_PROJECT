import Header from "@/components/public/header";
import HeroSection from "@/components/public/hero-section";
import HotelInfo from "@/components/public/hotel-info";
import RoomsSection from "@/components/public/rooms-section";
import VideoSection from "@/components/public/video-section";
import ContactSection from "@/components/public/contact-section";
import Footer from "@/components/public/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <HotelInfo />
        <RoomsSection />
        <VideoSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
