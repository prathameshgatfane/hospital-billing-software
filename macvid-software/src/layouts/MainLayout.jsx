import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#212121]">

            {/* Navbar */}
            <Navbar />

            {/* Page Content */}
            <main>
                {children}
            </main>
            <Footer />

        </div>
    );
};

export default MainLayout;