import React, { useState, useEffect } from 'react'
import './App.css';



function App() {
  const [youtubers, setYoutubers] = useState([])
  const [hidden, setHidden] = useState(true);
  const [newCreator, setNewCreator] = useState({ name: '' ,youtube_name: '', year_made: '' });
  const [updatingCreators, setUpdatingCreators] = useState({});
  const [update, setUpdate] = useState({});

  
  useEffect(() => {
    console.log('us')

    getData()
  }, [])

  function getData() {
    console.log("getting data")
    fetch(`http://localhost:3031/youtubers`)
      .then(res => res.json())
      .then(res => setYoutubers([...res]))
  }
  function deleteYoutuber(id) {
    console.log(id)
    fetch(`http://localhost:3031/youtubers/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => res.json())
      .then(() => getData())
  }
  function addYoutuber() {
    console.log(newCreator)

    fetch(`http://localhost:3031/youtubers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCreator),
    })
      .then(res => res.json())
      .then(() => {getData(); setNewCreator({ name: '' , youtube_name: '', year_made: '' })
  })
    setHidden(!hidden)
  }
  function updateYoutuber(id) {
    const newUpdate = { ...update };

    for (let creators in youtubers) {
      newUpdate[youtubers[creators].id] = false;
    }
    setUpdate(newUpdate);
    setUpdate({ ...newUpdate, [id]: !update[id] });
  }
  function updateYoutuberInfo(creators, e) {
    setUpdatingCreators({ ...creators, [e.target.getAttribute('field')]: e.target.value });
  }
  function completeUpdate() {
    fetch(`http://localhost:3031/youtubers`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatingCreators),
    })
      .then(res => res.json())
      .then(() => getData())
    setUpdate({});
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <h1 className='head'>Current Favorite Youtubers</h1>
        {youtubers.map((creators) => {
          return (!update[creators.id] ?
            <div className='youtubeCard' key={creators.id}>
              <h3>{creators.name}</h3>
              <p>{creators.youtube_name}</p>
              <p>{creators.year_made}</p>
              <button onClick={() => updateYoutuber(creators.id)}>Update</button>
              <button onClick={() => deleteYoutuber(creators.id)}>Delete</button>
            </div>
            :
            <div className='youtubeCard' key={creators.id}>
              <input defaultValue={creators.name} field='name' placeholder='Creator Name' onChange={(e) => updateYoutuberInfo(creators, e)} />
              <input defaultValue={creators.youtube_name} field='youtube_name' placeholder='Youtubename' onChange={(e) => updateYoutuberInfo(creators, e)} />
              <input defaultValue={creators.year_made} field='year_made' placeholder='Year Made' onChange={(e) => updateYoutuberInfo(creators, e)} />
              <button onClick={() => updateYoutuber(creators.id)}>Cancel</button>
              <button onClick={() => completeUpdate(creators)}>Update</button>
            </div>
          )
        })}
        {hidden ?
          <button onClick={() => setHidden(!hidden)}>Add New Youtuber</button> :
          <div className='youtubeCard'>
            <h3>Creator Name: <input onChange={(e) => setNewCreator({ ...newCreator, name: e.target.value })} value={newCreator.name} placeholder='Creator Name' /></h3>
            <br />
            <p>Youtube Name: <input onChange={(e) => setNewCreator({ ...newCreator, youtube_name: e.target.value })} value={newCreator.youtube_name} placeholder='Youtube Name' /></p>
            <br />
            <p>Year Created <input onChange={(e) => setNewCreator({ ...newCreator, year_made: e.target.value })} value={newCreator.year_made} placeholder='Year Created' /></p>
            <br />
            <button onClick={() => addYoutuber()}>Submit</button>
          </div>}
      </header>
    </div>
  );
}

export default App;
