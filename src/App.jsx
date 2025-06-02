import React from 'react'
import Hero from './components/Hero'
import NewHero from './components/NewHero'
import About from './components/About'
const App = () => {
  return (
    <main className='relative min-h-screen w-screen overflow-x-hidden'>
      <NewHero/>
      <About/>
    </main>
  )
}

export default App

