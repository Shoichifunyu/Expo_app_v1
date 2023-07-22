import React from 'react'
const {useEffect, useRef, useState} = React
import styles from './styles.js'
import { Keyboard, View, Text ,Button, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import io from 'socket.io-client';
import _ from 'lodash';
import { RadioButton } from 'react-native-paper';
import Checkbox from 'expo-checkbox';
import { ExpoConfig, ConfigContext } from '@expo/config'
// import RNFetchBlob from 'react-native-blob-util'; // or react-native-blob-util
import * as FileSystem from 'expo-file-system';

export function ChatForm(props) {
    const [message, setMessage] = useState('');
    const [message_s, setMessage_s] = useState('');
    const [message_slct_list, setMessage_slct_list] = useState('');
    const socketRef = useRef();

    useEffect(() => {
        console.log('Connecting..');
        socketRef.current = io("https://ec2-54-204-165-145.compute-1.amazonaws.com:443/"
        , {
            transports: ['websocket'],
            cors: {
                // 適宜変更
            //   origin: ['http://192.168.11.14:19006','http://localhost:19006'],
              origin: 'exp://192.168.138.110:19000',
              methods: ['GET', 'POST'],
              allowedHeaders: ['my-custom-header'],
              credentials: true
            },
            key: FileSystem.readAsStringAsync("./server.key"),
            cert: FileSystem.readAsStringAsync("./server.crt")
        }
        );
        return () => {
            console.log('Disconnecting..');
            socketRef.current.disconnect();
        };
    }, []);



    const messageChanged = (e) => {
        const changeMessage = e;
        setMessage(changeMessage);
        setMessage_s(changeMessage);
        console.log(changeMessage);
        console.log("pass5");
    }

    const send = () => {
        console.log("pass4")
        const timestamp = new Date().getTime(); // 現在のタイムスタンプを取得

        const cMessage = {
            message,
            timestamp
        };

        const msg = {
            message_s,
            timestamp
        };

        const slct_list = {
            message,
            timestamp
        };

        console.log(cMessage);

        socketRef.current.emit('chat_before', cMessage);
        socketRef.current.emit('chat', msg);
        socketRef.current.emit('select_list', slct_list);
        setMessage(prevMessage => [...prevMessage, cMessage]);
        setMessage(prevMessage_s => [...prevMessage_s, msg]);
        setMessage(prevMessage_slct_list => [...prevMessage_slct_list, slct_list]);
        setMessage('');
        setMessage_s('');
        setMessage_slct_list('');
    }

    return (
    <View>
        <Text style={styles.form}>メッセージ:</Text>
        <TextInput
        style={styles.input}
        onChangeText={messageChanged}
        value={message}
        />
        <Button title="送信" onPress={send}/>
    </View>
    )
}


export default function ChatApp(props){
    const [logs, setLogs] = useState([]);
    const [messages, setMessasges] = useState('');
    const [checked, setChecked] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [message_slcted_action, setMessage_slcted_action] = useState('');
    const [Editing, setEditing] = useState(false);
    const [message, setMessage] = useState([]);
    const [tappedValue, setTappedValue] = useState('');
    let [count, setCount] = useState(0);
    const socketRef = useRef();
    const [message_s, setMessage_s] = useState('');
    const [buy_item, isEditing, e, message_slct_list, s, inputValue] = useState('');
    const [handleTapValue, setHandleTapValue] = useState('');
    const [ckdflg, setCkdflg] = useState(false);


    useEffect(() => {
        console.log('Connecting..');
        socketRef.current = io("https://ec2-54-204-165-145.compute-1.amazonaws.com:443/"
        , {
            transports: ['websocket'],
            cors: {
                // 適宜変更
            //   origin: ['http://192.168.11.14:19006','http://localhost:19006'],
                origin: 'exp://192.168.138.110:19000',
                methods: ['GET', 'POST'],
                allowedHeaders: ['my-custom-header'],
                credentials: true
            },
            key: FileSystem.readAsStringAsync("./server.key"),
            cert: FileSystem.readAsStringAsync("./server.crt")
        }
        );
        socketRef.current.on('chat_before', obj => {
            console.log("pass1")
            obj = JSON.parse(obj)
            count += 1
            obj.count = count
            obj.key = 'chat_before_key_' + (count + 1);
            obj.buy_key = 'slcted_action_key_' + new Date().getTime();
            console.log(obj)
            setLogs((prevLogs) => [...prevLogs, obj]);
            socketRef.current.emit('buy_item', {
                item_key: obj.buy_key,
                buy_item: obj.message,
                flg: false,
                timestamp: new Date().getTime()
            })
        });
        socketRef.current.on('chat', obj => {
            count += 1
            obj.count = count;
            console.log("pass10")
            obj.key = 'chat_key_' + (count + 1)
            console.log(obj)
            setLogs((prevLogs) => [...prevLogs, obj]);
        });
        socketRef.current.on('select_list', slct_list => {
            const obj = JSON.parse(slct_list);
            count += 1
            obj.count = count;
            console.log(slct_list)
            obj.key = 'slct_list_key_' + (count + 1)
            console.log(obj)
            setLogs((prevLogs) => [...prevLogs, obj]);
        });
        socketRef.current.on('reply_slcted_action_format', reply_slcted_action_format => {
            count += 1
            reply_slcted_action_format.count = count;
            if (reply_slcted_action_format.key === undefined) {
                reply_slcted_action_format.key = 'slcted_action_format_key_' + (count + 1)
            }
            console.log(reply_slcted_action_format)
            setLogs((prevLogs) => [...prevLogs, reply_slcted_action_format]);
        });
        socketRef.current.on('reply_slcted_action', reply_slcted_action => {
            count += 1
            reply_slcted_action.count = count;
            if (reply_slcted_action.flg === undefined) {
                reply_slcted_action.flg = false;
            }
            if (reply_slcted_action.key === undefined) {
                reply_slcted_action.key = 'slcted_action_key_' + new Date().getTime()
            }
            console.log(reply_slcted_action)
            setLogs((prevLogs) => [...prevLogs, reply_slcted_action]);
        });

        return () => {
            console.log('Disconnecting..');
            socketRef.current.disconnect();
        };
    }, []);
    

    const handleSelectChange = (event) => {
        setSelectedValue(event)
    };

    const send =() => {
        const slctAction = {
            message_slcted_action: selectedValue,
            timestamp: new Date().getTime()
        }
        socketRef.current.emit('slcted_action', slctAction);
        setMessage_slcted_action('');
    };
    
    const copyText = async (text) => {
        await Clipboard.setStringAsync(text.replace(/"/g, ""));
    };

    const MessageDiv = props => {
        if (props.logs !== undefined) {
            console.log("ddd:"+props.logs)
        let sortedMessages = props.logs?.sort(function(a, b){if (a.count > b.count){
            return -1;
          }else if (a.count < b.count){
            return 1;
          }else{
            return 0;
          }
        });
        
        for (let i=0;i< sortedMessages.length; i++){
            console.log("bbb:"+sortedMessages[i])
        }

        let image = sortedMessages.map((e) => {
        
            const checkedCheckedBox = (k, f) => {
                setLogs((prevLogs) => prevLogs.map((value) => (
                value.key === k ? {"count":value.count, "key": value.key , "flg": f, "message_slcted_action":value.message_slcted_action, "timestamp": value.timestamp} : value)))
                let msg = {
                    item_key: k,
                    flg: f,
                    timestamp: new Date().getTime()
                };
                socketRef.current.emit('buy_item', msg)
            }
            
            console.log(e);
            const ts = new Date().getTime()
            if (e.key.indexOf('slcted_action_format_key_') === 0) {
                const flg = e.flg
                console.log("flg"+flg)
                return (<ScrollView key={e.key+ts} style={styles.log}>
                            <TouchableOpacity onLongPress={() => copyText(JSON.stringify(e.message_slcted_action))}>
                            <Text style={styles.msg}>{e.message_slcted_action}</Text>
                            </TouchableOpacity>
                        </ScrollView>)
            } else if (e.key.indexOf('slcted_action_key_') === 0) {
                const flg = e.flg
                console.log("flg"+flg)
                return (<ScrollView key={e.key+ts} style={styles.log}>
                            {/* <Checkbox title={e.message_slcted_action} value={flg} onValueChange={() => {
                                setCkdflg(!ckdflg)
                                checkedCheckedBox(e.key, !ckdflg)}}/> */}
                            <TouchableOpacity onLongPress={() => copyText(JSON.stringify(e.message_slcted_action))}>
                            <Text style={styles.msg}>{"\n"}{e.message_slcted_action}</Text>
                            </TouchableOpacity>
                        </ScrollView>)
            } else if (e.key.indexOf('chat_before_key_') === 0) {
                return (<ScrollView key={e.key+ts} style={styles.log}>
                                <TouchableOpacity onPress={() => copyText(JSON.stringify(e.message))}>
                                <Text style={styles.msg}>{e.message}</Text>
                                </TouchableOpacity>
                            </ScrollView>)
            } else if (e.key.indexOf('chat_key_') === 0) {
                return (<ScrollView key={e.key+ts} style={styles.log}>
                            <TouchableOpacity onPress={() => copyText(JSON.stringify(e.message_s))}>
                            <Text style={styles.msg}>{e.message_s}</Text>
                            </TouchableOpacity>
                        </ScrollView>)
            } else if (e.key.indexOf('slct_list_key_') === 0) {                   
                    return (<ScrollView key={e.key+ts} style={styles.log}>
                            <RadioButton.Group>
                           {e.item.map((f) => (
                            <RadioButton.Item
                            key={f}
                            value={f}
                            label={f}
                            status={ checked === f ? 'checked' : 'unchecked' }
                            onPress={() => {
                                    setChecked(f)
                                    handleSelectChange(f)
                                    }}
                            />))}
                            </RadioButton.Group>
                            <Button title="選択" onPress={() => send()} />
                            </ScrollView>)
            }
        })
    return image
    }
}
    return (
        <ScrollView>
            <Text style={styles.h1}>リアルタイムチャット</Text>
            <ChatForm />
        <ScrollView>
            <MessageDiv logs = {logs}/>
        </ScrollView>
        </ScrollView>
    )
}