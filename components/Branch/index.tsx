import { Image, ImageBackground } from "react-native";
import { images, moderateScale as ms } from "../../constants";
import styles from './styles';

const Branch = ({ side }: { side: Number }) => {
  switch (side) {
    case 0:
      return (
        <ImageBackground source={images.elevatorTile} style={[styles.branch]} />
      );

    case 1:
      return (
        <ImageBackground source={images.elevatorTile} style={styles.branch}>
          <Image
            style={{
              height: ms(100),
              width: ms(100),
              marginLeft: ms(-100),
            }}
            source={images.obstacleTile}
          />
        </ImageBackground>
      );

    case 2:
      return (
        <ImageBackground source={images.elevatorTile} style={styles.branch}>
          <Image
            style={{
              height: ms(100),
              width: ms(100),
              marginLeft: ms(100),
              transform: [{ rotate: "180deg" }],
            }}
            source={images.obstacleTile}
          />
        </ImageBackground>
      );

    default:
      return (
        <ImageBackground source={images.elevatorTile} style={[styles.branch]} />
      );
  }
};

export default Branch;
