import React from 'react'
import Hero from './components/Hero'
import NewHero from './components/NewHero'
const App = () => {
  return (
    <main className='relative min-h-screen w-screen overflow-x-hidden'>
      <NewHero/>
      <section className='z-0 min-h-screen bg-blue-500'></section>
    </main>
  )
}

export default App

