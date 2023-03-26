import React from 'react'
// import ReactDOM from 'react-dom'
import styles from './styles.js'
import { View, Text ,Button, TextInput, AppRegistry} from 'react-native';
import socketio from 'socket.io-client';
// import RNPickerSelect from 'react-native-picker-select';
// import { RadioButton } from 'react-native-paper';

class ChatForm extends React.Component {
    constructor (props) {
        super(props)
        this.socket = socketio('https://6f5f-113-149-235-78.ap.ngrok.io', {
            transports: ['websocket'],
            cors: {
              methods: ['GET', 'POST'],
              allowedHeaders: ['my-custom-header'],
              credentials: true
            }
        });
        this.state = { e: '', message: '', message_s: '', message_slct_list: '', buy_item: ''} 
    }
    messageChanged (e) {
        const message = e;
        this.setState({message});
        this.setState({message_s: message});
        this.setState({message_slct_list: message});
        this.setState({buy_item: message});
        console.log("pass5");
    }

    send() {
        console.log("pass4")
        const timestamp = new Date().getTime(); // 現在のタイムスタンプを取得
        this.socket.emit('chat_before', {
            message: this.state.message,
            timestamp
        })
        this.socket.emit('chat', {
            message_s: this.state.message_s,
            timestamp
        })
        this.socket.emit('select_list', {
            message_slct_list: this.state.message_slct_list,
            timestamp
        })
        this.socket.emit('buy_item', {
            buy_item: this.state.buy_item,
            timestamp
        })
        this.setState({message: ''})
        this.setState({message_s: ''})
        this.setState({message_slct_list: ''})
        this.setState({buy_item: ''})
    }

    render () {
        return (
        <View>
            <Text style={styles.form}>メッセージ:</Text>
            <TextInput 
            style={styles.input}
            value={this.state.message}
            onChangeText={e => this.messageChanged(e)}
            />
            <Button title="送信" onPress={() => this.send()}/>
        </View>
        )
    }
}


export default class ChatApp extends React.Component {
    constructor (props) {
        super(props)
        this.socket = socketio('https://6f5f-113-149-235-78.ap.ngrok.io', {
            transports: ['websocket'],
            cors: {
              origin: 'chat_prd_v2://com.chat_prd_v2',
              methods: ['GET', 'POST'],
              allowedHeaders: ['my-custom-header'],
              credentials: true
            }
        });
        this.state = {
            logs: [],
            // logs_s: [],
            // logs_slct_s: [],
            // logs_reply_slcted_action: [],
            message_slcted_action: '',
            selectedValue: ''
        };
        // this.handleSelectChange = this.handleSelectChange.bind(this);
        this.send = this.send.bind(this);
    }

    componentDidMount () {
        this.socket.on('chat_before', (obj) => {
            console.log("pass1")
            const logs2 = this.state.logs
            console.log("obj:"+obj)
            obj.key = 'chat_before_key_' + (this.state.logs.length + 1)
            console.log(obj)
            logs2.unshift(obj)
            this.setState({logs: logs2})
        });
        this.socket.on('chat', (obj) => {
            console.log("pass10")
            const logs_s2 = this.state.logs.slice()
            obj.key = 'chat_key_' + (this.state.logs.length + 1)
            console.log(obj)
            logs_s2.unshift(obj)
            this.setState({logs: logs_s2})
        });
        this.socket.on('select_list', (slct_list) => {
            console.log(slct_list)
            const obj = JSON.parse(slct_list);
            const logs_s3 = this.state.logs.slice()
            obj.key = 'slct_list_key_' + (this.state.logs.length + 1)
            console.log(obj)
            logs_s3.unshift(obj)
            this.setState({logs: logs_s3})
        });
        this.socket.on('reply_slcted_action', (reply_slcted_action) => {
            const logs_s4 = this.state.logs.slice()
            reply_slcted_action.key = 'slcted_action_key_' + (this.state.logs.length + 1)
            console.log(reply_slcted_action)
            logs_s4.unshift(reply_slcted_action)
            this.setState({logs: logs_s4})
        });
    };

    handleSelectChange(event) {
        this.setState({ selectedValue: event });
    }

    send() {
        console.log("selectedValue:"+ this.state.selectedValue)
        const timestamp = new Date().getTime(); // 現在のタイムスタンプを取
        this.socket.emit('slcted_action', {
            message_slcted_action: this.state.selectedValue,
            timestamp
        })
        this.setState({message_slcted_action: ''})
    };

    render() {
        console.log("pass2")
        console.log(this.state.logs)
        let sortedMessages = this.state.logs.sort((a, b) => b.timestamp - a.timestamp);
        console.log("print:"+sortedMessages)
        let items;
        // sortedMessages.map((e) => {
        //     if (e.key.indexOf('slct_list_key_') === 0) { 
        //     items = ([
        //         { label: e.item01, value: e.item01 },
        //         { label: e.item02, value: e.item02 },
        //         { label: e.item03, value: e.item03 }
        //     ])
        // }
        // });

        let messages = [];
        sortedMessages.map((e) => {
        if (e.key.indexOf('chat_before_key_') === 0) {
            messages.push(<View key={e.key} style={styles.log}>
                        <Text style={styles.msg}>{e.message}</Text>
                    </View>)
            console.log("messages1:")
            console.dir(messages)
        }
        if (e.key.indexOf('chat_key_') === 0) {
            messages.push(<View key={e.key} style={styles.log}>
                        <Text style={styles.msg}>{e.message_s}</Text>
                    </View>)
            console.log("messages2:")
            console.dir(messages)
        }
        if (e.key.indexOf('slcted_action_key_') === 0) {
            messages.push(<View key={e.key} style={styles.log}>
                        <Text style={styles.msg}>{e.message_slcted_action}</Text>
                    </View>)
            console.log("messages3:")
            console.dir(messages)
        }
        if (e.key.indexOf('slct_list_key_') === 0) {
            console.log(JSON.stringify(e.item01))
            messages.push(<View key={e.key} style={styles.log}>
                    {/* <RadioButton
                        value={e.item01}
                        status={ checked === 'first' ? 'checked' : 'unchecked' }
                        onPress={() => handleSelectChange(e.item01)}
                    />
                    <RadioButton
                        value={e.item02}
                        status={ checked === 'second' ? 'checked' : 'unchecked' }
                        onPress={() => handleSelectChange(e.item02)}
                    />
                    <RadioButton
                        value={e.item03}
                        status={ checked === 'second' ? 'checked' : 'unchecked' }
                        onPress={() => handleSelectChange(e.item03)}
                    /> */}
                    </View>)
            console.log("messages4:")
            console.dir(messages)
        }
    })
    console.log('%o',messages)

    // let messages_ext = JSON.parse(messages)
    // console.log("messages_ext:"+messages_ext)

        return (
            <View>
                <Text style={styles.h1}>リアルタイムチャット</Text>
                <ChatForm />
                {messages}
            </View>
        )
    }
}

