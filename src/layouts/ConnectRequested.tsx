import React from 'react'

interface Props {
  list: string[]
  onAllow: (origin: string) => void
}

const ConnectRequested = ({ list, onAllow }: Props) => {
  return (
    <ul>
      {list.map((origin) => (
        <li>
          <h3>Allow {origin}?</h3>
          <button className="btn btn-primary" onClick={() => onAllow(origin)}>
            Allow
          </button>
        </li>
      ))}
    </ul>
  )
}

export default ConnectRequested
