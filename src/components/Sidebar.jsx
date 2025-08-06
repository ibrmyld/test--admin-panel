import React from 'react'

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <div className={`bg-gray-900 text-white w-64 ${isOpen ? 'block' : 'hidden'} lg:block`}>
      <div className="p-6">
        <h2 className="text-xl font-bold">Raliux Admin</h2>
      </div>
    </div>
  )
}

export default Sidebar