import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="bg-[#0b0f14] text-white min-h-screen">
      <Header />

      <main className="pt-14 transition-all duration-300">
        <div className="max-w-4xl mx-auto px-4 w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;