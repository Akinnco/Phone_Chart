import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  LogBox,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import DropDownPicker from 'react-native-dropdown-picker';
import {LineChart} from 'react-native-chart-kit';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);
LogBox.ignoreLogs([
  'Remote debugger is in a background tab which may cause apps to perform slowly. Fix this by foregrounding the tab (or opening it in a separate window).',
]);

const Home = ({navigation}) => {
  const [incomingData, setIncomingData] = useState();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('price');
  const [items, setItems] = useState([
    {label: 'Fiyat Bazlı Arama', value: 'price'},
    {label: 'Stok Bazlı Arama', value: 'stock'},
    {label: 'Puan Bazlı Arama', value: 'rating'},
  ]);
  const [openStart, setOpenStart] = useState(false);
  const [valueStart, setValueStart] = useState(null);
  const [itemsStart, setItemsStart] = useState([
    {label: '20', value: '20'},
    {label: '30', value: '30'},
    {label: '40', value: '40'},
  ]);
  const [openFinal, setOpenFinal] = useState(false);
  const [valueFinal, setValueFinal] = useState(null);
  const [itemsFinal, setItemsFinal] = useState([
    {label: '30', value: '30'},
    {label: '40', value: '40'},
    {label: '50', value: '50'},
  ]);
  useEffect(() => {
    var axios = require('axios');

    var config = {
      method: 'get',
      url: 'https://dummyjson.com/products',
      headers: {},
    };

    axios(config)
      .then(function (response) {
        const data = [];
        response.data.products.map(x =>
          data.push({
            price: x.price,
            stok: x.stock,
            brand: x.brand,
            rating: x.rating,
          }),
        );

        const filterData = () => {
          var _filterData = data;
          if (valueStart && valueFinal) {
            var _filterData = data.filter(
              x => x.price >= valueStart && x.price <= valueFinal,
            );
          }
          if (valueStart) {
            var _filterData = data.filter(x => x.price >= valueStart);
          }
          if (valueFinal) {
            var _filterData = data.filter(x => x.price <= valueFinal);
          }
          return _filterData;
        };
        setIncomingData(filterData);

        if (incomingData != undefined) {
          setBelki(incomingData.map(x => x));
        }
        if (value != undefined && value != null && incomingData != undefined) {
          setDeneme(incomingData.map(x => x + value));
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [valueStart, valueFinal, value]);

  return (
    <SafeAreaView>
      <View style={{zIndex: 9}}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Arama Yöntemi Seçiniz"
        />
      </View>

      {/* BASLANGIC Fiyat -------*/}
      <View style={{zIndex: 8, marginTop: hp('1%')}}>
        <DropDownPicker
          open={openStart}
          value={valueStart}
          items={itemsStart}
          setOpen={setOpenStart}
          setValue={setValueStart}
          setItems={setItemsStart}
          placeholder="Baslangıç Fiyat Seçiniz"
        />
      </View>

      {/* BITIS TARIHI */}
      <View style={{zIndex: 7, marginTop: hp('1%')}}>
        <DropDownPicker
          open={openFinal}
          value={valueFinal}
          items={itemsFinal}
          setOpen={setOpenFinal}
          setValue={setValueFinal}
          setItems={setItemsFinal}
          placeholder="Son  Fiyat Seçiniz"
        />
      </View>

      {incomingData !== undefined && (
        <ScrollView horizontal={true}>
          <LineChart
            data={{
              labels: [incomingData.map(x => x.brand)],
              datasets: [
                {
                  data:
                    (value == 'stock' && incomingData.map(x => x.stok)) ||
                    (value == 'price' && incomingData.map(x => x.price)) ||
                    (value == 'rating' && incomingData.map(x => x.rating)),
                },
              ],
            }}
            width={wp('160%')}
            height={hp('30%')}
            // yAxisSuffix="$"
            verticalLabelRotation={0.01}
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: 'transparent',
              backgroundGradientTo: 'transparent',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {},
              propsForDots: {
                r: '6',
                stroke: 'transparent',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
            }}
          />
        </ScrollView>
      )}

      <View style={styles.infArea}>
        <Text style={{fontSize: wp('5%')}}>
          Grafikteki Fiyat,Stok,Puan verileri
        </Text>
        <Text style={styles.ImportantText}>GERÇEĞİ YANSITMAMAKTADIR</Text>
        <TouchableOpacity
          style={styles.goingtoCv}
          onPress={() => navigation.navigate('Cv')}>
          <Text>CV Sayfasına Gidiş </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  infArea: {width: wp('100%'), alignItems: 'center'},
  ImportantText: {
    fontSize: wp('6%'),
    textDecorationLine: 'underline',
    marginTop: hp('2%'),
  },
  goingtoCv: {
    backgroundColor: '#6ecddd',
    width: wp('50%'),
    height: hp('5%'),
    borderRadius: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
});
