import { Colors, Typography } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function ChatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tus Mensajes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  text: { color: Colors.primary, fontFamily: Typography.fonts.title }
});