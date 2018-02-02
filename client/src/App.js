import React, { Component } from 'react';
import moment from 'moment';
import Navbar from './Navbar';
import Messages from './Messages';
import Suggestion from './Suggestion';
import Status from './Status';
import './App.css';

const SERVER_PORT = 3001;

const Users = [
  {id: 0, name: "Tim"},
  {id: 1, name: 'Fred'},
  {id: 2, name: 'Mary'},
  {id: 3, name: "Bob"},
  {id: 4, name: "Alice"},
];

class App extends Component {
  constructor(props) {
    super(props);

    this.socket = null;

    const message1 = {
      date: moment('2017-05-20 18:00:00'),
      content: {
        user: Users[3],
        event: 'party at my house',
        date: moment('2017-05-27 19:00:00')
      },
      people: [
        { user: Users[1], status: Status.going },
        { user: Users[2], status: Status.going },
      ]
    };
    const message2 = {
      date: moment('2017-05-21 22:57:00'),
      content: {
        user: Users[0],
        event: 'gym',
        date: moment('2017-05-24 18:30:00')
      },
      people: [
        { user: Users[3], status: Status.going },
        { user: Users[1], status: Status.notGoing },
        { user: Users[4], status: Status.going },
        { user: Users[2], status: Status.notGoing },
      ]
    };
    
    this.state = {
      currentUser: Users[0],
      messages: []
    };

    this.sendNewMessage = this.sendNewMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  sendNewMessage(newMessage) {
    // TODO server handles messages
    // const messages = this.state.messages.concat(newMessage);
    this.socket.send(JSON.stringify(newMessage));
  }

  deleteMessage(message) {
    // TODO server handles messages
    // const messages = this.state.messages.filter(m => m.id !== message.id);
    // this.setState({ messages: messages });
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    
    setTimeout(() => {
      console.log("Simulating incoming message");
      const newMessage = {
        date: moment('2018-01-24 12:13:00'),
        content: {
          user: Users[1],
          event: 'hang out',
          date: moment('2018-01-25 10:00:00')
        },
        people: [
          { user: Users[4], status: Status.notGoing },
          { user: Users[3], status: Status.going },
        ]
      };
      this.sendNewMessage(newMessage);
    }, 3000);

    this.socket = new WebSocket(`ws://localhost:${SERVER_PORT}`);
    
    this.socket.onopen = (evt) => {
      console.log('Connected to server');
    };

    this.socket.onmessage = (evt) => {
      console.log('Message received');
      // this.setState({ messages: messages });
    };
  }
  
  render() {
    return (
      <div className="App">
        <Navbar
          username={this.state.currentUser.name}
          />
        <Messages
          messages={this.state.messages}
          user={this.state.currentUser}
          deleteMessage={this.deleteMessage}
          />
        <Suggestion
          user={this.state.currentUser}
          sendNewMessage={this.sendNewMessage}
          />
      </div>
    );
  }
}

export default App;