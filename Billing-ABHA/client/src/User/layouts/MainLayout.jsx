import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const MainLayout = ({ children }) => {
    return (
    <div className="min-h-screen bg-charcoal text-white font-sans selection:bg-primary selection:text-white" style={{ fontSize: '13px' }}>

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