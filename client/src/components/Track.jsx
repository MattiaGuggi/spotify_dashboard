import React from 'react'

const Track = ({ index, item }) => {
  return (
    <div>
      <br />
      <li>
        <p>{index}. {item.track.name}</p>
        <img src={item.track.album.images[0]?.url} alt={item.track.name} width="100" />
      </li>
    </div>
  )
}

export default Track
