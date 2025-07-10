import React from "react";
import Hero from "./components/Hero";
import NewHero from "./components/NewHero";
import About from "./components/About";
import NavBar from "./components/NavBar";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
const App = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden ">
      <NavBar />
      <NewHero />
      <About />
      <Story />
      <Contact />
      <Footer />
    </main>
  );
};

export default App;
