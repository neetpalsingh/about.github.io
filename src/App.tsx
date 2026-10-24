import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AgentStudio from './components/AgentStudio'
import McpServer from './components/McpServer'
import { About, Experience, Skills } from './components/Sections'

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
        <Skills />
      </main>
    </>
  )
}
