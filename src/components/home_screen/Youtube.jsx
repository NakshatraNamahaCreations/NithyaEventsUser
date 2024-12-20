import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import {apiUrl} from '../../api-services/api-constants';
import axios from 'axios';

const {width} = Dimensions.get('window');

const Youtube = () => {
  const [allVideos, setAllVideo] = useState([]);

  const getYoutubeVideo = async () => {
    try {
      const youtubeRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_YOUTUBE_VIDEO_LINK}`,
      );
      if (youtubeRes.status === 200) {
        setAllVideo(youtubeRes.data.data.reverse());
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    getYoutubeVideo();
  }, []);

  // Utility function to extract YouTube video ID
  const extractVideoID = url => {
    const regex = /(?:\?v=|&v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const renderItem = ({item}) => {
    const videoID = extractVideoID(item.video_link);
    // console.log('videoID', videoID);

    return (
      <View style={styles.itemCard}>
        <YoutubePlayer height={150} play={false} videoId={videoID} />
      </View>
    );
  };

  return (
    <View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {allVideos.map(ele => {
          const videoID = extractVideoID(ele.video_link);
          return (
            <View key={ele._id} style={styles.itemCard}>
              <YoutubePlayer height={250} play={false} videoId={videoID} />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    width: width - 25,
    height: 250,
    borderRadius: 15,
    marginHorizontal: 5,
    // resizeMode: 'cover',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default Youtube;
