import React,{useEffect, useRef, useState}  from 'react';
import axios from 'axios'

function App() {
  const defaultlName = "だるいさん"
  const [msgs, setMsgs] = useState([])
  const [post, setPost] = useState({})
  const [apiRootUrl, setApiRootUrl] = useState()
  const [inApiRootUrl, setInApiRootUrl] = useState()
  const [timezone, setTimezone] = useState()
  const inputNameRef = useRef()
  const inputTextRef = useRef()
  const inputInApiRootUrlRef = useRef()
  const inputTimezoneRef = useRef()
  const tzlist = [
    {value: 'UTC', label: 'UTC'},
    {value: 'JST', label: 'JST'},
  ]

  const handleName = event => {
    setPost({username: event.target.value, text: post.text})
  }

  const handleText = event => {
    setPost({username: post.username, text: event.target.value})
  }

  const handleInApiRootUrl = event => {
    setInApiRootUrl(event.target.value)
  }

  const handleTimezone = event => {
    setTimezone(event.target.value)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (apiRootUrl) {
        axios.get(apiRootUrl + "/messages/")
        .then(res => {
          console.log(res)
          setMsgs(res.data)
        })
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [apiRootUrl])

  const clickSubmit = (e) => {
    // messageが空欄でなければ送信
    console.log(post.text)
    console.log(post.username)
    if (post.text) {

      const text = post.text
      // usernameがなければデフォルト名を使用
      const username = post.username ? post.username : defaultlName
      const _post = {username: username, text: text}

      // POST処理
      axios.post(apiRootUrl + "/messages/", _post)
      .then(res => {
        console.log(res)
        setMsgs(res.data)
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        console.log('Error', error.message);
      })

      // clear message textarea
      inputTextRef.current.value = "";
      setPost({username: post.username, text: ""})
    }
  }

  const clickStart = (e) => {
    // Validation
    if (inApiRootUrl) {
      setApiRootUrl(inApiRootUrl)
      setMsgs([{"created_at": inApiRootUrl, "text": "Now Loading..."}])
      inputInApiRootUrlRef.current.value = ""
      setInApiRootUrl("")
    }
  }

  const clickClear = (e) => {
    // DELETE処理
    axios.delete(apiRootUrl + "/messages/")
    .then(res => {
      console.log(res)
      setMsgs(res.data)
    })
    .catch((error) => {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      console.log('Error', error.message);
    })
  }

  const changeTimezone = (strDate) => {
    switch(timezone){
      case 'JST':
        const parseDate = Date.parse(strDate.replace(/-/g,"/"))
        const parsejstdate = parseDate + 9 * 60 * 60 * 1000
        const jstdate = new Date(parsejstdate)
        return [jstdate.getFullYear(), ('0' + (jstdate.getMonth() + 1)).slice(-2), ('0' + jstdate.getDate()).slice(-2)].join('-') + " " + [('0' + jstdate.getHours()).slice(-2), ('0' + jstdate.getMinutes()).slice(-2), ('0' + jstdate.getSeconds()).slice(-2)].join(':')
      default:
        return strDate
    }
  }

  return (
    <div style={{
      margin:'auto',
      width:'90%'
    }}>
      <div style={{
        display:'flex',
        WebkitBoxPack: 'justify',
        MozBoxPack: 'justify',
        MsFlexPack: 'justify',
        WebkitJustifyContent: 'space-between',
        justifyContent:'space-between',
      }}>
        <div><h1>HTTP CHAT <small><small>by iwsh</small></small></h1></div>
        <div style={{display:'flex', alignItems:'center'}}>
          <select style={{fontSize:'16px'}} name="timezone" defaultValue="UTC" ref={inputTimezoneRef} onChange={handleTimezone}>
            {tzlist.map( tz => <option value={tz.value}>{tz.label}</option>)}
          </select>
        </div>
      </div>
      <div>
        <table cellPadding={5}>
          <tr>
            <td>Enter API Server URL:</td>
          </tr>
          <tr>
            <td><input style={{fontSize:'16px'}} ref={inputInApiRootUrlRef} type="text" onChange={handleInApiRootUrl} required/></td>
          </tr>
          <tr>
            <td><button type="submit" onClick={clickStart}><big>Start</big></button></td>
          </tr>
        </table>
      </div>
      <hr></hr>
      {(apiRootUrl)?
        <div>
          <table cellPadding={5}>
            <tr>
              <td>Name:</td>
              <td><input style={{fontSize:'16px'}} ref={inputNameRef} type="text" placeholder={defaultlName} onChange={handleName} required/></td>
            </tr>
            <tr>
              <td valign="middle">Message:</td>
              <td><textarea style={{fontSize:'16px'}} ref={inputTextRef} cols="22" rows="5" onChange={handleText} required/></td>
            </tr>
            <button type="submit" onClick={clickSubmit}><big>Submit</big></button>
          </table>
          <hr></hr>
        </div>
      :<div></div>}
      <button type="submit" onClick={clickClear}><big>Clear All</big></button>
      {msgs.map(msg => {
        return (
          <p>
            <div>
              <b><big>{msg.username}</big></b> <small>@ {changeTimezone(msg.created_at)}</small>
            </div>
            <div style={{
              backgroundColor: '#ffffff',
              padding: 8,
              marginLeft: '1%',
              marginTop: 5,
              marginRight: '5%',
              // maxWidth: '50%',
              alignSelf: 'flex-end',
              borderRadius: 15,
              display: 'inline-block',
              border: '1.5px solid',
              borderColor: '#b0e0e6',
            }}>
              {msg.text}
            </div>
          </p>
        );
      })}
    </div>
  );
}

export default App;
