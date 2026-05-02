import MainLayout from "../layouts/MainLayout";
import Hero from "../components/home/Hero";
import KeyFeatures from "../components/home/KeyFeatures";
import TrustedBy from "../components/home/TrustedBy";
import Integrations from "../components/home/Integrations";
import IndiaExpertise from "../components/home/IndiaExpertise";
import SmartChoice from "../components/home/SmartChoice";
import Testimonials from "../components/home/Testimonials";
import CallToAction from "../components/home/CallToAction";

const Home = () => {
    return (
        <MainLayout>
            <Hero />
            <KeyFeatures />
            <TrustedBy />
            <Integrations />
            <IndiaExpertise />
            <SmartChoice />
            <Testimonials />
            <CallToAction />
        </MainLayout>
    );
};

export default Home;