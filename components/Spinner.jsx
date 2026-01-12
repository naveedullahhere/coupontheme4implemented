import React from 'react'

const Spinner = () => {
  return (
    <div className="w-100 py-5 d-flex justify-content-center align-items-center h-100">
      <div class="spinner-border text-black" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}

export default Spinner