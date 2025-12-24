import React, { useState } from 'react'
import Chatcontainer from '../components/Chatcontainer'
import Rightsidebar from '../components/Rightsidebar'
import Sidebar from '../components/Sidebar'

const Homepage = () => {
  const [selectedUser, setSelectedUser] = useState(false);
  

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%] ">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr] "
            : "md:grid-cols-2"
        } `}
      >
        <Sidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <Chatcontainer
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <Rightsidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>
    </div>
  );
}

export default Homepage