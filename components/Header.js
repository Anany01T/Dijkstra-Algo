import React from 'react'


const Header = () => {

  const [edge,setEdge] = [false];

  const HandleEdge = () => {
    setEdge(true);
  }

  console.log(edge);
  return (

    <>
    <h1>Dijkstra Algorithm-To Find The Shortest Path</h1>
    <div className='headElements'>
      <button>Add Edges</button>
      <button onClick={HandleEdge}>Clear</button>
    </div>
    <div className='head2'>
      <input type="text" placeholder='Source Node' />
      <button>Run</button>
    </div>
    </>
    
  )
}

export default Header;
