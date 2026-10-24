import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AgentStudio from './components/AgentStudio'
import McpServer from './components/McpServer'
import UseCases from './components/UseCases'
import Projects from './components/Projects'
import { About, Experience, Skills } from './components/Sections'
import { Credentials, Contact, Footer } from './components/Closing'

export default function App() {
  return (
    <>
      <Navbar />
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
    </>
  )
}
