import React, {Component} from 'react'
import {View, TextInput, StyleSheet, Dimensions, StatusBar, TouchableOpacity,
        Text, FlatList, Image, ActivityIndicator } 
      from 'react-native'
import database from '@react-native-firebase/database'

const deviceWidth = Dimensions.get('screen').width
const deviceHeight = Dimensions.get('screen').height

import send from '../assets/send.png'
import location from '../assets/location.png'

class ChatDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      image: this.props.route.params.image,
      name: this.props.route.params.name,
      chat: this.props.route.params.chat,
      msg: '',
      dataChat: []
    }
  }
  user = () => {
    const {image, name} = this.state
    this.props.navigation.navigate('user-detail', {
      image: image,
      name: name
    })
  }

  forMe = async () => {
    const {msg} = this.state
    await database().ref(`/chat/ilham/bagas/${new Date().getTime()}`)
    .set({msg: msg, isSender: true})
  }
  forYou = async () => {
    const {msg} = this.state
    await database().ref(`/chat/bagas/ilham/${new Date().getTime()}`)
    .set({msg: msg, isSender: false})
  }
  send = async () => {
    await this.forMe()
    await this.forYou()
  }

  render() {
    const { image, dataChat, name, msg } = this.state
    return(
      <>
        <StatusBar backgroundColor='#121212' />
        <View style={style.fill}>
          <TouchableOpacity style={style.header} onPress={this.user}>
            <View style={style.imgWrapper}>
              <Image style={style.img} source={{uri: image}}/>
            </View>
            <View>
              <Text style={style.name}>{name}</Text>
              <Text style={style.bio}>Hey there! I'm not using Whatsapp</Text>
            </View>
          </TouchableOpacity>
          <View style={style.content}>
            {dataChat.forEach((item) => {
              <Text>{item}</Text>
            })}
            {/* <FlatList
              data={dataChat}
              style={style.chatDisplay}
              renderItem={({item}) => (
                <ChatList
                  isSender={item.isSender}
                  msg={item.msg}
                />
              )}
            /> */}
            <View style={style.inputWrapper}>
              <TextInput 
                placeholder='Type message' 
                placeholderTextColor='#B8B8B8'
                style={style.input}
                multiline
                value={msg}
                onChangeText={(e) => {this.setState({msg: e})}}
              />
              <TouchableOpacity style={style.btn} onPress={this.send}>
                <Image style={style.imgBtn} source={send}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    )
  }
}

class ChatList extends Component{
  render(){
    const {isSender} = this.props
    return(
      <>
        {isSender ? (
          <View style={style.messageSend}>
            <Text style={style.chat}>{this.props.msg}</Text>
          </View>
        ):(
          <View style={style.messageReceive}>
            <Text style={style.chat}>{this.props.msg}</Text>
          </View>
        )}
      </>
    )
  }
}

export default (ChatDetail)

const style = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: '#1B1B1B'
  },
  header: {
    width: deviceWidth,
    height: 60,
    backgroundColor: '#2B2B2B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 50
  },
  imgWrapper: {
    backgroundColor: 'white',
    width: 40, 
    height: 40,
    borderRadius: 50,
    marginRight: 10
  },
  img: {
    resizeMode: 'cover',
    flex: 1,
    borderRadius: 50
  },
  name: {
    color: 'white',
    fontWeight: 'bold'
  },
  bio: {
    color: '#B8B8B8'
  },
  content: {
    height: deviceHeight-60
  },
  chatDisplay: {
    flex: 3.5,
  },
  messageReceive: {
    width: deviceWidth-80,
    height: 70,
    backgroundColor: '#2B2B2B',
    marginTop: 20,
    marginLeft: 10,
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  messageSend: {
    width: deviceWidth-80,
    alignSelf: 'flex-end',
    height: 70,
    backgroundColor: '#2476C3',
    marginTop: 20,
    marginLeft: 10,
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    marginRight: 10
  },
  chat: {
    color: 'white'
  },
  inputWrapper: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 5,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  input: {
    width: deviceWidth-90,
    height: 50,
    backgroundColor: '#2B2B2B',
    borderRadius: 25,
    color: 'white',
    paddingLeft: 10,
    paddingRight: 10
  },
  btn: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#2476C3',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  imgBtn: {
    resizeMode: 'cover',
    width: 25,
    height: 25,
  }
})