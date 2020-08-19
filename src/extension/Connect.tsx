import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useExtension } from './useExtension'

const Connect = () => {
  const { replace } = useHistory()
  const { connect } = useExtension()
  const { list, allow } = connect
  const [origin] = list

  useEffect(() => {
    !origin && replace('/')
  }, [origin, replace])

  return !origin ? null : (
    <>
      <h1>Allow access to wallet</h1>
      <h1>{origin} wants to access your wallet</h1>
      <button className="btn btn-primary" onClick={() => allow(origin)}>
        Allow
      </button>
      <button className="btn btn-danger" onClick={() => allow(origin, false)}>
        Deny
      </button>
    </>
  )
}

export default Connect
