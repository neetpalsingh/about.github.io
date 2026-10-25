import AgentStudio from './components/AgentStudio'
import Hero from './components/Hero'
import HireProvider from './components/HireModal'
import McpServer from './components/McpServer'
import Navbar from './components/Navbar'
import Projects from './components/Projects'
import UseCases from './components/UseCases'
import { About, Experience, Skills } from './components/Sections'
import { Contact, Credentials, Footer } from './components/Closing'

export default function App() {
  return (
    <HireProvider>
      <Navbar />
      {/* The frame draws vertical rules down both edges; each section adds a horizontal rule */}
      <main className="frame">
        <Hero />
        <About />
        <Experience />
        <AgentStudio />
        <McpServer />
        <UseCases />
        <Projects />
        <Skills />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </HireProvider>
  )
}
