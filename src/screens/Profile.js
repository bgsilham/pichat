import React, {Component} from 'react'
import {View, ScrollView, StyleSheet, Dimensions, StatusBar, TouchableOpacity,
        Text, Alert, Image, ActivityIndicator} 
      from 'react-native'
import storage from '@react-native-firebase/storage'

import {connect} from 'react-redux'
import {logout} from '../redux/actions/auth'
import {getUser, deleteAvatar} from '../redux/actions/user'

const deviceWidth = Dimensions.get('screen').width
const deviceHeight = Dimensions.get('screen').height

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: this.props.user.dataUser.fullname,
      imageName: this.props.user.dataUser.image,
      image: 'https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg',
      username: this.props.user.dataUser.username,
      bio: this.props.user.dataUser.bio,
      email: this.props.auth.email,
      isLoading: true
    }
  }
  edit = () => {
    const {name, image, username, bio, email} = this.state
    this.props.navigation.navigate('edit-profile', 
    {image: image, name: name, username: username, bio: bio, email: email})
  }
  logoutModal = () => {
    Alert.alert(
      'Are you sure?',
      "You'll leave me alone :(",
      [
        {
          text: '',
          // onPress: () => console.log('Ask me later pressed')
        },
        {
          text: 'Cancel',
          // onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'Logout', 
          onPress: this.logout 
      }
      ],
      { cancelable: false }
    )
  }
 modalAvatar = () => {
    Alert.alert(
      'Remove avatar?',
      "Your avatar will be reseted to default",
      [
        {
          text: '',
          // onPress: () => console.log('Ask me later pressed')
        },
        {
          text: 'Cancel',
          // onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'Remove', 
          onPress: this.removeAvatar 
      }
      ],
      { cancelable: false }
    )
  }
  logout = () => {
    this.props.logout()
    this.props.navigation.navigate('login')
  }
  getUrlUpload = () => {
    const {imageName} = this.state
    storage().ref(imageName).getDownloadURL().then((url) => {
      this.setState({image: url})
    })
  }
  removeAvatar = () => {
    const {email} = this.state
    this.setState({image: 'https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg'})
    this.props.deleteAvatar(email).then(() => {
      Alert.alert('Poof!', 'Avatar has been set to default')
    })
  }

  componentDidMount() {
    this.getUrlUpload()
  }
  render() {
    const {name, image, username, bio, email, isLoading} = this.state
    const {isLoadingAva} = this.props.user
    return(
      <>
        <StatusBar backgroundColor='#121212' />
        <View style={style.fill}>
          <View style={style.imgWrapper}>
            <Image
              source={{uri: image}}
              style={style.img} 
            />
          </View>
          <View style={style.btnWrapper}>
            <TouchableOpacity style={style.btnEdit} onPress={this.edit}>
              <Text style={style.btnEditText}>Edit Profile</Text>
            </TouchableOpacity>
            {isLoadingAva ? (
              <View style={style.btnDelete}>
                <ActivityIndicator size='small' color='white' />
              </View>
            ):(
              <TouchableOpacity style={style.btnDelete} onPress={this.modalAvatar}>
                <Text style={style.btnEditText}>Remove Avatar</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView style={style.info}>
            <View style={style.infoWrapper}>
              <Text style={style.title}>Name</Text>
              <Text style={style.subTitle}>{name}</Text>
              <View style={style.line} />
            </View>
            <View style={style.infoWrapper}>
              <Text style={style.title}>Username</Text>
              <Text style={style.subTitle}>@{username}</Text>
              <View style={style.line} />
            </View>
            <View style={style.infoWrapper}>
              <Text style={style.title}>Email</Text>
              <Text style={style.subTitle}>{email}</Text>
              <View style={style.line} />
            </View>
            <View style={style.infoWrapper}>
              <Text style={style.title}>Bio</Text>
              <Text style={style.subTitle}>{bio}</Text>
              <View style={style.line} />
            </View>
            <TouchableOpacity style={style.btnLogout} onPress={this.logoutModal}>
              <Text style={style.btnLogoutText}>LOGOUT</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </>
    )
  }
}

const mapDispatchToProps = {logout, getUser, deleteAvatar}
const mapStateToProps = state => ({
  user: state.user,
  auth: state.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)

const style = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: '#1B1B1B'
  },
  loading: {
    alignSelf: 'center',
    marginTop: 50
  },
  imgWrapper: {
    marginTop: 70,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#2476C3',
    alignSelf: 'center'
  },
  img: {
    flex: 1,
    resizeMode: 'cover',
    borderRadius: 50
  },
  btnWrapper: {
    flexDirection: 'row',
    alignSelf: 'center'
  },
  info: {
    marginTop: 40
  },
  infoWrapper: {
    width: deviceWidth-50,
    alignSelf: "center",
    marginTop: 10
  },
  title: {
    color: '#B8B8B8'
  },
  subTitle: {
    color: 'white',
    fontSize: 20
  },
  line: {
    width: deviceWidth-50,
    height: 1,
    alignSelf: 'center',
    backgroundColor: '#2476C3',
    marginTop: 10
  },
  btnLogout: {
    width: deviceWidth-50,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#b71c1c',
    alignSelf: 'center',
    alignItems: "center",
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 30
  },
  btnLogoutText: {
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 5,
    fontSize: 15,
  },
  btnEdit: {
    marginTop: 5,
    width: 100,
    height: 25,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2476C3',
    borderRadius: 5
  },
  btnDelete: {
    marginTop: 5,
    width: 100,
    height: 25,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#b71c1c',
    borderRadius: 5,
    marginLeft: 10
  },
  btnEditText: {
    color: 'white'
  }
})