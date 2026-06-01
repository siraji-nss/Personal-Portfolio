import Head from 'next/head';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Nazmus Sakib Siraji — Software Engineer & Technical PM</title>
      </Head>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Services />
        <Experience />
        <Education />
      </main>
      <Footer />
    </>
  );
}
