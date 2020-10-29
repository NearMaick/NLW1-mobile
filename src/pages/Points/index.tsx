import React, { useCallback, useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import { ScrollView } from 'react-native-gesture-handler';
import api from '../../services/api';

import styles from './styles';

interface ItemProps {
  id: number;
  title: string;
  image_url: string;
}
// parei aqui 1:28'41
const Points: React.FC = () => {
  const [items, setItems] = useState<ItemProps[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    });
  }, []);

  const handleNavigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNavigateToDetail = useCallback(() => {
    navigation.navigate('Detail');
  }, [navigation]);

  const handleSelectItem = useCallback(
    (id: number) => {
      const alreadySelected = selectedItems.findIndex(item => item === id);

      if (alreadySelected >= 0) {
        const filteredItems = selectedItems.filter(item => item !== id);

        setSelectedItems(filteredItems);
      } else {
        setSelectedItems([...selectedItems, id]);
      }
    },
    [selectedItems],
  );

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta.
        </Text>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: -23.4084301,
              longitude: -46.4998748,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              style={styles.mapMarker}
              onPress={handleNavigateToDetail}
              coordinate={{ latitude: -23.4084301, longitude: -46.4998748 }}
            >
              <View style={styles.mapMarkerContainer}>
                <Image
                  style={styles.mapMarkerImage}
                  source={{
                    uri:
                      'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
                  }}
                />

                <Text style={styles.mapMarkerTitle}>Mercado</Text>
              </View>
            </Marker>
          </MapView>
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {items.map(item => (
            <TouchableOpacity
              key={String(item.id)}
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {},
              ]}
              onPress={() => handleSelectItem(item.id)}
              activeOpacity={0.7}
            >
              <SvgUri width={42} height={42} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default Points;
