```typescript
import { Image, Dimensions } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';

export default class App extends React.Component {
    render: function() {
        return (
            <ImageZoom cropWidth={Dimensions.get('window').width}
                       cropHeight={Dimensions.get('window').height}
                       imageWidth={200}
                       imageHeight={200}>
                <Image style={{width:200, height:200}}
                       source={{uri:'https://picsum.photos/200/200'}}/>
            </ImageZoom>
        )
    }
}
```

| Props | Type | Description | DefaultValue |
| --- | --- | --- | --- |
| **cropWidth(required)** | number | operating area width | 100 |
| **cropHeight(required)** | number | operating area height | 100 |
| **imageWidth(required)** | number | picture width | 100 |
| **imageHeight(required)** | number | picture height | 100 |
| onClick | (eventParams: [IOnClick](https://github.com/ascoders/react-native-image-zoom/blob/master/src/image-zoom/image-zoom.type.ts))=>void | onClick | ()=>{} |
| onDoubleClick | (eventParams: [IOnClick](https://github.com/ascoders/react-native-image-zoom/blob/master/src/image-zoom/image-zoom.type.ts))=>void | onDoubleClick | ()=>{} |
| panToMove | boolean | allow to move picture with one finger | true |
| pinchToZoom | boolean | allow scale with two fingers | true |
| clickDistance | number | how many finger movement can also trigger `onClick` | 10 |
| horizontalOuterRangeOffset | (offsetX?: number)=>void | horizontal beyond the distance, the parent to do picture switching, you can listen to this function. When this function is triggered, you can do the switch operation | ()=>{} |
| onDragLeft | ()=>void | trigger to switch to the left of the graph, the left sliding speed exceeds the threshold when triggered | ()=>{} |
| responderRelease | (vx: number)=>void | let go but do not cancel | ()=>{} |
| maxOverflow | number | maximum sliding threshold | 100 |
| longPressTime | number | long press threshold | 800 |
| onLongPress | (eventParams: [IOnClick](https://github.com/ascoders/react-native-image-zoom/blob/master/src/image-zoom/image-zoom.type.ts))=>void | on longPress | ()=> {} |
| doubleClickInterval | number | time allocated for second click to be considered as doublClick event | 175 |
| onMove | ( position: [IOnMove](https://github.com/ascoders/react-native-image-zoom/blob/master/src/image-zoom/image-zoom.type.ts) )=>void | reports movement position data (helpful to build overlays) | ()=> {} |
| centerOn | { x: number, y: number, scale: number, duration: number } | if given this will cause the map to pan and zoom to the desired location | undefined |
| enableSwipeDown | boolean | for enabling vertical movement if user doesn't want it | false |
| enableCenterFocus | boolean | for disabling focus on image center if user doesn't want it | true |
| onSwipeDown | () => void | function that fires when user swipes down | null |
| swipeDownThreshold | number | threshold for firing swipe down function | 230 |
| minScale | number | minimum zoom scale | 0.6 |
| maxScale | number | maximum zoom scale | 10 |
| useNativeDriver | boolean | Whether to animate using [`useNativeDriver`](https://reactnative.dev/docs/animations#using-the-native-driver) | false |
| onStartShouldSetPanResponder | () => boolean | Override onStartShouldSetPanResponder behavior | () => true |
| onMoveShouldSetPanResponder | () => boolean | Override onMoveShouldSetPanResponder behavior | undefined |
| onPanResponderTerminationRequest | () => boolean | Override onMoveShouldSetPanResponder behavior | () => false |
| useHardwareTextureAndroid | boolean | for disabling rendering to hardware texture on Android | true |

| Method | params | Description |
| --- | --- | --- |
| reset |  | Reset the position and the scale of the image |
| resetScale |  | Reset the scale of the image |
| centerOn | ICenterOn | Centers the image in the position indicated. ICenterOn={ x: number, y: number, scale: number, duration: number } |

