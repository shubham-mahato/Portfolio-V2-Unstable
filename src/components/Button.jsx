import React from 'react'

const Button = ({title, id, containerClass}) => {
  return (
    <button 
      id={id} 
      className={`group relative z-10 w-fit cursor-pointer overflow-hidden 
        border-2 border-current px-8 py-3 
        font-medium text-sm uppercase tracking-wider
        transition-all duration-300 ease-in-out
        hover:bg-white hover:text-black hover:border-white
        active:scale-95
        ${containerClass}`}
    >
      <span className='relative z-10 transition-colors duration-300'>
        {title}
      </span>
      
      {/* Hover background effect */}
      <div className='absolute inset-0 bg-white transform scale-x-0 origin-left 
        transition-transform duration-300 ease-in-out group-hover:scale-x-100'></div>
    </button>
  )
}

export default Button