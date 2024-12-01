/* eslint-disable react-native/no-inline-styles */
import React, { memo, Suspense, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  InteractionManager,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const Screen = Dimensions.get('window');
const Banner = require('./src/assets/banner/banner.png');

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setLoading(true);
      fetch('https://dummyjson.com/products?limit=200')
        .then(res => res.json())
        .then((response) => {
          const product = response?.products ?? [];
          setData(product);
        }).finally(() => {
          setLoading(false);
        });
    });

    return () => {
      task.cancel();
    }
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : '#fff',
  };

  return (
    <Suspense fallback={(<ActivityIndicator />)}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <View style={{ elevation: 2, height: 56, justifyContent: 'center', alignItems: 'center', backgroundColor: backgroundStyle.backgroundColor }}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 18,
          }}>E-Commerce</Text>
        </View>
        <FlatList
          keyExtractor={(item) => String(item.id)}
          data={data}
          style={{ flex: 1 }}
          renderItem={({ item }) => <ItemProduct
            title={item?.title}
            thumbnail={item?.thumbnail}
            price={item?.price}
            category={item?.category}
            rating={item?.rating}
            stock={item?.stock}
          />}
          numColumns={2}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={21}
          disableVirtualization={true}
          decelerationRate={'fast'}
          columnWrapperStyle={{
            margin: 8,
          }}
          ListHeaderComponent={(<View>
            <Image
              source={Banner}
              style={{
                height: Screen.width * 0.5,
                width: Screen.width,
              }}
            />
            <Text style={{
              fontSize: 20,
              color: '#171717',
              fontWeight: 'bold',
              marginHorizontal: 8,
              marginTop: 32,
              marginBottom: 16,
            }}>Spesial Product</Text>
          </View>)}
          // eslint-disable-next-line react/no-unstable-nested-components
          ListEmptyComponent={() => (<>
            {
              loading && (<View style={{ height: Screen.height * 0.5, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={'#bd4411'} size={'large'} />
                <Text style={{
                  fontSize: 14,
                  marginTop: 8,
                }}>Sedang memuat...</Text>
              </View>)
            }
          </>)}
        />
      </SafeAreaView>
    </Suspense>
  );
}

const ItemProduct = memo(({
  title = '',
  thumbnail = '',
  price = 0,
  category = '',
  rating = '',
  stock = '0',
}: {
  title: string,
  thumbnail: string,
  price: number,
  category: string,
  rating: string,
  stock: string,
}) => (
  <View style={styles.card}>
    <Image source={{ uri: thumbnail }}
      resizeMode='contain'
      style={{
        height: Screen.width * 0.6,
        width: Screen.width * 0.5 - 24,
        backgroundColor: '#f0ece6',
        borderRadius: 10,
        alignSelf: 'center',
        overflow: 'hidden',
      }}
    />
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
      <Text style={{
        color: '#787675',
        fontSize: 14,
        marginRight: 6
      }}>
        {category}
      </Text>
      <Text style={{
        color: '#171717',
        fontSize: 14,
      }}>
        ⭐{rating} <Text style={{
          color: '#787675',
          fontSize: 14,
        }}>
          ({stock})
        </Text>
      </Text>
    </View>
    <Text style={{
      fontWeight: '600',
      color: '#171717',
      fontSize: 16,
      marginVertical: 6
    }} numberOfLines={1}>{title}</Text>
    <Text style={{
      fontWeight: '600',
      color: '#171717',
      fontSize: 16,
      marginBottom: 4
    }}>${String(price)}</Text>
  </View>
),
  (prevProps, nextProps) => {
    return prevProps.thumbnail !== nextProps.thumbnail;
  },
);

const styles = StyleSheet.create({
  card: {
    width: Screen.width * 0.5 - 24,
    marginHorizontal: 8,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 8,
  },
});

export default App;
