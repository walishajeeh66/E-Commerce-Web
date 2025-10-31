// *********************
// Role of the component: Section title that can be used on any page
// Name of the component: SectionTitle.tsx
// Developer: Wali E-commerce Team
// Version: 1.0
// Component call: <SectionTitle />
// Input parameters: {title: string; path: string}
// Output: div containing h1 for page title and p for page location path 
// *********************

import React from 'react'

const SectionTitle = ({title, path} : {title: string; path: string}) => {
  return (
    <div className='h-[160px] border-b pt-10 border-white bg-brand-red mb-0 max-sm:h-[140px] max-sm:pt-10'>
        <h1 className='section-title-title text-5xl text-center mb-3 max-md:text-5xl max-sm:text-3xl text-white'>{ title }</h1>
        <p className='section-title-path text-lg text-center max-sm:text-base text-white'>{ path }</p>
    </div>
  )
}

export default SectionTitle
