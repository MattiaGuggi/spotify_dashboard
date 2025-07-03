import React from 'react'

const Track = ({ index, item, size }) => {
  return (
    <div className='flex items-center justify-start m-10 px-16 py-5 w-2/3 rounded-3xl shadow-custom hover:-translate-y-3 cursor-pointer
      bg-gradient-to-b from-green-300 via-green-500 to bg-green-700
      hover:after:scale-x-140 hover:after:scale-y-160 hover:after:opacity-0 transition-all duration-200 after:transition-all after:duration-400'>
      <li className='flex justify items-start flex-col'>
        <p className='text-start font-medium py-4 text-xl w-auto'>{index}. {item.name}</p>
        <img src={item.album.images[0]?.url} alt={item.name} width={size} className='rounded-2xl shadow-custom'/>
      </li>
    </div>
  )
}

export default Track
