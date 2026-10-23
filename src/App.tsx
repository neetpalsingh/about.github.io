import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { About, Experience, Skills } from './components/Sections'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="frame">
        <Hero />
        <About />
        <Experience />
        <Skills />
      </main>
    </>
  )
}
