import React from 'react'
const {useEffect, useMemo, useRef, useState, useCallback} = React
// import ReactDOM from 'react-dom'
import styles from './styles.js'
import { Keyboard, View, Text ,Button, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import io from 'socket.io-client';
import _ from 'lodash';
// import ContentEditable from 'react-contenteditable'
import { EditText, EditTextarea } from 'react-edit-text';
// import RNPickerSelect from 'react-native-picker-select';
import { RadioButton } from 'react-native-paper';
import Checkbox from 'expo-checkbox';

export function ChatForm(props) {
    const [message, setMessage] = useState('');
    const [message_s, setMessage_s] = useState('');
    const [message_slct_list, setMessage_slct_list] = useState('');
    const [text, setText] = useState('');
    const socketRef = useRef();
    const [message_slcted_action, selectedValue, checked, buy_item, isEditing, e, s, inputValue] = useState('');

    useEffect(() => {
        console.log('Connecting..');
        socketRef.current = io('https://c991-113-149-235-78.ngrok-free.app'
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

        const slct_list = {
            message,
            timestamp
        };

        // const sMessage = {
        //     text: text,
        //     timestamp
        // };

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
    const [tappedValue, setTappedValue] = useState('');
    let [count, setCount] = useState(0);
    const socketRef = useRef();
    const [message_s, setMessage_s] = useState('');
    const [buy_item, isEditing, e, message_slct_list, s, inputValue] = useState('');
    const [handleTapValue, setHandleTapValue] = useState('');
    const [ckdflg, setCkdflg] = useState(false);

    useEffect(() => {
        console.log('Connecting..');
        socketRef.current = io('https://c991-113-149-235-78.ngrok-free.app'
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
            // setCount((prevCount) => prevCount + 1);
            count += 1
            obj.count = count
            obj.key = 'chat_before_key_' + (count + 1);
            obj.buy_key = 'slcted_action_key_' + new Date().getTime();
            console.log(obj)
            // logs.unshift(obj)
            setLogs((prevLogs) => [...prevLogs, obj]);
            socketRef.current.emit('buy_item', {
                item_key: obj.buy_key,
                buy_item: obj.message,
                flg: false,
                timestamp: new Date().getTime()
            })
            // console.log("aaa:"+ logs[0].key)
        });
        socketRef.current.on('chat', obj => {
            // setCount((prevCount) => prevCount + 1);
            count += 1
            obj.count = count;
            console.log("pass10")
            // const logs_s2 = logs
            obj.key = 'chat_key_' + (count + 1)
            console.log(obj)
            // logs.unshift(obj)
            setLogs((prevLogs) => [...prevLogs, obj]);
        });
        socketRef.current.on('select_list', slct_list => {
            const obj = JSON.parse(slct_list);
            // setCount((prevCount) => prevCount + 1);
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

    useEffect(() => {
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
          TextInput.State.currentlyFocusedInput()?.blur();
        });

    // return () => {
    //     keyboardDidHideListener.remove();
    //     };
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

    const Blursend =() => {
        console.log("tappedValue:"+tappedValue)
        const tappedMessage = {
            message: tappedValue,
            timestamp: new Date().getTime()
        };
        socketRef.current.emit('chat_before', tappedMessage);
        setMessage('');
        setEditing(false);
    };

    
    const EditableText = ({tappedValue}) => {
        if (Editing) {
            return (
            <TextInput
                defaultValue={tappedValue}
                onChangeText={handleTapChange}
                onBlur={() => {blursend()}
                }
            >{tappedValue}</TextInput>
            );
        }
        return (
            <TouchableOpacity onPress={() => copyText(JSON.stringify(tappedValue))} onLongPress={() => setEditing(true)}>
            <Text>{tappedValue}</Text>
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


    
    

    const handleTapSubmit = (k) => {
       
        // logs = logs.map((value) => (value.key === k ? {"count":value.count, "key": value.key, "message_slcted_action":aaaa, "timestamp": value.timestamp} : value))
        
        // function update(k, aaaa) {
        
    };

    // const logsChange = (handleTapKey, handleTapValue) => {
    //     
    // }

    const MessageDiv = props => {
        // const { logs } = props;
        if (props.logs !== undefined) {
            console.log("ddd:"+props.logs)
        // logs.map
        // console.log("logssssss:"+logs[0].message);
        // const dispmMessage = logs;
        // let sortedMessages = useState([]);
        // setSortedMessages(dispmMessage);
        let sortedMessages = props.logs?.sort(function(a, b){if (a.count > b.count){
            return -1;
          }else if (a.count < b.count){
            return 1;
          }else{
            return 0;
          }
        });
        
        // sortedMessages.sort((a, b) => b.timestamp - a.timestamp);
        // console.log(sortedMessages)
        // const { checked } = state
        // logs.map((e) => {
        for (let i=0;i< sortedMessages.length; i++){
            console.log("bbb:"+sortedMessages[i])
        }


        // const handleTapChange = (k, newText) => {
        //     // const handleTapKey = k;
        //     // const tapchanged = e;
            
        //     // console.log("e:"+tapchanged)
        //     setTimeout(() => {
            
        //     }, 3000);
            
        // }
        
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
        let image = sortedMessages.map((e) => {
            const [text, setText] = useState('');

            const handleTapChange =  _.debounce(
                (k, text) => {
                setLogs(prevLogs => prevLogs.map(
                    (value) => (
                        value.key === e.key ? {"count":value.count, "key": value.key + "_upd", "message_slcted_action":text, "timestamp": value.timestamp} : value)))
                let msg = {
                    item_key: k,
                    buy_item: text,
                    timestamp: new Date().getTime()
                };
                logs.map(
                    (value) => (
                        console.log(value)))
                socketRef.current.emit('buy_item', msg)
              }
              ,3000)
        
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
                            {/* <Text style={styles.msg}>{e.message_slcted_action}</Text> */}
                            {/* <TextInput style={styles.msg} blurOnSubmit={false} value={e.message_slcted_action} onChangeText={(inputText) =>{
                                setText(inputText)
                                handleTapChange(e.key, inputText)}}/> */}
                            <TouchableOpacity onLongPress={() => copyText(JSON.stringify(e.message_slcted_action))}>
                            <Text style={styles.msg}>{e.message_slcted_action}</Text>
                            </TouchableOpacity>
                        </ScrollView>)
            } else if (e.key.indexOf('slcted_action_key_') === 0) {
                const flg = e.flg
                console.log("flg"+flg)
                return (<ScrollView key={e.key+ts} style={styles.log}>
                            {/* <Text style={styles.msg}>{e.message_slcted_action}</Text> */}
                            {/* <TextInput style={styles.msg} blurOnSubmit={false} value={e.message_slcted_action} onChangeText={(inputText) =>{
                                setText(inputText)
                                handleTapChange(e.key, inputText)}}/> */}
                            <Checkbox title={e.message_slcted_action} value={flg} onValueChange={() => {
                                setCkdflg(!ckdflg)
                                checkedCheckedBox(e.key, !ckdflg)}}/>
                            <TouchableOpacity onLongPress={() => copyText(JSON.stringify(e.message_slcted_action))}>
                            <Text style={styles.msg}>{"\n"}{e.message_slcted_action}</Text>
                            </TouchableOpacity>
                        </ScrollView>)
            } else if (e.key.indexOf('chat_before_key_') === 0) {
                return (<ScrollView key={e.key+ts} style={styles.log}>
                                <TouchableOpacity onPress={() => copyText(JSON.stringify(e.message))}>
                                {/* <Text style={styles.msg}>{e.message}</Text> */}
                                <Text style={styles.msg}>{e.message}</Text>
                                </TouchableOpacity>
                            </ScrollView>)
            } else if (e.key.indexOf('chat_key_') === 0) {
                return (<ScrollView key={e.key+ts} style={styles.log}>
                            {/* `<ContentEditable html= {<Text>${e.message_s}</Text>} onBlur={Blursend} onChange={HandleTapChange} />` */}
                            {/* <EditableText style={styles.msg} tappedValue={e.message_s}>r</EditableText> */}
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
        <View>
            <Text style={styles.h1}>リアルタイムチャット</Text>
            <ChatForm />
        <ScrollView>
            <MessageDiv logs = {logs}/>
        </ScrollView>
        </View>
    )
}