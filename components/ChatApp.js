import React from 'react'
const {useEffect, useMemo, useRef, useState} = React
// import ReactDOM from 'react-dom'
import styles from './styles.js'
import { View, Text ,Button, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import io from 'socket.io-client';
import _ from 'lodash';
// import RNPickerSelect from 'react-native-picker-select';
import { RadioButton } from 'react-native-paper';

export function ChatForm(props) {
    const [message, setMessage] = useState('');
    const [message_s, setMessage_s] = useState('');
    const [message_slct_list, setMessage_slct_list] = useState('');
    const [text, setText] = useState('');
    const socketRef = useRef();
    const [message_slcted_action, selectedValue, checked, buy_item, isEditing, e, s, inputValue] = useState('');

    useEffect(() => {
        console.log('Connecting..');
        socketRef.current = io('https://29b7-113-149-235-78.ap.ngrok.io'
        , {
            transports: ['websocket'],
            cors: {
                // 適宜変更
            //   origin: ['http://192.168.11.14:19006','http://localhost:19006'],
              origin: 'exp://eb-cq3.funyu.chat-prd-v4.exp.direct:80',
              methods: ['GET', 'POST'],
              allowedHeaders: ['my-custom-header'],
              credentials: true
            }
        }
        );
        // socketRef.current.on('chat_before', msg => {
        //     console.log('Recieved: ' + msg);
        //     setMessage(prevMessage => [...prevMessage, msg]);
        // });
        return () => {
            console.log('Disconnecting..');
            socketRef.current.disconnect();
        };
    }, []);



    const messageChanged = (e) => {
        const changeMessage = e;
        setMessage(changeMessage);
        setMessage_s(changeMessage);
        // const message = e;
        // useEffect(() => {
        // message_s = message
        // }, [message_s])
        // useEffect(() => {
        //     message_slct_list = message
        //     }, [message_slct_list])
        // useEffect(() => {
        //     buy_item = message
        //     }, [buy_item])
        console.log(changeMessage);
        console.log("pass5");
    }

    const send = () => {
        // setText(e);
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

        // const slct_list = {
        //     message_slct_list,
        //     timestamp
        // };

        // const sMessage = {
        //     text: text,
        //     timestamp
        // };

        console.log(cMessage);

        socketRef.current.emit('chat_before', cMessage);
        socketRef.current.emit('chat', msg);
        // socketRef.current.emit('select_list', slct_list);
        setMessage(prevMessage => [...prevMessage, cMessage]);
        setMessage(prevMessage_s => [...prevMessage_s, msg]);
        // setMessage(prevMessage_slct_list => [...prevMessage_slct_list, slct_list]);
        setMessage('');
        // setMessage_s('');
        // setMessage_slct_list('');

        // useEffect(() => {
        //     socket.emit('chat_before', {
        //         message,
        //         timestamp
        //     })}, [message])
        // useEffect(() => {
        //     socket.emit('chat', {
        //         message_s,
        //         timestamp
        //     })}, [message_s])
        // useEffect(() => {
        //     socket.emit('select_list', {
        //         message_slct_list,
        //         timestamp
        //     })}, [message_slct_list])
    }

    return (
    <View>
        <Text style={styles.form}>メッセージ:</Text>
        <TextInput
        style={styles.input}
        onChangeText={messageChanged}
        >{message}</TextInput>
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
    const socketRef = useRef();
    const [buy_item, isEditing, e, message_s, message_slct_list, s, inputValue] = useState('');

    useEffect(() => {
        console.log('Connecting..');
        socketRef.current = io('https://29b7-113-149-235-78.ap.ngrok.io'
        , {
            transports: ['websocket'],
            cors: {
                // 適宜変更
            //   origin: ['http://192.168.11.14:19006','http://localhost:19006'],
                origin: 'exp://eb-cq3.funyu.chat-prd-v4.exp.direct:80',
                methods: ['GET', 'POST'],
                allowedHeaders: ['my-custom-header'],
                credentials: true
            }
        }
        )
        socketRef.current.on('chat_before', obj => {
            console.log("pass1")
            // const logs2 = logs
            obj = JSON.parse(obj)
            obj.key = 'chat_before_key_' + (logs.length + 1)
            console.log(obj)
            // logs.unshift(obj)
            setLogs(prevLogs => [...prevLogs, obj]);
            socketRef.current.emit('buy_item', {
                buy_item: obj.message,
                timestamp: new Date().getTime()
            })
            // console.log("aaa:"+ logs[0].key)
        });
        socketRef.current.on('chat', obj => {
            console.log("pass10")
            // const logs_s2 = logs
            obj.key = 'chat_key_' + (logs.length + 1)
            console.log(obj)
            // logs.unshift(obj)
            setLogs(prevLogs => [...prevLogs, obj]);
        });
        // socketRef.current.on('select_list', slct_list => {
        //     console.log(slct_list)
        //     const obj = JSON.parse(slct_list);
        //     const logs_s3 = logs.slice()
        //     obj.key = 'slct_list_key_' + (logs.length + 1)
        //     console.log(obj)
        //     logs_s3.push(obj)
        //     setLogs(logs_s3);
        // });
        // socketRef.current.on('reply_slcted_action', reply_slcted_action => {
        //     const logs_s4 = [...logs]
        //     reply_slcted_action.key = 'slcted_action_key_' + (logs.length + 1)
        //     console.log(reply_slcted_action)
        //     logs_s4.unshift(reply_slcted_action)
        //     setLogs(logs_s4);
        // });

        return () => {
            console.log('Disconnecting..');
            socketRef.current.disconnect();
        };
    }, [logs]);


    const handleSelectChange = (event) => {
        setSelectedValue(event)
    };

    const send =() => {
        const timestamp = () => new Date().getTime(); // 現在のタイムスタンプを取
        const slctAction = () => {
            message_slcted_action,
            timestamp
        }
        socketRef.current.emit('slcted_action',slctAction);
        setMessage_slcted_action('');
    };

    
    const EditableText = ({text}) => {
        if (Editing) {
            return (
            <TextInput
                defaultValue={text}
                value={inputValue}
                onChangeText={() => _handleTextChange}
                onBlur={() => setEditing(false)}
            />
            );
        }
        return (
            <TouchableOpacity onPress={() => copyText(JSON.stringify(text))} onLongPress={() => setEditing(true)}>
            <Text>{text}</Text>
            </TouchableOpacity>
        );
        };
    
    const copyText = async (text) => {
        await Clipboard.setStringAsync(text.replace(/"/g, ""));
    };

    // removeObject.js
    const removeObjectBy = (object, condition) => {
        // lodash#cloneDeep
        const _obj = _.cloneDeep(object);
        
        const _cond = typeof condition === 'function' ? condition : function () {};
    
        function _remove (obj) {
        for (let o in obj) {
            if (_cond(obj[o])) {
            delete obj[o];
            } else if (typeof obj[o] === 'object') {
            _remove(obj[o]);
            }
        }
        }
    
        _remove(_obj, _cond);
        return _obj;
    }
    
    // この条件に合致するプロパティを削除する
    const isEmpty = val => val === '' || val === null || val === undefined;

    const MessageDiv = props => {
        // const { logs } = props;
        if (props.logs !== undefined) {
            console.log("ddd:"+props.logs)
        // logs.map
        // console.log("logssssss:"+logs[0].message);
        // const dispmMessage = logs;
        // let sortedMessages = useState([]);
        // setSortedMessages(dispmMessage);
        
        let sortedMessages = props.logs?.sort((a, b) => b?.timestamp - a?.timestamp);
        // console.log(sortedMessages)
        // const { checked } = state
        // logs.map((e) => {
        for (let i=0;i< sortedMessages.length; i++){
            console.log("bbb:"+sortedMessages[i])
        }
        
        // const actualMessages = removeObjectBy(sortedMessages, isEmpty);
        // actualMessages.map((e) => {
        //     console.log("ccc:"+e.key)
        // })

        // let e = sortedMessages
        // for (let loop=0;loop<e.length; loop++){
        //     return (<ScrollView key={e[loop].key} style={styles.log}>
                                {/* <TouchableOpacity onPress={() => copyText(JSON.stringify(e.message))}> */}
                                // <Text style={styles.msg}>{e[loop].message}</Text>
                                {/* </TouchableOpacity> */}
                            // </ScrollView>)

        let image = sortedMessages.map(e => {
            console.log(e);
            if (e.key.indexOf('chat_before_key_') === 0) {
                return (<ScrollView key={e.key} style={styles.log}>
                                <TouchableOpacity onPress={() => copyText(JSON.stringify(e.message))}>
                                <Text style={styles.msg}>{e.message}</Text>
                                </TouchableOpacity>
                            </ScrollView>)
            } else if (e.key.indexOf('chat_key_') === 0) {
                return (<ScrollView key={e.key} style={styles.log}>
                            {/* <EditableText style={styles.msg} text={e.message_s}></EditableText> */}
                            <TouchableOpacity onPress={() => copyText(JSON.stringify(e.message_s))}>
                            <Text style={styles.msg}>{e.message_s}</Text>
                            </TouchableOpacity>
                        </ScrollView>)
            // } else if (e.key.indexOf('slcted_action_key_') === 0) {
            //     return (<ScrollView key={e.key} style={styles.log}>
            //                 <TouchableOpacity onLongPress={() => copyText(JSON.stringify(e.message_slcted_action))}>
            //                 <Text style={styles.msg}>{e.message_slcted_action}</Text>
            //                 </TouchableOpacity>
            //             </ScrollView>)
            // } else if (e.key.indexOf('slct_list_key_') === 0) {
            //     console.log(JSON.stringify(e.item01))
            //     console.log(e.item01)
            //     return (<></>)
                // return (<ScrollView key={e.key} style={styles.log}>
                //         <RadioButton.Item
                //             value={e.item01}
                //             label={e.item01}
                //             status={ checked === e.item01 ? 'checked' : 'unchecked' }
                //             onPress={() => {
                //                 setChecked(e.item01)
                //                 handleSelectChange(e.item01)
                //             }
                //         }
                //         />
                //         <RadioButton.Item
                //             value={e.item02}
                //             label={e.item02}
                //             status={ checked === e.item02 ? 'checked' : 'unchecked' }
                //             onPress={() => {
                //                 setChecked(e.item02)
                //                 handleSelectChange(e.item02)
                //             }
                //         }
                //         />
                //         <RadioButton.Item
                //             value={e.item03}
                //             label={e.item03}
                //             status={ checked === e.item03 ? 'checked' : 'unchecked' }
                //             onPress={() => {
                //                 setChecked(e.item03)
                //                 handleSelectChange(e.item03)
                //             }
                //         }
                //         />
                //         <Button title="選択" onPress={() => send()} />
                        // </ScrollView>)
        //     }
        // })
    // let messages_ext = JSON.parse(messages)
    // console.log("messages_ext:"+messages_ext)
                }
            })
    return image
    }
}

    return (
        <View>
            <Text style={styles.h1}>リアルタイムチャット</Text>
            <ChatForm />
        <ScrollView>
            <MessageDiv logs = {logs}/>
        </ScrollView>
        </View>
    )
}