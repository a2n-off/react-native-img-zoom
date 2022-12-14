import { StyleSheet, Dimensions, Image } from 'react-native';
import { Text, View } from '../components/Themed';
import Zoom from './../built/index';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Zoom
        cropWidth={Dimensions.get('window').width}
        cropHeight={Dimensions.get('window').height}
        imageWidth={1000}
        imageHeight={1000}
        enableSwipeDown={true}
      >
        <Image
          enableHorizontalBounce={true}
          style={{ width: 1000, height: 1000 }}
          source={{ uri: 'https://picsum.photos/1000/1000' }}
        />
      </Zoom>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
